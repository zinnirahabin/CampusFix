import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  Wrench,
  ShieldCheck,
  UserCheck,
  LogOut,
  Bell,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  Building2,
  User,
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

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  Campus<span className="text-blue-600">Fix</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 -mt-1">
                  UNITEN Facility Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Demo Quick Role Switcher Pill */}
          <div className="hidden md:flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200">
            <span className="text-xs font-medium px-2.5 text-slate-500">Demo Role:</span>
            <button
              onClick={() => {
                switchRole('student')
                if (!location.pathname.startsWith('/student')) navigate('/student/dashboard')
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isStudent
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Student View
            </button>
            <button
              onClick={() => {
                switchRole('admin')
                if (!location.pathname.startsWith('/admin')) navigate('/admin/dashboard')
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isAdmin
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin View
            </button>
          </div>

          {/* Right: Actions & User Info */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationToast(!showNotificationToast)}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
              </button>

              {showNotificationToast && (
                <div className="absolute right-0 mt-2 w-88 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 text-sm">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 font-bold text-slate-800 text-sm">
                    <span>Recent Alerts</span>
                    <span className="text-xs text-blue-600 font-semibold px-2 py-0.5 rounded-full bg-blue-50">2 new</span>
                  </div>
                  <div className="mt-3 space-y-2.5">
                    <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100/60 text-slate-700">
                      <p className="font-bold text-blue-900 text-sm">CF-2024-001 Updated</p>
                      <p className="text-xs text-slate-600 mt-1">HVAC technician assigned to CCI Lab 402 AC leak.</p>
                      <span className="text-[11px] text-slate-400 mt-1.5 block">15 mins ago</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                      <p className="font-bold text-slate-900 text-sm">Scheduled Maintenance</p>
                      <p className="text-xs text-slate-600 mt-1">Water supply shutoff for Library Annex tomorrow 2 AM - 5 AM.</p>
                      <span className="text-[11px] text-slate-400 mt-1.5 block">2 hours ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-600/20"
                  />
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-800 leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-slate-500 capitalize">
                      {isAdmin ? 'Facilities Administrator' : `Student • ${user.id || ''}`}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in-50 zoom-in-95 duration-100">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                      <span className={`inline-block mt-1.5 text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        isAdmin ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'
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
                      {isStudent && (
                        <Link
                          to="/student/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>Student Profile Settings</span>
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setShowProfileMenu(false)
                          handleRoleToggle()
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
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
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
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
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm transition-all"
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
