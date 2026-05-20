/**
 * CORE LAYER — Repository Interface (Contract)
 * Mendefinisikan kontrak untuk auth repository.
 * Infrastructure layer wajib mengimplementasikan interface ini.
 */
import type { AuthUser, UserEntity } from '@/core/entities/user.entity'

export interface IAuthRepository {
  /**
   * Cari user berdasarkan email.
   * Digunakan saat login untuk validasi credentials.
   */
  findByEmail(email: string): Promise<UserEntity | null>

  /**
   * Cari user berdasarkan ID.
   * Digunakan untuk refresh session.
   */
  findById(id: string): Promise<UserEntity | null>

  /**
   * Buat user baru (register tenant).
   */
  createUser(data: {
    name: string
    email: string
    hashedPassword: string
    role?: 'SUPER_ADMIN' | 'TENANT'
  }): Promise<UserEntity>

  /**
   * Cek apakah email sudah terdaftar.
   */
  isEmailTaken(email: string): Promise<boolean>

  /**
   * Buat User + Tenant dalam satu atomic transaction.
   * Encapsulate Prisma $transaction di infrastructure layer,
   * sehingga use case tetap bersih tanpa import Prisma.
   */
  createUserWithTenant(data: {
    name: string
    email: string
    hashedPassword: string
    businessName: string
    slug: string
  }): Promise<{ userId: string; tenantId: string; tenantSlug: string }>

  /**
   * Ambil AuthUser lengkap dengan tenant info.
   * Digunakan untuk populate session JWT.
   */
  getAuthUser(userId: string): Promise<AuthUser | null>
}
