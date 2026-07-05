'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  LayoutDashboard, Heart, Users, ClipboardCheck,
  Image as ImageIcon, Palette, Settings,
  ChevronLeft, ChevronRight
} from 'lucide-react'
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
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
import { User, LogOut, MoreVertical, Sun, Moon } from 'lucide-react'

interface SidebarProps {
  resellerName?: string
  userName?: string
  userEmail?: string
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

export function Sidebar({ resellerName, userName, userEmail }: SidebarProps) {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const { state, toggleSidebar } = useSidebar()

  return (
    <ShadcnSidebar variant="inset" collapsible="icon" className="border-r border-border bg-sidebar relative">
      <button 
        type="button"
        onClick={toggleSidebar}
        className="absolute top-6 -right-3 w-6 h-6 bg-secondary border border-input rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground z-50 hidden lg:flex" 
      >
        {state === 'expanded' ? (
          <ChevronLeft className="w-3 h-3 text-background" />
        ) : (
          <ChevronRight className="w-3 h-3 text-background" />
        )}
      </button>
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
             <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-foreground text-sm leading-tight">{resellerName ?? 'Wedding SaaS'}</p>
            <p className="text-muted-foreground text-xs">Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
              
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    render={<Link href={item.href} />}
                    isActive={isActive} 
                    tooltip={item.label}
                    className="data-[active=true]:bg-primary data-[active=true]:text-white data-[active=true]:shadow-md data-[active=true]:shadow-primary/30 text-muted-foreground hover:text-sidebar-accent-foreground transition-all duration-200"
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 rounded-lg shrink-0">
            <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs font-bold">
              {(userName ?? 'U').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-foreground text-xs font-medium truncate">{userName ?? 'User'}</p>
            <p className="text-muted-foreground text-xs truncate">{userEmail}</p>
          </div>
          <button 
            type="button" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding transition-all outline-none size-8 w-9 h-9 text-muted-foreground hover:text-foreground hover:bg-muted"
            title="Toggle theme"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
            <span className="sr-only">Toggle theme</span>
          </button>
          <button 
            type="button" 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding transition-all outline-none size-8 w-7 h-7 text-muted-foreground hover:text-red-400 hover:bg-red-900/20"
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
