import React, { createContext, useContext, useState, useEffect } from 'react'
import { INITIAL_REPORTS, INITIAL_CATEGORIES, INITIAL_STUDENTS } from '../data/mockData'

const ReportContext = createContext(null)

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('campusfix_reports')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return INITIAL_REPORTS
      }
    }
    return INITIAL_REPORTS
  })

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('campusfix_categories')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return INITIAL_CATEGORIES
      }
    }
    return INITIAL_CATEGORIES
  })

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('campusfix_students')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return INITIAL_STUDENTS
      }
    }
    return INITIAL_STUDENTS
  })

  useEffect(() => {
    localStorage.setItem('campusfix_reports', JSON.stringify(reports))
  }, [reports])

  useEffect(() => {
    localStorage.setItem('campusfix_categories', JSON.stringify(categories))
  }, [categories])

  useEffect(() => {
    localStorage.setItem('campusfix_students', JSON.stringify(students))
  }, [students])

  const addReport = (reportData, user) => {
    const nextNumber = String(reports.length + 1).padStart(3, '0')
    const newId = `CF-2024-${nextNumber}`
    const now = new Date().toISOString()

    const newReport = {
      id: newId,
      title: reportData.title,
      category: reportData.category,
      location: `${reportData.building}, ${reportData.floor}, ${reportData.room}`,
      building: reportData.building,
      floor: reportData.floor,
      room: reportData.room,
      description: reportData.description,
      priority: reportData.priority || 'Medium',
      status: 'Pending',
      studentId: user?.id || 'SW0108321',
      studentName: user?.name || 'Aiman Hakim',
      studentEmail: user?.email || 'aiman@student.uniten.edu.my',
      createdAt: now,
      updatedAt: now,
      images: reportData.images && reportData.images.length > 0 ? reportData.images : [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
      ],
      assignedTo: 'Unassigned',
      adminNotes: 'Awaiting admin review and dispatch.',
      timeline: [
        {
          status: 'Pending',
          timestamp: now,
          note: `Report submitted by ${user?.name || 'Student'}. Photographic evidence attached.`,
        },
      ],
    }

    setReports((prev) => [newReport, ...prev])

    // Update student report count
    setStudents((prev) =>
      prev.map((s) =>
        s.id === user?.id ? { ...s, totalReports: s.totalReports + 1 } : s
      )
    )

    return newReport
  }

  const updateReportStatus = (reportId, newStatus, adminNotes = '', assignedTo = '') => {
    const now = new Date().toISOString()

    setReports((prev) =>
      prev.map((report) => {
        if (report.id === reportId) {
          const updatedTimeline = [
            ...report.timeline,
            {
              status: newStatus,
              timestamp: now,
              note: adminNotes || `Status updated to ${newStatus} by Campus Facilities Admin.`,
            },
          ]

          return {
            ...report,
            status: newStatus,
            adminNotes: adminNotes || report.adminNotes,
            assignedTo: assignedTo || report.assignedTo,
            updatedAt: now,
            timeline: updatedTimeline,
          }
        }
        return report
      })
    )
  }

  const getReportById = (id) => {
    return reports.find((r) => r.id === id)
  }

  const addCategory = (categoryData) => {
    const newCat = {
      id: `cat-${categories.length + 1}`,
      name: categoryData.name,
      description: categoryData.description,
      icon: categoryData.icon || 'HelpCircle',
      color: categoryData.color || 'blue',
      active: true,
    }
    setCategories((prev) => [...prev, newCat])
    return newCat
  }

  const toggleCategoryStatus = (categoryId) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, active: !c.active } : c))
    )
  }

  const resetToSampleData = () => {
    setReports(INITIAL_REPORTS)
    setCategories(INITIAL_CATEGORIES)
    setStudents(INITIAL_STUDENTS)
    localStorage.removeItem('campusfix_reports')
    localStorage.removeItem('campusfix_categories')
    localStorage.removeItem('campusfix_students')
  }

  // Derived Statistics
  const totalReports = reports.length
  const pendingReports = reports.filter((r) => r.status === 'Pending').length
  const inProgressReports = reports.filter((r) => r.status === 'In Progress').length
  const resolvedReports = reports.filter((r) => r.status === 'Resolved').length
  const rejectedReports = reports.filter((r) => r.status === 'Rejected').length
  const resolutionRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0

  return (
    <ReportContext.Provider
      value={{
        reports,
        categories,
        students,
        addReport,
        updateReportStatus,
        getReportById,
        addCategory,
        toggleCategoryStatus,
        resetToSampleData,
        stats: {
          total: totalReports,
          pending: pendingReports,
          inProgress: inProgressReports,
          resolved: resolvedReports,
          rejected: rejectedReports,
          resolutionRate,
        },
      }}
    >
      {children}
    </ReportContext.Provider>
  )
}

export const useReports = () => {
  const context = useContext(ReportContext)
  if (!context) {
    throw new Error('useReports must be used within a ReportProvider')
  }
  return context
}
