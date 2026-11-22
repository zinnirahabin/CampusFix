import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useReports } from '../../context/ReportContext'
import StatCard from '../../components/common/StatCard'
import StatusBadge from '../../components/common/StatusBadge'
import PriorityBadge from '../../components/common/PriorityBadge'
import CategoryBadge from '../../components/common/CategoryBadge'
import { formatDate, getRelativeTime } from '../../utils/formatters'
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  FileText,
  AlertTriangle,
  ArrowRight,
  MapPin,
  ChevronRight,
  User,
  Phone,
} from 'lucide-react'

export const StudentDashboard = () => {
  const { user } = useAuth()
  const { reports } = useReports()

  // Filter reports submitted by current student or show demo reports
  const myReports = reports.filter(
    (r) => r.studentId === user?.id || r.studentEmail === user?.email || r.userId === user?.uuid || !user?.id
  )

  const pendingCount = myReports.filter((r) => r.status === 'Pending').length
  const inProgressCount = myReports.filter((r) => r.status === 'In Progress').length
  const resolvedCount = myReports.filter((r) => r.status === 'Resolved').length

  const recentReports = myReports.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* UNITEN Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#174D91] via-[#154582] to-[#0E3666] text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold text-blue-100 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#E9432B]" />
                UNITEN Student Portal • {user?.id || 'SW0108321'}
              </span>
              {user?.phone && (
                <span className="hidden sm:inline-flex items-center gap-1 text-xs font-mono text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-full">
                  <Phone className="w-3 h-3 text-[#E9432B]" />
                  {user.phone}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Student'}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Report campus facility defects, upload photo proof to Supabase Storage, and track real-time technician repairs at Universiti Tenaga Nasional.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/student/submit"
              className="px-5 py-3 rounded-xl bg-[#E9432B] hover:bg-[#D3341D] text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all flex items-center gap-2 transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Issue</span>
            </Link>
            <Link
              to="/student/profile"
              className="px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-1.5"
            >
              <User className="w-4 h-4 text-blue-200" />
              <span>My Profile</span>
            </Link>
            <Link
              to="/student/reports"
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition-all flex items-center gap-1.5"
            >
              <span>My Reports</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Reports Submitted"
          value={myReports.length}
          icon={FileText}
          changeText="All-time complaints logged"
          color="blue"
        />
        <StatCard
          title="Awaiting Triage"
          value={pendingCount}
          icon={Clock}
          changeText="Queued for admin review"
          color="amber"
        />
        <StatCard
          title="Technician Dispatched"
          value={inProgressCount}
          icon={MapPin}
          changeText="Active repairs underway"
          color="indigo"
        />
        <StatCard
          title="Resolved & Verified"
          value={resolvedCount}
          icon={CheckCircle2}
          changeText="Inspected by facilities staff"
          color="emerald"
        />
      </div>

      {/* Recent Submissions List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Maintenance Incidents
            </h2>
            <p className="text-xs text-slate-500">
              Live status updates for your submitted campus maintenance reports
            </p>
          </div>
          <Link
            to="/student/reports"
            className="text-xs font-semibold text-[#174D91] hover:underline flex items-center gap-1"
          >
            <span>View All ({myReports.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentReports.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F3F5F8] px-3 -mx-3 rounded-xl transition-colors group"
              >
                <div className="flex items-start gap-3">
                  {report.images && report.images.length > 0 ? (
                    <img
                      src={report.images[0]}
                      alt={report.title}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#174D91] shrink-0 font-bold text-xs">
                      CF
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800 group-hover:text-[#174D91] transition-colors">
                        {report.id}
                      </span>
                      <CategoryBadge category={report.category} />
                      <PriorityBadge priority={report.priority} />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">
                      {report.title}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{report.location}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <StatusBadge status={report.status} />
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {getRelativeTime(report.createdAt)}
                    </span>
                  </div>
                  <Link
                    to={`/reports/${report.id}`}
                    className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-[#174D91] hover:text-white transition-all"
                    title="View details"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#174D91] mx-auto flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Reports Logged Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Notice a broken desk, leaking tap, or air conditioning malfunction? Submit a report with photographic evidence.
            </p>
            <Link
              to="/student/submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E9432B] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit First Report</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentDashboard
