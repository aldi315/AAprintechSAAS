/**
 * INFRASTRUCTURE LAYER — Tenant-Scoped Repository Base Class
 *
 * Semua repository yang membutuhkan tenant isolation harus extends class ini.
 * Base class menyediakan:
 * - `this.db` → tenant-scoped Prisma client (auto-inject tenantId)
 * - `this.tenantId` → current tenant ID
 * - `this.isSuperAdmin` → apakah user adalah SUPER_ADMIN
 *
 * USAGE:
 * class WeddingRepository extends TenantScopedRepository {
 *   async findAll() {
 *     return this.db.wedding.findMany() // otomatis { where: { tenantId } }
 *   }
 * }
 *
 * const repo = new WeddingRepository(tenantId)
 * const weddings = await repo.findAll()
 */
import { createTenantPrisma, type TenantPrismaClient } from '@/infrastructure/database/tenant-prisma'
import { prisma } from '@/lib/prisma'
import type { TenantContext } from '@/lib/tenant-context'

export abstract class TenantScopedRepository {
  protected readonly db: TenantPrismaClient
  protected readonly tenantId: string
  protected readonly isSuperAdmin: boolean

  constructor(context: TenantContext) {
    this.tenantId = context.tenantId
    this.isSuperAdmin = context.isSuperAdmin
    // SUPER_ADMIN mendapat tenant-scoped client yang diarahkan ke tenant tertentu
    // (SUPER_ADMIN bypass terjadi di level guard, bukan di repository)
    this.db = createTenantPrisma(context.tenantId)
  }
}

/**
 * Repository untuk SUPER_ADMIN yang tidak memerlukan tenant isolation.
 * Gunakan ini hanya di admin panel — BUKAN di tenant dashboard.
 */
export abstract class AdminRepository {
  /** Base Prisma — tidak ada tenant isolation, hanya soft-delete extension */
  protected readonly db = prisma
}
