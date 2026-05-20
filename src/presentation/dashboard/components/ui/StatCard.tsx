import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  description?: string
}

export function StatCard({ title, value, icon: Icon, trend, trendUp, description }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-start gap-4">
      <div className="w-11 h-11 rounded-lg bg-[#C8A882]/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[#C8A882]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
        {(trend || description) && (
          <p className="text-xs mt-1">
            {trend && (
              <span className={trendUp ? 'text-emerald-600' : 'text-red-500'}>
                {trendUp ? '↑' : '↓'} {trend}
              </span>
            )}
            {description && <span className="text-slate-400"> {description}</span>}
          </p>
        )}
      </div>
    </div>
  )
}
