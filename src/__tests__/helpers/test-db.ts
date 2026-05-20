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
import { createTenantPrisma } from '@/infrastructure/database/tenant-prisma'
import type { TenantContext } from '@/lib/tenant-context'

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

// ─── Tenant-scoped client untuk test ─────────────────────────────────────────

export function getTenantClient(tenantId: string) {
  return createTenantPrisma(tenantId)
}

// ─── Test data factories ──────────────────────────────────────────────────────

export interface TestTenant {
  userId: string
  tenantId: string
  tenantSlug: string
  ctx: TenantContext
}

/**
 * Buat user + tenant untuk kebutuhan test.
 * Gunakan prefix unik agar tidak collision antar test run.
 */
export async function createTestTenant(slug: string): Promise<TestTenant> {
  const db = getTestPrisma()
  const hashedPw = await bcrypt.hash('TestPass@123', 4) // cost 4 — cepat untuk test

  const result = await (db as any).$transaction(async (tx: any) => {
    const user = await tx.user.create({
      data: {
        name: `Test User ${slug}`,
        email: `${slug}@test.local`,
        password: hashedPw,
        role: 'TENANT',
      },
    })

    const tenant = await tx.tenant.create({
      data: {
        businessName: `Business ${slug}`,
        slug,
        ownerId: user.id,
        subscriptionStatus: 'TRIAL',
      },
    })

    return { user, tenant }
  })

  const ctx: TenantContext = {
    tenantId: result.tenant.id,
    tenantSlug: result.tenant.slug,
    userId: result.user.id,
    role: 'TENANT',
    isSuperAdmin: false,
  }

  return {
    userId: result.user.id,
    tenantId: result.tenant.id,
    tenantSlug: result.tenant.slug,
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
      category: 'Test',
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
export async function createTestWedding(tenantId: string, templateId: string, slugSuffix: string) {
  const db = getTestPrisma()
  return (db as any).wedding.create({
    data: {
      tenantId,
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
    connectionString: process.env.DATABASE_URL ?? 'postgresql://postgres:admin@localhost:5432/invit?schema=public',
  })
  const rawAdapter = new PrismaPg(rawPool)
  const rawPrisma = new PrismaClient({ adapter: rawAdapter })

  try {
    // Cari semua tenant yang akan dihapus (slug bisa berupa prefix)
    const tenants = await rawPrisma.tenant.findMany({
      where: { slug: { in: slugPrefixes } },
      select: { id: true },
    })
    // Juga cari yang dimulai dengan prefix (untuk handle timestamp-suffixed slugs)
    const tenantsWithPrefix = await rawPrisma.tenant.findMany({
      where: {
        OR: slugPrefixes.map((p) => ({ slug: { startsWith: p } })),
      },
      select: { id: true },
    })
    const tenantIds = [...new Set([...tenants, ...tenantsWithPrefix].map((t) => t.id))]

    if (tenantIds.length > 0) {
      // 1. Hapus nested data (WeddingEvent → via Wedding)
      const weddings = await rawPrisma.wedding.findMany({
        where: { tenantId: { in: tenantIds } },
        select: { id: true },
      })
      const weddingIds = weddings.map((w) => w.id)

      if (weddingIds.length > 0) {
        await rawPrisma.weddingEvent.deleteMany({ where: { weddingId: { in: weddingIds } } })
        await rawPrisma.rSVP.deleteMany({ where: { weddingId: { in: weddingIds } } })
        await rawPrisma.invitationGuest.deleteMany({ where: { weddingId: { in: weddingIds } } })
      }

      // 2. Hapus semua data langsung di bawah tenant
      await rawPrisma.wedding.deleteMany({ where: { tenantId: { in: tenantIds } } })
      await rawPrisma.subscription.deleteMany({ where: { tenantId: { in: tenantIds } } })
      await rawPrisma.payment.deleteMany({ where: { tenantId: { in: tenantIds } } })
      await rawPrisma.media.deleteMany({ where: { tenantId: { in: tenantIds } } })
      await rawPrisma.activityLog.deleteMany({ where: { tenantId: { in: tenantIds } } })

      // 3. Hapus tenant
      await rawPrisma.tenant.deleteMany({ where: { id: { in: tenantIds } } })
    }

    // 4. Cari sisa tenant yang mungkin masih ada (dari run sebelumnya)
    //    yang owner-nya adalah user test
    const testUsers = await rawPrisma.user.findMany({
      where: { email: { endsWith: '@test.local' } },
      select: { id: true },
    })
    const testUserIds = testUsers.map((u) => u.id)

    if (testUserIds.length > 0) {
      // Cari tenant tambahan yang ownerId-nya user test
      const remainingTenants = await rawPrisma.tenant.findMany({
        where: { ownerId: { in: testUserIds } },
        select: { id: true },
      })
      const remainingTenantIds = remainingTenants.map((t) => t.id)

      if (remainingTenantIds.length > 0) {
        // Hapus child data dari remaining tenants
        const remainingWeddings = await rawPrisma.wedding.findMany({
          where: { tenantId: { in: remainingTenantIds } },
          select: { id: true },
        })
        const remainingWeddingIds = remainingWeddings.map((w) => w.id)
        if (remainingWeddingIds.length > 0) {
          await rawPrisma.weddingEvent.deleteMany({ where: { weddingId: { in: remainingWeddingIds } } })
          await rawPrisma.invitationGuest.deleteMany({ where: { weddingId: { in: remainingWeddingIds } } })
          await rawPrisma.rSVP.deleteMany({ where: { weddingId: { in: remainingWeddingIds } } })
        }
        await rawPrisma.wedding.deleteMany({ where: { tenantId: { in: remainingTenantIds } } })
        await rawPrisma.activityLog.deleteMany({ where: { tenantId: { in: remainingTenantIds } } })
        await rawPrisma.media.deleteMany({ where: { tenantId: { in: remainingTenantIds } } })
        await rawPrisma.subscription.deleteMany({ where: { tenantId: { in: remainingTenantIds } } })
        await rawPrisma.payment.deleteMany({ where: { tenantId: { in: remainingTenantIds } } })
        await rawPrisma.tenant.deleteMany({ where: { id: { in: remainingTenantIds } } })
      }

      // Hapus users setelah semua tenant terhapus
      await rawPrisma.user.deleteMany({ where: { id: { in: testUserIds } } })
    }
  } finally {
    await rawPrisma.$disconnect()
    await rawPool.end()
  }

  await disconnectTestPrisma()
}
