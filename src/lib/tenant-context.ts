/**
 * SHARED LIB — Tenant Context
 *
 * Mengambil dan memvalidasi tenant context dari NextAuth session.
 * Digunakan di Server Components, Server Actions, dan Route Handlers.
 *
 * DESIGN DECISION:
 * Tenant context TIDAK disimpan di global state / AsyncLocalStorage
 * karena Next.js App Router tidak menjamin single-request isolation
 * pada level Node.js global. Sebagai gantinya, kita selalu derive
 * context dari session per-call — aman dan stateless.
 */
import { getServerSession } from 'next-auth'
import { authOptions } from '@/infrastructure/auth/authOptions'
import { TenantSessionMissingError } from '@/core/errors/tenant.errors'
import type { Session } from 'next-auth'

export type TenantContext = {
  tenantId: string
  tenantSlug: string
  userId: string
  role: 'SUPER_ADMIN' | 'TENANT'
  isSuperAdmin: boolean
}

/**
 * Ambil tenant context dari session saat ini.
 * Throw jika session tidak ada atau tenantId tidak tersedia.
 *
 * @throws TenantSessionMissingError
 */
export async function getTenantContext(): Promise<TenantContext> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw new TenantSessionMissingError()
  }

  const { id: userId, role, tenantId, tenantSlug } = session.user

  if (!tenantId || !tenantSlug) {
    throw new TenantSessionMissingError()
  }

  return {
    tenantId,
    tenantSlug,
    userId,
    role: role as 'SUPER_ADMIN' | 'TENANT',
    isSuperAdmin: role === 'SUPER_ADMIN',
  }
}

/**
 * Ambil tenant context — tapi tidak throw jika SUPER_ADMIN tanpa tenant.
 * SUPER_ADMIN context mengembalikan tenantId: null.
 */
export type SuperAdminContext = {
  tenantId: null
  userId: string
  role: 'SUPER_ADMIN'
  isSuperAdmin: true
}

export async function getAnyRoleContext(): Promise<TenantContext | SuperAdminContext> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw new TenantSessionMissingError()
  }

  const { id: userId, role, tenantId, tenantSlug } = session.user

  if (role === 'SUPER_ADMIN') {
    return { tenantId: null, userId, role: 'SUPER_ADMIN', isSuperAdmin: true }
  }

  if (!tenantId || !tenantSlug) {
    throw new TenantSessionMissingError()
  }

  return {
    tenantId,
    tenantSlug,
    userId,
    role: 'TENANT',
    isSuperAdmin: false,
  }
}

/**
 * Derive tenant context dari session yang sudah ada (tanpa re-fetch).
 * Berguna saat session sudah diambil sebelumnya di komponen yang sama.
 */
export function deriveTenantContext(session: Session): TenantContext {
  const { id: userId, role, tenantId, tenantSlug } = session.user

  if (!tenantId || !tenantSlug) {
    throw new TenantSessionMissingError()
  }

  return {
    tenantId,
    tenantSlug,
    userId,
    role: role as 'SUPER_ADMIN' | 'TENANT',
    isSuperAdmin: role === 'SUPER_ADMIN',
  }
}
