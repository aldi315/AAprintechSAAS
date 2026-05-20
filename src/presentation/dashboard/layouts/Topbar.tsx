'use client'
import { signOut } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'
import { Menu, Bell, LogOut, User, ChevronDown } from 'lucide-react'

interface TopbarProps {
  onMenuToggle: () => void
  userName?: string
  userEmail?: string
  pageTitle?: string
}

export function Topbar({ onMenuToggle, userName, userEmail, pageTitle }: TopbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      {/* Left: mobile menu + page title */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
          <Menu className="w-5 h-5 text-slate-600" />
        </button>
        {pageTitle && (
          <h1 className="text-lg font-semibold text-slate-800 hidden sm:block">{pageTitle}</h1>
        )}
      </div>

      {/* Right: notification + user */}
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-slate-100 rounded-lg relative">
          <Bell className="w-5 h-5 text-slate-500" />
        </button>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#C8A882] flex items-center justify-center text-white text-sm font-bold">
              {(userName ?? 'U').charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-slate-700 leading-tight">{userName ?? 'User'}</p>
              <p className="text-[11px] text-slate-400 leading-tight">{userEmail}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-slate-200 shadow-lg py-1 z-50">
              <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                <User className="w-4 h-4" /> Profil
              </button>
              <hr className="my-1 border-slate-100" />
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
