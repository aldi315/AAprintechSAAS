type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
  dot?: boolean
}

const variants: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-sky-50 text-sky-700 border-sky-200',
  neutral: 'bg-slate-50 text-slate-600 border-slate-200',
}

const dotColors: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-sky-500',
  neutral: 'bg-slate-400',
}

export function Badge({ variant = 'neutral', children, className = '', dot }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  )
}

/** Mapping status ke badge variant */
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    PUBLISHED: { variant: 'success', label: 'Published' },
    DRAFT: { variant: 'neutral', label: 'Draft' },
    ARCHIVED: { variant: 'warning', label: 'Archived' },
    ATTENDING: { variant: 'success', label: 'Hadir' },
    NOT_ATTENDING: { variant: 'danger', label: 'Tidak Hadir' },
    MAYBE: { variant: 'warning', label: 'Mungkin' },
    PENDING: { variant: 'info', label: 'Pending' },
  }
  const cfg = map[status] ?? { variant: 'neutral' as BadgeVariant, label: status }
  return <Badge variant={cfg.variant} dot>{cfg.label}</Badge>
}
