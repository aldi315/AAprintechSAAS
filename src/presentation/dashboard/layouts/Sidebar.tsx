'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Heart, Users, ClipboardCheck,
  Image as ImageIcon, Palette, Settings, ChevronLeft,
} from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
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

export function Sidebar({ collapsed, onToggle, tenantName }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-30 bg-[#0F172A] text-slate-400 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-[68px]' : 'w-[240px]'
      } max-lg:hidden`}
    >
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-slate-800 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-[#C8A882] flex items-center justify-center text-white font-bold text-sm shrink-0">
          W
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{tenantName ?? 'Wedding SaaS'}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Dashboard</p>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#C8A882]/15 text-[#C8A882]'
                  : 'hover:bg-slate-800 hover:text-slate-200'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="h-12 flex items-center justify-center border-t border-slate-800 hover:bg-slate-800 transition-colors"
      >
        <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
      </button>
    </aside>
  )
}
