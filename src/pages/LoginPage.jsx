import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  ShieldCheck,
  UserCheck,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Building2,
  CheckCircle2,
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
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleRoleChange = (newRole) => {
    setRole(newRole)
    if (newRole === 'admin') {
      setEmail('admin@campusfix.uniten.edu.my')
    } else {
      setEmail('aiman@student.uniten.edu.my')
    }
    setPassword('password123')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please provide both your email address and password.')
      return
    }

    setIsLoggingIn(true)
    setError('')
    try {
      const res = await login(email, password, role)
      if (res.success) {
        if (role === 'admin') {
          navigate('/admin/dashboard')
        } else {
          navigate('/student/dashboard')
        }
      } else {
        setError(res.error || 'Invalid credentials. Please verify your email and password.')
      }
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F5F8] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Brand with UNITEN Official Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block group mb-3">
          <img
            src="/images/uniten-logo.png"
            alt="Universiti Tenaga Nasional"
            className="h-16 w-auto mx-auto object-contain group-hover:scale-105 transition-transform"
          />
        </Link>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Campus<span className="text-[#E9432B]">Fix</span>
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-[#174D91]">
            UNITEN
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
          Sign In to Your Account
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Campus Facility Issue Reporting and Maintenance Platform
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-slate-200 sm:px-10 space-y-6">
          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#F3F5F8] rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                role === 'student'
                  ? 'bg-white text-[#174D91] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4 text-[#174D91]" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                role === 'admin'
                  ? 'bg-[#174D91] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#E9432B]" />
              <span>Administrator</span>
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-[#E9432B] text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {role === 'admin' ? 'Administrator Email' : 'Student Email'}
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
                  placeholder={role === 'admin' ? 'admin@campusfix.uniten.edu.my' : 'student@student.uniten.edu.my'}
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm font-normal text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#174D91] min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault()
                    alert('For student password reset, please contact the UNITEN IT Helpdesk at helpdesk@uniten.edu.my or Ext 2020.')
                  }}
                  className="text-xs font-medium text-[#174D91] hover:underline"
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
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-sm font-normal text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#174D91] min-h-[44px]"
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

            {/* Demo Credentials Reminder Note */}
            <div className="p-3 rounded-xl bg-[#F3F5F8] border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-semibold text-slate-800 block">Pre-configured Demonstration Account:</span>
              <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
                <span>{role === 'admin' ? 'admin@campusfix.uniten.edu.my' : 'aiman@student.uniten.edu.my'}</span>
                <span className="text-emerald-700 font-bold">password123</span>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 px-4 rounded-xl bg-[#174D91] hover:bg-[#133F77] text-white font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to CampusFix</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Bottom Switch to Register */}
          <div className="border-t border-slate-100 pt-4 text-center">
            <p className="text-sm text-slate-500">
              New UNITEN student?{' '}
              <Link to="/register" className="font-semibold text-[#174D91] hover:underline">
                Register for an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
