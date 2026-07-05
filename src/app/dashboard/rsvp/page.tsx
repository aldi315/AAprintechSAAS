import { requireReseller } from '@/lib/reseller-guard'
import { getRsvpsByReseller } from '@/application/queries/guest.queries'
import { Card, CardContent } from '@/components/ui/card'
import { StatCard } from '@/presentation/dashboard/components/ui/StatCard'
import { StatusBadge } from '@/presentation/dashboard/components/ui/Badge'
import { EmptyState } from '@/presentation/dashboard/components/ui/EmptyState'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ClipboardCheck, UserCheck, UserX, HelpCircle, Users } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ page?: string; filter?: string; search?: string }>
}

export default async function RsvpPage({ searchParams }: PageProps) {
  const ctx = await requireReseller()
  const sp = await searchParams
  const page = Number(sp.page) || 1
  const filter = (sp.filter ?? 'ALL') as 'ALL' | 'ATTENDING' | 'NOT_ATTENDING' | 'MAYBE'
  const search = sp.search ?? ''

  const { items, total, totalPages, stats } = await getRsvpsByReseller(ctx.resellerId, filter, page, 20, search)

  const filters = [
    { key: 'ALL', label: 'Semua' },
    { key: 'ATTENDING', label: 'Hadir' },
    { key: 'NOT_ATTENDING', label: 'Tidak Hadir' },
    { key: 'MAYBE', label: 'Mungkin' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">RSVP</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor konfirmasi kehadiran tamu.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total RSVP" value={stats.total} icon={ClipboardCheck} />
        <StatCard title="Hadir" value={stats.attending} icon={UserCheck} description={`${stats.totalExpectedGuests} total tamu`} />
        <StatCard title="Tidak Hadir" value={stats.notAttending} icon={UserX} />
        <StatCard title="Mungkin" value={stats.maybe} icon={HelpCircle} />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {filters.map((f) => (
          <Link
            key={f.key}
            href={`/dashboard/rsvp?filter=${f.key}`}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
              filter === f.key ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState icon={ClipboardCheck} title="Belum ada RSVP" description="Tamu belum mengisi konfirmasi kehadiran." />
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Tamu</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Undangan</TableHead>
                <TableHead>Pesan</TableHead>
                <TableHead>Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.guestName}</TableCell>
                  <TableCell><StatusBadge status={r.attendance} /></TableCell>
                  <TableCell className="text-muted-foreground">{r.totalGuest} orang</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{r.weddingTitle}</TableCell>
                  <TableCell className="text-muted-foreground text-xs max-w-[200px] truncate">{r.message || '-'}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-border">
              <p className="text-xs text-muted-foreground">Halaman {page} dari {totalPages}</p>
              <div className="flex gap-2">
                {page > 1 && <Button variant="outline" size="sm" asChild><Link href={`/dashboard/rsvp?filter=${filter}&page=${page - 1}`}>Prev</Link></Button>}
                {page < totalPages && <Button variant="outline" size="sm" asChild><Link href={`/dashboard/rsvp?filter=${filter}&page=${page + 1}`}>Next</Link></Button>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
