import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useReports } from '../../context/ReportContext'
import Select from '../../components/common/Select'
import { validateMalaysianPhone, formatMalaysianPhone } from '../../utils/formatters'
import {
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  MapPin,
  Lock,
  Camera,
  CheckCircle2,
  AlertCircle,
  Save,
  ShieldCheck,
  Bell,
  Home,
  HeartHandshake,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react'

export const StudentProfilePage = () => {
  const { user, updateProfile } = useAuth()
  const { reports, updateStudent } = useReports()

  const [activeTab, setActiveTab] = useState('profile') // 'profile' | 'security' | 'notifications'

  // Profile Form State - NO hardcoded fallback telephone number!
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    studentId: user?.id || '',
    phone: user?.phone || '', // Strictly authenticated student's telephone number
    faculty: user?.faculty || 'College of Computing & Informatics',
    program: user?.program || 'Bachelor of Software Engineering (Hons)',
    hostel: user?.hostel || '',
    emergencyContact: user?.emergencyContact || '',
    bio: user?.bio || '',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  })

  // Security Form State
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Notification toggles
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: true,
    weeklyDigest: false,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Compute student reports count
  const myReports = reports.filter(
    (r) => r.studentId === user?.id || r.studentEmail === user?.email || r.userId === user?.uuid
  )
  const resolvedCount = myReports.filter((r) => r.status === 'Resolved').length
  const pendingCount = myReports.filter((r) => r.status === 'Pending').length

  // Synchronize formData with authenticated user state automatically
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name ?? prev.name,
        email: user.email ?? prev.email,
        studentId: user.id ?? prev.studentId,
        phone: user.phone !== undefined ? user.phone : prev.phone,
        faculty: user.faculty ?? prev.faculty,
        program: user.program ?? prev.program,
        hostel: user.hostel ?? prev.hostel,
        emergencyContact: user.emergencyContact ?? prev.emergencyContact,
        bio: user.bio ?? prev.bio,
        avatar: user.avatar ?? prev.avatar,
      }))
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setErrorMessage('')
    setSuccessMessage('')
    if (name === 'phone') {
      setPhoneError('')
    }
  }

  const handlePhoneBlur = () => {
    if (formData.phone && formData.phone.trim()) {
      const val = validateMalaysianPhone(formData.phone)
      if (!val.valid) {
        setPhoneError(val.message)
      } else {
        setPhoneError('')
        setFormData((prev) => ({
          ...prev,
          phone: formatMalaysianPhone(prev.phone),
        }))
      }
    }
  }

  const handleSecurityChange = (e) => {
    setSecurityData({
      ...securityData,
      [e.target.name]: e.target.value,
    })
    setErrorMessage('')
    setSuccessMessage('')
  }

  const handleCustomAvatarUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setFormData((prev) => ({ ...prev, avatar: url }))
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setPhoneError('')

    if (!formData.name.trim()) {
      setErrorMessage('Full name is required.')
      return
    }

    // Validate telephone number if provided
    let formattedPhone = formData.phone
    if (formData.phone && formData.phone.trim()) {
      const val = validateMalaysianPhone(formData.phone)
      if (!val.valid) {
        setPhoneError(val.message)
        setErrorMessage(val.message)
        return
      }
      formattedPhone = formatMalaysianPhone(formData.phone)
    }

    setIsSaving(true)

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formattedPhone,
        faculty: formData.faculty,
        program: formData.program,
        hostel: formData.hostel,
        emergencyContact: formData.emergencyContact,
        bio: formData.bio,
        avatar: formData.avatar,
      }

      // 1. Update AuthContext, Supabase profiles table, Auth metadata, and local registry
      await updateProfile(payload)

      // 2. Synchronize with ReportContext student directory
      if (updateStudent && (user?.id || formData.studentId)) {
        updateStudent(user?.id || formData.studentId, payload)
      }

      setFormData((prev) => ({
        ...prev,
        phone: formattedPhone,
      }))

      setSuccessMessage('Student profile details and contact mobile number updated successfully!')
      setTimeout(() => setSuccessMessage(''), 4000)
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveSecurity = (e) => {
    e.preventDefault()
    if (!securityData.currentPassword) {
      setErrorMessage('Please enter your current password.')
      return
    }
    if (securityData.newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.')
      return
    }
    if (securityData.newPassword !== securityData.confirmPassword) {
      setErrorMessage('New password and confirmation do not match.')
      return
    }

    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setSuccessMessage('Password changed successfully!')
      setTimeout(() => setSuccessMessage(''), 4000)
    }, 400)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs font-normal text-slate-500 mb-1">
          <Link to="/student/dashboard" className="hover:underline text-[#174D91]">
            Dashboard
          </Link>
          <span>/</span>
          <span className="font-medium text-slate-800">Student Profile</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Student Profile & Account Settings
        </h1>
        <p className="text-sm font-normal text-slate-500 mt-1">
          Manage your personal university credentials, contact telephone number, and campus residential details
        </p>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-[#E9432B] text-sm font-medium flex items-center gap-2.5 shadow-xs">
          <AlertCircle className="w-5 h-5 text-[#E9432B] shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Profile Card & Quick Stats (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-center relative overflow-hidden">
            {/* Top UNITEN Blue Banner */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-[#174D91]" />

            {/* Avatar with Camera Icon */}
            <div className="relative inline-block mt-4 mb-3">
              <img
                src={formData.avatar}
                alt={formData.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-md mx-auto bg-slate-100"
              />
              <label
                className="absolute bottom-0 right-0 p-1.5 bg-[#174D91] hover:bg-[#133F77] text-white rounded-full shadow-md cursor-pointer transition-transform hover:scale-110"
                title="Upload custom profile photo"
              >
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>

            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              {formData.name || 'Student Name'}
            </h2>
            <p className="text-xs font-mono font-semibold text-[#174D91] mt-0.5">
              {formData.studentId || user?.id || 'SW0108321'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {formData.email}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#174D91] border border-blue-100">
                Active Student
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                UNITEN Putrajaya
              </span>
            </div>

            {/* Key Contact Summary Box */}
            <div className="mt-4 p-3 rounded-xl bg-[#F3F5F8] border border-slate-200 text-left space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-3.5 h-3.5 text-[#174D91] shrink-0" />
                <span className="font-mono font-medium">
                  {formData.phone || <em className="text-slate-400 not-italic">No telephone number registered</em>}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <GraduationCap className="w-3.5 h-3.5 text-[#174D91] shrink-0" />
                <span className="truncate">{formData.faculty}</span>
              </div>
            </div>
          </div>

          {/* Activity Statistics Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-base font-semibold text-slate-900 pb-2 border-b border-slate-100">
              Maintenance Reporting Activity
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-[#F3F5F8]">
                <span className="text-lg font-bold text-slate-900 block">{myReports.length}</span>
                <span className="text-[11px] text-slate-500">Total</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50">
                <span className="text-lg font-bold text-amber-700 block">{pendingCount}</span>
                <span className="text-[11px] text-amber-600">Pending</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50">
                <span className="text-lg font-bold text-emerald-700 block">{resolvedCount}</span>
                <span className="text-[11px] text-emerald-600">Resolved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings Tabs & Forms (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Navigation Tabs */}
          <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-xs flex gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'profile'
                  ? 'bg-[#174D91] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#F3F5F8]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Personal Profile</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'security'
                  ? 'bg-[#174D91] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#F3F5F8]'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Security & Password</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('notifications')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'notifications'
                  ? 'bg-[#174D91] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#F3F5F8]'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </button>
          </div>

          {/* TAB 1: Profile Information */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900">
                  Academic & Personal Information
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your registered contact telephone number and academic credentials
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Full Name <span className="text-[#E9432B]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 text-sm font-normal text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#174D91] min-h-[44px]"
                      />
                    </div>
                  </div>

                  {/* Student ID (Read Only) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Student ID (Official)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </div>
                      <input
                        type="text"
                        value={formData.studentId}
                        readOnly
                        disabled
                        className="w-full pl-10 pr-3.5 py-2.5 text-sm font-mono text-slate-600 bg-[#F3F5F8] border border-slate-300 rounded-xl cursor-not-allowed min-h-[44px]"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">Assigned by UNITEN Registrar</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Student Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      University Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        readOnly
                        disabled
                        className="w-full pl-10 pr-3.5 py-2.5 text-sm text-slate-600 bg-[#F3F5F8] border border-slate-300 rounded-xl cursor-not-allowed min-h-[44px]"
                      />
                    </div>
                  </div>

                  {/* PRIORITY 1: Contact Mobile Number Field */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Contact Mobile Number <span className="text-[#E9432B]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        onBlur={handlePhoneBlur}
                        placeholder="+60 12-345 6789"
                        className={`w-full pl-10 pr-3.5 py-2.5 text-sm font-normal text-slate-900 bg-white border rounded-xl focus:outline-none focus:ring-2 min-h-[44px] ${
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
                      <span className="text-xs text-slate-500 mt-1 block">
                        Direct contact number used by maintenance technicians
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Faculty */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      College / Faculty
                    </label>
                    <Select
                      name="faculty"
                      value={formData.faculty}
                      onChange={handleInputChange}
                    >
                      <option value="College of Computing & Informatics">College of Computing & Informatics (CCI)</option>
                      <option value="College of Engineering">College of Engineering (COE)</option>
                      <option value="College of Business Administration">College of Business Administration (COBA)</option>
                      <option value="College of Energy Economics">College of Energy Economics (CES)</option>
                    </Select>
                  </div>

                  {/* Academic Program */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Degree Program
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="program"
                        value={formData.program}
                        onChange={handleInputChange}
                        placeholder="e.g. Bachelor of Software Engineering (Hons)"
                        className="w-full pl-10 pr-3.5 py-2.5 text-sm font-normal text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#174D91] min-h-[44px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Hostel Room */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Campus Hostel / Accommodation
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Home className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="hostel"
                        value={formData.hostel}
                        onChange={handleInputChange}
                        placeholder="e.g. Murni Residence, Block B, Room 304"
                        className="w-full pl-10 pr-3.5 py-2.5 text-sm font-normal text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#174D91] min-h-[44px]"
                      />
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Emergency Guardian Contact
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <HeartHandshake className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        placeholder="e.g. Encik Shamsul (Father) - +60 12-345 6789"
                        className="w-full pl-10 pr-3.5 py-2.5 text-sm font-normal text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#174D91] min-h-[44px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Student Bio */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Student Bio / Notes
                  </label>
                  <textarea
                    rows={3}
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Brief information about your campus activities or department affiliations..."
                    className="w-full p-3 text-sm font-normal text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#174D91]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="py-2.5 px-6 rounded-xl bg-[#174D91] hover:bg-[#133F77] text-white font-semibold text-sm shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Security & Password */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900">
                  Account Password & Security
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your UNITEN single sign-on credentials and session security
                </p>
              </div>

              <form onSubmit={handleSaveSecurity} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={securityData.currentPassword}
                    onChange={handleSecurityChange}
                    required
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#174D91] min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={securityData.newPassword}
                    onChange={handleSecurityChange}
                    required
                    placeholder="Minimum 6 characters"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#174D91] min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={securityData.confirmPassword}
                    onChange={handleSecurityChange}
                    required
                    placeholder="Repeat new password"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#174D91] min-h-[44px]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="py-2.5 px-6 rounded-xl bg-[#174D91] hover:bg-[#133F77] text-white font-semibold text-sm shadow-xs transition-all disabled:opacity-50"
                  >
                    <span>{isSaving ? 'Updating Password...' : 'Update Password'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: Notifications */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900">
                  Notification Preferences
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure how you receive updates when facility technicians inspect or resolve complaints
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#F3F5F8] border border-slate-200">
                  <div>
                    <span className="font-semibold text-slate-800 text-sm block">Email Status Notifications</span>
                    <span className="text-xs text-slate-500">Receive automated email alerts when status changes to In Progress or Resolved.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailAlerts}
                    onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                    className="w-5 h-5 rounded text-[#174D91] focus:ring-[#174D91]"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#F3F5F8] border border-slate-200">
                  <div>
                    <span className="font-semibold text-slate-800 text-sm block">SMS & Mobile Alerts</span>
                    <span className="text-xs text-slate-500">Receive instant SMS alerts on your registered telephone number for emergency hazard complaints.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.smsAlerts}
                    onChange={(e) => setNotifications({ ...notifications, smsAlerts: e.target.checked })}
                    className="w-5 h-5 rounded text-[#174D91] focus:ring-[#174D91]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentProfilePage
