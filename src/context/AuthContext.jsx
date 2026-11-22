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
        const parsed = JSON.parse(saved)
        if (parsed && parsed.email) {
          return parsed
        }
      } catch (e) {
        return null
      }
    }
    return null
  })
  const [viewRole, setViewRole] = useState(() => {
    return localStorage.getItem('campusfix_view_role') || 'student'
  })
  const [loading, setLoading] = useState(true)

  // Fetch profile strictly from Supabase public.profiles
  const fetchProfile = async (authUserId) => {
    if (!authUserId) return null
    try {
      // 1. Fetch from Supabase profiles table
      const { data: dbProfile, error: dbError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUserId)
        .single()

      if (dbError || !dbProfile) {
        console.warn('Profile not found in Supabase public.profiles for ID:', authUserId, dbError)
        return null
      }

      // 2. Fetch auth user metadata for fallback phone/details if missing in profile
      const { data: { user: authUser } } = await supabase.auth.getUser()
      const authMeta = authUser?.user_metadata || {}

      // 3. Check persistent student registry
      const userEmail = dbProfile.email || authUser?.email
      const registryEntry = getStudentFromRegistry(userEmail)

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
            .then(() => console.log('Synchronized telephone number to profiles table'))
            .catch((err) => console.warn('Could not backfill telephone number:', err))
        }
      }

      const enrichedUser = {
        id: dbProfile.student_id || dbProfile.id,
        uuid: dbProfile.id,
        name: dbProfile.name || (dbProfile.role === 'admin' ? 'Administrator' : 'Student'),
        email: dbProfile.email,
        role: dbProfile.role || 'student',
        faculty: dbProfile.faculty || 'College of Computing & Informatics',
        program: dbProfile.program || 'Bachelor of Software Engineering (Hons)',
        phone: resolvedPhone || '',
        department: dbProfile.department || (dbProfile.role === 'admin' ? 'Campus Facilities & Maintenance Department' : ''),
        hostel: registryEntry?.hostel || (dbProfile.email === MOCK_STUDENT_USER.email ? MOCK_STUDENT_USER.hostel : ''),
        emergencyContact: registryEntry?.emergencyContact || (dbProfile.email === MOCK_STUDENT_USER.email ? MOCK_STUDENT_USER.emergencyContact : ''),
        bio: registryEntry?.bio || (dbProfile.email === MOCK_STUDENT_USER.email ? MOCK_STUDENT_USER.bio : ''),
        avatar: dbProfile.avatar_url || (dbProfile.role === 'admin' ? MOCK_ADMIN_USER.avatar : MOCK_STUDENT_USER.avatar),
      }

      setUser(enrichedUser)
      localStorage.setItem('campusfix_auth', JSON.stringify(enrichedUser))
      saveStudentToRegistry(enrichedUser)
      return enrichedUser
    } catch (err) {
      console.warn('Could not fetch profile from Supabase:', err)
      return null
    }
  }

  // Initialize Supabase Auth listener
  useEffect(() => {
    let isMounted = true

    const initAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession()
        if (!isMounted) return

        setSession(initialSession)
        if (initialSession?.user) {
          const profile = await fetchProfile(initialSession.user.id)
          if (!profile && isMounted) {
            setUser(null)
            localStorage.removeItem('campusfix_auth')
          } else if (profile && isMounted) {
            const savedView = localStorage.getItem('campusfix_view_role')
            setViewRole(savedView || profile.role || 'student')
          }
        } else {
          setUser(null)
          localStorage.removeItem('campusfix_auth')
        }
      } catch (e) {
        console.warn('Supabase Auth init error:', e)
        if (isMounted) {
          setUser(null)
          localStorage.removeItem('campusfix_auth')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return
      setSession(newSession)
      if (newSession?.user) {
        const profile = await fetchProfile(newSession.user.id)
        if (!profile && isMounted) {
          setUser(null)
          localStorage.removeItem('campusfix_auth')
        }
      } else {
        setUser(null)
        localStorage.removeItem('campusfix_auth')
      }
    })

    return () => {
      isMounted = false
      subscription?.unsubscribe()
    }
  }, [])

  // Strictly authenticate via Supabase Auth without auto-creating fallback accounts
  const login = async (email, password) => {
    try {
      const cleanEmail = email ? email.trim() : ''
      if (!cleanEmail || !password) {
        return {
          success: false,
          error: 'Please enter both your email address and password.',
        }
      }

      // 1. Authenticate strictly via Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      })

      if (error || !data?.user) {
        setUser(null)
        setSession(null)
        localStorage.removeItem('campusfix_auth')
        return {
          success: false,
          error: error?.message || 'Invalid login credentials. Please check your email and password.',
        }
      }

      // 2. Fetch the matching user record from public.profiles in Supabase
      const profile = await fetchProfile(data.user.id)
      if (!profile) {
        // Keep the user signed out and never create an account automatically
        await supabase.auth.signOut()
        setUser(null)
        setSession(null)
        localStorage.removeItem('campusfix_auth')
        return {
          success: false,
          error: 'Account profile not found in Supabase. Please ensure your account has been registered.',
        }
      }

      setSession(data.session)
      setViewRole(profile.role || 'student')
      localStorage.setItem('campusfix_view_role', profile.role || 'student')

      return { success: true, user: profile }
    } catch (err) {
      console.error('Login error:', err)
      setUser(null)
      setSession(null)
      localStorage.removeItem('campusfix_auth')
      return {
        success: false,
        error: err.message || 'An error occurred during sign in. Please try again.',
      }
    }
  }

  const register = async (registrationData) => {
    try {
      const formattedPhone = formatMalaysianPhone(registrationData.phone) || registrationData.phone || ''

      // 1. Immediately store in persistent student registry
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
        console.warn('Supabase Auth signUp returned error:', error.message)
        return { success: false, error: error.message }
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

      // 4. Construct current authenticated student state
      const newStudentUser = {
        id: registrationData.studentId || data?.user?.id || `SW01${Math.floor(10000 + Math.random() * 90000)}`,
        uuid: data?.user?.id || null,
        name: registrationData.name,
        email: registrationData.email,
        role: 'student',
        faculty: registrationData.faculty || 'College of Computing & Informatics',
        program: registrationData.program || 'Bachelor of Software Engineering (Hons)',
        phone: formattedPhone,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(registrationData.name)}`,
      }

      setUser(newStudentUser)
      setViewRole('student')
      localStorage.setItem('campusfix_auth', JSON.stringify(newStudentUser))
      localStorage.setItem('campusfix_view_role', 'student')

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
    localStorage.removeItem('campusfix_view_role')
    setViewRole('student')
  }

  // Switch UI role view without altering the authenticated user or session
  const switchRole = (newRole) => {
    if (newRole !== 'admin' && newRole !== 'student') return
    setViewRole(newRole)
    localStorage.setItem('campusfix_view_role', newRole)
  }

  // True account roles from Supabase database
  const isActualAdmin = user?.role === 'admin'
  const isActualStudent = user?.role === 'student'

  // UI view mode flags (controls navigation/sidebar/view)
  const isAdmin = viewRole === 'admin'
  const isStudent = viewRole === 'student'

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isAuthenticated: !!user,
        isAdmin,
        isStudent,
        isActualAdmin,
        isActualStudent,
        viewRole,
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
