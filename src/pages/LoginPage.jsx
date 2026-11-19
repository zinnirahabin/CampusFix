import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Wrench,
  ShieldCheck,
  UserCheck,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Building2,
} from 'lucide-react'

export const LoginPage = () => {
  const [searchParams] = useSearchParams()
  const initialRole = searchParams.get('role') === 'admin' ? 'admin' : 'student'

  const [role, setRole] = useState(initialRole)
  const [email, setEmail] = useState(
    initialRole === 'admin' ? 'admin@campusfix.uniten.edu.my' : 'aiman@student.uniten.edu.my'
  )
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleRoleChange = (newRole) => {
    setRole(newRole)
    if (newRole === 'admin') {
      setEmail('admin@campusfix.uniten.edu.my')
    } else {
      setEmail('aiman@student.uniten.edu.my')
    }
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please provide both email and password.')
      return
    }

    const res = login(email, password, role)
    if (res.success) {
      if (role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/student/dashboard')
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Brand */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <Wrench className="w-6 h-6" />
          </div>
          <div className="text-left">
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              Campus<span className="text-blue-600">Fix</span>
            </span>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Universiti Tenaga Nasional
            </span>
          </div>
        </Link>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Campus Facility Issue Reporting and Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200/80 sm:px-10">
          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                role === 'student'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                role === 'admin'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Administrator</span>
            </button>
          </div>

          {/* Quick Demo Fill Notice */}
          <div className="mb-5 p-3 rounded-xl bg-blue-50/70 border border-blue-200/70 text-xs text-blue-900 flex items-start gap-2.5">
            <Building2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Demo Mode Credentials Active</p>
              <p className="text-[11px] text-blue-700 mt-0.5">
                {role === 'student'
                  ? 'Logging in as Student (Aiman Hakim - SW0108321)'
                  : 'Logging in as Admin (En. Razak Sulaiman - Facilities Dept)'}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {role === 'student' ? 'Student University Email' : 'Staff Admin Email'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={role === 'student' ? 'student@uniten.edu.my' : 'admin@campusfix.uniten.edu.my'}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault()
                    alert('For demonstration purposes, password is pre-filled. Click "Sign In" to enter.')
                  }}
                  className="text-[11px] font-medium text-blue-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember this workstation</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In as {role === 'student' ? 'Student' : 'Administrator'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Role Switch for Demo */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <span className="text-[11px] text-slate-400 font-medium block text-center mb-2.5">
              1-Click Demo Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  handleRoleChange('student')
                  login('aiman@student.uniten.edu.my', 'password', 'student')
                  navigate('/student/dashboard')
                }}
                className="py-2 px-3 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Student Login</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleRoleChange('admin')
                  login('admin@campusfix.uniten.edu.my', 'password', 'admin')
                  navigate('/admin/dashboard')
                }}
                className="py-2 px-3 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>

          {/* Registration Link */}
          <div className="mt-6 text-center text-xs text-slate-500">
            <span>New student at UNITEN? </span>
            <Link to="/register" className="font-semibold text-blue-600 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
