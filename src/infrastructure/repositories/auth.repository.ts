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
    role?: 'SUPER_ADMIN' | 'RESELLER'
  }): Promise<UserEntity> {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.hashedPassword,
        role: data.role ?? 'RESELLER',
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

  async createUserWithReseller(data: {
    name: string
    email: string
    hashedPassword: string
    businessName: string
    slug: string
  }): Promise<{ userId: string; resellerId: string; resellerSlug: string }> {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.hashedPassword,
          role: 'RESELLER',
        },
      })

      const reseller = await (tx as any).reseller.create({
        data: {
          businessName: data.businessName,
          slug: data.slug,
          ownerId: user.id,
          subscriptionStatus: 'TRIAL',
        },
      })

      return { user, reseller }
    })

    return {
      userId: result.user.id,
      resellerId: result.reseller.id,
      resellerSlug: result.reseller.slug,
    }
  }

  async getAuthUser(userId: string): Promise<AuthUser | null> {
    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        // Ambil reseller pertama yang dimiliki user (untuk populate session)
        ownedResellers: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'asc' },
          take: 1,
          select: { id: true, slug: true },
        },
      },
    })

    if (!user) return null

    const firstReseller = user.ownedResellers[0] ?? null

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as AuthUser['role'],
      resellerId: firstReseller?.id ?? null,
      resellerSlug: firstReseller?.slug ?? null,
    }
  }
}

// Singleton instance
export const authRepository = new PrismaAuthRepository()
