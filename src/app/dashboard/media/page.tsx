import { requireTenant } from '@/lib/tenant-guard'
import { getWeddingsByTenant } from '@/application/queries/wedding.queries'
import { getMediaByTenant } from '@/application/queries/media.queries'
import { MediaUploader } from './MediaUploader'
import { MediaGrid } from './MediaGrid'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function MediaLibraryPage({ searchParams }: PageProps) {
  const ctx = await requireTenant()
  const sp = await searchParams
  const page = Number(sp.page) || 1

  const [weddingsData, mediaData] = await Promise.all([
    getWeddingsByTenant(ctx.tenantId, 1, 100),
    getMediaByTenant(ctx.tenantId, page, 20)
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Media Library</h1>
        <p className="text-sm text-slate-500 mt-1">Upload dan kelola foto untuk galeri undangan.</p>
      </div>

      {/* Uploader Section */}
      <MediaUploader weddings={weddingsData.items.map(w => ({ id: w.id, label: `${w.brideName} & ${w.groomName} (/${w.slug})` }))} />

      {/* Media Grid Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Media Terunggah</h3>
          <p className="text-xs text-slate-500">{mediaData.total} file</p>
        </div>
        
        <MediaGrid media={mediaData.items} />

        {/* Pagination */}
        {mediaData.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border border-slate-200 rounded-lg">
            <p className="text-xs text-slate-500">Halaman {page} dari {mediaData.totalPages}</p>
            <div className="flex gap-1">
              {page > 1 && <Link href={`/dashboard/media?page=${page - 1}`} className="px-3 py-1 text-xs rounded border border-slate-200 hover:bg-slate-50">Prev</Link>}
              {page < mediaData.totalPages && <Link href={`/dashboard/media?page=${page + 1}`} className="px-3 py-1 text-xs rounded border border-slate-200 hover:bg-slate-50">Next</Link>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
