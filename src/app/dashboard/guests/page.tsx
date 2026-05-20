import { requireTenant } from '@/lib/tenant-guard'
import { getGuestsByTenant } from '@/application/queries/guest.queries'
import { getWeddingsByTenant } from '@/application/queries/wedding.queries'
import { Card } from '@/presentation/dashboard/components/ui/Card'
import { StatusBadge } from '@/presentation/dashboard/components/ui/Badge'
import { EmptyState } from '@/presentation/dashboard/components/ui/EmptyState'
import { Users, Plus, Copy, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { GuestCopyUrl } from './GuestCopyUrl'

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; weddingId?: string }>
}

export default async function GuestsPage({ searchParams }: PageProps) {
  const ctx = await requireTenant()
  const sp = await searchParams
  const page = Number(sp.page) || 1
  const search = sp.search ?? ''
  const weddingId = sp.weddingId

  const { items, total, totalPages } = await getGuestsByTenant(ctx.tenantId, page, 20, search, weddingId)
  const { items: weddings } = await getWeddingsByTenant(ctx.tenantId, 1, 100)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Daftar Tamu</h1>
          <p className="text-sm text-slate-500 mt-1">{total} tamu total</p>
        </div>
        <Link
          href="/dashboard/guests/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8A882] text-white rounded-lg text-sm font-medium hover:bg-[#b89872] transition-colors"
        >
          <Plus className="w-4 h-4" /> Tambah Tamu
        </Link>
      </div>

      {items.length === 0 ? (
        <Card>
          <EmptyState
            icon={Users}
            title="Belum ada tamu"
            description="Tambahkan tamu untuk membagikan undangan."
            action={
              <Link href="/dashboard/guests/new" className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8A882] text-white rounded-lg text-sm font-medium hover:bg-[#b89872]">
                <Plus className="w-4 h-4" /> Tambah Tamu
              </Link>
            }
          />
        </Card>
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left font-medium text-slate-500 px-6 py-3">Nama Tamu</th>
                  <th className="text-left font-medium text-slate-500 px-6 py-3">Kode</th>
                  <th className="text-left font-medium text-slate-500 px-6 py-3">Telepon</th>
                  <th className="text-left font-medium text-slate-500 px-6 py-3">Status</th>
                  <th className="text-left font-medium text-slate-500 px-6 py-3">Undangan</th>
                  <th className="text-right font-medium text-slate-500 px-6 py-3">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-800">{g.guestName}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{g.guestCode}</td>
                    <td className="px-6 py-4 text-slate-600 text-xs">{g.phone ?? '-'}</td>
                    <td className="px-6 py-4"><StatusBadge status={g.attendanceStatus} /></td>
                    <td className="px-6 py-4 text-slate-600 text-xs">/{g.weddingSlug}</td>
                    <td className="px-6 py-4 text-right">
                      <GuestCopyUrl url={g.invitationUrl} />
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
                {page > 1 && <Link href={`/dashboard/guests?page=${page - 1}`} className="px-3 py-1 text-xs rounded border border-slate-200 hover:bg-slate-50">Prev</Link>}
                {page < totalPages && <Link href={`/dashboard/guests?page=${page + 1}`} className="px-3 py-1 text-xs rounded border border-slate-200 hover:bg-slate-50">Next</Link>}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
