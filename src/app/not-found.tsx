import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center px-6 overflow-hidden relative">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Large 404 text */}
        <div className="relative mb-8">
          <h1
            className="text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter select-none"
            style={{
              background: 'linear-gradient(135deg, rgba(129,140,248,0.2) 0%, rgba(99,102,241,0.05) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            404
          </h1>
          {/* Glowing overlay text */}
          <h1
            className="absolute inset-0 text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter select-none"
            style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 40%, #a78bfa 80%, #c4b5fd 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'blur(1px)',
              opacity: 0.6,
            }}
          >
            404
          </h1>
        </div>

        {/* Divider line */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-indigo-400/50" />
          <div className="w-2 h-2 rounded-full bg-indigo-400/60 animate-pulse" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-indigo-400/50" />
        </div>

        {/* Message */}
        <h2 className="text-2xl sm:text-3xl font-semibold text-white/90 mb-4 tracking-tight">
          Halaman tidak ditemukan
        </h2>
        <p className="text-base sm:text-lg text-slate-400 mb-10 max-w-md mx-auto leading-relaxed">
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan ke alamat lain.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="group relative px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Beranda
            </span>
          </Link>
          <Link
            href="/admin"
            className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-medium rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-sm"
          >
            Buka Dashboard
          </Link>
        </div>

        {/* Floating particles decoration */}
        <div className="mt-16 flex items-center justify-center gap-3 opacity-30">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="rounded-full bg-indigo-400 animate-bounce"
              style={{
                width: `${4 + i * 2}px`,
                height: `${4 + i * 2}px`,
                animationDelay: `${i * 0.15}s`,
                animationDuration: '2s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
