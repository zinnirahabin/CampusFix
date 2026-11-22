import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useReports } from '../../context/ReportContext'
import StatusBadge from '../../components/common/StatusBadge'
import PriorityBadge from '../../components/common/PriorityBadge'
import CategoryBadge from '../../components/common/CategoryBadge'
import Modal from '../../components/common/Modal'
import Select from '../../components/common/Select'
import { formatDate, getRelativeTime } from '../../utils/formatters'
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit3,
  X,
  Layers,
  ArrowUpDown,
  Building2,
  Calendar,
  Camera,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'

export const AdminReportsPage = () => {
  const { reports, categories, updateReportStatus } = useReports()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')

  // Modals
  const [activeModalReport, setActiveModalReport] = useState(null)
  const [modalStatus, setModalStatus] = useState('In Progress')
  const [modalAssignedTo, setModalAssignedTo] = useState('')
  const [modalAdminNotes, setModalAdminNotes] = useState('')
  const [activePhotoModal, setActivePhotoModal] = useState(null)

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        report.title.toLowerCase().includes(query) ||
        report.id.toLowerCase().includes(query) ||
        report.location.toLowerCase().includes(query) ||
        report.studentName.toLowerCase().includes(query) ||
        report.studentId.toLowerCase().includes(query)

      const matchesStatus =
        statusFilter === 'All' || report.status === statusFilter

      const matchesCategory =
        categoryFilter === 'All' || report.category === categoryFilter

      const matchesPriority =
        priorityFilter === 'All' || report.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesCategory && matchesPriority
    })
  }, [reports, searchQuery, statusFilter, categoryFilter, priorityFilter])

  const openUpdateModal = (report) => {
    setActiveModalReport(report)
    setModalStatus(report.status)
    setModalAssignedTo(report.assignedTo || '')
    setModalAdminNotes(report.adminNotes || '')
  }

  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    if (!activeModalReport) return

    setIsUpdating(true)
    try {
      await updateReportStatus(
        activeModalReport.id,
        modalStatus,
        modalAdminNotes,
        modalAssignedTo
      )
      setActiveModalReport(null)
    } catch (err) {
      alert('Error updating report status in Supabase: ' + err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleExportCSV = () => {
    const csvHeader = 'Report ID,Title,Category,Priority,Status,Location,Student Name,Student ID,Assigned To,Created At\n'
    const csvRows = filteredReports
      .map(
        (r) =>
          `"${r.id}","${r.title.replace(/"/g, '""')}","${r.category}","${r.priority}","${r.status}","${r.location.replace(/"/g, '""')}","${r.studentName}","${r.studentId}","${r.assignedTo}","${r.createdAt}"`
      )
      .join('\n')

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `CampusFix_Reports_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Maintenance Report Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review complaints, inspect photo evidence, dispatch technicians, and manage resolution statuses
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Console */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search */}
          <div className="sm:col-span-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, title, student, or location..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending Review</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Priority Filter */}
          <div className="sm:col-span-2">
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </Select>
          </div>
        </div>

        {/* Clear Filters Status */}
        {(searchQuery || statusFilter !== 'All' || categoryFilter !== 'All' || priorityFilter !== 'All') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Found <strong>{filteredReports.length}</strong> matching reports (of {reports.length} total)
            </span>
            <button
              onClick={() => {
                setSearchQuery('')
                setStatusFilter('All')
                setCategoryFilter('All')
                setPriorityFilter('All')
              }}
              className="text-blue-600 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Admin Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Ref ID</th>
                <th className="py-3.5 px-4">Photo</th>
                <th className="py-3.5 px-4">Problem & Description</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Reporter</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Assigned To</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No reports match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      <Link to={`/reports/${report.id}`} className="hover:text-blue-600 underline">
                        {report.id}
                      </Link>
                    </td>

                    {/* Photo thumbnail */}
                    <td className="py-3.5 px-4">
                      {report.images && report.images.length > 0 ? (
                        <button
                          onClick={() => setActivePhotoModal(report.images[0])}
                          className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 block shrink-0 hover:ring-2 hover:ring-blue-500 transition-all"
                          title="Click to view full photo evidence"
                        >
                          <img
                            src={report.images[0]}
                            alt="thumbnail"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-300">
                          <Camera className="w-4 h-4" />
                        </div>
                      )}
                    </td>

                    {/* Title & Desc */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <Link
                        to={`/reports/${report.id}`}
                        className="font-bold text-slate-900 hover:text-blue-600 truncate block"
                      >
                        {report.title}
                      </Link>
                      <span className="text-[11px] text-slate-500 line-clamp-1">
                        {report.description}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <CategoryBadge category={report.category} />
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 text-slate-700 max-w-[180px] truncate" title={report.location}>
                      {report.location}
                    </td>

                    {/* Reporter */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 block">{report.studentName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{report.studentId}</span>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PriorityBadge priority={report.priority} />
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={report.status} size="sm" />
                    </td>

                    {/* Assigned */}
                    <td className="py-3.5 px-4 text-slate-600 text-[11px] max-w-[140px] truncate">
                      {report.assignedTo || 'Unassigned'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => openUpdateModal(report)}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-semibold text-xs transition-colors"
                      >
                        Status
                      </button>
                      <Link
                        to={`/reports/${report.id}`}
                        className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-semibold text-xs inline-block transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>Showing {filteredReports.length} records</span>
          <span className="font-mono text-[11px]">Database: CampusFix Mock PostgreSQL Sync</span>
        </div>
      </div>

      {/* Admin Update Status Modal */}
      {activeModalReport && (
        <Modal
          isOpen={!!activeModalReport}
          onClose={() => setActiveModalReport(null)}
          title={`Update Complaint: ${activeModalReport.id}`}
        >
          <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Issue Title</span>
              <p className="font-bold text-slate-900 mt-0.5">{activeModalReport.title}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">📍 {activeModalReport.location}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">👤 Reported by: {activeModalReport.studentName} ({activeModalReport.studentId})</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Update Status</label>
              <Select
                value={modalStatus}
                onChange={(e) => setModalStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </Select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assign Technician / Work Unit</label>
              <input
                type="text"
                value={modalAssignedTo}
                onChange={(e) => setModalAssignedTo(e.target.value)}
                placeholder="e.g. Pak Mat (HVAC Maintenance Team), Siva (Plumbing Unit)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Administrative Notes / Action Taken</label>
              <textarea
                rows={3}
                value={modalAdminNotes}
                onChange={(e) => setModalAdminNotes(e.target.value)}
                placeholder="Record work order number, materials required, or inspection verdict..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModalReport(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-5 py-2 bg-[#174D91] hover:bg-[#133F77] disabled:opacity-50 text-white rounded-xl font-bold shadow-xs"
              >
                {isUpdating ? 'Saving to Supabase...' : 'Save Status Update'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Photo Preview Modal */}
      {activePhotoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          onClick={() => setActivePhotoModal(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden bg-black shadow-2xl">
            <img src={activePhotoModal} alt="Full view" className="max-w-full max-h-[85vh] object-contain" />
            <button
              onClick={() => setActivePhotoModal(null)}
              className="absolute top-3 right-3 px-3 py-1 bg-white/20 hover:bg-white/40 text-white text-xs font-bold rounded-lg backdrop-blur-xs transition-colors"
            >
              Close (Esc)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminReportsPage
