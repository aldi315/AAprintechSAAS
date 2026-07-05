/**
 * SHARED LIB — Reseller Context
 */
import { getServerSession } from 'next-auth'
import { authOptions } from '@/infrastructure/auth/authOptions'
import { ResellerSessionMissingError } from '@/core/errors/reseller.errors'
import type { Session } from 'next-auth'

export type ResellerContext = {
  resellerId: string
  resellerSlug: string
  userId: string
  role: 'SUPER_ADMIN' | 'RESELLER'
  isSuperAdmin: boolean
}

/**
 * Ambil reseller context dari session saat ini.
 */
export async function getResellerContext(): Promise<ResellerContext> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw new ResellerSessionMissingError()
  }

  const { id: userId, role, resellerId, resellerSlug } = session.user

  if (!resellerId || !resellerSlug) {
    throw new ResellerSessionMissingError()
  }

  return {
    resellerId,
    resellerSlug,
    userId,
    role: role as 'SUPER_ADMIN' | 'RESELLER',
    isSuperAdmin: role === 'SUPER_ADMIN',
  }
}

export type SuperAdminContext = {
  resellerId: null
  userId: string
  role: 'SUPER_ADMIN'
  isSuperAdmin: true
}

export async function getAnyRoleContext(): Promise<ResellerContext | SuperAdminContext> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw new ResellerSessionMissingError()
  }

  const { id: userId, role, resellerId, resellerSlug } = session.user

  if (role === 'SUPER_ADMIN') {
    return { resellerId: null, userId, role: 'SUPER_ADMIN', isSuperAdmin: true }
  }

  if (!resellerId || !resellerSlug) {
    throw new ResellerSessionMissingError()
  }

  return {
    resellerId,
    resellerSlug,
    userId,
    role: 'RESELLER',
    isSuperAdmin: false,
  }
}

/**
 * Derive reseller context dari session yang sudah ada.
 */
export function deriveResellerContext(session: Session): ResellerContext {
  const { id: userId, role, resellerId, resellerSlug } = session.user

  if (!resellerId || !resellerSlug) {
    throw new ResellerSessionMissingError()
  }

  return {
    resellerId,
    resellerSlug,
    userId,
    role: role as 'SUPER_ADMIN' | 'RESELLER',
    isSuperAdmin: role === 'SUPER_ADMIN',
  }
}
