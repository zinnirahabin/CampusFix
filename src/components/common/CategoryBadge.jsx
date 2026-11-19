import React from 'react'
import {
  Zap,
  Droplets,
  Wind,
  Armchair,
  MonitorPlay,
  Sparkles,
  HelpCircle,
} from 'lucide-react'

export const getCategoryIcon = (categoryName) => {
  switch (categoryName) {
    case 'Electrical Problems':
      return Zap
    case 'Plumbing':
      return Droplets
    case 'Air Conditioning':
      return Wind
    case 'Furniture Damage':
      return Armchair
    case 'Classroom Equipment':
      return MonitorPlay
    case 'Cleanliness':
      return Sparkles
    default:
      return HelpCircle
  }
}

export const CategoryBadge = ({ category }) => {
  const Icon = getCategoryIcon(category)

  const colorStyles = {
    'Electrical Problems': 'bg-amber-50 text-amber-800 border-amber-200',
    'Plumbing': 'bg-blue-50 text-blue-800 border-blue-200',
    'Air Conditioning': 'bg-cyan-50 text-cyan-800 border-cyan-200',
    'Furniture Damage': 'bg-orange-50 text-orange-800 border-orange-200',
    'Classroom Equipment': 'bg-indigo-50 text-indigo-800 border-indigo-200',
    'Cleanliness': 'bg-emerald-50 text-emerald-800 border-emerald-200',
    'Other': 'bg-slate-50 text-slate-700 border-slate-200',
  }

  const style = colorStyles[category] || colorStyles['Other']

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${style}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{category}</span>
    </span>
  )
}

export default CategoryBadge
