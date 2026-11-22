import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useReports } from '../../context/ReportContext'
import { useAuth } from '../../context/AuthContext'
import StatCard from '../../components/common/StatCard'
import StatusBadge from '../../components/common/StatusBadge'
import PriorityBadge from '../../components/common/PriorityBadge'
import CategoryBadge, { getCategoryIcon } from '../../components/common/CategoryBadge'
import Modal from '../../components/common/Modal'
import Select from '../../components/common/Select'
import { formatDate, getRelativeTime } from '../../utils/formatters'
import {
  ShieldCheck,
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Layers,
  Users,
  Edit3,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react'

export const AdminDashboard = () => {
  const { reports, stats, categories, updateReportStatus, resetToSampleData } = useReports()
  const { user } = useAuth()

  // Selected report for status modal
  const [editingReport, setEditingReport] = useState(null)
  const [newStatus, setNewStatus] = useState('In Progress')
  const [assignedTech, setAssignedTech] = useState('')
  const [adminNotes, setAdminNotes] = useState('')

  // Urgent pending/in-progress issues
  const urgentIssues = reports.filter(
    (r) => (r.priority === 'Urgent' || r.priority === 'High') && r.status !== 'Resolved'
  )

  const openStatusModal = (report) => {
    setEditingReport(report)
    setNewStatus(report.status)
    setAssignedTech(report.assignedTo || '')
    setAdminNotes(report.adminNotes || '')
  }

  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusSubmit = async (e) => {
    e.preventDefault()
    if (!editingReport) return
    if (user?.role !== 'admin') {
      alert('Access Denied: Only users with an Administrator role can update report status.')
      return
    }

    setIsUpdating(true)
    try {
      await updateReportStatus(editingReport.id, newStatus, adminNotes, assignedTech)
      setEditingReport(null)
    } catch (err) {
      alert('Error updating status in Supabase: ' + err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  // Count reports by category
  const categoryCounts = categories.map((cat) => {
    const count = reports.filter((r) => r.category === cat.name).length
    const percentage = reports.length > 0 ? Math.round((count / reports.length) * 100) : 0
    return {
      ...cat,
      count,
      percentage,
    }
  })

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E9432B]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#174D91]">
              UNITEN Facilities & Maintenance Directorate
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Operations & Maintenance Overview
          </h1>
          <p className="text-xs text-slate-500">
            Real-time telemetry, triage queue, and technician dispatch for Putrajaya & Muadzam Shah campuses
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (window.confirm('Reload and synchronize all reports directly from Supabase?')) {
                resetToSampleData()
              }
            }}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Sync Database
          </button>
          <Link
            to="/admin/reports"
            className="px-4 py-2 bg-[#174D91] hover:bg-[#133F77] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>Manage All Reports</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Reports"
          value={stats.total}
          icon={FileText}
          changeText="Active database records"
          color="blue"
        />
        <StatCard
          title="Pending Review"
          value={stats.pending}
          icon={Clock}
          changeText="Awaiting admin triage"
          color="amber"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={RefreshCw}
          changeText="Technicians dispatched"
          color="indigo"
        />
        <StatCard
          title="Resolved"
          value={stats.resolved}
          icon={CheckCircle2}
          changeText={`${stats.resolutionRate}% resolution efficiency`}
          color="emerald"
        />
        <StatCard
          title="Rejected / Void"
          value={stats.rejected}
          icon={XCircle}
          changeText="Invalid or duplicate items"
          color="rose"
        />
      </div>

      {/* Urgent Issues Alert Banner */}
      {urgentIssues.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Priority Action Queue ({urgentIssues.length} urgent/high priority open)</span>
            </div>
            <Link
              to="/admin/reports"
              className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
            >
              <span>View In Table</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {urgentIssues.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-3 bg-white rounded-xl border border-amber-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      {item.id}
                    </span>
                    <PriorityBadge priority={item.priority} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    📍 {item.location}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <StatusBadge status={item.status} size="sm" />
                  <button
                    onClick={() => openStatusModal(item)}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Category Breakdown Left, Recent Reports Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Reports by Category</h2>
              <p className="text-xs text-slate-500">Breakdown of reported issues across campus</p>
            </div>
            <Link to="/admin/categories" className="text-xs font-semibold text-blue-600 hover:underline">
              Manage
            </Link>
          </div>

          <div className="space-y-3">
            {categoryCounts.map((cat) => {
              const Icon = getCategoryIcon(cat.name)
              return (
                <div key={cat.id} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-semibold text-slate-800">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{cat.count}</span>
                      <span className="text-[11px] text-slate-400">({cat.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Active Categories: {categories.filter(c => c.active).length}</span>
            <Link to="/admin/categories" className="font-semibold text-blue-600 hover:underline">
              Configure & Add +
            </Link>
          </div>
        </div>

        {/* Live Submissions Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Recent Campus Complaints</h2>
                <p className="text-xs text-slate-500">Live incoming reports from students</p>
              </div>
              <Link
                to="/admin/reports"
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>View All ({reports.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Ref ID</th>
                    <th className="py-3 px-4">Problem & Location</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reports.slice(0, 6).map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <Link to={`/reports/${report.id}`} className="hover:text-blue-600">
                          {report.id}
                        </Link>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <Link
                          to={`/reports/${report.id}`}
                          className="font-bold text-slate-900 hover:text-blue-600 truncate block"
                        >
                          {report.title}
                        </Link>
                        <span className="text-[11px] text-slate-500 truncate block">
                          {report.location}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <PriorityBadge priority={report.priority} />
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <StatusBadge status={report.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => openStatusModal(report)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition-colors"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500">
            <span>Showing recent submissions</span>
            <Link to="/admin/reports" className="font-semibold text-blue-600 hover:underline">
              Open Full Management Console →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Status Modal */}
      {editingReport && (
        <Modal
          isOpen={!!editingReport}
          onClose={() => setEditingReport(null)}
          title={`Update Status: ${editingReport.id}`}
        >
          <form onSubmit={handleStatusSubmit} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="font-bold text-slate-900">{editingReport.title}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">📍 {editingReport.location}</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Report Status</label>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </Select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Technician / Contractor</label>
              <input
                type="text"
                value={assignedTech}
                onChange={(e) => setAssignedTech(e.target.value)}
                placeholder="e.g. Pak Mat (HVAC), Siva (Plumbing), IT Multimedia"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Administrative Notes</label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Details of inspection, parts requisitioned or completion note..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingReport(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default AdminDashboard
