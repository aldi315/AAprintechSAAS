'use client'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Sidebar as DashboardSidebar } from './Sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
  userName?: string
  userEmail?: string
  resellerName?: string
  pageTitle?: string
}

export function DashboardLayout({ children, userName, userEmail, resellerName, pageTitle }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardSidebar resellerName={resellerName} userName={userName} userEmail={userEmail} />

      <SidebarInset>
        <SidebarTrigger className="lg:hidden fixed top-4 left-4 z-50 bg-background shadow-sm border rounded-md" />
        <div className="flex flex-1 flex-col gap-4 p-4 lg:p-8 pt-16 lg:pt-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
