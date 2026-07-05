'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  LayoutDashboard, Building2, Palette, Image as ImageIcon,
  CreditCard, Activity, Settings, Heart, Users,
  ChevronLeft, ChevronRight
} from 'lucide-react'
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { signOut } from 'next-auth/react'
import { LogOut, MoreVertical, Sun, Moon } from 'lucide-react'

interface AdminSidebarProps {
  userEmail?: string
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
      { href: '/admin/resellers', label: 'Resellers', icon: Building2 },
      { href: '/admin/invitations', label: 'Undangan', icon: Heart },
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
      { href: '/admin/users', label: 'Pengguna', icon: Users },
      { href: '/admin/settings', label: 'Settings', icon: Settings },
    ]
  }
]

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const { state, toggleSidebar } = useSidebar()

  return (
    <ShadcnSidebar variant="sidebar" collapsible="icon" className="border-r border-border bg-sidebar">
      <SidebarHeader className="border-b border-border p-4">
        {/* Expanded state: logo + text + collapse button */}
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:hidden">
          <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
          <div className="overflow-hidden flex-1">
            <p className="font-bold text-foreground text-sm leading-tight">Super Admin</p>
            <p className="text-muted-foreground text-xs">Control Center</p>
          </div>
          <button
            type="button"
            onClick={toggleSidebar}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding transition-all outline-none size-8 text-muted-foreground hover:text-foreground hover:bg-muted hidden lg:inline-flex"
            title="Tutup Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Collapsed state: logo + expand button stacked */}
        <div className="hidden group-data-[collapsible=icon]:flex flex-col items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
          <button
            type="button"
            onClick={toggleSidebar}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding transition-all outline-none size-8 text-muted-foreground hover:text-foreground hover:bg-muted hidden lg:inline-flex"
            title="Buka Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {menuGroups.map((group, idx) => (
          <SidebarGroup key={idx}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      tooltip={item.label}
                      className="data-active:bg-primary data-active:text-primary-foreground data-active:shadow-md data-active:shadow-primary/30 text-muted-foreground hover:text-sidebar-accent-foreground transition-all duration-200"
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-3">
        {/* Expanded state */}
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:hidden">
          <Avatar className="h-8 w-8 rounded-lg shrink-0">
            <AvatarFallback className="rounded-lg bg-primary text-white text-xs font-bold">
              SA
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-foreground text-xs font-medium truncate">Administrator</p>
            <p className="text-muted-foreground text-xs truncate">{userEmail}</p>
          </div>
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding transition-all outline-none size-8 text-muted-foreground hover:text-foreground hover:bg-muted"
            title="Toggle theme"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
            <span className="sr-only">Toggle theme</span>
          </button>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding transition-all outline-none size-8 text-muted-foreground hover:text-red-400 hover:bg-red-900/20"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Collapsed state — avatar centered + stacked action buttons */}
        <div className="hidden group-data-[collapsible=icon]:flex flex-col items-center gap-2">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarFallback className="rounded-lg bg-primary text-white text-xs font-bold">
              SA
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="inline-flex items-center justify-center rounded-lg border border-transparent transition-all outline-none size-8 text-muted-foreground hover:text-foreground hover:bg-muted"
            title="Toggle theme"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
          </button>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="inline-flex items-center justify-center rounded-lg border border-transparent transition-all outline-none size-8 text-muted-foreground hover:text-red-400 hover:bg-red-900/20"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </ShadcnSidebar>
  )
}
