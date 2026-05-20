/**
 * SHARED LIB — Multi-tenant Query Helpers
 *
 * Utility functions untuk membangun WHERE clause yang aman
 * secara manual (saat tidak menggunakan tenant-scoped Prisma client).
 *
 * NOTE: Prioritaskan penggunaan createTenantPrisma() dan TenantScopedRepository.
 * Helper ini hanya untuk kasus edge (raw query, Prisma $queryRaw, dll).
 */
import type { TenantContext } from '@/lib/tenant-context'

// ─── WHERE clause builders ────────────────────────────────────────────────────

/**
 * Buat WHERE clause yang selalu menyertakan tenantId.
 *
 * @example
 * const where = withTenantFilter(ctx, { status: 'PUBLISHED' })
 * // Result: { tenantId: 'xxx', status: 'PUBLISHED' }
 */
export function withTenantFilter<T extends Record<string, unknown>>(
  ctx: TenantContext,
  additionalWhere?: T,
): { tenantId: string } & T {
  return {
    tenantId: ctx.tenantId,
    ...(additionalWhere ?? {}),
  } as { tenantId: string } & T
}

/**
 * Buat WHERE clause dengan tenantId + soft-delete filter.
 */
export function withTenantAndSoftDelete<T extends Record<string, unknown>>(
  ctx: TenantContext,
  additionalWhere?: T,
): { tenantId: string; deletedAt: null } & T {
  return {
    tenantId: ctx.tenantId,
    deletedAt: null,
    ...(additionalWhere ?? {}),
  } as { tenantId: string; deletedAt: null } & T
}

/**
 * Buat data object untuk create yang selalu menyertakan tenantId.
 *
 * @example
 * const data = withTenantData(ctx, { slug: 'wedding-1', brideName: 'Sari' })
 * // Result: { tenantId: 'xxx', slug: 'wedding-1', brideName: 'Sari' }
 */
export function withTenantData<T extends Record<string, unknown>>(
  ctx: TenantContext,
  data: T,
): { tenantId: string } & T {
  return {
    tenantId: ctx.tenantId,
    ...data,
  } as { tenantId: string } & T
}

/**
 * Pastikan resourceTenantId cocok dengan tenantId di context.
 * Return true jika aman (cocok atau SUPER_ADMIN).
 *
 * Gunakan ini untuk manual check tanpa throw.
 */
export function isTenantOwner(ctx: TenantContext, resourceTenantId: string): boolean {
  if (ctx.isSuperAdmin) return true
  return ctx.tenantId === resourceTenantId
}

/**
 * Build pagination args yang aman.
 */
export function buildPaginationArgs(page: number = 1, limit: number = 20) {
  const safePage = Math.max(1, page)
  const safeLimit = Math.min(100, Math.max(1, limit)) // max 100 per page
  return {
    skip: (safePage - 1) * safeLimit,
    take: safeLimit,
  }
}

/**
 * Build response format yang konsisten untuk list queries.
 */
export function buildListResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
) {
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  }
}
