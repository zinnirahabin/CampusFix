import React from 'react'

export const StatCard = ({ title, value, icon: Icon, changeText, trend = 'neutral', color = 'blue' }) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-100',
    },
    amber: {
      bg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-100',
    },
    emerald: {
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-100',
    },
    rose: {
      bg: 'bg-rose-50',
      iconColor: 'text-rose-600',
      borderColor: 'border-rose-100',
    },
    indigo: {
      bg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      borderColor: 'border-indigo-100',
    },
  }

  const activeColor = colorMap[color] || colorMap.blue

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeColor.bg}`}>
          <Icon className={`w-5 h-5 ${activeColor.iconColor}`} />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-slate-900">{value}</span>
      </div>
      {changeText && (
        <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
          {changeText}
        </p>
      )}
    </div>
  )
}

export default StatCard
