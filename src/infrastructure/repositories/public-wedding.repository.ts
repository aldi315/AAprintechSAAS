/**
 * INFRASTRUCTURE LAYER — Public Wedding Repository
 *
 * Query wedding untuk public route /[slug].
 * TIDAK menggunakan tenant scope — ini adalah public endpoint.
 * HANYA mengembalikan wedding dengan status PUBLISHED.
 *
 * Security:
 * - status = PUBLISHED (wajib)
 * - deletedAt = null (via soft-delete extension)
 * - Tidak membocorkan reseller internal data
 */
import { prisma } from '@/lib/prisma'
import type { WeddingWithIncludes } from '@/application/mappers/invitation-render.mapper'

export class PublicWeddingRepository {
  /**
   * Ambil published wedding berdasarkan slug.
   * Return null jika tidak ditemukan, unpublished, atau soft-deleted.
   */
  async findPublishedBySlug(slug: string): Promise<WeddingWithIncludes | null> {
    const wedding = await prisma.wedding.findFirst({
      where: {
        slug,
        status: 'PUBLISHED',
        // deletedAt: null otomatis dari soft-delete extension
      },
      include: {
        events: {
          orderBy: { startTime: 'asc' },
        },
        template: {
          select: {
            id: true,
            name: true,
            themeConfig: true,
          },
        },
        reseller: {
          select: {
            slug: true,
            businessName: true,
          },
        },
      },
    })

    return wedding as WeddingWithIncludes | null
  }

  /**
   * Ambil wedding berdasarkan slug tanpa mempedulikan status.
   * Berguna untuk preview draft jika user sedang login.
   */
  async findBySlug(slug: string): Promise<WeddingWithIncludes | null> {
    const wedding = await prisma.wedding.findFirst({
      where: {
        slug,
      },
      include: {
        events: {
          orderBy: { startTime: 'asc' },
        },
        template: {
          select: {
            id: true,
            name: true,
            themeConfig: true,
          },
        },
        reseller: {
          select: {
            slug: true,
            businessName: true,
          },
        },
      },
    })

    return wedding as WeddingWithIncludes | null
  }

  /**
   * Increment view counter — fire and forget, tidak perlu await.
   */
  async incrementViewCount(weddingId: string): Promise<void> {
    await prisma.wedding.update({
      where: { id: weddingId },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {
      // Ignore error — view count adalah best-effort
    })
  }
}

export const publicWeddingRepository = new PublicWeddingRepository()
