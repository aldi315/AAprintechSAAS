'use client'
import { Menu, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

interface AdminTopbarProps {
  onMenuToggle: () => void
  userEmail?: string
  pageTitle?: string
}

export function AdminTopbar({ onMenuToggle, userEmail, pageTitle }: AdminTopbarProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        {pageTitle && (
          <h1 className="text-lg font-semibold text-slate-800">{pageTitle}</h1>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-slate-700">{userEmail}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Super Admin</p>
        </div>
        
        <div className="w-px h-8 bg-slate-200 mx-2 hidden sm:block" />
        
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Sign out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
