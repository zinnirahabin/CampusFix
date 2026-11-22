import {
  Armchair,
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock,
  Droplets,
  HardDrive,
  MapPin,
  MonitorPlay,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Wind,
  Zap
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useReports } from '../context/ReportContext'

export const LandingPage = () => {
  const { stats, reports } = useReports()
  const { user, isAdmin } = useAuth()

  const categories = [
    {
      name: 'Broken Chair & Furniture',
      icon: Armchair,
      color: 'text-[#E9432B] bg-red-50 border-red-100',
      desc: 'Cracked study chairs, collapsed desks, defective whiteboard frames & doors.',
    },
    {
      name: 'Damaged Classroom Projector',
      icon: MonitorPlay,
      color: 'text-[#174D91] bg-blue-50 border-blue-100',
      desc: 'Ceiling projector blinking, bulb failure, HDMI cables & smart screen bugs.',
    },
    {
      name: 'Leaking Water Pipe',
      icon: Droplets,
      color: 'text-[#174D91] bg-blue-50 border-blue-100',
      desc: 'Ruptured plumbing pipes, restroom sink leaks, ceiling drips & flooding.',
    },
    {
      name: 'Air Conditioning Malfunctions',
      icon: Wind,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-100',
      desc: 'Cassette unit water dripping, insufficient cooling, loud rattling & thermostats.',
    },
    {
      name: 'Electrical & Lighting Problems',
      icon: Zap,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      desc: 'Strobing fluorescent tubes, exposed wiring, dead power sockets & switches.',
    },
    {
      name: 'Restroom Cleanliness & Spillage',
      icon: Sparkles,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      desc: 'Overflowing dustbins, unsanitary facilities, slippery liquids & pest control.',
    },
  ]

  const steps = [
    {
      step: '01',
      title: 'Snap Photographic Evidence',
      desc: 'Take or upload photos of the defective equipment or facility hazard. Files are stored securely in Supabase Storage with full metadata.',
      icon: Camera,
    },
    {
      step: '02',
      title: 'Pin Campus Location & Urgency',
      desc: 'Specify the exact campus building, floor level, and room number. Mark urgency level as Routine, High, or Emergency.',
      icon: MapPin,
    },
    {
      step: '03',
      title: 'Real-Time Inspection & Resolution',
      desc: 'Facilities technicians inspect, dispatch spare components, and resolve the defect with live timeline updates in your portal.',
      icon: CheckCircle2,
    },
  ]

  return (
    <div className="min-h-screen bg-[#F3F5F8] text-slate-800">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/images/uniten-logo.png"
              alt="Universiti Tenaga Nasional"
              className="h-10 w-auto object-contain shrink-0"
            />
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center">
                Campus<span className="text-[#E9432B]">Fix</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 -mt-0.5">
                UNITEN Facility Portal
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-[#174D91] transition-colors">Features</a>
            <a href="#categories" className="hover:text-[#174D91] transition-colors">Common Issues</a>
            <a href="#how-it-works" className="hover:text-[#174D91] transition-colors">Reporting Process</a>
            <a href="#stats" className="hover:text-[#174D91] transition-colors">Campus Stats</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              to="/login?role=admin"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#E9432B]" />
              <span>Admin Login</span>
            </Link>
            <Link
              to="/login?role=student"
              className="px-4 py-2 text-sm font-semibold bg-[#174D91] hover:bg-[#133F77] text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Student Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#174D91] text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#E9432B] animate-pulse" />
                UNIVERSITI TENAGA NASIONAL • CENTRAL MAINTENANCE PORTAL
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.18]">
                Empowering Students.{' '}
                <span className="text-[#174D91]">Fixing Campus Facilities</span>{' '}
                <span className="text-[#E9432B]">Faster.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                CampusFix is UNITEN’s centralized incident management platform. Snap damaged chairs, projector faults, or plumbing leaks, upload photographic proof, and track live technician repairs directly to completion.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  to="/student/submit"
                  className="px-6 py-3.5 bg-[#E9432B] hover:bg-[#D3341D] text-white font-bold text-sm rounded-xl shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-2 transform active:scale-98"
                >
                  <Camera className="w-4 h-4" />
                  <span>Report Maintenance Defect</span>
                </Link>
                <Link
                  to="/login?role=student"
                  className="px-6 py-3.5 bg-[#174D91] hover:bg-[#133F77] text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Student Portal Login</span>
                </Link>
                <Link
                  to="/login?role=admin"
                  className="px-5 py-3.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-[#E9432B]" />
                  <span>Admin Portal</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#174D91]" />
                  <span>Integrated with UNITEN Student Directory</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#174D91]" />
                  <span>Storage Evidence Repository</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#174D91]" />
                  <span>24/7 Facilities Hotline: Ext 2020</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Card Preview */}
            <div className="lg:col-span-5">
              <div className="bg-[#F3F5F8] p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-lg space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <img
                      src="/images/uniten-logo.png"
                      alt="UNITEN"
                      className="h-8 w-auto object-contain"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Live Facility Ticket</span>
                      <span className="text-[10px] font-mono text-[#174D91]">#CF-2026-0001</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-[#174D91]">
                    In Progress
                  </span>
                </div>

                <div className="rounded-2xl overflow-hidden aspect-video relative bg-slate-200 border border-slate-300">
                  <img
                    src="/images/damaged-chair.jpg"
                    alt="Damaged study chair"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                    Storage Evidence • campusfix-evidence
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <span className="text-[11px] font-semibold text-[#E9432B] uppercase tracking-wider block">
                    Furniture Damage • Urgent Attention
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    Broken Armrest & Sharp Bracket in Lecture Hall
                  </h4>
                  <p className="text-slate-600 line-clamp-2 text-xs">
                    Row 3 student chair cracked with exposed metal sharp edges near the aisle.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500 font-medium">Assigned Work Order:</span>
                    <span className="font-bold text-[#174D91]">Carpentry & Store Unit</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500 font-medium">Technician Status:</span>
                    <span className="font-semibold text-emerald-700">Spare replacement chair en route</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Campus Statistics Counters */}
      <section id="stats" className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-5 rounded-2xl bg-[#F3F5F8] border border-slate-200">
              <span className="text-3xl font-extrabold text-[#174D91] block">{stats.total || 12}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1 block">
                Total Complaints Logged
              </span>
            </div>
            <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200">
              <span className="text-3xl font-extrabold text-amber-700 block">{stats.pending || 2}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 mt-1 block">
                Pending Triage
              </span>
            </div>
            <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200">
              <span className="text-3xl font-extrabold text-[#174D91] block">{stats.inProgress || 3}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#174D91] mt-1 block">
                Under Active Repair
              </span>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
              <span className="text-3xl font-extrabold text-emerald-700 block">{stats.resolutionRate || 85}%</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mt-1 block">
                Inspection Resolution Rate
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Common Maintenance Categories */}
      <section id="categories" className="py-16 bg-[#F3F5F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#174D91] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Campus Classifications
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Common Campus Facility Complaints
            </h2>
            <p className="text-sm text-slate-600">
              Direct routing to specialized technicians across Putrajaya and Muadzam Shah campuses
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat, idx) => {
              const Icon = cat.icon
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#174D91] transition-all hover:shadow-md space-y-3 group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${cat.color} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E9432B] bg-red-50 px-3 py-1 rounded-full border border-red-200">
              Simple 3-Step Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              How CampusFix Resolves Defects
            </h2>
            <p className="text-sm text-slate-600">
              From student discovery to verified technician closure in three transparent phases
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((st, idx) => {
              const Icon = st.icon
              return (
                <div key={idx} className="bg-[#F3F5F8] p-6 rounded-2xl border border-slate-200 space-y-4 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-[#174D91]/20 font-mono">
                      {st.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#174D91] shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {st.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section id="features" className="py-16 bg-[#F3F5F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#174D91] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Built for UNITEN
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Complete Maintenance Management Platform
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2.5">
              <HardDrive className="w-6 h-6 text-[#174D91]" />
              <h4 className="text-sm font-bold text-slate-900">Storage Evidence</h4>
              <p className="text-xs text-slate-600">Incident photographs are preserved in the dedicated storage bucket with verifiable MIME and file size metadata.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2.5">
              <Clock className="w-6 h-6 text-[#174D91]" />
              <h4 className="text-sm font-bold text-slate-900">Real-Time Sync</h4>
              <p className="text-xs text-slate-600">Instant database event subscriptions keep student dashboards synchronized when technician work orders update.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2.5">
              <ShieldCheck className="w-6 h-6 text-[#E9432B]" />
              <h4 className="text-sm font-bold text-slate-900">Role Isolation</h4>
              <p className="text-xs text-slate-600">Database Row Level Security policies prevent unauthorized access between students and facilities personnel.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2.5">
              <PhoneCall className="w-6 h-6 text-[#174D91]" />
              <h4 className="text-sm font-bold text-slate-900">Verified Contact</h4>
              <p className="text-xs text-slate-600">Malaysian mobile telephone numbers captured during registration allow direct technician callback during site visits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-14 bg-[#174D91] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <img
            src="/images/uniten-logo.png"
            alt="UNITEN Logo"
            className="h-14 w-auto mx-auto object-contain brightness-0 invert"
          />
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Spot a Maintenance Issue on Campus Today?
          </h2>
          <p className="text-sm text-blue-100 max-w-xl mx-auto">
            Log in with your UNITEN student credentials, attach a photograph of the damage, and help keep our university clean, safe, and world-class.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/student/submit"
              className="px-6 py-3 bg-[#E9432B] hover:bg-[#D3341D] text-white font-bold text-sm rounded-xl shadow-lg transition-all"
            >
              Submit Report Now
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-white text-[#174D91] hover:bg-blue-50 font-bold text-sm rounded-xl transition-all"
            >
              Create Student Account
            </Link>
          </div>
        </div>
      </section>

      {/* Professional UNITEN Footer */}
      <footer className="bg-white border-t border-slate-200 pt-12 pb-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <img
                src="/images/uniten-logo.png"
                alt="UNITEN Logo"
                className="h-10 w-auto object-contain"
              />
              <p className="text-xs text-slate-600 leading-relaxed">
                Universiti Tenaga Nasional (UNITEN) is a premier university owned by Tenaga Nasional Berhad (TNB).
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-3">Campus Locations</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Putrajaya Campus:</strong><br />
                Jalan IKRAM-UNITEN,<br />
                43000 Kajang, Selangor Darul Ehsan.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                <strong>Sultan Haji Ahmad Shah Campus:</strong><br />
                26700 Muadzam Shah, Pahang.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-3">Facility Emergency</h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li>Facilities Department: Ext 2020</li>
                <li>Security Control Centre: +60 3-8921 2121</li>
                <li>UNITEN IT Helpdesk: Ext 2222</li>
                <li>Email: facilities@uniten.edu.my</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-3">Platform Quick Links</h4>
              <ul className="space-y-1.5 text-xs">
                <li><Link to="/student/dashboard" className="text-[#174D91] hover:underline">Student Portal</Link></li>
                <li><Link to="/admin/dashboard" className="text-[#174D91] hover:underline">Facilities Admin Dashboard</Link></li>
                <li><Link to="/student/submit" className="text-[#174D91] hover:underline">Submit Facility Complaint</Link></li>
                <li><Link to="/student/reports" className="text-[#174D91] hover:underline">Track Complaint Status</Link></li>
                <li><Link to="/register" className="text-[#174D91] hover:underline">Student Registration</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>© {new Date().getFullYear()} Universiti Tenaga Nasional. All rights reserved. CampusFix Facility Management System.</p>
            <p>Designed and built for UNITEN campus community.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
