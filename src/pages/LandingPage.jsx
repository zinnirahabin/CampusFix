import React from 'react'
import { Link } from 'react-router-dom'
import { useReports } from '../context/ReportContext'
import { useAuth } from '../context/AuthContext'
import {
  Wrench,
  Camera,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Zap,
  Droplets,
  Wind,
  Armchair,
  MonitorPlay,
  Sparkles,
  HelpCircle,
  Building2,
  Users,
  ChevronRight,
  TrendingUp,
  MapPin,
  Flame,
} from 'lucide-react'
import StatusBadge from '../components/common/StatusBadge'

export const LandingPage = () => {
  const { stats, reports } = useReports()
  const { user, isAdmin } = useAuth()

  const categories = [
    { name: 'Electrical Problems', icon: Zap, color: 'text-amber-500 bg-amber-50 border-amber-200', desc: 'Outlets, lighting fixtures, short circuits & wiring issues.' },
    { name: 'Plumbing', icon: Droplets, color: 'text-blue-500 bg-blue-50 border-blue-200', desc: 'Pipe leaks, washroom clogs, faucet damage & water supply.' },
    { name: 'Air Conditioning', icon: Wind, color: 'text-cyan-500 bg-cyan-50 border-cyan-200', desc: 'Cooling breakdown, ceiling water leakage, thermostat faults.' },
    { name: 'Furniture Damage', icon: Armchair, color: 'text-orange-500 bg-orange-50 border-orange-200', desc: 'Damaged lecture chairs, broken study tables, door locks.' },
    { name: 'Classroom Equipment', icon: MonitorPlay, color: 'text-indigo-500 bg-indigo-50 border-indigo-200', desc: 'Projector failures, audio/PA systems & smart board bugs.' },
    { name: 'Cleanliness', icon: Sparkles, color: 'text-emerald-500 bg-emerald-50 border-emerald-200', desc: 'Waste overflows, restroom hygiene, spillage cleanups.' },
    { name: 'Other Facilities', icon: HelpCircle, color: 'text-slate-500 bg-slate-50 border-slate-200', desc: 'Elevators, pathway lighting, grounds & general campus hazards.' },
  ]

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Campus<span className="text-blue-600">Fix</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                UNITEN
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#categories" className="hover:text-blue-600 transition-colors">Categories</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#stats" className="hover:text-blue-600 transition-colors">Live Stats</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600"
            >
              Sign In
            </Link>
            <Link
              to={user ? (isAdmin ? '/admin/dashboard' : '/student/submit') : '/student/submit'}
              className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 transition-all transform active:scale-95 flex items-center gap-1.5"
            >
              <span>Report Issue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-800 text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                CENTRAL CAMPUS FACILITY REPORTING PLATFORM
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                Report Campus Problems.{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Get Them Fixed Faster.
                </span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                CampusFix empowers university students to submit real-time maintenance complaints, attach photo evidence, and track repair progress directly with the Facilities Management Department.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/student/submit"
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 text-sm"
                >
                  <Camera className="w-4 h-4" />
                  <span>Submit a Complaint</span>
                </Link>

                <Link
                  to="/student/reports"
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-xl border border-slate-300/80 shadow-sm transition-all flex items-center gap-2 text-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Track Status</span>
                </Link>

                <Link
                  to="/admin/dashboard"
                  className="px-4 py-3.5 text-slate-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 group"
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Admin Portal Demo</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Key Trust Signals */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}+</p>
                  <p className="text-xs text-slate-500 font-medium">Reports Processed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{stats.resolutionRate}%</p>
                  <p className="text-xs text-slate-500 font-medium">Resolution Rate</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600">24/7</p>
                  <p className="text-xs text-slate-500 font-medium">Issue Monitoring</p>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive UI Showcase Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4">
                {/* Mock Card Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="text-xs font-semibold text-slate-400 ml-2">Live Incident Preview</span>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    #CF-2024-001
                  </span>
                </div>

                {/* Mock Card Body */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      Ceiling AC Unit Leaking Water Heavily
                    </h4>
                    <StatusBadge status="In Progress" size="sm" />
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    Continuous water leaking above student workstation #14 in Lab 402, slip hazard created on carpet.
                  </p>

                  <div className="relative rounded-xl overflow-hidden h-36 border border-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
                      alt="Facility Issue"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-1 rounded flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-blue-400" />
                      <span>CCI Block B • Lab 402</span>
                    </div>
                  </div>

                  {/* Progress Timeline Stepper */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold">
                      <span>Status: Assigned to HVAC Team</span>
                      <span className="text-blue-600 font-bold">Step 2 of 3</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full w-2/3" />
                    </div>
                    <p className="text-[11px] text-slate-500 italic">
                      "Drainage pump replacement arriving today - Pak Mat (HVAC)"
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>Reported by: Aiman H. (SW0108321)</span>
                  <Link to="/reports/CF-2024-001" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                    View Details <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg border border-slate-100 p-3 hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Immediate Resolution</p>
                  <p className="text-[11px] text-slate-500">Average response &lt; 24h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section id="categories" className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Coverage & Scope
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              7 Dedicated Maintenance Categories
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Every facility complaint is instantly categorized and routed to the corresponding specialist department at UNITEN.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat, idx) => {
              const Icon = cat.icon
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-400 hover:shadow-lg transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${cat.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              )
            })}

            {/* Quick Submit Card */}
            <div className="p-5 rounded-2xl border border-dashed border-blue-300 bg-blue-50/50 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase">Have an issue?</span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Report it now in 60 seconds
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Help keep UNITEN campuses safe, clean, and functional.
                </p>
              </div>
              <Link
                to="/student/submit"
                className="mt-4 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                <span>New Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              How CampusFix Solves Problems
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              From identification to final repair, every step is transparent and tracked.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-md shadow-blue-500/20">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                1. Snap & Describe Issue
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Notice a broken projector, leaking faucet, or faulty AC? Take a quick photo, tag the campus building and room, and submit via your student dashboard.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-md shadow-indigo-500/20">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                2. Admin Review & Dispatch
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Facilities administrators review priority, approve the work order, and assign the appropriate technician (HVAC, Electrical, Plumbing, or Janitorial).
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-md shadow-emerald-500/20">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                3. Real-Time Status & Resolution
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Watch the live timeline transition from In Progress to Resolved. Technicians log their work notes and students receive completion notices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Comparison Banner */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Student Card */}
            <div className="rounded-2xl p-8 bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Student Portal</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">For University Students</h3>
                <p className="text-sm text-slate-600 mt-2">
                  No more wondering if your complaint was ever noticed or sent to the wrong department.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Instant report submission with photo evidence upload</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Complete personal report history & status timeline</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Real-time feedback and technician resolution remarks</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  to="/student/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <span>Open Student Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Admin Card */}
            <div className="rounded-2xl p-8 bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Admin Control</span>
                <h3 className="text-2xl font-bold text-white mt-1">For Facilities & Operations</h3>
                <p className="text-sm text-slate-300 mt-2">
                  A centralized dashboard to supervise, assign, and resolve campus infrastructure defects efficiently.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Centralized view of all university facility complaints</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>1-Click status updates (Pending, In Progress, Resolved, Rejected)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Category metrics, technician assignment & student directory</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  to="/admin/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500 text-white rounded-xl text-xs font-semibold hover:bg-indigo-600 transition-colors shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Launch Admin Management</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Wrench className="w-4 h-4" />
                </div>
                <span>CampusFix</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Campus Facility Issue Reporting and Management System for Universiti Tenaga Nasional (UNITEN).
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Portal Links</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/student/dashboard" className="hover:text-white">Student Dashboard</Link></li>
                <li><Link to="/student/submit" className="hover:text-white">Submit New Report</Link></li>
                <li><Link to="/student/reports" className="hover:text-white">My Reports</Link></li>
                <li><Link to="/admin/dashboard" className="hover:text-white">Admin Management</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Report Categories</h4>
              <ul className="space-y-2 text-xs">
                <li><span>Air Conditioning & HVAC</span></li>
                <li><span>Electrical & Lighting</span></li>
                <li><span>Plumbing & Restrooms</span></li>
                <li><span>Classroom Projectors & Tech</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Emergency Hotline</h4>
              <p className="text-xs text-slate-300">Campus Facilities Control Centre:</p>
              <p className="text-sm font-bold text-white mt-1">📞 +60 3-8921 2020</p>
              <p className="text-[11px] text-slate-500 mt-2">Open 24 Hours • 7 Days a Week</p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} CampusFix. All rights reserved. Universiti Tenaga Nasional.</p>
            <p>Phase 1 Frontend Prototype • Designed for Cloud Deployment</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
