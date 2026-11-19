import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useReports } from '../../context/ReportContext'
import Select from '../../components/common/Select'
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
  RotateCcw,
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

  // Profile Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    studentId: user?.id || 'SW0108321',
    phone: user?.phone || '+60 17-234 5678',
    faculty: user?.faculty || 'College of Computing & Informatics',
    program: user?.program || 'Bachelor of Software Engineering (Hons)',
    hostel: user?.hostel || 'Murni Residence, Block B, Room 304',
    emergencyContact: user?.emergencyContact || 'Encik Shamsul (Father) - +60 12-345 6789',
    bio: user?.bio || 'Year 3 Software Engineering undergraduate student passionate about campus tech improvements.',
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
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Avatar presets
  const avatarPresets = [
    { label: 'Student 1', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' },
    { label: 'Student 2', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
    { label: 'Student 3', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80' },
    { label: 'Student 4', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80' },
    { label: 'Avatar Initials', url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.name || 'Student')}` },
  ]

  // Compute student stats
  const myReports = reports.filter(
    (r) => r.studentId === user?.id || r.studentEmail === user?.email
  )
  const resolvedCount = myReports.filter((r) => r.status === 'Resolved').length
  const pendingCount = myReports.filter((r) => r.status === 'Pending').length

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        studentId: user.id || prev.studentId,
        phone: user.phone || prev.phone,
        faculty: user.faculty || prev.faculty,
        program: user.program || prev.program,
        hostel: user.hostel || prev.hostel,
        emergencyContact: user.emergencyContact || prev.emergencyContact,
        bio: user.bio || prev.bio,
        avatar: user.avatar || prev.avatar,
      }))
    }
  }, [user])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setErrorMessage('')
    setSuccessMessage('')
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

  const handleSaveProfile = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setErrorMessage('Full name is required.')
      return
    }

    setIsSaving(true)

    setTimeout(() => {
      // 1. Update AuthContext
      updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        faculty: formData.faculty,
        program: formData.program,
        hostel: formData.hostel,
        emergencyContact: formData.emergencyContact,
        bio: formData.bio,
        avatar: formData.avatar,
      })

      // 2. Synchronize with ReportContext student directory & reports
      updateStudent(user?.id || formData.studentId, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        faculty: formData.faculty,
        program: formData.program,
      })

      setIsSaving(false)
      setSuccessMessage('Student profile details updated successfully!')
      setTimeout(() => setSuccessMessage(''), 4000)
    }, 500)
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
    }, 500)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <Link to="/student/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">Student Profile</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Student Profile & Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your personal university credentials, faculty enrollment, and emergency contact details
        </p>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 shadow-xs animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Profile Card & Quick Stats (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm text-center relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-blue-600 to-indigo-600" />

            {/* Avatar with Camera Icon */}
            <div className="relative inline-block mt-4 mb-3">
              <img
                src={formData.avatar}
                alt={formData.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-lg mx-auto bg-slate-100"
              />
              <label
                className="absolute bottom-0 right-0 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md cursor-pointer transition-transform hover:scale-110"
                title="Upload custom profile photo"
              >
                <Camera className="w-3.5 h-3.5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>

            <h2 className="text-base font-bold text-slate-900">{formData.name}</h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{formData.studentId}</p>

            <div className="mt-2 flex items-center justify-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active Student
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                UNITEN Verified
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-3 px-2 italic">
              "{formData.bio}"
            </p>

            {/* Avatar Presets Picker */}
            <div className="mt-5 pt-4 border-t border-slate-100 text-left">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Choose Avatar Preset
              </span>
              <div className="flex items-center justify-center gap-2">
                {avatarPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, avatar: preset.url }))}
                    className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all ${
                      formData.avatar === preset.url
                        ? 'border-blue-600 ring-2 ring-blue-500/30 scale-105'
                        : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                    }`}
                    title={preset.label}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-50">
                <span className="block font-bold text-slate-900 text-base">{myReports.length}</span>
                <span className="text-[10px] text-slate-500">Reports</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50">
                <span className="block font-bold text-indigo-600 text-base">{pendingCount}</span>
                <span className="text-[10px] text-slate-500">Pending</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50">
                <span className="block font-bold text-emerald-600 text-base">{resolvedCount}</span>
                <span className="text-[10px] text-slate-500">Resolved</span>
              </div>
            </div>
          </div>

          {/* Emergency / Contact Badge Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-rose-500" />
              <span>Campus Resident Info</span>
            </h3>
            <div className="space-y-2 text-slate-600">
              <div className="flex items-start gap-2">
                <Home className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{formData.hostel}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>Emergency: {formData.emergencyContact}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Forms with Tabs (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Tabs Navigation Header */}
          <div className="flex border-b border-slate-200/80 bg-slate-50/50 px-4 pt-3 gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 -mb-px ${
                activeTab === 'profile'
                  ? 'bg-white text-blue-700 border-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 border-transparent'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Personal & Academic</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 -mb-px ${
                activeTab === 'security'
                  ? 'bg-white text-blue-700 border-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 border-transparent'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Password & Security</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 -mb-px ${
                activeTab === 'notifications'
                  ? 'bg-white text-blue-700 border-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 border-transparent'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Preferences</span>
            </button>
          </div>

          <div className="p-6">
            {/* TAB 1: Profile Information Form */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Edit Profile Information
                  </h3>
                  <p className="text-slate-500 mt-0.5">
                    Update your display name, contact phone, and campus residential details
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Student ID (Read Only) */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Student ID Number <span className="text-slate-400 text-[10px]">(Institutional ID)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        value={formData.studentId}
                        disabled
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-xl cursor-not-allowed font-mono font-semibold"
                      />
                    </div>
                  </div>

                  {/* University Email */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      University Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Full Legal Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                    </div>
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Contact Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+60 1x-xxx xxxx"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Faculty */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
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
                    <label className="block font-semibold text-slate-700 mb-1">
                      Degree Program
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <GraduationCap className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        name="program"
                        value={formData.program}
                        onChange={handleInputChange}
                        placeholder="e.g. Bachelor of Software Engineering (Hons)"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Hostel Room */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Campus Residence / Hostel Room
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Home className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        name="hostel"
                        value={formData.hostel}
                        onChange={handleInputChange}
                        placeholder="e.g. Murni Residence Block B, Room 304"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Emergency Contact Person & Phone
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <HeartHandshake className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        placeholder="e.g. Parent Name - +60 12-xxxxxxx"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Bio / Student Notes */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Student Bio / Note
                  </label>
                  <textarea
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Short bio or note regarding your campus activities..."
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: Security & Password Form */}
            {activeTab === 'security' && (
              <form onSubmit={handleSaveSecurity} className="space-y-4 text-xs max-w-md">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Change Password
                  </h3>
                  <p className="text-slate-500 mt-0.5">
                    Update your account credentials to keep your portal secure
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={securityData.currentPassword}
                    onChange={handleSecurityChange}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    (Default demo password: <code>password123</code>)
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={securityData.newPassword}
                    onChange={handleSecurityChange}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={securityData.confirmPassword}
                    onChange={handleSecurityChange}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Updating...' : 'Update Password'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: Preferences Form */}
            {activeTab === 'notifications' && (
              <div className="space-y-5 text-xs max-w-lg">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Communication & Notification Preferences
                  </h3>
                  <p className="text-slate-500 mt-0.5">
                    Control how the Facilities Department notifies you about reported repairs
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <span className="font-bold text-slate-800 block">Report Status Updates</span>
                      <span className="text-[11px] text-slate-500">
                        Receive email notifications when an admin or technician updates your report.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailAlerts}
                      onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <span className="font-bold text-slate-800 block">SMS Urgent Alerts</span>
                      <span className="text-[11px] text-slate-500">
                        Get text alerts for critical campus power or water shutdown announcements.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.smsAlerts}
                      onChange={(e) => setNotifications({ ...notifications, smsAlerts: e.target.checked })}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <span className="font-bold text-slate-800 block">Weekly Campus Digest</span>
                      <span className="text-[11px] text-slate-500">
                        Receive a weekly summary of resolved campus infrastructure improvements.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.weeklyDigest}
                      onChange={(e) => setNotifications({ ...notifications, weeklyDigest: e.target.checked })}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSuccessMessage('Notification preferences saved!')
                      setTimeout(() => setSuccessMessage(''), 3000)
                    }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Preferences</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentProfilePage
