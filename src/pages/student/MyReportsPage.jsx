import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useReports } from '../../context/ReportContext'
import { useAuth } from '../../context/AuthContext'
import StatusBadge from '../../components/common/StatusBadge'
import PriorityBadge from '../../components/common/PriorityBadge'
import CategoryBadge from '../../components/common/CategoryBadge'
import { formatDate, getRelativeTime } from '../../utils/formatters'
import {
  Search,
  Filter,
  Grid,
  List,
  PlusCircle,
  MapPin,
  Calendar,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  X,
  FileQuestion,
} from 'lucide-react'

export const MyReportsPage = () => {
  const { reports, categories } = useReports()
  const { user } = useAuth()

  // Filter reports submitted by the logged in student
  const studentReports = reports.filter(
    (r) => r.studentId === user?.id || r.studentEmail === user?.email || !user?.id
  )

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'table'
  const [sortBy, setSortBy] = useState('newest')

  const statuses = ['All', 'Pending', 'In Progress', 'Resolved', 'Rejected']

  const filteredReports = useMemo(() => {
    return studentReports
      .filter((report) => {
        const matchesSearch =
          report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.description.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus =
          selectedStatus === 'All' || report.status === selectedStatus

        const matchesCategory =
          selectedCategory === 'All' || report.category === selectedCategory

        return matchesSearch && matchesStatus && matchesCategory
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt) - new Date(a.createdAt)
        } else if (sortBy === 'oldest') {
          return new Date(a.createdAt) - new Date(b.createdAt)
        }
        return 0
      })
  }, [studentReports, searchQuery, selectedStatus, selectedCategory, sortBy])

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My Submitted Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track and monitor the progress of your facility complaints
          </p>
        </div>

        <Link
          to="/student/submit"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Issue</span>
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {statuses.map((status) => {
          const count =
            status === 'All'
              ? studentReports.length
              : studentReports.filter((r) => r.status === status).length

          const isActive = selectedStatus === status

          return (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{status}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, location, or report ID..."
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

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="sm:col-span-3 flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
            </select>

            {/* View Mode Toggle Buttons */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0 border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Clear indicator */}
        {(searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All') && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Showing {filteredReports.length} of {studentReports.length} reports
            </span>
            <span>•</span>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
                setSelectedStatus('All')
              }}
              className="text-blue-600 hover:underline font-semibold"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Reports Display: Grid or Table */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
          <FileQuestion className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No reports found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, status or category filters to find what you're looking for.
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('All')
              setSelectedStatus('All')
            }}
            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Photo Preview Header */}
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  {report.images && report.images.length > 0 ? (
                    <img
                      src={report.images[0]}
                      alt={report.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      No Photo Evidence
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="text-[11px] font-mono font-bold bg-slate-900/80 text-white backdrop-blur-xs px-2 py-0.5 rounded">
                      {report.id}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={report.status} size="sm" />
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <CategoryBadge category={report.category} />
                    <PriorityBadge priority={report.priority} />
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    <Link to={`/reports/${report.id}`}>{report.title}</Link>
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {report.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{report.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{formatDate(report.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 pt-0">
                <Link
                  to={`/reports/${report.id}`}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold text-xs border border-slate-200 hover:border-blue-200 transition-all flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details & Timeline</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Title & Description</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Submitted</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {report.id}
                    </td>
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
                    <td className="py-3.5 px-4">
                      <CategoryBadge category={report.category} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {report.location}
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={report.priority} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={report.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {getRelativeTime(report.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link
                        to={`/reports/${report.id}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyReportsPage
