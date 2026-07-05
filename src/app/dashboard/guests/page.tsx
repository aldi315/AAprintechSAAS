import { requireReseller } from '@/lib/reseller-guard'
import { getGuestsByReseller } from '@/application/queries/guest.queries'
import { getWeddingsByReseller } from '@/application/queries/wedding.queries'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/presentation/dashboard/components/ui/Badge'
import { EmptyState } from '@/presentation/dashboard/components/ui/EmptyState'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Users, Plus, Copy, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { GuestCopyUrl } from './GuestCopyUrl'

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; weddingId?: string }>
}

export default async function GuestsPage({ searchParams }: PageProps) {
  const ctx = await requireReseller()
  const sp = await searchParams
  const page = Number(sp.page) || 1
  const search = sp.search ?? ''
  const weddingId = sp.weddingId

  const { items, total, totalPages } = await getGuestsByReseller(ctx.resellerId, page, 20, search, weddingId)
  const { items: weddings } = await getWeddingsByReseller(ctx.resellerId, 1, 100)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Daftar Tamu</h1>
          <p className="text-sm text-muted-foreground mt-1">{total} tamu total</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/guests/new">
            <Plus className="w-4 h-4 mr-2" /> Tambah Tamu
          </Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              icon={Users}
              title="Belum ada tamu"
              description="Tambahkan tamu untuk membagikan undangan."
              action={
                <Button asChild>
                  <Link href="/dashboard/guests/new">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Tamu
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
                <TableHead>Nama Tamu</TableHead>
                <TableHead>Kode</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Undangan</TableHead>
                <TableHead className="text-right">Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((g) => (
                <TableRow key={g.id}>
                  <TableCell className="font-medium">{g.guestName}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{g.guestCode}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{g.phone ?? '-'}</TableCell>
                  <TableCell><StatusBadge status={g.attendanceStatus} /></TableCell>
                  <TableCell className="text-muted-foreground text-xs">/{g.weddingSlug}</TableCell>
                  <TableCell className="text-right">
                    <GuestCopyUrl url={g.invitationUrl} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-border">
              <p className="text-xs text-muted-foreground">Halaman {page} dari {totalPages}</p>
              <div className="flex gap-2">
                {page > 1 && <Button variant="outline" size="sm" asChild><Link href={`/dashboard/guests?page=${page - 1}`}>Prev</Link></Button>}
                {page < totalPages && <Button variant="outline" size="sm" asChild><Link href={`/dashboard/guests?page=${page + 1}`}>Next</Link></Button>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
