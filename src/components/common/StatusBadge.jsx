import React from 'react'
import { Clock, RefreshCw, CheckCircle2, XCircle } from 'lucide-react'

export const StatusBadge = ({ status, size = 'md' }) => {
  const configs = {
    'Pending': {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
      icon: Clock,
      label: 'Pending Review',
    },
    'In Progress': {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      dot: 'bg-blue-500 animate-pulse',
      icon: RefreshCw,
      label: 'In Progress',
    },
    'Resolved': {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
      icon: CheckCircle2,
      label: 'Resolved',
    },
    'Rejected': {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
      icon: XCircle,
      label: 'Rejected',
    },
  }

  const current = configs[status] || configs['Pending']
  const Icon = current.icon

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border ${current.bg} ${current.text} ${current.border} ${sizeClasses[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{current.label}</span>
    </span>
  )
}

export default StatusBadge
