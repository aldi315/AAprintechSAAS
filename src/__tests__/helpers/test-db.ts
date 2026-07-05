/**
 * TEST HELPER — Prisma client untuk test environment
 *
 * Menggunakan PrismaPg adapter (sama dengan production) agar
 * extension soft-delete dan tenant isolation bisa diuji secara akurat.
 */
import { PrismaClient, Prisma } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import { createResellerPrisma } from '@/infrastructure/database/reseller-prisma'
import type { ResellerContext } from '@/lib/reseller-context'

// ─── Test Prisma (base — soft-delete extension saja) ─────────────────────────

const softDeleteExtension = Prisma.defineExtension({
  name: 'softDelete',
  query: {
    user: {
      findMany({ args, query }) { args.where = { deletedAt: null, ...args.where }; return query(args) },
      findFirst({ args, query }) { args.where = { deletedAt: null, ...args.where }; return query(args) },
    },
    tenant: {
      findMany({ args, query }) { args.where = { deletedAt: null, ...args.where }; return query(args) },
      findFirst({ args, query }) { args.where = { deletedAt: null, ...args.where }; return query(args) },
    },
    wedding: {
      findMany({ args, query }) { args.where = { deletedAt: null, ...args.where }; return query(args) },
      findFirst({ args, query }) { args.where = { deletedAt: null, ...args.where }; return query(args) },
    },
  },
})

let pool: Pool
let _basePrisma: ReturnType<typeof buildBasePrisma>

function buildBasePrisma() {
  pool = new Pool({ connectionString: process.env.DATABASE_URL ?? 'postgresql://postgres:admin@localhost:5432/invit?schema=public' })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter }).$extends(softDeleteExtension)
}

export function getTestPrisma() {
  if (!_basePrisma) _basePrisma = buildBasePrisma()
  return _basePrisma
}

export async function disconnectTestPrisma() {
  if (_basePrisma) await (_basePrisma as any).$disconnect?.()
  if (pool) await pool.end()
}

// ─── Reseller-scoped client untuk test ─────────────────────────────────────────

export function getResellerClient(resellerId: string) {
  return createResellerPrisma(resellerId)
}

// ─── Test data factories ──────────────────────────────────────────────────────

export interface TestReseller {
  userId: string
  resellerId: string
  resellerSlug: string
  ctx: ResellerContext
}

/**
 * Buat user + reseller untuk kebutuhan test.
 * Gunakan prefix unik agar tidak collision antar test run.
 */
export async function createTestReseller(slug: string): Promise<TestReseller> {
  const db = getTestPrisma()
  const hashedPw = await bcrypt.hash('TestPass@123', 4) // cost 4 — cepat untuk test

  const result = await (db as any).$transaction(async (tx: any) => {
    const user = await tx.user.create({
      data: {
        name: `Test User ${slug}`,
        email: `${slug}@test.local`,
        password: hashedPw,
        role: 'RESELLER',
      },
    })

    const reseller = await (tx as any).reseller.create({
      data: {
        businessName: `Business ${slug}`,
        slug,
        ownerId: user.id,
        subscriptionStatus: 'TRIAL',
      },
    })

    return { user, reseller }
  })

  const ctx: ResellerContext = {
    resellerId: result.reseller.id,
    resellerSlug: result.reseller.slug,
    userId: result.user.id,
    role: 'RESELLER',
    isSuperAdmin: false,
  }

  return {
    userId: result.user.id,
    resellerId: result.reseller.id,
    resellerSlug: result.reseller.slug,
    ctx,
  }
}

/**
 * Buat template default untuk test (Wedding butuh templateId).
 */
export async function getOrCreateTestTemplate(): Promise<string> {
  const db = getTestPrisma()
  const existing = await (db as any).template.findFirst({
    where: { name: 'Test Template' },
  })
  if (existing) return existing.id

  const template = await (db as any).template.create({
    data: {
      name: 'Test Template',
      category: {
        connectOrCreate: {
          where: { slug: 'test' },
          create: { name: 'Test', slug: 'test' },
        },
      },
      themeConfig: {},
      premium: false,
      active: true,
    },
  })
  return template.id
}

/**
 * Buat wedding untuk tenant tertentu menggunakan base prisma (tanpa isolation extension)
 * agar test bisa setup data lintas tenant.
 */
export async function createTestWedding(resellerId: string, templateId: string, slugSuffix: string) {
  const db = getTestPrisma()
  return (db as any).wedding.create({
    data: {
      resellerId,
      slug: `wedding-${slugSuffix}`,
      brideName: 'Bride Test',
      groomName: 'Groom Test',
      timezone: 'Asia/Jakarta',
      templateId,
      status: 'DRAFT',
    },
  })
}

