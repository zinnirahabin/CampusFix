import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Select from '../components/common/Select'
import { validateMalaysianPhone, formatMalaysianPhone } from '../utils/formatters'
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Phone,
  CheckCircle2,
  AlertCircle,
  Hash,
  GraduationCap,
} from 'lucide-react'

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    faculty: 'College of Computing & Informatics',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [phoneError, setPhoneError] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('')
    if (name === 'phone') {
      setPhoneError('')
    }
  }

  const handlePhoneBlur = () => {
    if (formData.phone && formData.phone.trim()) {
      const result = validateMalaysianPhone(formData.phone)
      if (!result.valid) {
        setPhoneError(result.message)
      } else {
        setPhoneError('')
        setFormData((prev) => ({
          ...prev,
          phone: formatMalaysianPhone(prev.phone),
        }))
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setPhoneError('')

    if (!formData.studentId.trim() || !formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all required fields marked with an asterisk (*).')
      return
    }

    if (!formData.phone.trim()) {
      setPhoneError('Please enter your contact mobile number for emergency maintenance notifications.')
      return
    }

    // Strict validation of Malaysian telephone number
    const phoneValidation = validateMalaysianPhone(formData.phone)
    if (!phoneValidation.valid) {
      setPhoneError(phoneValidation.message)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await register({
        ...formData,
        phone: formatMalaysianPhone(formData.phone),
      })

      if (res.success) {
        setSuccess(true)
        setTimeout(() => {
          navigate('/student/dashboard')
        }, 800)
      } else {
        setError(res.error || 'Registration failed. Please check your details.')
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during registration.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F5F8] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Header with Official UNITEN Logo */}
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
          Create Student Account
        </h1>
        <p className="mt-1 text-sm font-normal text-slate-500">
          Sign up to report facility defects and track campus repairs
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-[#E9432B] text-sm font-medium flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Account created successfully! Redirecting to student portal...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Student ID */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Student ID Number <span className="text-[#E9432B]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Hash className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                    placeholder="e.g. SW0108321"
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm font-normal text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#174D91] min-h-[44px]"
                  />
                </div>
                <span className="text-xs text-slate-400 mt-1 block">UNITEN student registration number</span>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name <span className="text-[#E9432B]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Nurul Izzah binti Mansor"
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm font-normal text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#174D91] min-h-[44px]"
                  />
                </div>
              </div>
            </div>

            {/* University Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Student Email Address <span className="text-[#E9432B]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="studentname@student.uniten.edu.my"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm font-normal text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#174D91] min-h-[44px]"
                />
              </div>
            </div>

            {/* Faculty & Contact Telephone Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  College / Faculty
                </label>
                <Select
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                >
                  <option value="College of Computing & Informatics">College of Computing & Informatics (CCI)</option>
                  <option value="College of Engineering">College of Engineering (COE)</option>
                  <option value="College of Business Administration">College of Business Administration (COBA)</option>
                  <option value="College of Energy Economics">College of Energy Economics (CES)</option>
                </Select>
              </div>

              {/* PRIORITY 1: Contact Mobile Number Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Contact Mobile Number <span className="text-[#E9432B]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handlePhoneBlur}
                    required
                    placeholder="+60 12-345 6789"
                    className={`w-full pl-9 pr-3.5 py-2.5 text-sm font-normal text-slate-900 bg-white border rounded-xl focus:outline-none focus:ring-2 min-h-[44px] ${
                      phoneError
                        ? 'border-[#E9432B] focus:ring-[#E9432B]'
                        : 'border-slate-300 focus:ring-[#174D91]'
                    }`}
                  />
                </div>
                {phoneError ? (
                  <span className="text-xs text-[#E9432B] font-medium mt-1 block">
                    {phoneError}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 mt-1 block">
                    Malaysian mobile format (e.g. +60 1x-xxx xxxx or 01x-xxx xxxx)
                  </span>
                )}
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password <span className="text-[#E9432B]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm font-normal text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#174D91] min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Confirm Password <span className="text-[#E9432B]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm font-normal text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#174D91] min-h-[44px]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-[#174D91] hover:bg-[#133F77] text-white font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Creating Student Account...</span>
                ) : (
                  <>
                    <span>Register Student Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="border-t border-slate-100 pt-4 text-center">
            <p className="text-sm text-slate-500">
              Already have a UNITEN student or staff account?{' '}
              <Link to="/login" className="font-semibold text-[#174D91] hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
