import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  Layers,
  Users,
  ShieldCheck,
  PhoneCall,
  X,
  FileText,
  User,
  GraduationCap,
} from 'lucide-react'

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin, isStudent } = useAuth()

  const studentLinks = [
    {
      to: '/student/dashboard',
      label: 'Student Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/student/submit',
      label: 'Submit Maintenance Report',
      icon: PlusCircle,
      highlight: true,
    },
    {
      to: '/student/reports',
      label: 'My Submitted Reports',
      icon: ClipboardList,
    },
    {
      to: '/student/profile',
      label: 'Student Profile',
      icon: User,
    },
  ]

  const adminLinks = [
    {
      to: '/admin/dashboard',
      label: 'Operations Overview',
      icon: LayoutDashboard,
    },
    {
      to: '/admin/reports',
      label: 'Report Management',
      icon: ClipboardList,
    },
    {
      to: '/admin/categories',
      label: 'Facility Categories',
      icon: Layers,
    },
    {
      to: '/admin/students',
      label: 'Student Directory',
      icon: Users,
    },
  ]

  const currentLinks = isAdmin ? adminLinks : studentLinks

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 overflow-y-auto">
          {/* Header Mobile Close with Logo */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 lg:hidden">
            <div className="flex items-center gap-2">
              <img
                src="/images/uniten-logo.png"
                alt="UNITEN Logo"
                className="h-8 w-auto object-contain"
              />
              <span className="text-xs font-bold text-slate-800">CampusFix</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role Status Tag */}
          <div className="mb-4 p-3 rounded-xl bg-[#F3F5F8] border border-slate-200/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isAdmin ? 'bg-[#E9432B]' : 'bg-[#174D91]'}`} />
                <span className="text-xs font-bold text-slate-800">
                  {isAdmin ? 'Facilities Administrator' : 'UNITEN Student'}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                isAdmin ? 'bg-red-100 text-[#E9432B]' : 'bg-blue-100 text-[#174D91]'
              }`}>
                {isAdmin ? 'ADMIN' : 'STUDENT'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              {isAdmin
                ? 'Universiti Tenaga Nasional Maintenance Operations'
                : 'Campus Facility Malfunction & Repair Tracking'}
            </p>
          </div>

          {/* Quick Submit CTA for Students (UNITEN Red) */}
          {isStudent && (
            <Link
              to="/student/submit"
              onClick={onClose}
              className="mb-5 flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-[#E9432B] hover:bg-[#D3341D] text-white rounded-xl text-sm font-semibold shadow-xs transition-all transform active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Facility Issue</span>
            </Link>
          )}

          {/* Main Navigation Links: 14px, 500 font-weight */}
          <nav className="space-y-1">
            {currentLinks.map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#174D91] text-white shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-[#F3F5F8]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Indicator Bar */}
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#E9432B] rounded-r-full" />
                      )}
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#174D91]'}`} />
                      <span>{link.label}</span>
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>

          {/* Campus Facility Notices */}
          <div className="mt-8 pt-4 border-t border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
              UNITEN Helpdesk
            </span>
            <div className="mt-2.5 space-y-1">
              <a
                href="#hotline"
                onClick={(e) => {
                  e.preventDefault()
                  alert('UNITEN Facilities Emergency Hotline:\n📞 +60 3-8921 2020\nAvailable 24/7 for emergency facility hazards.')
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-normal text-slate-600 hover:bg-[#F3F5F8] transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-[#174D91]" />
                <span>Emergency: Ext 2020</span>
              </a>
              <Link
                to="/"
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-normal text-slate-600 hover:bg-[#F3F5F8] transition-colors"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span>CampusFix Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Campus Status */}
        <div className="p-3.5 border-t border-slate-200/80 bg-[#F3F5F8] text-[11px]">
          <div className="flex items-center justify-between text-slate-600">
            <span className="font-medium">System Telemetry</span>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Universiti Tenaga Nasional</p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
