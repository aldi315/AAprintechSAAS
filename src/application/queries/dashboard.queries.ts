/**
 * APPLICATION QUERIES — Dashboard Stats
 * Server-side query functions untuk dashboard overview.
 * Gunakan prisma base (bukan tenant-scoped) untuk SUPER_ADMIN flexibility.
 */
import { prisma } from '@/lib/prisma'

export interface DashboardStats {
  totalWeddings: number
  publishedWeddings: number
  totalGuests: number
  totalRsvp: number
  attendingCount: number
  attendancePercentage: number
}

export interface RecentRsvp {
  id: string
  guestName: string
  attendance: string
  weddingTitle: string
  weddingSlug: string
  createdAt: string
}

export async function getDashboardStats(tenantId: string): Promise<DashboardStats> {
  const [weddings, guests, rsvps] = await Promise.all([
    (prisma as any).wedding.findMany({
      where: { tenantId },
      select: { id: true, status: true },
    }),
    (prisma as any).invitationGuest.findMany({
      where: { wedding: { tenantId } },
      select: { id: true },
    }),
    (prisma as any).rSVP.findMany({
      where: { wedding: { tenantId } },
      select: { id: true, attendance: true },
    }),
  ])

  const publishedWeddings = weddings.filter((w: any) => w.status === 'PUBLISHED').length
  const attendingCount = rsvps.filter((r: any) => r.attendance === 'ATTENDING').length
  const attendancePercentage = rsvps.length > 0
    ? Math.round((attendingCount / rsvps.length) * 100)
    : 0

  return {
    totalWeddings: weddings.length,
    publishedWeddings,
    totalGuests: guests.length,
    totalRsvp: rsvps.length,
    attendingCount,
    attendancePercentage,
  }
}

export async function getRecentRsvps(tenantId: string, limit = 5): Promise<RecentRsvp[]> {
  const rsvps = await (prisma as any).rSVP.findMany({
    where: { wedding: { tenantId } },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      guest: { select: { guestName: true } },
      wedding: { select: { slug: true, brideName: true, groomName: true } },
    },
  })

  return rsvps.map((r: any) => ({
    id: r.id,
    guestName: r.guest?.guestName ?? 'Tamu',
    attendance: r.attendance,
    weddingTitle: `${r.wedding?.brideName ?? ''} & ${r.wedding?.groomName ?? ''}`,
    weddingSlug: r.wedding?.slug ?? '',
    createdAt: r.createdAt.toISOString(),
  }))
}

export async function getSystemStats() {
  const [tenantCount, weddingCount, rsvpCount] = await Promise.all([
    (prisma as any).tenant.count(),
    (prisma as any).wedding.count(),
    (prisma as any).rSVP.count(),
  ])
  return { tenantCount, weddingCount, rsvpCount }
}
