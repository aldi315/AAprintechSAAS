'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Building2, Palette, Image as ImageIcon,
  CreditCard, Activity, Settings, ChevronLeft
} from 'lucide-react'

interface AdminSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const menuGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    ]
  },
  {
    label: 'Management',
    items: [
      { href: '/admin/tenants', label: 'Tenants', icon: Building2 },
      { href: '/admin/templates', label: 'Templates', icon: Palette },
      { href: '/admin/media', label: 'Media', icon: ImageIcon },
    ]
  },
  {
    label: 'Finance',
    items: [
      { href: '/admin/revenue', label: 'Revenue', icon: CreditCard },
    ]
  },
  {
    label: 'Monitoring',
    items: [
      { href: '/admin/activity', label: 'Activity Logs', icon: Activity },
    ]
  },
  {
    label: 'System',
    items: [
      { href: '/admin/settings', label: 'Settings', icon: Settings },
    ]
  }
]

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-30 bg-[#0F172A] text-slate-400 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-[68px]' : 'w-[260px]'
      } max-lg:hidden`}
    >
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-slate-800/60 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
          S
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">Super Admin</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Control Center</p>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 px-3 space-y-6 overflow-y-auto custom-scrollbar">
        {menuGroups.map((group, idx) => (
          <div key={idx}>
            {!collapsed && (
              <p className="px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-2">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-500/15 text-indigo-400'
                        : 'hover:bg-slate-800/80 hover:text-slate-200'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="h-12 flex items-center justify-center border-t border-slate-800/60 hover:bg-slate-800/50 transition-colors"
      >
        <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
      </button>
    </aside>
  )
}
