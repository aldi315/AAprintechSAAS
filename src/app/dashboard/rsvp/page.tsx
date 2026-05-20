import { requireTenant } from '@/lib/tenant-guard'
import { getRsvpsByTenant } from '@/application/queries/guest.queries'
import { Card, CardHeader, CardTitle } from '@/presentation/dashboard/components/ui/Card'
import { StatCard } from '@/presentation/dashboard/components/ui/StatCard'
import { StatusBadge } from '@/presentation/dashboard/components/ui/Badge'
import { EmptyState } from '@/presentation/dashboard/components/ui/EmptyState'
import { ClipboardCheck, UserCheck, UserX, HelpCircle, Users } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ page?: string; filter?: string; search?: string }>
}

export default async function RsvpPage({ searchParams }: PageProps) {
  const ctx = await requireTenant()
  const sp = await searchParams
  const page = Number(sp.page) || 1
  const filter = (sp.filter ?? 'ALL') as 'ALL' | 'ATTENDING' | 'NOT_ATTENDING' | 'MAYBE'
  const search = sp.search ?? ''

  const { items, total, totalPages, stats } = await getRsvpsByTenant(ctx.tenantId, filter, page, 20, search)

  const filters = [
    { key: 'ALL', label: 'Semua' },
    { key: 'ATTENDING', label: 'Hadir' },
    { key: 'NOT_ATTENDING', label: 'Tidak Hadir' },
    { key: 'MAYBE', label: 'Mungkin' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">RSVP</h1>
        <p className="text-sm text-slate-500 mt-1">Monitor konfirmasi kehadiran tamu.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total RSVP" value={stats.total} icon={ClipboardCheck} />
        <StatCard title="Hadir" value={stats.attending} icon={UserCheck} description={`${stats.totalExpectedGuests} total tamu`} />
        <StatCard title="Tidak Hadir" value={stats.notAttending} icon={UserX} />
        <StatCard title="Mungkin" value={stats.maybe} icon={HelpCircle} />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
        {filters.map((f) => (
          <Link
            key={f.key}
            href={`/dashboard/rsvp?filter=${f.key}`}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
              filter === f.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <Card>
          <EmptyState icon={ClipboardCheck} title="Belum ada RSVP" description="Tamu belum mengisi konfirmasi kehadiran." />
        </Card>
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left font-medium text-slate-500 px-6 py-3">Nama Tamu</th>
                  <th className="text-left font-medium text-slate-500 px-6 py-3">Status</th>
                  <th className="text-left font-medium text-slate-500 px-6 py-3">Jumlah</th>
                  <th className="text-left font-medium text-slate-500 px-6 py-3">Undangan</th>
                  <th className="text-left font-medium text-slate-500 px-6 py-3">Pesan</th>
                  <th className="text-left font-medium text-slate-500 px-6 py-3">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-800">{r.guestName}</td>
                    <td className="px-6 py-4"><StatusBadge status={r.attendance} /></td>
                    <td className="px-6 py-4 text-slate-600">{r.totalGuest} orang</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{r.weddingTitle}</td>
                    <td className="px-6 py-4 text-xs text-slate-500 max-w-[200px] truncate">{r.message || '-'}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100">
              <p className="text-xs text-slate-500">Halaman {page} dari {totalPages}</p>
              <div className="flex gap-1">
                {page > 1 && <Link href={`/dashboard/rsvp?filter=${filter}&page=${page - 1}`} className="px-3 py-1 text-xs rounded border border-slate-200 hover:bg-slate-50">Prev</Link>}
                {page < totalPages && <Link href={`/dashboard/rsvp?filter=${filter}&page=${page + 1}`} className="px-3 py-1 text-xs rounded border border-slate-200 hover:bg-slate-50">Next</Link>}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
