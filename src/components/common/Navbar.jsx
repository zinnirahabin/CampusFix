import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  ShieldCheck,
  UserCheck,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronDown,
  Building2,
  User,
  ExternalLink,
} from 'lucide-react'

export const Navbar = ({ onToggleSidebar }) => {
  const { user, isAdmin, isStudent, switchRole, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotificationToast, setShowNotificationToast] = useState(false)

  const handleRoleToggle = () => {
    if (isAdmin) {
      switchRole('student')
      navigate('/student/dashboard')
    } else {
      switchRole('admin')
      navigate('/admin/dashboard')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: UNITEN Brand & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/images/uniten-logo.png"
                alt="Universiti Tenaga Nasional Logo"
                className="h-10 w-auto object-contain shrink-0"
              />
              <div className="h-6 w-px bg-slate-200 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-[#174D91] transition-colors flex items-center">
                  Campus<span className="text-[#E9432B]">Fix</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 -mt-0.5">
                  UNITEN Facility Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Quick Role Switcher Pill */}
          <div className="hidden md:flex items-center bg-[#F3F5F8] p-1 rounded-xl border border-slate-200">
            <span className="text-xs font-medium px-2.5 text-slate-500">Role View:</span>
            <button
              type="button"
              onClick={() => {
                switchRole('student')
                if (!location.pathname.startsWith('/student')) navigate('/student/dashboard')
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                isStudent
                  ? 'bg-white text-[#174D91] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4 text-[#174D91]" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => {
                switchRole('admin')
                if (!location.pathname.startsWith('/admin')) navigate('/admin/dashboard')
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                isAdmin
                  ? 'bg-[#174D91] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#E9432B]" />
              <span>Administrator</span>
            </button>
          </div>

          {/* Right: Notifications & User Profile */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationToast(!showNotificationToast)}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E9432B] rounded-full ring-2 ring-white"></span>
              </button>

              {showNotificationToast && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-sm">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 font-bold text-slate-800">
                    <span>UNITEN Campus Notices</span>
                    <span className="text-xs text-[#E9432B] font-semibold px-2 py-0.5 rounded-full bg-red-50">2 new</span>
                  </div>
                  <div className="mt-3 space-y-2.5">
                    <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-slate-700">
                      <p className="font-bold text-[#174D91] text-xs">Work Order Dispatched</p>
                      <p className="text-xs text-slate-600 mt-1">Technician assigned to inspect classroom lighting fault.</p>
                      <span className="text-[11px] text-slate-400 mt-1 block">Just now</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                      <p className="font-bold text-slate-800 text-xs">Scheduled Maintenance</p>
                      <p className="text-xs text-slate-600 mt-1">COE water pipe upgrade scheduled this Saturday 9 AM.</p>
                      <span className="text-[11px] text-slate-400 mt-1 block">2 hours ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile - Always renders the authenticated user session */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || user.email)}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-[#174D91]/20"
                  />
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-800 leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-slate-500 capitalize">
                      {user.role === 'admin' ? 'Facilities Admin' : `Student • ${user.id || ''}`}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in-50 zoom-in-95 duration-100">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                      <span className={`inline-block mt-1.5 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        user.role === 'admin' ? 'bg-red-50 text-[#E9432B]' : 'bg-blue-50 text-[#174D91]'
                      }`}>
                        {user.role}
                      </span>
                    </div>

                    <div className="py-1.5 space-y-0.5">
                      <Link
                        to={isAdmin ? '/admin/dashboard' : '/student/dashboard'}
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span>Dashboard</span>
                      </Link>
                      {user.role === 'student' && (
                        <Link
                          to="/student/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>Student Profile</span>
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setShowProfileMenu(false)
                          handleRoleToggle()
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                      >
                        {isAdmin ? (
                          <>
                            <UserCheck className="w-4 h-4 text-slate-400" />
                            <span>Switch to Student View</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4 text-slate-400" />
                            <span>Switch to Admin View</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1.5 mt-1">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false)
                          handleLogout()
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-[#E9432B] hover:bg-red-50 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-[#E9432B]" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-[#174D91] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold bg-[#174D91] text-white rounded-xl hover:bg-[#133F77] shadow-xs transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
