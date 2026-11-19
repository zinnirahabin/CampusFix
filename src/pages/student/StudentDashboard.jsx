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
  RefreshCw,
  CheckCircle2,
  FileText,
  AlertTriangle,
  ArrowRight,
  MapPin,
  ChevronRight,
  Info,
  User,
} from 'lucide-react'

export const StudentDashboard = () => {
  const { user } = useAuth()
  const { reports } = useReports()

  // Filter reports submitted by current student or show demo reports
  const myReports = reports.filter(
    (r) => r.studentId === user?.id || r.studentEmail === user?.email || !user?.id
  )

  const pendingCount = myReports.filter((r) => r.status === 'Pending').length
  const inProgressCount = myReports.filter((r) => r.status === 'In Progress').length
  const resolvedCount = myReports.filter((r) => r.status === 'Resolved').length

  const recentReports = myReports.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-6 sm:p-8 shadow-lg shadow-blue-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold text-blue-100">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Student Portal • {user?.id || 'SW0108321'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Student'}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Report facility malfunctions, submit photographic proof, and stay updated with real-time technician repairs on campus.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/student/submit"
              className="px-5 py-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs shadow-md transition-all flex items-center gap-2 transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              <span>Report an Issue</span>
            </Link>
            <Link
              to="/student/profile"
              className="px-4 py-3 rounded-xl bg-blue-800/60 hover:bg-blue-800 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-1.5"
            >
              <User className="w-4 h-4 text-blue-200" />
              <span>Edit Profile</span>
            </Link>
            <Link
              to="/student/reports"
              className="px-4 py-3 rounded-xl bg-blue-800/40 hover:bg-blue-800 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-1.5"
            >
              <span>My Reports</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Reports Submitted"
          value={myReports.length}
          icon={FileText}
          changeText="All time complaints logged"
          color="blue"
        />
        <StatCard
          title="Awaiting Review"
          value={pendingCount}
          icon={Clock}
          changeText="Queued for admin review"
          color="amber"
        />
        <StatCard
          title="Under Repair"
          value={inProgressCount}
          icon={RefreshCw}
          changeText="Technicians dispatched on-site"
          color="indigo"
        />
        <StatCard
          title="Resolved Issues"
          value={resolvedCount}
          icon={CheckCircle2}
          changeText="Verified completed by campus staff"
          color="emerald"
        />
      </div>

      {/* Maintenance Announcement Banner */}
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 flex-1">
          <p className="font-bold">Campus Maintenance Advisory</p>
          <p className="text-blue-700 mt-0.5">
            Routine electrical substation maintenance is scheduled for College of Engineering (COE) this Saturday from 8:00 AM to 1:00 PM. Please report any lingering power anomalies.
          </p>
        </div>
      </div>

      {/* Recent Reports Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Maintenance Requests</h2>
            <p className="text-xs text-slate-500">Track progress and technician updates on your reported problems</p>
          </div>
          <Link
            to="/student/reports"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>See full history</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentReports.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No issues reported yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Notice a problem with campus lighting, air conditioning, plumbing or classrooms? Submit a report now.
            </p>
            <Link
              to="/student/submit"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report an Issue</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    {report.images && report.images.length > 0 ? (
                      <img
                        src={report.images[0]}
                        alt={report.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <FileText className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {report.id}
                      </span>
                      <CategoryBadge category={report.category} />
                      <PriorityBadge priority={report.priority} />
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">
                      <Link to={`/reports/${report.id}`}>{report.title}</Link>
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {report.location}
                      </span>
                      <span>•</span>
                      <span>Submitted {getRelativeTime(report.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                  <StatusBadge status={report.status} />
                  <Link
                    to={`/reports/${report.id}`}
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentDashboard
