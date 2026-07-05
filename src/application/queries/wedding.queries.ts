/**
 * APPLICATION QUERIES — Wedding Queries (reseller-scoped)
 */
import { prisma } from '@/lib/prisma'

export interface WeddingListItem {
  id: string
  slug: string
  brideName: string
  groomName: string
  status: string
  viewCount: number
  eventsCount: number
  guestsCount: number
  templateName: string
  createdAt: string
  updatedAt: string
}

export interface WeddingDetail {
  id: string
  slug: string
  brideName: string
  groomName: string
  status: string
  timezone: string
  coverImage: string | null
  musicUrl: string | null
  location: string | null
  mapsUrl: string | null
  metaTitle: string | null
  metaDescription: string | null
  ogImage: string | null
  gallery: unknown[]
  templateId: string
  template: { id: string; name: string }
  events: Array<{
    id: string
    name: string
    startTime: string
    endTime: string | null
    location: string | null
    mapsUrl: string | null
    dresscode: string | null
    note: string | null
  }>
}

export async function getWeddingsByReseller(
  resellerId: string,
  page = 1,
  perPage = 10,
  search = '',
): Promise<{ items: WeddingListItem[]; total: number; totalPages: number }> {
  const skip = (page - 1) * perPage
  const where: any = {
    resellerId,
    ...(search ? {
      OR: [
        { brideName: { contains: search, mode: 'insensitive' } },
        { groomName: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ],
    } : {}),
  }

  const [weddings, total] = await Promise.all([
    (prisma as any).wedding.findMany({
      where,
      skip,
      take: perPage,
      orderBy: { createdAt: 'desc' },
      include: {
        template: { select: { name: true } },
        _count: { select: { events: true, guests: true } },
      },
    }),
    (prisma as any).wedding.count({ where }),
  ])

  return {
    items: weddings.map((w: any) => ({
      id: w.id,
      slug: w.slug,
      brideName: w.brideName,
      groomName: w.groomName,
      status: w.status,
      viewCount: w.viewCount,
      eventsCount: w._count.events,
      guestsCount: w._count.guests,
      templateName: w.template?.name ?? '-',
      createdAt: w.createdAt.toISOString(),
      updatedAt: w.updatedAt.toISOString(),
    })),
    total,
    totalPages: Math.ceil(total / perPage),
  }
}

export async function getWeddingById(resellerId: string, weddingId: string): Promise<WeddingDetail | null> {
  const w = await (prisma as any).wedding.findFirst({
    where: { id: weddingId, resellerId },
    include: {
      template: { select: { id: true, name: true } },
      events: { orderBy: { startTime: 'asc' } },
    },
  })
  if (!w) return null

  return {
    id: w.id,
    slug: w.slug,
    brideName: w.brideName,
    groomName: w.groomName,
    status: w.status,
    timezone: w.timezone,
    coverImage: w.coverImage,
    musicUrl: w.musicUrl,
    location: w.location,
    mapsUrl: w.mapsUrl,
    metaTitle: w.metaTitle,
    metaDescription: w.metaDescription,
    ogImage: w.ogImage,
    gallery: Array.isArray(w.gallery) ? w.gallery : [],
    templateId: w.templateId,
    template: w.template,
    events: w.events.map((e: any) => ({
      id: e.id,
      name: e.name,
      startTime: e.startTime.toISOString(),
      endTime: e.endTime?.toISOString() ?? null,
      location: e.location,
      mapsUrl: e.mapsUrl,
      dresscode: e.dresscode,
      note: e.note,
    })),
  }
}

export async function getTemplateOptions() {
  return (prisma as any).template.findMany({
    select: { id: true, name: true, category: true, price: true },
    orderBy: { name: 'asc' },
  })
}
