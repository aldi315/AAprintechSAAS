'use client'
import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MobileNav } from './MobileNav'

interface DashboardLayoutProps {
  children: React.ReactNode
  userName?: string
  userEmail?: string
  tenantName?: string
  pageTitle?: string
}

export function DashboardLayout({ children, userName, userEmail, tenantName, pageTitle }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Desktop sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} tenantName={tenantName} />

      {/* Mobile nav */}
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} tenantName={tenantName} />

      {/* Main content */}
      <div className={`transition-all duration-300 ${collapsed ? 'lg:ml-[68px]' : 'lg:ml-[240px]'}`}>
        <Topbar
          onMenuToggle={() => setMobileOpen(true)}
          userName={userName}
          userEmail={userEmail}
          pageTitle={pageTitle}
        />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
