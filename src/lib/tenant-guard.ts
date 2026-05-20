/**
 * SHARED LIB — Tenant Guard
 *
 * Kumpulan fungsi guard untuk memproteksi akses tenant.
 * Digunakan di Server Components, Server Actions, dan Route Handlers.
 *
 * HIERARCHY:
 * requireAuth()          → harus login
 *   └── requireTenant()  → harus punya tenant
 *         └── requireTenantAccess(tenantId) → harus punya akses ke tenant tersebut
 */
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/infrastructure/auth/authOptions'
import { getTenantContext, type TenantContext } from '@/lib/tenant-context'
import { prisma } from '@/lib/prisma'
import {
  TenantAccessDeniedError,
  TenantNotFoundError,
  CrossTenantAccessError,
} from '@/core/errors/tenant.errors'
import type { Session } from 'next-auth'

// ─── Core Guards (redirect-based, untuk Server Components/Pages) ─────────────

/**
 * Pastikan user sudah login dan punya tenant aktif.
 * Redirect ke /login jika belum login, /onboarding jika belum punya tenant.
 *
 * @returns TenantContext yang sudah tervalidasi
 */
export async function requireTenant(): Promise<TenantContext> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  if (!session.user.tenantId) {
    redirect('/onboarding')
  }

  return {
    tenantId: session.user.tenantId,
    tenantSlug: session.user.tenantSlug ?? '',
    userId: session.user.id,
    role: session.user.role,
    isSuperAdmin: session.user.role === 'SUPER_ADMIN',
  }
}

/**
 * Verifikasi bahwa user memiliki akses ke tenantId tertentu.
 * SUPER_ADMIN otomatis bypass. TENANT hanya bisa akses tenant sendiri.
 *
 * @param requestedTenantId - tenantId yang ingin diakses
 * @throws TenantAccessDeniedError jika tidak punya akses
 * @returns TenantContext
 */
export async function requireTenantAccess(requestedTenantId: string): Promise<TenantContext> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const { id: userId, role, tenantId, tenantSlug } = session.user
  const isSuperAdmin = role === 'SUPER_ADMIN'

  // SUPER_ADMIN bypass — boleh akses tenant mana saja
  if (isSuperAdmin) {
    return {
      tenantId: requestedTenantId,
      tenantSlug: tenantSlug ?? '',
      userId,
      role: 'SUPER_ADMIN',
      isSuperAdmin: true,
    }
  }

  // TENANT: hanya boleh akses tenant sendiri
  if (tenantId !== requestedTenantId) {
    throw new CrossTenantAccessError()
  }

  return {
    tenantId: tenantId,
    tenantSlug: tenantSlug ?? '',
    userId,
    role: 'TENANT',
    isSuperAdmin: false,
  }
}

/**
 * Verifikasi tenant ownership untuk resource tertentu.
 * Contoh: memastikan Wedding dengan weddingId memang milik tenant ini.
 *
 * @param resourceTenantId - tenantId yang tersimpan di resource
 * @param callerSession - session user yang memanggil
 * @throws CrossTenantAccessError jika cross-tenant access terdeteksi
 */
export function verifyTenantOwnership(
  resourceTenantId: string,
  callerSession: Session,
): void {
  const { role, tenantId } = callerSession.user
  const isSuperAdmin = role === 'SUPER_ADMIN'

  if (isSuperAdmin) return // Bypass

  if (tenantId !== resourceTenantId) {
    throw new CrossTenantAccessError()
  }
}

// ─── Non-redirect Guards (untuk API Routes, Server Actions) ──────────────────

/**
 * Validate tenant access — return boolean, tidak redirect.
 * Gunakan di API Route handlers yang perlu return JSON error response.
 */
export async function canAccessTenant(targetTenantId: string): Promise<boolean> {
  const session = await getServerSession(authOptions)
  if (!session?.user) return false
  if (session.user.role === 'SUPER_ADMIN') return true
  return session.user.tenantId === targetTenantId
}

/**
 * Pastikan tenant dengan tenantId ada di database.
 * @throws TenantNotFoundError
 */
export async function validateTenantExists(tenantId: string): Promise<void> {
  const tenant = await prisma.tenant.findFirst({ where: { id: tenantId } })
  if (!tenant) throw new TenantNotFoundError()
}

// ─── withTenantScope — HOF untuk Server Actions ───────────────────────────────

type ServerActionFn<TArgs extends unknown[], TResult> = (
  context: TenantContext,
  ...args: TArgs
) => Promise<TResult>

/**
 * Higher-Order Function untuk Server Actions.
 * Membungkus server action dengan tenant isolation otomatis.
 *
 * @example
 * // Definisi:
 * export const createWedding = withTenantScope(async (ctx, data) => {
 *   const db = createTenantPrisma(ctx.tenantId)
 *   return db.wedding.create({ data })
 * })
 *
 * // Pemanggilan dari Client Component:
 * await createWedding(weddingData) // tenantId otomatis dari session
 */
export function withTenantScope<TArgs extends unknown[], TResult>(
  fn: ServerActionFn<TArgs, TResult>,
): (...args: TArgs) => Promise<TResult> {
  return async (...args: TArgs): Promise<TResult> => {
    const context = await getTenantContext()
    return fn(context, ...args)
  }
}
