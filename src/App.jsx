import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './components/common/DashboardLayout'

// Public Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard'
import SubmitReportPage from './pages/student/SubmitReportPage'
import MyReportsPage from './pages/student/MyReportsPage'
import ReportDetailsPage from './pages/student/ReportDetailsPage'
import StudentProfilePage from './pages/student/StudentProfilePage'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminReportsPage from './pages/admin/AdminReportsPage'
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage'
import AdminStudentsPage from './pages/admin/AdminStudentsPage'

export const App = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Main Authenticated Dashboard Shell */}
      <Route element={<DashboardLayout />}>
        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/submit" element={<SubmitReportPage />} />
        <Route path="/student/reports" element={<MyReportsPage />} />
        <Route path="/student/profile" element={<StudentProfilePage />} />

        {/* Shared Report Details Route */}
        <Route path="/reports/:id" element={<ReportDetailsPage />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
        <Route path="/admin/categories" element={<AdminCategoriesPage />} />
        <Route path="/admin/students" element={<AdminStudentsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
