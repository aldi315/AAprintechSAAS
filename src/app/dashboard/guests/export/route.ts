import { NextResponse } from 'next/server'
import { requireTenant } from '@/lib/tenant-guard'
import { getGuestsByTenant } from '@/application/queries/guest.queries'

export async function GET(request: Request) {
  try {
    const ctx = await requireTenant()
    const { searchParams } = new URL(request.url)
    const weddingId = searchParams.get('weddingId') ?? undefined

    // Fetch all guests (limit 1000 for export)
    const { items } = await getGuestsByTenant(ctx.tenantId, 1, 1000, '', weddingId)

    // Generate CSV
    const header = ['Nama Tamu', 'Kode', 'Telepon', 'Status Kehadiran', 'URL Undangan']
    const csvContent = [
      header.join(','),
      ...items.map(g => [
        `"${g.guestName.replace(/"/g, '""')}"`,
        g.guestCode,
        g.phone ?? '',
        g.attendanceStatus,
        g.invitationUrl
      ].join(','))
    ].join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="guests_export_${Date.now()}.csv"`
      },
    })
  } catch (error) {
    console.error('CSV Export Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
