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
  LifeBuoy,
  User,
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
      label: 'Submit Issue Report',
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
      label: 'My Profile',
      icon: User,
    },
  ]

  const adminLinks = [
    {
      to: '/admin/dashboard',
      label: 'Admin Overview',
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
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
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
          {/* Header Mobile Close */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 lg:hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Navigation Menu
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role Status Tag */}
          <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
              ) : (
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              )}
              <span className="text-xs font-semibold text-slate-800">
                {isAdmin ? 'Administrator Portal' : 'Student Portal'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {isAdmin
                ? 'Central Facilities Management System'
                : 'Report & track campus maintenance'}
            </p>
          </div>

          {/* Quick Submit CTA for Students */}
          {isStudent && (
            <Link
              to="/student/submit"
              onClick={onClose}
              className="mb-5 flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all transform active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report New Issue</span>
            </Link>
          )}

          {/* Main Navigation Links */}
          <nav className="space-y-1">
            {currentLinks.map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200/60 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              )
            })}
          </nav>

          {/* Campus Facility Notices */}
          <div className="mt-8 pt-4 border-t border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
              Campus Helpdesk
            </span>
            <div className="mt-2.5 space-y-1">
              <a
                href="#hotline"
                onClick={(e) => {
                  e.preventDefault()
                  alert('UNITEN Facilities Emergency Hotline:\n📞 +60 3-8921 2020\nAvailable 24/7 for urgent campus hazards.')
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-600 hover:bg-slate-50"
              >
                <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                <span>24/7 Hotline: Ext 2020</span>
              </a>
              <Link
                to="/"
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-600 hover:bg-slate-50"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Public Landing Page</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Campus Status */}
        <div className="p-3 border-t border-slate-200/80 bg-slate-50/70 text-[11px]">
          <div className="flex items-center justify-between text-slate-500">
            <span>System Status</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Online
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">CampusFix v1.0 • UNITEN</p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
