import { requireReseller } from '@/lib/reseller-guard'
import { getWeddingsByReseller } from '@/application/queries/wedding.queries'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/presentation/dashboard/components/ui/Badge'
import { EmptyState } from '@/presentation/dashboard/components/ui/EmptyState'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Heart, Plus, Eye, Pencil, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { togglePublishAction, deleteWeddingAction } from './_actions/wedding.actions'
import { WeddingActions } from './WeddingActions'

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>
}

export default async function WeddingsPage({ searchParams }: PageProps) {
  const ctx = await requireReseller()
  const sp = await searchParams
  const page = Number(sp.page) || 1
  const search = sp.search ?? ''
  const { items, total, totalPages } = await getWeddingsByReseller(ctx.resellerId, page, 10, search)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Weddings</h1>
          <p className="text-sm text-muted-foreground mt-1">{total} undangan total</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/weddings/new">
            <Plus className="w-4 h-4 mr-2" /> Buat Baru
          </Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              icon={Heart}
              title="Belum ada undangan"
              description="Mulai buat undangan pernikahan digital pertama Anda."
              action={
                <Button asChild>
                  <Link href="/dashboard/weddings/new">
                    <Plus className="w-4 h-4 mr-2" /> Buat Undangan
                  </Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pasangan</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Template</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((w) => (
                <TableRow key={w.id}>
                  <TableCell>
                    <p className="font-medium">{w.brideName} & {w.groomName}</p>
                    <p className="text-xs text-muted-foreground">{w.eventsCount} acara · {w.guestsCount} tamu</p>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">/{w.slug}</TableCell>
                  <TableCell><StatusBadge status={w.status} /></TableCell>
                  <TableCell className="text-muted-foreground">{w.viewCount}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{w.templateName}</TableCell>
                  <TableCell className="text-right">
                    <WeddingActions weddingId={w.id} slug={w.slug} status={w.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-border">
              <p className="text-xs text-muted-foreground">Halaman {page} dari {totalPages}</p>
              <div className="flex gap-2">
                {page > 1 && <Button variant="outline" size="sm" asChild><Link href={`/dashboard/weddings?page=${page - 1}`}>Prev</Link></Button>}
                {page < totalPages && <Button variant="outline" size="sm" asChild><Link href={`/dashboard/weddings?page=${page + 1}`}>Next</Link></Button>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
