/**
 * INFRASTRUCTURE LAYER — Repository Implementation
 * Implementasi IAuthRepository menggunakan Prisma ORM.
 */
import { prisma } from '@/lib/prisma'
import type { IAuthRepository } from '@/core/repositories/auth.repository.interface'
import type { AuthUser, UserEntity } from '@/core/entities/user.entity'

export class PrismaAuthRepository implements IAuthRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findFirst({
      where: { email },
    })
    return user as UserEntity | null
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await prisma.user.findFirst({
      where: { id },
    })
    return user as UserEntity | null
  }

  async createUser(data: {
    name: string
    email: string
    hashedPassword: string
    role?: 'SUPER_ADMIN' | 'TENANT'
  }): Promise<UserEntity> {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.hashedPassword,
        role: data.role ?? 'TENANT',
      },
    })
    return user as UserEntity
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: { email },
    })
    return !!user
  }

  async createUserWithTenant(data: {
    name: string
    email: string
    hashedPassword: string
    businessName: string
    slug: string
  }): Promise<{ userId: string; tenantId: string; tenantSlug: string }> {
    // Prisma $transaction sepenuhnya di dalam infrastructure layer
    // Application/use-case tidak perlu tahu bahwa ini menggunakan Prisma
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.hashedPassword,
          role: 'TENANT',
        },
      })

      const tenant = await tx.tenant.create({
        data: {
          businessName: data.businessName,
          slug: data.slug,
          ownerId: user.id,
          subscriptionStatus: 'TRIAL',
        },
      })

      return { user, tenant }
    })

    return {
      userId: result.user.id,
      tenantId: result.tenant.id,
      tenantSlug: result.tenant.slug,
    }
  }

  async getAuthUser(userId: string): Promise<AuthUser | null> {
    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        // Ambil tenant pertama yang dimiliki user (untuk populate session)
        ownedTenants: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'asc' },
          take: 1,
          select: { id: true, slug: true },
        },
      },
    })

    if (!user) return null

    const firstTenant = user.ownedTenants[0] ?? null

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as AuthUser['role'],
      tenantId: firstTenant?.id ?? null,
      tenantSlug: firstTenant?.slug ?? null,
    }
  }
}

// Singleton instance
export const authRepository = new PrismaAuthRepository()
