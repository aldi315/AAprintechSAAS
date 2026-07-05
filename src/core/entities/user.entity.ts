/**
 * CORE LAYER — Domain Entity
 * Pure TypeScript, no external dependencies.
 * Mendefinisikan shape dari User entity di domain level.
 */
export type UserRole = 'SUPER_ADMIN' | 'RESELLER'

export interface UserEntity {
  id: string
  name: string
  email: string
  password: string | null
  avatar: string | null
  role: UserRole
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

// Shape minimal yang dikembalikan setelah login
export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  resellerId: string | null // Reseller pertama yang dimiliki user
  resellerSlug: string | null
}
