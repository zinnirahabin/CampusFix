import React, { useState, useMemo } from 'react'
import { useReports } from '../../context/ReportContext'
import Select from '../../components/common/Select'
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Mail,
  Phone,
  Building,
  GraduationCap,
  FileText,
  X,
  UserCheck,
} from 'lucide-react'

export const AdminStudentsPage = () => {
  const { students, reports } = useReports()

  const [searchQuery, setSearchQuery] = useState('')
  const [facultyFilter, setFacultyFilter] = useState('All')

  const faculties = [
    'All',
    'College of Computing & Informatics',
    'College of Engineering',
    'College of Business Administration',
  ]

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        s.name.toLowerCase().includes(query) ||
        s.id.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query)

      const matchesFaculty =
        facultyFilter === 'All' || s.faculty === facultyFilter

      return matchesSearch && matchesFaculty
    })
  }, [students, searchQuery, facultyFilter])

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Student Account Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Registered university students authorised to submit and track facility maintenance complaints
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-50 text-[#174D91] border border-blue-200">
            Total Students: {students.length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, ID (e.g. SW0108321), or email..."
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

          <div className="sm:col-span-4">
            <Select
              value={facultyFilter}
              onChange={(e) => setFacultyFilter(e.target.value)}
            >
              {faculties.map((f) => (
                <option key={f} value={f}>
                  {f === 'All' ? 'All Colleges & Faculties' : f}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Student ID</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">College / Faculty</th>
                <th className="py-3.5 px-4">Academic Program</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4 text-center">Reports Filed</th>
                <th className="py-3.5 px-4">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No student records found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const actualReportCount = reports.filter((r) => r.studentId === s.id).length

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {s.id}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {s.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {s.faculty}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {s.program || 'Undergraduate'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{s.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-mono">
                          <Phone className="w-3 h-3 text-[#174D91]" />
                          <span>{s.phone || 'No phone recorded'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center justify-center font-bold font-mono px-2 py-0.5 rounded-full bg-blue-50 text-[#174D91] text-xs">
                          {actualReportCount}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Active</span>
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminStudentsPage
