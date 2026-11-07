/**
 * SHARED LIB — Server Action Guards
 *
 * Server Actions adalah endpoint publik: bisa dipanggil lewat POST ke path mana pun
 * (cukup dengan header Next-Action), sehingga proteksi di middleware/layout TIDAK berlaku.
 * Setiap action yang sensitif WAJIB memanggil guard di sini di baris pertama.
 *
 * Role diverifikasi ulang ke database (bukan hanya dari JWT), supaya user yang sudah
 * dihapus atau diturunkan role-nya tidak bisa lagi memakai token lama.
 */
import { getServerSession } from 'next-auth'
import { authOptions } from '@/infrastructure/auth/authOptions'
import { prisma } from '@/lib/prisma'

export type GuardFailure = { success: false; error: string }

export const UNAUTHORIZED: GuardFailure = {
  success: false,
  error: 'Anda tidak memiliki akses untuk melakukan aksi ini.',
}

/**
 * Pastikan pemanggil adalah SUPER_ADMIN yang masih aktif di database.
 * Return userId jika valid, null jika tidak.
 */
export async function getVerifiedSuperAdminId(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId || session.user.role !== 'SUPER_ADMIN') return null

  // findFirst otomatis menyaring deletedAt: null (soft-delete extension)
  const user = await prisma.user.findFirst({
    where: { id: userId, role: 'SUPER_ADMIN' },
    select: { id: true },
  })
  return user?.id ?? null
}
