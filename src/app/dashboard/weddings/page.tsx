import { requireTenant } from '@/lib/tenant-guard'
import { getWeddingsByTenant } from '@/application/queries/wedding.queries'
import { Card } from '@/presentation/dashboard/components/ui/Card'
import { StatusBadge } from '@/presentation/dashboard/components/ui/Badge'
import { EmptyState } from '@/presentation/dashboard/components/ui/EmptyState'
import { Heart, Plus, Eye, Pencil, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { togglePublishAction, deleteWeddingAction } from './_actions/wedding.actions'
import { WeddingActions } from './WeddingActions'

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>
}

export default async function WeddingsPage({ searchParams }: PageProps) {
  const ctx = await requireTenant()
  const sp = await searchParams
  const page = Number(sp.page) || 1
  const search = sp.search ?? ''
  const { items, total, totalPages } = await getWeddingsByTenant(ctx.tenantId, page, 10, search)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Weddings</h1>
          <p className="text-sm text-slate-500 mt-1">{total} undangan total</p>
        </div>
        <Link
          href="/dashboard/weddings/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8A882] text-white rounded-lg text-sm font-medium hover:bg-[#b89872] transition-colors"
        >
          <Plus className="w-4 h-4" /> Buat Baru
        </Link>
      </div>

      {items.length === 0 ? (
        <Card>
          <EmptyState
            icon={Heart}
            title="Belum ada undangan"
            description="Mulai buat undangan pernikahan digital pertama Anda."
            action={
              <Link href="/dashboard/weddings/new" className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8A882] text-white rounded-lg text-sm font-medium hover:bg-[#b89872]">
                <Plus className="w-4 h-4" /> Buat Undangan
              </Link>
            }
          />
        </Card>
      ) : (
        <Card padding={false}>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left font-medium text-slate-500 px-6 py-3">Pasangan</th>
                  <th className="text-left font-medium text-slate-500 px-6 py-3">Slug</th>
                  <th className="text-left font-medium text-slate-500 px-6 py-3">Status</th>
                  <th className="text-left font-medium text-slate-500 px-6 py-3">Views</th>
                  <th className="text-left font-medium text-slate-500 px-6 py-3">Template</th>
                  <th className="text-right font-medium text-slate-500 px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{w.brideName} & {w.groomName}</p>
                      <p className="text-xs text-slate-400">{w.eventsCount} acara · {w.guestsCount} tamu</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">/{w.slug}</td>
                    <td className="px-6 py-4"><StatusBadge status={w.status} /></td>
                    <td className="px-6 py-4 text-slate-600">{w.viewCount}</td>
                    <td className="px-6 py-4 text-slate-600 text-xs">{w.templateName}</td>
                    <td className="px-6 py-4 text-right">
                      <WeddingActions weddingId={w.id} slug={w.slug} status={w.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100">
              <p className="text-xs text-slate-500">Halaman {page} dari {totalPages}</p>
              <div className="flex gap-1">
                {page > 1 && <Link href={`/dashboard/weddings?page=${page - 1}`} className="px-3 py-1 text-xs rounded border border-slate-200 hover:bg-slate-50">Prev</Link>}
                {page < totalPages && <Link href={`/dashboard/weddings?page=${page + 1}`} className="px-3 py-1 text-xs rounded border border-slate-200 hover:bg-slate-50">Next</Link>}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
