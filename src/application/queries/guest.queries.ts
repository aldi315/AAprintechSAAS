/**
 * APPLICATION QUERIES — Guest & RSVP Queries (tenant-scoped)
 */
import { prisma } from '@/lib/prisma'

export interface GuestListItem {
  id: string
  guestName: string
  guestCode: string
  phone: string | null
  attendanceStatus: string
  weddingSlug: string
  invitationUrl: string
}

export interface RsvpListItem {
  id: string
  guestName: string
  attendance: string
  totalGuest: number
  message: string
  weddingTitle: string
  weddingSlug: string
  createdAt: string
  updatedAt: string
}

export interface RsvpStats {
  total: number
  attending: number
  notAttending: number
  maybe: number
  totalExpectedGuests: number
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export async function getGuestsByTenant(
  tenantId: string,
  page = 1,
  perPage = 20,
  search = '',
  weddingId?: string,
): Promise<{ items: GuestListItem[]; total: number; totalPages: number }> {
  const skip = (page - 1) * perPage
  const where: any = {
    wedding: { tenantId },
    ...(weddingId ? { weddingId } : {}),
    ...(search ? {
      OR: [
        { guestName: { contains: search, mode: 'insensitive' } },
        { guestCode: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ],
    } : {}),
  }

  const [guests, total] = await Promise.all([
    (prisma as any).invitationGuest.findMany({
      where,
      skip,
      take: perPage,
      orderBy: { createdAt: 'desc' },
      include: { wedding: { select: { slug: true } } },
    }),
    (prisma as any).invitationGuest.count({ where }),
  ])

  return {
    items: guests.map((g: any) => ({
      id: g.id,
      guestName: g.guestName,
      guestCode: g.guestCode,
      phone: g.phone,
      attendanceStatus: g.attendanceStatus,
      weddingSlug: g.wedding?.slug ?? '',
      invitationUrl: `${BASE_URL}/${g.wedding?.slug ?? ''}?to=${encodeURIComponent(g.guestName)}&code=${g.guestCode}`,
    })),
    total,
    totalPages: Math.ceil(total / perPage),
  }
}

export async function getRsvpsByTenant(
  tenantId: string,
  filter: 'ALL' | 'ATTENDING' | 'NOT_ATTENDING' | 'MAYBE' = 'ALL',
  page = 1,
  perPage = 20,
  search = '',
): Promise<{ items: RsvpListItem[]; total: number; totalPages: number; stats: RsvpStats }> {
  const skip = (page - 1) * perPage
  const where: any = {
    wedding: { tenantId },
    ...(filter !== 'ALL' ? { attendance: filter } : {}),
    ...(search ? { guest: { guestName: { contains: search, mode: 'insensitive' } } } : {}),
  }

  const [rsvps, total, allRsvps] = await Promise.all([
    (prisma as any).rSVP.findMany({
      where,
      skip,
      take: perPage,
      orderBy: { createdAt: 'desc' },
      include: {
        guest: { select: { guestName: true } },
        wedding: { select: { slug: true, brideName: true, groomName: true } },
      },
    }),
    (prisma as any).rSVP.count({ where }),
    (prisma as any).rSVP.findMany({
      where: { wedding: { tenantId } },
      select: { attendance: true, totalGuest: true },
    }),
  ])

  const stats: RsvpStats = {
    total: allRsvps.length,
    attending: allRsvps.filter((r: any) => r.attendance === 'ATTENDING').length,
    notAttending: allRsvps.filter((r: any) => r.attendance === 'NOT_ATTENDING').length,
    maybe: allRsvps.filter((r: any) => r.attendance === 'MAYBE').length,
    totalExpectedGuests: allRsvps
      .filter((r: any) => r.attendance === 'ATTENDING')
      .reduce((sum: number, r: any) => sum + (r.totalGuest ?? 1), 0),
  }

  return {
    items: rsvps.map((r: any) => ({
      id: r.id,
      guestName: r.guest?.guestName ?? 'Tamu',
      attendance: r.attendance,
      totalGuest: r.totalGuest,
      message: r.message ?? '',
      weddingTitle: `${r.wedding?.brideName ?? ''} & ${r.wedding?.groomName ?? ''}`,
      weddingSlug: r.wedding?.slug ?? '',
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    })),
    total,
    totalPages: Math.ceil(total / perPage),
    stats,
  }
}
