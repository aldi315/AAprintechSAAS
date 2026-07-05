/**
 * SHARED LIB — Multi-reseller Query Helpers
 */
import type { ResellerContext } from '@/lib/reseller-context'

// ─── WHERE clause builders ────────────────────────────────────────────────────

/**
 * Buat WHERE clause yang selalu menyertakan resellerId.
 */
export function withResellerFilter<T extends Record<string, unknown>>(
  ctx: ResellerContext,
  additionalWhere?: T,
): { resellerId: string } & T {
  return {
    resellerId: ctx.resellerId,
    ...(additionalWhere ?? {}),
  } as { resellerId: string } & T
}

/**
 * Buat WHERE clause dengan resellerId + soft-delete filter.
 */
export function withResellerAndSoftDelete<T extends Record<string, unknown>>(
  ctx: ResellerContext,
  additionalWhere?: T,
): { resellerId: string; deletedAt: null } & T {
  return {
    resellerId: ctx.resellerId,
    deletedAt: null,
    ...(additionalWhere ?? {}),
  } as { resellerId: string; deletedAt: null } & T
}

/**
 * Buat data object untuk create yang selalu menyertakan resellerId.
 */
export function withResellerData<T extends Record<string, unknown>>(
  ctx: ResellerContext,
  data: T,
): { resellerId: string } & T {
  return {
    resellerId: ctx.resellerId,
    ...data,
  } as { resellerId: string } & T
}

/**
 * Pastikan resourceResellerId cocok dengan resellerId di context.
 */
export function isResellerOwner(ctx: ResellerContext, resourceResellerId: string): boolean {
  if (ctx.isSuperAdmin) return true
  return ctx.resellerId === resourceResellerId
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
