'use client'
/**
 * Login Page — Premium SaaS login redesign
 */
import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Heart, Loader2, Mail, Lock, Sparkles, Users, CheckCircle2 } from 'lucide-react'

function LoginForm() {
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

    if (!searchParams.get('callbackUrl') || searchParams.get('callbackUrl') === '/dashboard') {
      window.location.href = '/login'
    } else {
      window.location.href = callbackUrl
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          Alamat Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            required
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-foreground">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
          <div className="w-1 h-1 rounded-full bg-destructive shrink-0" />
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-primary/30 mt-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Memuat...
          </>
        ) : (
          'Masuk ke Dashboard'
        )}
      </button>
    </form>
  )
}

const STATS = [
  { val: '1K+', lbl: 'Undangan Dibuat', icon: Heart },
  { val: '50K+', lbl: 'Tamu Terundang', icon: Users },
  { val: '99%', lbl: 'Kepuasan Klien', icon: Sparkles },
]

const FEATURES = [
  'Template undangan elegan & modern',
  'Kelola tamu dan RSVP real-time',
  'Custom domain & branding sendiri',
  'Dashboard analitik lengkap',
]

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-background">

      {/* ===== LEFT: DECORATIVE PANEL ===== */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-foreground" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-primary/5" />

        {/* Decorative blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            color: 'white',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
              <Heart className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">AAPrintech</span>
          </div>

          {/* Main copy */}
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Wedding SaaS Platform</span>
            </div>

            <h2 className="text-4xl font-bold text-white leading-tight mb-5">
              Buat Undangan Pernikahan
              <br />
              <span className="text-primary">yang Tak Terlupakan</span>
            </h2>
            <p className="text-white/60 text-base leading-relaxed mb-10">
              Platform undangan digital modern untuk reseller dan wedding organizer. Kelola semua klien dari satu dashboard.
            </p>

            {/* Feature list */}
            <ul className="space-y-3 mb-12">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-white/70 text-sm">{f}</span>
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {STATS.map(({ val, lbl, icon: Icon }) => (
                <div
                  key={lbl}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm"
                >
                  <Icon className="w-4 h-4 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{val}</p>
                  <p className="text-[11px] text-white/50 mt-0.5">{lbl}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} AAPrintech. All rights reserved.
          </p>
        </div>
      </div>

      {/* ===== RIGHT: LOGIN FORM ===== */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        {/* Soft background accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-sm relative">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Heart className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="text-foreground font-bold text-lg">AAPrintech</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Selamat Datang 👋</h1>
            <p className="text-sm text-muted-foreground mt-1.5">Masuk untuk mengelola undangan pernikahan</p>
          </div>

          {/* Form */}
          <Suspense
            fallback={
              <div className="text-sm text-muted-foreground text-center py-8 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Memuat form...
              </div>
            }
          >
            <LoginForm />
          </Suspense>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground/60 mt-10">
            © {new Date().getFullYear()} AAPrintech · Wedding Invitation Platform
          </p>
        </div>
      </div>
    </div>
  )
}
