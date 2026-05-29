'use client'
/**
 * Login Page — Premium SaaS login form
 */
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Heart } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Email atau password salah.')
      setLoading(false)
      return
    }

    // Biarkan middleware yang mengurus redirect berdasarkan role (ke /admin atau /dashboard)
    // dengan cara memuat ulang halaman, sehingga request tertangkap middleware di server.
    if (!searchParams.get('callbackUrl') || searchParams.get('callbackUrl') === '/dashboard') {
      window.location.href = '/login'
    } else {
      window.location.href = callbackUrl
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C8A882]/20 via-transparent to-[#C8A882]/10" />
        <div className="relative z-10 text-center px-12 max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-[#C8A882] flex items-center justify-center mx-auto mb-8">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Wedding Invitation SaaS</h2>
          <p className="text-slate-400 leading-relaxed">
            Platform undangan pernikahan digital modern. Buat undangan elegan dalam hitungan menit.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-4">
            {[
              { val: '1K+', lbl: 'Undangan' },
              { val: '50K+', lbl: 'Tamu' },
              { val: '99%', lbl: 'Puas' },
            ].map((s) => (
              <div key={s.lbl} className="text-center">
                <p className="text-2xl font-bold text-[#C8A882]">{s.val}</p>
                <p className="text-xs text-slate-500 mt-1">{s.lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#C8A882] flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Wedding SaaS</h1>
          </div>

          <h1 className="text-2xl font-bold text-slate-800">Masuk ke Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1 mb-8">Kelola undangan pernikahan Anda</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-[#C8A882] focus:ring-1 focus:ring-[#C8A882]/20 outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-[#C8A882] focus:ring-1 focus:ring-[#C8A882]/20 outline-none transition-colors"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[#C8A882] text-white font-medium text-sm hover:bg-[#b89872] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? 'Memuat...' : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-8">
            © {new Date().getFullYear()} AAP Wedding. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
