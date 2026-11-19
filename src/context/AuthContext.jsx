import React, { createContext, useContext, useState, useEffect } from 'react'
import { MOCK_STUDENT_USER, MOCK_ADMIN_USER } from '../data/mockData'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('campusfix_auth')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return MOCK_STUDENT_USER
      }
    }
    return MOCK_STUDENT_USER // Default logged in as student for seamless demo
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('campusfix_auth', JSON.stringify(user))
    } else {
      localStorage.removeItem('campusfix_auth')
    }
  }, [user])

  const login = (email, password, role = 'student') => {
    if (role === 'admin' || email.includes('admin')) {
      const adminData = {
        ...MOCK_ADMIN_USER,
        email: email || MOCK_ADMIN_USER.email,
      }
      setUser(adminData)
      return { success: true, user: adminData }
    } else {
      const studentData = {
        ...MOCK_STUDENT_USER,
        email: email || MOCK_STUDENT_USER.email,
      }
      setUser(studentData)
      return { success: true, user: studentData }
    }
  }

  const register = (registrationData) => {
    const newStudent = {
      id: registrationData.studentId || `SW01${Math.floor(10000 + Math.random() * 90000)}`,
      name: registrationData.name,
      email: registrationData.email,
      role: 'student',
      faculty: registrationData.faculty || 'College of Computing & Informatics',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(registrationData.name)}`,
    }
    setUser(newStudent)
    return { success: true, user: newStudent }
  }

  const updateProfile = (updatedFields) => {
    setUser((prev) => {
      const updated = {
        ...prev,
        ...updatedFields,
      }
      return updated
    })
    return { success: true }
  }

  const logout = () => {
    setUser(null)
  }

  const switchRole = (newRole) => {
    if (newRole === 'admin') {
      setUser(MOCK_ADMIN_USER)
    } else {
      setUser(MOCK_STUDENT_USER)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isStudent: user?.role === 'student',
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
