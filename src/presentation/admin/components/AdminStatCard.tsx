import { type LucideIcon } from 'lucide-react'

interface AdminStatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function AdminStatCard({ title, value, icon: Icon, description, trend }: AdminStatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <div className="p-2 bg-slate-50 rounded-lg">
          <Icon className="w-5 h-5 text-slate-600" />
        </div>
      </div>
      
      <div>
        <div className="text-3xl font-bold text-slate-900">{value}</div>
        
        {(description || trend) && (
          <div className="flex items-center gap-2 mt-2">
            {trend && (
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  trend.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                }`}
              >
                {trend.isPositive ? '+' : '-'}{trend.value}%
              </span>
            )}
            {description && (
              <span className="text-xs text-slate-500">{description}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