/**
 * Hapus semua data test berdasarkan slug prefix.
 * Dipanggil di afterAll untuk cleanup.
 */
export async function cleanupTestData(slugPrefixes: string[]) {
  const rawPool = new Pool({
    connectionString: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/invit_db?schema=public',
  })
  const rawAdapter = new PrismaPg(rawPool)
  const rawPrisma = new PrismaClient({ adapter: rawAdapter })

  try {
    // Cari semua reseller yang akan dihapus (slug bisa berupa prefix)
    const resellers = await (rawPrisma as any).reseller.findMany({
      where: { slug: { in: slugPrefixes } },
      select: { id: true },
    })
    // Juga cari yang dimulai dengan prefix (untuk handle timestamp-suffixed slugs)
    const resellersWithPrefix = await (rawPrisma as any).reseller.findMany({
      where: {
        OR: slugPrefixes.map((p) => ({ slug: { startsWith: p } })),
      },
      select: { id: true },
    })
    const resellerIds = [...new Set([...resellers, ...resellersWithPrefix].map((t) => t.id))]

    if (resellerIds.length > 0) {
      // 1. Hapus nested data (WeddingEvent → via Wedding)
      const weddings = await rawPrisma.wedding.findMany({
        where: { resellerId: { in: resellerIds } },
        select: { id: true },
      })
      const weddingIds = weddings.map((w) => w.id)

      if (weddingIds.length > 0) {
        await rawPrisma.weddingEvent.deleteMany({ where: { weddingId: { in: weddingIds } } })
        await rawPrisma.rSVP.deleteMany({ where: { weddingId: { in: weddingIds } } })
        await rawPrisma.invitationGuest.deleteMany({ where: { weddingId: { in: weddingIds } } })
      }

      // 2. Hapus semua data langsung di bawah reseller
      await rawPrisma.wedding.deleteMany({ where: { resellerId: { in: resellerIds } } })
      await rawPrisma.subscription.deleteMany({ where: { resellerId: { in: resellerIds } } })
      await rawPrisma.payment.deleteMany({ where: { resellerId: { in: resellerIds } } })
      await rawPrisma.media.deleteMany({ where: { resellerId: { in: resellerIds } } })
      await rawPrisma.activityLog.deleteMany({ where: { resellerId: { in: resellerIds } } })

      // 3. Hapus reseller
      await (rawPrisma as any).reseller.deleteMany({ where: { id: { in: resellerIds } } })
    }

    // 4. Cari sisa reseller yang mungkin masih ada (dari run sebelumnya)
    //    yang owner-nya adalah user test
    const testUsers = await rawPrisma.user.findMany({
      where: { email: { endsWith: '@test.local' } },
      select: { id: true },
    })
    const testUserIds = testUsers.map((u) => u.id)

    if (testUserIds.length > 0) {
      // Cari reseller tambahan yang ownerId-nya user test
      const remainingResellers = await (rawPrisma as any).reseller.findMany({
        where: { ownerId: { in: testUserIds } },
        select: { id: true },
      })
      const remainingResellerIds = remainingResellers.map((t) => t.id)

      if (remainingResellerIds.length > 0) {
        // Hapus child data dari remaining resellers
        const remainingWeddings = await rawPrisma.wedding.findMany({
          where: { resellerId: { in: remainingResellerIds } },
          select: { id: true },
        })
        const remainingWeddingIds = remainingWeddings.map((w) => w.id)
        if (remainingWeddingIds.length > 0) {
          await rawPrisma.weddingEvent.deleteMany({ where: { weddingId: { in: remainingWeddingIds } } })
          await rawPrisma.invitationGuest.deleteMany({ where: { weddingId: { in: remainingWeddingIds } } })
          await rawPrisma.rSVP.deleteMany({ where: { weddingId: { in: remainingWeddingIds } } })
        }
        await rawPrisma.wedding.deleteMany({ where: { resellerId: { in: remainingResellerIds } } })
        await rawPrisma.activityLog.deleteMany({ where: { resellerId: { in: remainingResellerIds } } })
        await rawPrisma.media.deleteMany({ where: { resellerId: { in: remainingResellerIds } } })
        await rawPrisma.subscription.deleteMany({ where: { resellerId: { in: remainingResellerIds } } })
        await rawPrisma.payment.deleteMany({ where: { resellerId: { in: remainingResellerIds } } })
        await (rawPrisma as any).reseller.deleteMany({ where: { id: { in: remainingResellerIds } } })
      }

      // Hapus users setelah semua reseller terhapus
      await rawPrisma.user.deleteMany({ where: { id: { in: testUserIds } } })
    }
  } finally {
    await rawPrisma.$disconnect()
    await rawPool.end()
  }

  await disconnectTestPrisma()
}
