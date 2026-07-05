'use client'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AdminSidebar } from './AdminSidebar'
import { usePathname } from 'next/navigation'

interface AdminLayoutProps {
  children: React.ReactNode
  userEmail?: string
  pageTitle?: string
}

export function AdminLayout({ children, userEmail, pageTitle }: AdminLayoutProps) {
  const pathname = usePathname()

  if (pathname.includes('/design')) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <AdminSidebar userEmail={userEmail} />
      <SidebarInset>
        <SidebarTrigger className="lg:hidden fixed top-4 left-4 z-50 bg-background shadow-sm border rounded-md" />
        <div className="flex flex-1 flex-col gap-4 p-4 lg:p-8 pt-16 lg:pt-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
