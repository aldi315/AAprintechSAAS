/**
 * SHARED LIB — Session Utility
 * Reusable helpers untuk mengakses session di Server Components,
 * Server Actions, dan Route Handlers.
 */
import { getServerSession } from 'next-auth'
import { authOptions } from '@/infrastructure/auth/authOptions'
import type { Session } from 'next-auth'
import { redirect } from 'next/navigation'

type AuthenticatedSession = Session & {
  user: NonNullable<Session['user']>
}

/**
 * Ambil session saat ini.
 * Mengembalikan null jika belum login.
 * Gunakan di Server Components / Route Handlers.
 */
export async function getSession(): Promise<Session | null> {
  return getServerSession(authOptions)
}

/**
 * Ambil session dan redirect ke /login jika belum login.
 * Gunakan di halaman yang wajib login.
 */
export async function requireAuth(): Promise<AuthenticatedSession> {
  const session = await getSession()
  if (!session?.user) {
    redirect('/login')
  }
  return session as AuthenticatedSession
}

/**
 * Wajib login + wajib role tertentu.
 * Redirect ke /unauthorized jika role tidak sesuai.
 */
export async function requireRole(
  allowedRoles: Array<'SUPER_ADMIN' | 'RESELLER'>,
): Promise<AuthenticatedSession> {
  const session = await requireAuth()
  if (!allowedRoles.includes(session.user.role)) {
    redirect('/unauthorized')
  }
  return session
}

/**
 * Khusus untuk SUPER_ADMIN pages.
 */
export async function requireSuperAdmin(): Promise<AuthenticatedSession> {
  return requireRole(['SUPER_ADMIN'])
}

/**
 * Khusus untuk Reseller pages.
 * Juga memastikan resellerId tersedia di session.
 */
export async function requireReseller(): Promise<AuthenticatedSession & { user: { resellerId: string; resellerSlug: string } }> {
  const session = await requireRole(['RESELLER', 'SUPER_ADMIN'])
  if (!session.user.resellerId) {
    redirect('/onboarding') // Belum punya reseller
  }
  return session as any
}
