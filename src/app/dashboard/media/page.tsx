import { requireReseller } from '@/lib/reseller-guard'
import { getWeddingsByReseller } from '@/application/queries/wedding.queries'
import { getMediaByReseller } from '@/application/queries/media.queries'
import { MediaUploader } from './MediaUploader'
import { MediaGrid } from './MediaGrid'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function MediaLibraryPage({ searchParams }: PageProps) {
  const ctx = await requireReseller()
  const sp = await searchParams
  const page = Number(sp.page) || 1

  const [weddingsData, mediaData] = await Promise.all([
    getWeddingsByReseller(ctx.resellerId, 1, 100),
    getMediaByReseller(ctx.resellerId, page, 20)
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
        <p className="text-sm text-muted-foreground mt-1">Upload dan kelola foto untuk galeri undangan.</p>
      </div>

      {/* Uploader Section */}
      <MediaUploader weddings={weddingsData.items.map(w => ({ id: w.id, label: `${w.brideName} & ${w.groomName} (/${w.slug})` }))} />

      {/* Media Grid Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Media Terunggah</h3>
          <p className="text-xs text-slate-500">{mediaData.total} file</p>
        </div>
        
        <MediaGrid initialMedia={mediaData.items} />

        {/* Pagination */}
        {mediaData.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 px-4 py-3 bg-card border border-border rounded-lg shadow-sm">
            <p className="text-xs text-muted-foreground">Halaman {page} dari {mediaData.totalPages}</p>
            <div className="flex gap-2">
              {page > 1 && <Button variant="outline" size="sm" asChild><Link href={`/dashboard/media?page=${page - 1}`}>Prev</Link></Button>}
              {page < mediaData.totalPages && <Button variant="outline" size="sm" asChild><Link href={`/dashboard/media?page=${page + 1}`}>Next</Link></Button>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
