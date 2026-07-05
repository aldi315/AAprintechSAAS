/**
 * SHARED LIB — Reseller Guard
 *
 * Kumpulan fungsi guard untuk memproteksi akses reseller.
 */
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/infrastructure/auth/authOptions'
import { getResellerContext, type ResellerContext } from '@/lib/reseller-context'
import { prisma } from '@/lib/prisma'
import {
  ResellerAccessDeniedError,
  ResellerNotFoundError,
  CrossResellerAccessError,
} from '@/core/errors/reseller.errors'
import type { Session } from 'next-auth'

// ─── Core Guards (redirect-based, untuk Server Components/Pages) ─────────────

/**
 * Pastikan user sudah login dan punya reseller aktif.
 * Redirect ke /login jika belum login, /onboarding jika belum punya reseller.
 */
export async function requireReseller(): Promise<ResellerContext> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  if (!session.user.resellerId) {
    redirect('/onboarding')
  }

  return {
    resellerId: session.user.resellerId,
    resellerSlug: session.user.resellerSlug ?? '',
    userId: session.user.id,
    role: session.user.role,
    isSuperAdmin: session.user.role === 'SUPER_ADMIN',
  }
}

/**
 * Verifikasi bahwa user memiliki akses ke resellerId tertentu.
 * SUPER_ADMIN otomatis bypass. RESELLER hanya bisa akses reseller sendiri.
 */
export async function requireResellerAccess(requestedResellerId: string): Promise<ResellerContext> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const { id: userId, role, resellerId, resellerSlug } = session.user
  const isSuperAdmin = role === 'SUPER_ADMIN'

  // SUPER_ADMIN bypass — boleh akses reseller mana saja
  if (isSuperAdmin) {
    return {
      resellerId: requestedResellerId,
      resellerSlug: resellerSlug ?? '',
      userId,
      role: 'SUPER_ADMIN',
      isSuperAdmin: true,
    }
  }

  // RESELLER: hanya boleh akses reseller sendiri
  if (resellerId !== requestedResellerId) {
    throw new CrossResellerAccessError()
  }

  return {
    resellerId: resellerId,
    resellerSlug: resellerSlug ?? '',
    userId,
    role: 'RESELLER',
    isSuperAdmin: false,
  }
}

/**
 * Verifikasi reseller ownership untuk resource tertentu.
 */
export function verifyResellerOwnership(
  resourceResellerId: string,
  callerSession: Session,
): void {
  const { role, resellerId } = callerSession.user
  const isSuperAdmin = role === 'SUPER_ADMIN'

  if (isSuperAdmin) return // Bypass

  if (resellerId !== resourceResellerId) {
    throw new CrossResellerAccessError()
  }
}

// ─── Non-redirect Guards (untuk API Routes, Server Actions) ──────────────────

/**
 * Validate reseller access — return boolean, tidak redirect.
 */
export async function canAccessReseller(targetResellerId: string): Promise<boolean> {
  const session = await getServerSession(authOptions)
  if (!session?.user) return false
  if (session.user.role === 'SUPER_ADMIN') return true
  return session.user.resellerId === targetResellerId
}

/**
 * Pastikan reseller dengan resellerId ada di database.
 */
export async function validateResellerExists(resellerId: string): Promise<void> {
  const reseller = await (prisma as any).reseller.findFirst({ where: { id: resellerId } })
  if (!reseller) throw new ResellerNotFoundError()
}

// ─── withResellerScope — HOF untuk Server Actions ───────────────────────────────

type ServerActionFn<TArgs extends unknown[], TResult> = (
  context: ResellerContext,
  ...args: TArgs
) => Promise<TResult>

export function withResellerScope<TArgs extends unknown[], TResult>(
  fn: ServerActionFn<TArgs, TResult>,
): (...args: TArgs) => Promise<TResult> {
  return async (...args: TArgs): Promise<TResult> => {
    const context = await getResellerContext()
    return fn(context, ...args)
  }
}
