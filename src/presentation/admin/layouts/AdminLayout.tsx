'use client'
import { useState } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { AdminTopbar } from './AdminTopbar'

interface AdminLayoutProps {
  children: React.ReactNode
  userEmail?: string
  pageTitle?: string
}

export function AdminLayout({ children, userEmail, pageTitle }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Desktop sidebar */}
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Main content */}
      <div className={`transition-all duration-300 ${collapsed ? 'lg:ml-[68px]' : 'lg:ml-[260px]'}`}>
        <AdminTopbar
          onMenuToggle={() => setMobileOpen(true)}
          userEmail={userEmail}
          pageTitle={pageTitle}
        />
        <main className="p-4 lg:p-8 max-w-7xl mx-auto">{children}</main>
      </div>

      {/* TODO: AdminMobileNav implementation if needed, for now we just rely on standard responsiveness or hide it */}
    </div>
  )
}
