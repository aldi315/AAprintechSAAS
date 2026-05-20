import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Akses Ditolak</h1>
        <p className="text-sm text-slate-500 mb-8">
          Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center px-5 py-2.5 bg-[#C8A882] text-white rounded-lg text-sm font-medium hover:bg-[#b89872] transition-colors"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  )
}
