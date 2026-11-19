import React from 'react'
import { AlertTriangle, ArrowUp, ArrowDown, Minus } from 'lucide-react'

export const PriorityBadge = ({ priority }) => {
  const configs = {
    Urgent: {
      bg: 'bg-red-50 text-red-700 border-red-200',
      icon: AlertTriangle,
    },
    High: {
      bg: 'bg-orange-50 text-orange-700 border-orange-200',
      icon: ArrowUp,
    },
    Medium: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Minus,
    },
    Low: {
      bg: 'bg-slate-50 text-slate-600 border-slate-200',
      icon: ArrowDown,
    },
  }

  const current = configs[priority] || configs['Medium']
  const Icon = current.icon

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${current.bg}`}
    >
      <Icon className="w-3 h-3" />
      <span>{priority}</span>
    </span>
  )
}

export default PriorityBadge
