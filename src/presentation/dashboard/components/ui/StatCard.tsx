import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
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
    <Card>
      <CardContent className="p-5 flex items-start gap-4">
        <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
          {(trend || description) && (
            <p className="text-xs mt-1">
              {trend && (
                <span className={trendUp ? 'text-emerald-600' : 'text-red-500'}>
                  {trendUp ? '↑' : '↓'} {trend}
                </span>
              )}
              {description && <span className="text-muted-foreground"> {description}</span>}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
