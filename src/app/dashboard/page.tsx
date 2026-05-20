import { requireTenant } from '@/lib/tenant-guard'
import { getDashboardStats, getRecentRsvps } from '@/application/queries/dashboard.queries'
import { StatCard } from '@/presentation/dashboard/components/ui/StatCard'
import { Card, CardHeader, CardTitle } from '@/presentation/dashboard/components/ui/Card'
import { StatusBadge } from '@/presentation/dashboard/components/ui/Badge'
import { Heart, Users, ClipboardCheck, TrendingUp, Eye } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardHomePage() {
  const ctx = await requireTenant()
  const [stats, recentRsvps] = await Promise.all([
    getDashboardStats(ctx.tenantId),
    getRecentRsvps(ctx.tenantId, 5),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Selamat datang kembali! Berikut ringkasan undangan Anda.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Undangan" value={stats.totalWeddings} icon={Heart}
          description={`${stats.publishedWeddings} published`} />
        <StatCard title="Total Tamu" value={stats.totalGuests} icon={Users} />
        <StatCard title="Total RSVP" value={stats.totalRsvp} icon={ClipboardCheck} />
        <StatCard title="Kehadiran" value={`${stats.attendancePercentage}%`} icon={TrendingUp}
          description={`${stats.attendingCount} hadir`} />
      </div>

      {/* Recent RSVP */}
      <Card>
        <CardHeader>
          <CardTitle>RSVP Terbaru</CardTitle>
          <Link href="/dashboard/rsvp" className="text-sm text-[#C8A882] hover:underline">Lihat semua →</Link>
        </CardHeader>
        <div className="mt-4">
          {recentRsvps.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Belum ada RSVP.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentRsvps.map((rsvp) => (
                <div key={rsvp.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{rsvp.guestName}</p>
                    <p className="text-xs text-slate-400">{rsvp.weddingTitle}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={rsvp.attendance} />
                    <span className="text-xs text-slate-400">
                      {new Date(rsvp.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/dashboard/weddings/new" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#C8A882] hover:shadow-sm transition-all group">
          <Heart className="w-8 h-8 text-[#C8A882] mb-3" />
          <h3 className="font-semibold text-slate-800 group-hover:text-[#C8A882] transition-colors">Buat Undangan Baru</h3>
          <p className="text-xs text-slate-500 mt-1">Mulai buat undangan pernikahan digital</p>
        </Link>
        <Link href="/dashboard/guests" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#C8A882] hover:shadow-sm transition-all group">
          <Users className="w-8 h-8 text-[#C8A882] mb-3" />
          <h3 className="font-semibold text-slate-800 group-hover:text-[#C8A882] transition-colors">Kelola Tamu</h3>
          <p className="text-xs text-slate-500 mt-1">Tambah dan kelola daftar tamu undangan</p>
        </Link>
        <Link href="/dashboard/rsvp" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#C8A882] hover:shadow-sm transition-all group">
          <Eye className="w-8 h-8 text-[#C8A882] mb-3" />
          <h3 className="font-semibold text-slate-800 group-hover:text-[#C8A882] transition-colors">Lihat RSVP</h3>
          <p className="text-xs text-slate-500 mt-1">Monitor konfirmasi kehadiran tamu</p>
        </Link>
      </div>
    </div>
  )
}
