import React, { useState } from 'react'
import { useReports } from '../../context/ReportContext'
import { getCategoryIcon } from '../../components/common/CategoryBadge'
import Modal from '../../components/common/Modal'
import {
  Layers,
  PlusCircle,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Sparkles,
} from 'lucide-react'

export const AdminCategoriesPage = () => {
  const { categories, reports, addCategory, toggleCategoryStatus } = useReports()

  const [showAddModal, setShowAddModal] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [newCatDesc, setNewCatDesc] = useState('')
  const [newCatColor, setNewCatColor] = useState('blue')

  const handleAddSubmit = (e) => {
    e.preventDefault()
    if (!newCatName.trim()) return

    addCategory({
      name: newCatName.trim(),
      description: newCatDesc.trim() || 'Custom campus facility category',
      color: newCatColor,
    })

    setShowAddModal(false)
    setNewCatName('')
    setNewCatDesc('')
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Facility Issue Categories
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure campus maintenance classifications, triage routing, and active statuses
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.name)
          const reportCount = reports.filter((r) => r.category === cat.name).length

          return (
            <div
              key={cat.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm transition-all flex flex-col justify-between ${
                cat.active ? 'border-slate-200/80 hover:border-blue-300' : 'border-slate-200/50 opacity-60 bg-slate-50/50'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <button
                    onClick={() => toggleCategoryStatus(cat.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors"
                  >
                    {cat.active ? (
                      <span className="text-emerald-700 bg-emerald-50 border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active
                      </span>
                    ) : (
                      <span className="text-slate-500 bg-slate-100 border-slate-200 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 text-slate-400" /> Inactive
                      </span>
                    )}
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{cat.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed min-h-[40px]">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total complaints filed:</span>
                <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                  {reportCount} reports
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Facility Category"
        >
          <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Category Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                required
                placeholder="e.g. Elevator Malfunctions, Roof & Drainage"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Description & Examples
              </label>
              <textarea
                rows={3}
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="Mention what kind of defects or campus hardware fall into this category..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md"
              >
                Create Category
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default AdminCategoriesPage
