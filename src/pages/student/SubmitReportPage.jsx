import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReports } from '../../context/ReportContext'
import { useAuth } from '../../context/AuthContext'
import { getCategoryIcon } from '../../components/common/CategoryBadge'
import {
  UploadCloud,
  X,
  Camera,
  CheckCircle2,
  AlertCircle,
  Building2,
  MapPin,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react'

export const SubmitReportPage = () => {
  const { categories, addReport } = useReports()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    category: 'Air Conditioning',
    building: 'College of Computing & Informatics (CCI)',
    floor: 'Level 2',
    room: '',
    priority: 'Medium',
    description: '',
  })

  const [images, setImages] = useState([
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [createdReportId, setCreatedReportId] = useState('')

  // Campus building options for UNITEN
  const campusBuildings = [
    'College of Computing & Informatics (CCI)',
    'College of Engineering (COE)',
    'College of Business Administration (COBA)',
    'Main Library Complex',
    'Student Centre & Cafeteria',
    'Murni Residence Hostel',
    'Amanah Residence Hostel',
    'Cendekiawan Residence Hostel',
    'Admin Complex / Chancellor Building',
    'Campus Mosque & Islamic Centre',
    'Sports Complex & Gymnasium',
    'Other Outdoor Campus Facility',
  ]

  const samplePhotoOptions = [
    { label: 'AC Leakage', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80' },
    { label: 'Water Pipe Leak', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80' },
    { label: 'Projector Issue', url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Broken Furniture', url: 'https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=800&q=80' },
    { label: 'Electrical Wiring', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80' },
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      // Mock converting file to object URL preview
      const newUrls = files.map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...newUrls])
    }
  }

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const handleAddSamplePhoto = (url) => {
    if (!images.includes(url)) {
      setImages((prev) => [...prev, url])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      setError('Please provide a brief title describing the problem.')
      return
    }
    if (!formData.room.trim()) {
      setError('Please specify the exact room, lab or landmark location.')
      return
    }
    if (!formData.description.trim()) {
      setError('Please provide a description of the issue.')
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      const newReport = addReport(
        {
          ...formData,
          images,
        },
        user
      )

      setIsSubmitting(false)
      setCreatedReportId(newReport.id)
      setShowSuccessModal(true)
    }, 600)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
          <Camera className="w-3.5 h-3.5" />
          <span>New Facility Complaint</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Submit Maintenance Report
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Provide accurate details and photos to help facilities technicians diagnose and resolve the issue quickly.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Category Selection */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">1. Select Issue Category</h2>
              <p className="text-xs text-slate-500">Pick the category that best matches the maintenance problem</p>
            </div>
            <span className="text-xs font-semibold text-rose-500">* Required</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat.name)
              const isSelected = formData.category === cat.name
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setFormData({ ...formData, category: cat.name })}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-24 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-600/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <span className={`text-xs font-bold leading-tight ${
                    isSelected ? 'text-blue-900' : 'text-slate-700'
                  }`}>
                    {cat.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Step 2: Location Information */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">2. Incident Location</h2>
              <p className="text-xs text-slate-500">Specify exactly where maintenance staff should go</p>
            </div>
            <span className="text-xs font-semibold text-rose-500">* Required</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Campus Building / Complex
              </label>
              <div className="relative">
                <select
                  name="building"
                  value={formData.building}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {campusBuildings.map((bldg) => (
                    <option key={bldg} value={bldg}>
                      {bldg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Floor / Level
              </label>
              <select
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Basement">Basement</option>
                <option value="Ground Floor">Ground Floor</option>
                <option value="Level 1">Level 1</option>
                <option value="Level 2">Level 2</option>
                <option value="Level 3">Level 3</option>
                <option value="Level 4">Level 4</option>
                <option value="Rooftop">Rooftop / Exterior</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Room / Lab / Landmark <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="room"
                value={formData.room}
                onChange={handleChange}
                required
                placeholder="e.g. Lab 402, Quiet Zone Desk 14, Lecture Hall 3, Restroom G-02"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Issue Details */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">3. Issue Details</h2>
              <p className="text-xs text-slate-500">Describe the symptom, hazard level and impact</p>
            </div>
            <span className="text-xs font-semibold text-rose-500">* Required</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Issue Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Broken overhead projector blinking purple in LT1"
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priority Severity
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low (Minor cosmetic / non-urgent)</option>
                <option value="Medium">Medium (Routine defect)</option>
                <option value="High">High (Impacting class or safety)</option>
                <option value="Urgent">Urgent (Safety emergency / flood / power cut)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Provide more context: When did it start? Is it causing an immediate safety hazard, water leak, or blocking classes? Mention any specific equipment codes if visible."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
              <span>Be as descriptive as possible to avoid inspection delays</span>
              <span>{formData.description.length} characters</span>
            </div>
          </div>
        </div>

        {/* Step 4: Photographic Evidence */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">4. Photographic Evidence</h2>
              <p className="text-xs text-slate-500">Upload photos of the defect to fast-track approval</p>
            </div>
            <span className="text-xs font-medium text-slate-400">Recommended</span>
          </div>

          {/* Drag & Drop Zone */}
          <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center transition-colors bg-slate-50/50">
            <UploadCloud className="w-10 h-10 text-blue-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">
              Drag and drop incident photographs, or <label className="text-blue-600 hover:underline cursor-pointer">browse files<input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" /></label>
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Supports PNG, JPG, JPEG up to 10MB</p>
          </div>

          {/* Quick Preset Buttons for Demonstration */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick Demo Sample Photos:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {samplePhotoOptions.map((sample, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleAddSamplePhoto(sample.url)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-medium text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  + {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Uploaded Images Preview Gallery */}
          {images.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-700 mb-2 block">
                Attached Images ({images.length})
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((imgUrl, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                    <img src={imgUrl} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-1.5 left-1.5 bg-slate-900/70 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                      Photo #{index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/student/dashboard')}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center gap-2"
          >
            {isSubmitting ? (
              <span>Submitting Report...</span>
            ) : (
              <>
                <span>Submit Maintenance Report</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-slate-100">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                Reference #{createdReportId}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2">
                Report Submitted Successfully!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your report has been logged in the UNITEN CampusFix central repository with status <strong className="text-amber-600">Pending Review</strong>.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => navigate(`/reports/${createdReportId}`)}
                className="flex-1 py-2.5 px-4 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
              >
                View Report Details
              </button>
              <button
                type="button"
                onClick={() => navigate('/student/reports')}
                className="flex-1 py-2.5 px-4 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Go to My Reports
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SubmitReportPage
