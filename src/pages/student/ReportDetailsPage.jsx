import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useReports } from '../../context/ReportContext'
import { useAuth } from '../../context/AuthContext'
import StatusBadge from '../../components/common/StatusBadge'
import PriorityBadge from '../../components/common/PriorityBadge'
import CategoryBadge from '../../components/common/CategoryBadge'
import Modal from '../../components/common/Modal'
import { formatDate, getRelativeTime } from '../../utils/formatters'
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  Wrench,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  Building2,
  Share2,
  Download,
  Maximize2,
  Edit3,
} from 'lucide-react'

export const ReportDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getReportById, updateReportStatus } = useReports()
  const { user, isAdmin } = useAuth()

  const report = getReportById(id)

  const [activePhoto, setActivePhoto] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState([
    {
      id: 'c1',
      author: 'Campus Facilities Helpdesk',
      role: 'Staff',
      text: 'Thank you for reporting this issue. A maintenance team has been notified and scheduled for inspection.',
      createdAt: report?.createdAt,
    },
  ])

  // Admin Quick Status Update Modal
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(report?.status || 'In Progress')
  const [assignedTechnician, setAssignedTechnician] = useState(report?.assignedTo || '')
  const [adminNoteInput, setAdminNoteInput] = useState('')

  if (!report) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Report Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">
          The requested maintenance report reference ID ({id}) does not exist.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    )
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const commentObj = {
      id: `c-${Date.now()}`,
      author: user?.name || 'Student',
      role: isAdmin ? 'Administrator' : 'Student',
      text: newComment.trim(),
      createdAt: new Date().toISOString(),
    }

    setComments((prev) => [...prev, commentObj])
    setNewComment('')
  }

  const handleAdminUpdate = (e) => {
    e.preventDefault()
    updateReportStatus(
      report.id,
      selectedStatus,
      adminNoteInput || `Status transitioned to ${selectedStatus}`,
      assignedTechnician
    )
    setShowStatusModal(false)
    setAdminNoteInput('')
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link to={isAdmin ? '/admin/dashboard' : '/student/dashboard'} className="hover:underline">
                Dashboard
              </Link>
              <span>/</span>
              <Link to={isAdmin ? '/admin/reports' : '/student/reports'} className="hover:underline">
                Reports
              </Link>
              <span>/</span>
              <span className="font-mono font-semibold text-slate-800">{report.id}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
              {report.title}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => {
                setSelectedStatus(report.status)
                setAssignedTechnician(report.assignedTo)
                setShowStatusModal(true)
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Update Status & Notes</span>
            </button>
          )}

          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href)
              alert(`Report link copied to clipboard: ${report.id}`)
            }}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs"
            title="Share report reference"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Details Left, Meta/Timeline Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Photos, Description & Comments */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Info Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={report.status} size="lg" />
                <PriorityBadge priority={report.priority} />
                <CategoryBadge category={report.category} />
              </div>
              <span className="text-xs text-slate-400">
                Created {formatDate(report.createdAt)}
              </span>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Issue Description
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {report.description}
              </p>
            </div>

            {/* Photographic Evidence Gallery */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Photographic Evidence ({report.images?.length || 0})
              </h3>
              {report.images && report.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {report.images.map((imgUrl, index) => (
                    <div
                      key={index}
                      onClick={() => setActivePhoto(imgUrl)}
                      className="group relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer shadow-xs hover:border-blue-400"
                    >
                      <img
                        src={imgUrl}
                        alt={`Evidence ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center">
                        <Maximize2 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-400">
                  No photographic evidence was attached to this report.
                </div>
              )}
            </div>

            {/* Admin Resolution Remarks Banner */}
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Facilities Management Log</span>
              </div>
              <p className="text-xs text-indigo-800 leading-relaxed">
                {report.adminNotes || 'No specific maintenance remarks recorded yet.'}
              </p>
              <div className="text-[11px] text-indigo-600 font-semibold pt-1">
                Assigned Team: {report.assignedTo || 'Pending Assignment'}
              </div>
            </div>
          </div>

          {/* Interactive Comments & Discussion */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Communication & Activity Notes</h3>
              </div>
              <span className="text-xs text-slate-400">{comments.length} updates</span>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{c.author}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                        {c.role}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{getRelativeTime(c.createdAt)}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="pt-2 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a remark or inquiry regarding this report..."
                className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Progress Timeline Stepper & Meta details */}
        <div className="lg:col-span-4 space-y-6">
          {/* Progress Timeline Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Repair Progress Stepper
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {/* Step 1: Pending */}
              <div className="relative">
                <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white ${
                  report.status !== 'Rejected' ? 'border-blue-600 text-blue-600' : 'border-slate-300 text-slate-300'
                }`}>
                  <CheckCircle2 className="w-3 h-3 fill-current" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">1. Complaint Received</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Logged in system with photo evidence.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {formatDate(report.createdAt)}
                  </span>
                </div>
              </div>

              {/* Step 2: Under Review / In Progress */}
              <div className="relative">
                <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white ${
                  report.status === 'In Progress' || report.status === 'Resolved'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-slate-300 text-slate-300'
                }`}>
                  <CheckCircle2 className="w-3 h-3 fill-current" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">2. Technician Dispatched</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {report.assignedTo !== 'Unassigned'
                      ? `Assigned to ${report.assignedTo}`
                      : 'Pending maintenance staff dispatch.'}
                  </p>
                </div>
              </div>

              {/* Step 3: Resolved */}
              <div className="relative">
                <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white ${
                  report.status === 'Resolved'
                    ? 'border-emerald-600 text-emerald-600'
                    : report.status === 'Rejected'
                    ? 'border-rose-600 text-rose-600'
                    : 'border-slate-300 text-slate-300'
                }`}>
                  <CheckCircle2 className="w-3 h-3 fill-current" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {report.status === 'Rejected' ? '3. Report Rejected' : '3. Issue Resolved'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {report.status === 'Resolved'
                      ? 'Repairs inspected and verified completed.'
                      : report.status === 'Rejected'
                      ? 'Issue rejected by facilities admin.'
                      : 'Awaiting technician repair completion.'}
                  </p>
                  {report.status === 'Resolved' && (
                    <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                      Closed on {formatDate(report.updatedAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Location & Reporter Details Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Facility Location Details
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Building Complex</span>
                <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  {report.building}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[11px]">Floor / Level</span>
                  <span className="font-semibold text-slate-800">{report.floor}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Room / Area</span>
                  <span className="font-semibold text-slate-800">{report.room}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block text-[11px]">Reported By</span>
                <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  {report.studentName} ({report.studentId})
                </span>
                <span className="text-[11px] text-slate-500 block">{report.studentEmail}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Photo Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          onClick={() => setActivePhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden bg-black shadow-2xl">
            <img src={activePhoto} alt="Full view" className="max-w-full max-h-[85vh] object-contain" />
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-3 right-3 px-3 py-1 bg-white/20 hover:bg-white/40 text-white text-xs font-bold rounded-lg backdrop-blur-xs transition-colors"
            >
              Close Preview (Esc)
            </button>
          </div>
        </div>
      )}

      {/* Admin Status Update Modal */}
      {showStatusModal && (
        <Modal
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          title={`Update Status: ${report.id}`}
        >
          <form onSubmit={handleAdminUpdate} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status Transition</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assign Technician / Unit</label>
              <input
                type="text"
                value={assignedTechnician}
                onChange={(e) => setAssignedTechnician(e.target.value)}
                placeholder="e.g. Pak Mat (HVAC Team), Siva (Plumbing), IT AV Unit"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Maintenance Notes</label>
              <textarea
                rows={3}
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                placeholder="Provide notes on parts ordered, technician work schedule, or reason for resolution/rejection..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md"
              >
                Save Status Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default ReportDetailsPage
