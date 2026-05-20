/**
 * SHARED LIB — Permission Guard
 * Utility untuk cek permission di sisi client (React hooks)
 * dan sisi server (non-redirect, return boolean).
 */
import type { Session } from 'next-auth'

type UserRole = 'SUPER_ADMIN' | 'TENANT'

/**
 * Cek apakah user memiliki salah satu role yang diizinkan.
 * Aman dipakai di mana saja (client/server, tanpa redirect).
 */
export function hasRole(session: Session | null, allowedRoles: UserRole[]): boolean {
  if (!session?.user) return false
  return allowedRoles.includes(session.user.role as UserRole)
}

/**
 * Apakah user adalah SUPER_ADMIN?
 */
export function isSuperAdmin(session: Session | null): boolean {
  return hasRole(session, ['SUPER_ADMIN'])
}

/**
 * Apakah user adalah TENANT?
 */
export function isTenant(session: Session | null): boolean {
  return hasRole(session, ['TENANT'])
}

/**
 * Apakah user sudah login?
 */
export function isAuthenticated(session: Session | null): boolean {
  return !!session?.user
}

/**
 * Apakah user memiliki tenant aktif?
 */
export function hasTenant(session: Session | null): boolean {
  return !!session?.user?.tenantId
}
