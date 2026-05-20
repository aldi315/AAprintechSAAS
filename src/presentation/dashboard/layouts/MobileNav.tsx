'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Heart, Users, ClipboardCheck,
  Image as ImageIcon, Palette, Settings, X,
} from 'lucide-react'

interface MobileNavProps {
  open: boolean
  onClose: () => void
  tenantName?: string
}

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/weddings', label: 'Weddings', icon: Heart },
  { href: '/dashboard/guests', label: 'Guests', icon: Users },
  { href: '/dashboard/rsvp', label: 'RSVP', icon: ClipboardCheck },
  { href: '/dashboard/media', label: 'Media', icon: ImageIcon },
  { href: '/dashboard/templates', label: 'Templates', icon: Palette },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function MobileNav({ open, onClose, tenantName }: MobileNavProps) {
  const pathname = usePathname()

  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* Drawer */}
      <nav className="absolute left-0 top-0 bottom-0 w-[260px] bg-[#0F172A] text-slate-400 flex flex-col animate-in slide-in-from-left">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C8A882] flex items-center justify-center text-white font-bold text-sm">W</div>
            <p className="text-sm font-semibold text-white truncate">{tenantName ?? 'Wedding SaaS'}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Menu */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-[#C8A882]/15 text-[#C8A882]' : 'hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
