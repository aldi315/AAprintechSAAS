import { prisma } from '@/lib/prisma'

export interface MediaListItem {
  id: string
  fileUrl: string
  fileType: string
  size: number
  weddingId: string | null
  createdAt: string
}

export async function getMediaByReseller(
  resellerId: string,
  page = 1,
  perPage = 20
): Promise<{ items: MediaListItem[]; total: number; totalPages: number }> {
  const skip = (page - 1) * perPage

  const [media, total] = await Promise.all([
    (prisma as any).media.findMany({
      where: { resellerId },
      skip,
      take: perPage,
      orderBy: { createdAt: 'desc' },
    }),
    (prisma as any).media.count({ where: { resellerId } }),
  ])

  return {
    items: media.map((m: any) => ({
      id: m.id,
      fileUrl: m.fileUrl,
      fileType: m.fileType,
      size: m.size,
      weddingId: m.weddingId,
      createdAt: m.createdAt.toISOString(),
    })),
    total,
    totalPages: Math.ceil(total / perPage),
  }
}
