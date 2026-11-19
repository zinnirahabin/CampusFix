import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { INITIAL_REPORTS, INITIAL_CATEGORIES, INITIAL_STUDENTS } from '../data/mockData'

const ReportContext = createContext(null)

// Helper to normalize Supabase DB rows into frontend app models
export const mapDbReportToApp = (dbRow, profilesMap = {}) => {
  const reporterProfile = profilesMap[dbRow.user_id] || {}
  const images = (dbRow.images && dbRow.images.length > 0)
    ? dbRow.images
    : (dbRow.photo_url ? [dbRow.photo_url] : [])

  return {
    id: dbRow.report_number || dbRow.id,
    uuid: dbRow.id,
    reportNumber: dbRow.report_number || dbRow.id,
    userId: dbRow.user_id,
    categoryId: dbRow.category_id,
    title: dbRow.title,
    category: dbRow.category,
    location: dbRow.location,
    building: dbRow.building || '',
    floor: dbRow.floor || '',
    room: dbRow.room || '',
    description: dbRow.description,
    priority: dbRow.priority || 'Medium',
    status: dbRow.status || 'Pending',
    studentId: reporterProfile.student_id || 'SW0108321',
    studentName: reporterProfile.name || 'Aiman Hakim',
    studentEmail: reporterProfile.email || 'aiman@student.uniten.edu.my',
    assignedTo: dbRow.assigned_to || 'Unassigned',
    adminNotes: dbRow.admin_notes || '',
    photoUrl: dbRow.photo_url,
    fileName: dbRow.file_name,
    fileSize: dbRow.file_size,
    mimeType: dbRow.mime_type,
    images,
    timeline: Array.isArray(dbRow.timeline) ? dbRow.timeline : [],
    createdAt: dbRow.created_at,
    updatedAt: dbRow.updated_at,
  }
}

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState(INITIAL_REPORTS)
  const [categories, setCategories] = useState(INITIAL_CATEGORIES)
  const [students, setStudents] = useState(INITIAL_STUDENTS)
  const [loading, setLoading] = useState(true)

  // Fetch categories from Supabase
  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

      if (!error && data && data.length > 0) {
        setCategories(data)
        localStorage.setItem('campusfix_categories', JSON.stringify(data))
      }
    } catch (err) {
      console.warn('Error fetching categories from Supabase:', err)
    }
  }, [])

  // Fetch students/profiles from Supabase
  const fetchStudents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')

      if (!error && data && data.length > 0) {
        const mappedStudents = data.map((p) => ({
          id: p.student_id || p.id,
          uuid: p.id,
          name: p.name,
          email: p.email,
          faculty: p.faculty || 'College of Computing & Informatics',
          program: p.program || 'Bachelor of Software Engineering (Hons)',
          phone: p.phone || '+60 17-234 5678',
          status: 'Active',
          totalReports: 0,
          joinedDate: p.created_at ? p.created_at.split('T')[0] : '2024-01-01',
        }))
        setStudents(mappedStudents)
        return data.reduce((acc, curr) => {
          acc[curr.id] = curr
          return acc
        }, {})
      }
    } catch (err) {
      console.warn('Error fetching profiles from Supabase:', err)
    }
    return {}
  }, [])

  // Fetch reports from Supabase
  const fetchReports = useCallback(async (profilesMap = {}) => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        const appReports = data.map((row) => mapDbReportToApp(row, profilesMap))
        setReports(appReports)
        localStorage.setItem('campusfix_reports', JSON.stringify(appReports))
      }
    } catch (err) {
      console.warn('Error fetching reports from Supabase:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initialize and subscribe to real-time changes
  useEffect(() => {
    let profilesMap = {}

    const initData = async () => {
      await fetchCategories()
      profilesMap = await fetchStudents()
      await fetchReports(profilesMap)
    }

    initData()

    // Real-time subscription to reports table
    const reportsChannel = supabase
      .channel('public:reports')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reports' },
        async () => {
          await fetchReports(profilesMap)
        }
      )
      .subscribe()

    // Real-time subscription to categories table
    const categoriesChannel = supabase
      .channel('public:categories')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        async () => {
          await fetchCategories()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(reportsChannel)
      supabase.removeChannel(categoriesChannel)
    }
  }, [fetchCategories, fetchStudents, fetchReports])

  // Upload file to Supabase Storage bucket campusfix-evidence
  const uploadEvidencePhoto = async (fileOrUrl) => {
    if (!fileOrUrl) return null

    try {
      // If it's already an existing Supabase Storage URL
      if (typeof fileOrUrl === 'string' && fileOrUrl.includes('campusfix-evidence')) {
        return {
          photoUrl: fileOrUrl,
          fileName: fileOrUrl.split('/').pop(),
          fileSize: 250000,
          mimeType: 'image/jpeg',
        }
      }

      // If it's a File object from input[type="file"]
      if (fileOrUrl instanceof File) {
        const fileExt = fileOrUrl.name.split('.').pop()
        const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
        const filePath = `reports/${cleanName}`

        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from('campusfix-evidence')
          .upload(filePath, fileOrUrl, {
            contentType: fileOrUrl.type || 'image/jpeg',
            upsert: false,
          })

        if (uploadErr) {
          console.error('Storage upload error:', uploadErr)
          throw uploadErr
        }

        const { data: pubData } = supabase.storage
          .from('campusfix-evidence')
          .getPublicUrl(filePath)

        return {
          photoUrl: pubData.publicUrl,
          fileName: fileOrUrl.name,
          fileSize: fileOrUrl.size,
          mimeType: fileOrUrl.type || 'image/jpeg',
        }
      }

      // If it's a URL string (e.g. from sample photo buttons), fetch and upload to Storage
      if (typeof fileOrUrl === 'string' && (fileOrUrl.startsWith('http://') || fileOrUrl.startsWith('https://'))) {
        try {
          const res = await fetch(fileOrUrl)
          const blob = await res.blob()
          const fileName = `sample-${Date.now()}.jpg`
          const filePath = `reports/${fileName}`

          const { error: upErr } = await supabase.storage
            .from('campusfix-evidence')
            .upload(filePath, blob, {
              contentType: blob.type || 'image/jpeg',
              upsert: true,
            })

          if (!upErr) {
            const { data: pubData } = supabase.storage
              .from('campusfix-evidence')
              .getPublicUrl(filePath)
            return {
              photoUrl: pubData.publicUrl,
              fileName,
              fileSize: blob.size,
              mimeType: blob.type || 'image/jpeg',
            }
          }
        } catch (e) {
          console.warn('Could not re-upload remote sample photo, using direct URL:', e)
        }

        return {
          photoUrl: fileOrUrl,
          fileName: 'evidence.jpg',
          fileSize: 250000,
          mimeType: 'image/jpeg',
        }
      }
    } catch (err) {
      console.error('Error uploading photo to storage:', err)
      throw err
    }

    return null
  }

  // Submit report to Supabase
  const addReport = async (reportData, user, attachedFile = null) => {
    const now = new Date().toISOString()

    // 1. Upload photo to Supabase Storage if file attached or sample selected
    let photoMeta = null
    const sourcePhoto = attachedFile || (reportData.images && reportData.images[0])
    if (sourcePhoto) {
      photoMeta = await uploadEvidencePhoto(sourcePhoto)
    }

    // 2. Resolve category ID
    const matchedCategory = categories.find(
      (c) => c.name.toLowerCase() === (reportData.category || '').toLowerCase()
    )

    // 3. Resolve user UUID
    const userUuid = user?.uuid || (user?.role === 'admin' ? '22222222-2222-2222-2222-222222222222' : '11111111-1111-1111-1111-111111111111')

    const initialTimeline = [
      {
        status: 'Pending',
        timestamp: now,
        note: `Report submitted by ${user?.name || 'Student'}. Photographic evidence attached.`,
      },
    ]

    const dbPayload = {
      user_id: userUuid,
      category_id: matchedCategory?.id || null,
      category: reportData.category,
      title: reportData.title,
      description: reportData.description,
      location: `${reportData.building}, ${reportData.floor}, ${reportData.room}`,
      building: reportData.building,
      floor: reportData.floor,
      room: reportData.room,
      priority: reportData.priority || 'Medium',
      status: 'Pending',
      photo_url: photoMeta?.photoUrl || null,
      file_name: photoMeta?.fileName || null,
      file_size: photoMeta?.fileSize || null,
      mime_type: photoMeta?.mimeType || null,
      images: photoMeta?.photoUrl ? [photoMeta.photoUrl] : (reportData.images || []),
      timeline: initialTimeline,
    }

    // Insert into Supabase reports table
    const { data: insertedRow, error: insertError } = await supabase
      .from('reports')
      .insert(dbPayload)
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting report to Supabase:', insertError)
      throw insertError
    }

    const appReport = mapDbReportToApp(insertedRow, { [userUuid]: user })
    setReports((prev) => [appReport, ...prev])

    return appReport
  }

  // Update report status in Supabase
  const updateReportStatus = async (reportId, newStatus, adminNotes = '', assignedTo = '') => {
    const now = new Date().toISOString()
    const targetReport = reports.find((r) => r.id === reportId || r.uuid === reportId || r.reportNumber === reportId)

    const updatedTimeline = targetReport
      ? [
          ...targetReport.timeline,
          {
            status: newStatus,
            timestamp: now,
            note: adminNotes || `Status updated to ${newStatus} by Campus Facilities Admin.`,
          },
        ]
      : [
          {
            status: newStatus,
            timestamp: now,
            note: adminNotes || `Status updated to ${newStatus}.`,
          },
        ]

    const updatePayload = {
      status: newStatus,
      admin_notes: adminNotes || (targetReport?.adminNotes ?? ''),
      assigned_to: assignedTo || (targetReport?.assignedTo ?? 'Unassigned'),
      timeline: updatedTimeline,
      updated_at: now,
    }

    // Update in Supabase
    const idToUse = targetReport?.uuid || reportId
    const { data: updatedRow, error: updateError } = await supabase
      .from('reports')
      .update(updatePayload)
      .eq('id', idToUse)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating report status in Supabase:', updateError)
      throw updateError
    }

    // Optimistically update local state
    setReports((prev) =>
      prev.map((r) => (r.id === reportId || r.uuid === reportId || r.reportNumber === reportId ? {
        ...r,
        status: newStatus,
        adminNotes: adminNotes || r.adminNotes,
        assignedTo: assignedTo || r.assignedTo,
        timeline: updatedTimeline,
        updatedAt: now,
      } : r))
    )

    return updatedRow
  }

  const getReportById = (id) => {
    if (!id) return null
    return reports.find(
      (r) => r.id === id || r.uuid === id || r.reportNumber === id || String(r.id).toLowerCase() === String(id).toLowerCase()
    )
  }

  const addCategory = async (categoryData) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: categoryData.name,
          description: categoryData.description,
          icon: categoryData.icon || 'HelpCircle',
          color: categoryData.color || 'blue',
          active: true,
        })
        .select()
        .single()

      if (!error && data) {
        setCategories((prev) => [...prev, data])
        return data
      }
    } catch (err) {
      console.error('Error adding category to Supabase:', err)
    }

    const localCat = {
      id: `cat-${categories.length + 1}`,
      name: categoryData.name,
      description: categoryData.description,
      icon: categoryData.icon || 'HelpCircle',
      color: categoryData.color || 'blue',
      active: true,
    }
    setCategories((prev) => [...prev, localCat])
    return localCat
  }

  const toggleCategoryStatus = async (categoryId) => {
    const current = categories.find((c) => c.id === categoryId)
    if (current && typeof categoryId === 'string' && categoryId.length > 20) {
      // Valid UUID in Supabase
      await supabase
        .from('categories')
        .update({ active: !current.active })
        .eq('id', categoryId)
    }

    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, active: !c.active } : c))
    )
  }

  const updateStudent = async (studentId, updatedData) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, ...updatedData } : s))
    )
  }

  const resetToSampleData = async () => {
    // Re-fetch clean reports and categories from Supabase
    await fetchCategories()
    const pMap = await fetchStudents()
    await fetchReports(pMap)
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
        loading,
        addReport,
        uploadEvidencePhoto,
        updateReportStatus,
        getReportById,
        addCategory,
        toggleCategoryStatus,
        updateStudent,
        resetToSampleData,
        refreshReports: fetchReports,
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
