import { ReactNode } from 'react'

interface DashboardCardProps {
  title: string
  value: number | string
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  icon?: ReactNode
  onClick?: () => void
  actionLabel?: string
}

export function DashboardCard({
  title,
  value,
  change,
  trend,
  icon,
  onClick,
  actionLabel,
}: DashboardCardProps) {
  return (
    <div
      className={`p-6 bg-surface border border-border rounded-lg ${
        onClick ? 'cursor-pointer hover:border-text transition-colors' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-muted uppercase tracking-wider mb-2">{title}</p>
          <p className="font-serif text-3xl font-bold">{value}</p>
        </div>
        {icon && <div className="text-2xl opacity-50">{icon}</div>}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium ${
              trend === 'up'
                ? 'text-green-600'
                : trend === 'down'
                  ? 'text-red-600'
                  : 'text-muted'
            }`}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {Math.abs(change)}%
          </span>
          <span className="text-xs text-muted">vs last period</span>
        </div>
      )}

      {actionLabel && (
        <button className="mt-4 text-sm text-text hover:underline">
          {actionLabel} →
        </button>
      )}
    </div>
  )
}
