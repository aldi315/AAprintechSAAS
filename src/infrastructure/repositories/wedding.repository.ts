/**
 * INFRASTRUCTURE LAYER — Wedding Repository (Reseller-Scoped)
 *
 * Contoh implementasi konkret dari ResellerScopedRepository.
 * Semua query otomatis memfilter berdasarkan resellerId.
 *
 * USAGE:
 * // Dalam Server Component / Server Action:
 * const ctx = await requireReseller()
 * const repo = new WeddingRepository(ctx)
 * const weddings = await repo.findAll()  // otomatis { where: { resellerId: ctx.resellerId } }
 */
import { ResellerScopedRepository } from '@/infrastructure/repositories/reseller-scoped.repository.base'
import type { ResellerContext } from '@/lib/reseller-context'
import type { WeddingStatus } from '@prisma/client'

export class WeddingRepository extends ResellerScopedRepository {
  constructor(ctx: ResellerContext) {
    super(ctx)
  }

  /**
   * Ambil semua wedding milik reseller ini (dengan soft-delete otomatis).
   * resellerId di-inject otomatis oleh ResellerScopedRepository.
   */
  async findAll(opts?: { status?: WeddingStatus; page?: number; limit?: number }) {
    const take = opts?.limit ?? 20
    const skip = ((opts?.page ?? 1) - 1) * take

    return this.db.wedding.findMany({
      where: opts?.status ? { status: opts.status } : undefined,
      include: { events: true, template: { select: { name: true, previewImage: true } } },
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    })
  }

  /**
   * Ambil satu wedding berdasarkan slug.
   * Jika slug bukan milik reseller ini, extension akan return null (tidak throw).
   */
  async findBySlug(slug: string) {
    return this.db.wedding.findFirst({
      where: { slug },
      include: {
        events: { orderBy: { startTime: 'asc' } },
        template: true,
        guests: { select: { id: true, guestName: true, attendanceStatus: true } },
      },
    })
  }

  async findById(id: string) {
    return this.db.wedding.findFirst({
      where: { id },
      include: { events: true, template: true },
    })
  }

  async create(data: {
    slug: string
    brideName: string
    groomName: string
    templateId: string
    timezone?: string
  }) {
    // resellerId di-inject otomatis oleh ResellerIsolation extension
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.db.wedding.create({ data: data as any })
  }

  async update(id: string, data: Partial<{
    slug: string
    brideName: string
    groomName: string
    status: WeddingStatus
    metaTitle: string
    metaDescription: string
    ogImage: string
    coverImage: string
    musicUrl: string
    location: string
    mapsUrl: string
  }>) {
    // resellerId di-inject ke WHERE oleh extension — tidak bisa update wedding reseller lain
    return this.db.wedding.update({ where: { id }, data })
  }

  async softDelete(id: string) {
    return this.db.wedding.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }

  async incrementViewCount(id: string) {
    return this.db.wedding.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    })
  }

  async count(opts?: { status?: WeddingStatus }) {
    return this.db.wedding.count({
      where: opts?.status ? { status: opts.status } : undefined,
    })
  }
}

