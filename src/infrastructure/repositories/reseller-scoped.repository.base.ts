/**
 * INFRASTRUCTURE LAYER — Reseller-Scoped Repository Base Class
 *
 * Semua repository yang membutuhkan reseller isolation harus extends class ini.
 */
import { createResellerPrisma, type ResellerPrismaClient } from '@/infrastructure/database/reseller-prisma'
import { prisma } from '@/lib/prisma'
import type { ResellerContext } from '@/lib/reseller-context'

export abstract class ResellerScopedRepository {
  protected readonly db: ResellerPrismaClient
  protected readonly resellerId: string
  protected readonly isSuperAdmin: boolean

  constructor(context: ResellerContext) {
    this.resellerId = context.resellerId
    this.isSuperAdmin = context.isSuperAdmin
    this.db = createResellerPrisma(context.resellerId)
  }
}

/**
 * Repository untuk SUPER_ADMIN yang tidak memerlukan reseller isolation.
 */
export abstract class AdminRepository {
  protected readonly db = prisma
}
