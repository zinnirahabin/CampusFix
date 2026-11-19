import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { MOCK_STUDENT_USER, MOCK_ADMIN_USER } from '../data/mockData'
import { formatMalaysianPhone } from '../utils/formatters'

const AuthContext = createContext(null)

// Helper to manage persistent student registry (survives refreshes, prevents cross-account leak)
const getStudentRegistry = () => {
  try {
    const raw = localStorage.getItem('campusfix_student_registry')
    return raw ? JSON.parse(raw) : {}
  } catch (e) {
    return {}
  }
}

const saveStudentToRegistry = (studentData) => {
  if (!studentData?.email) return
  try {
    const registry = getStudentRegistry()
    const emailKey = studentData.email.toLowerCase().trim()
    const existing = registry[emailKey] || {}

    registry[emailKey] = {
      ...existing,
      ...studentData,
      phone: studentData.phone !== undefined ? studentData.phone : existing.phone,
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem('campusfix_student_registry', JSON.stringify(registry))
  } catch (e) {
    console.warn('Could not save to student registry:', e)
  }
}

const getStudentFromRegistry = (email) => {
  if (!email) return null
  const registry = getStudentRegistry()
  return registry[email.toLowerCase().trim()] || null
}

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('campusfix_auth')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return MOCK_STUDENT_USER
      }
    }
    return MOCK_STUDENT_USER
  })
  const [loading, setLoading] = useState(true)

  // Fetch profile from Supabase and synchronize with student registration data
  const fetchProfile = async (authUserId, fallbackUser = null) => {
    try {
      // 1. Fetch from Supabase profiles table
      const { data: dbProfile, error: dbError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUserId)
        .single()

      // 2. Fetch auth user metadata for fallback phone/details
      const { data: { user: authUser } } = await supabase.auth.getUser()
      const authMeta = authUser?.user_metadata || {}

      // 3. Check persistent student registry
      const userEmail = dbProfile?.email || authUser?.email || fallbackUser?.email
      const registryEntry = getStudentFromRegistry(userEmail)

      if (!dbError && dbProfile) {
        // Resolve telephone number with strict precedence:
        // A) Database profile phone (if populated)
        // B) Auth registration metadata phone
        // C) Persistent student registry phone
        // D) Only for Aiman demo user: Aiman's phone; for any new student: empty string (NEVER leak Aiman's phone!)
        let resolvedPhone = dbProfile.phone

        if (!resolvedPhone || resolvedPhone.trim() === '') {
          if (authMeta.phone && authMeta.phone.trim() !== '') {
            resolvedPhone = authMeta.phone
          } else if (registryEntry?.phone && registryEntry.phone.trim() !== '') {
            resolvedPhone = registryEntry.phone
          } else if (dbProfile.email === MOCK_STUDENT_USER.email) {
            resolvedPhone = MOCK_STUDENT_USER.phone
          } else {
            resolvedPhone = ''
          }

          // Backfill database if phone was found in registration metadata but missing in profile
          if (resolvedPhone && resolvedPhone !== dbProfile.phone) {
            supabase
              .from('profiles')
              .update({ phone: resolvedPhone })
              .eq('id', authUserId)
              .then(() => console.log('Synchronized missing telephone number to profiles table'))
              .catch((err) => console.warn('Could not backfill telephone number:', err))
          }
        }

        const enrichedUser = {
          id: dbProfile.student_id || dbProfile.id,
          uuid: dbProfile.id,
          name: dbProfile.name,
          email: dbProfile.email,
          role: dbProfile.role,
          faculty: dbProfile.faculty || 'College of Computing & Informatics',
          program: dbProfile.program || 'Bachelor of Software Engineering (Hons)',
          phone: resolvedPhone || '',
          department: dbProfile.department || '',
          hostel: registryEntry?.hostel || (dbProfile.email === MOCK_STUDENT_USER.email ? MOCK_STUDENT_USER.hostel : ''),
          emergencyContact: registryEntry?.emergencyContact || (dbProfile.email === MOCK_STUDENT_USER.email ? MOCK_STUDENT_USER.emergencyContact : ''),
          bio: registryEntry?.bio || (dbProfile.email === MOCK_STUDENT_USER.email ? MOCK_STUDENT_USER.bio : ''),
          avatar: dbProfile.avatar_url || (dbProfile.role === 'admin' ? MOCK_ADMIN_USER.avatar : MOCK_STUDENT_USER.avatar),
        }

        setUser(enrichedUser)
        localStorage.setItem('campusfix_auth', JSON.stringify(enrichedUser))
        saveStudentToRegistry(enrichedUser)
        return enrichedUser
      }
    } catch (err) {
      console.warn('Could not fetch profile from Supabase, using local fallback:', err)
    }

    if (fallbackUser) {
      const reg = getStudentFromRegistry(fallbackUser.email)
      const merged = {
        ...fallbackUser,
        phone: reg?.phone || fallbackUser.phone || '',
      }
      setUser(merged)
      localStorage.setItem('campusfix_auth', JSON.stringify(merged))
      return merged
    }

    return null
  }

  // Initialize Supabase Auth listener
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession()
        setSession(initialSession)
        if (initialSession?.user) {
          await fetchProfile(initialSession.user.id)
        } else {
          // Check local auth state
          const saved = localStorage.getItem('campusfix_auth')
          if (saved) {
            try {
              const parsed = JSON.parse(saved)
              if (parsed?.email) {
                const reg = getStudentFromRegistry(parsed.email)
                if (reg?.phone) {
                  parsed.phone = reg.phone
                  setUser(parsed)
                }
              }
            } catch (e) {}
          }
        }
      } catch (e) {
        console.warn('Supabase Auth init error:', e)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession)
      if (newSession?.user) {
        await fetchProfile(newSession.user.id)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const login = async (email, password = 'password123', role = 'student') => {
    try {
      const loginEmail = email || (role === 'admin' ? 'admin@campusfix.uniten.edu.my' : 'aiman@student.uniten.edu.my')
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: password || 'password123',
      })

      if (error) {
        // Fallback for offline or local mock credentials
        const registryData = getStudentFromRegistry(loginEmail)
        let fallback
        if (role === 'admin' || loginEmail.includes('admin')) {
          fallback = { ...MOCK_ADMIN_USER, email: loginEmail }
        } else if (loginEmail === MOCK_STUDENT_USER.email) {
          fallback = { ...MOCK_STUDENT_USER, email: loginEmail }
        } else {
          // Specific student fallback - preserve their exact registered telephone number
          fallback = {
            id: registryData?.studentId || registryData?.id || `SW01${Math.floor(10000 + Math.random() * 90000)}`,
            name: registryData?.name || splitEmail(loginEmail),
            email: loginEmail,
            role: 'student',
            faculty: registryData?.faculty || 'College of Computing & Informatics',
            phone: registryData?.phone || '',
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(loginEmail)}`,
          }
        }

        setUser(fallback)
        localStorage.setItem('campusfix_auth', JSON.stringify(fallback))
        return { success: true, user: fallback }
      }

      const profile = await fetchProfile(data.user.id)
      return { success: true, user: profile }
    } catch (err) {
      console.error('Login error:', err)
      return { success: false, error: err.message }
    }
  }

  const splitEmail = (em) => {
    if (!em) return 'Student'
    const namePart = em.split('@')[0]
    return namePart.charAt(0).toUpperCase() + namePart.slice(1)
  }

  const register = async (registrationData) => {
    try {
      const formattedPhone = formatMalaysianPhone(registrationData.phone) || registrationData.phone || ''

      // 1. Immediately store in persistent student registry (guarantees telephone number preservation)
      saveStudentToRegistry({
        studentId: registrationData.studentId,
        id: registrationData.studentId,
        name: registrationData.name,
        email: registrationData.email,
        phone: formattedPhone,
        faculty: registrationData.faculty,
        program: registrationData.program || 'Bachelor of Software Engineering (Hons)',
        role: 'student',
      })

      // 2. Sign up via Supabase Auth with metadata
      const { data, error } = await supabase.auth.signUp({
        email: registrationData.email,
        password: registrationData.password,
        options: {
          data: {
            name: registrationData.name,
            role: 'student',
            student_id: registrationData.studentId || `SW01${Math.floor(10000 + Math.random() * 90000)}`,
            faculty: registrationData.faculty || 'College of Computing & Informatics',
            phone: formattedPhone,
          },
        },
      })

      if (error) {
        console.warn('Supabase Auth signUp returned error (proceeding with local registration):', error.message)
      }

      // 3. If Supabase created a user, insert or update public.profiles directly
      if (data?.user) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email: registrationData.email,
            name: registrationData.name,
            role: 'student',
            student_id: registrationData.studentId,
            faculty: registrationData.faculty,
            phone: formattedPhone,
            avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(registrationData.name)}`,
            updated_at: new Date().toISOString(),
          })
        } catch (dbErr) {
          console.warn('Could not upsert profile directly:', dbErr)
        }
      }

      // 4. Construct current authenticated student state with the EXACT registered telephone number
      const newStudentUser = {
        id: registrationData.studentId || data?.user?.id || `SW01${Math.floor(10000 + Math.random() * 90000)}`,
        uuid: data?.user?.id || null,
        name: registrationData.name,
        email: registrationData.email,
        role: 'student',
        faculty: registrationData.faculty || 'College of Computing & Informatics',
        program: registrationData.program || 'Bachelor of Software Engineering (Hons)',
        phone: formattedPhone, // Captured telephone number!
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(registrationData.name)}`,
      }

      setUser(newStudentUser)
      localStorage.setItem('campusfix_auth', JSON.stringify(newStudentUser))

      return { success: true, user: newStudentUser }
    } catch (err) {
      console.error('Register error:', err)
      return { success: false, error: err.message }
    }
  }

  const updateProfile = async (updatedFields) => {
    try {
      const formattedPhone = updatedFields.phone !== undefined
        ? (formatMalaysianPhone(updatedFields.phone) || updatedFields.phone)
        : user?.phone

      // 1. Update Supabase public.profiles if uuid exists
      if (user?.uuid) {
        await supabase
          .from('profiles')
          .update({
            name: updatedFields.name || user.name,
            phone: formattedPhone,
            faculty: updatedFields.faculty || user.faculty,
            program: updatedFields.program || user.program,
            avatar_url: updatedFields.avatar || user.avatar,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.uuid)

        // Also update Auth user metadata for complete synchronization
        try {
          await supabase.auth.updateUser({
            data: {
              name: updatedFields.name || user.name,
              phone: formattedPhone,
              faculty: updatedFields.faculty || user.faculty,
            },
          })
        } catch (authUpdateErr) {
          console.warn('Could not update auth metadata:', authUpdateErr)
        }
      }

      // 2. Update persistent student registry
      saveStudentToRegistry({
        ...user,
        ...updatedFields,
        phone: formattedPhone,
        email: user?.email,
      })

      // 3. Update current user state and localStorage
      const updatedUser = {
        ...user,
        ...updatedFields,
        phone: formattedPhone,
      }

      setUser(updatedUser)
      localStorage.setItem('campusfix_auth', JSON.stringify(updatedUser))

      return { success: true, user: updatedUser }
    } catch (err) {
      console.error('Profile update error:', err)
      return { success: false, error: err.message }
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (e) {
      console.warn('SignOut error:', e)
    }
    setUser(null)
    setSession(null)
    localStorage.removeItem('campusfix_auth')
  }

  const switchRole = async (newRole) => {
    if (newRole === 'admin') {
      await login('admin@campusfix.uniten.edu.my', 'password123', 'admin')
    } else {
      await login('aiman@student.uniten.edu.my', 'password123', 'student')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isStudent: user?.role === 'student',
        loading,
        login,
        register,
        updateProfile,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
