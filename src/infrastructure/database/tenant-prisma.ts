/**
 * INFRASTRUCTURE LAYER — Tenant-Aware Prisma Extension
 *
 * Factory function yang menghasilkan Prisma client dengan tenant isolation
 * otomatis. Dikomposisikan di atas soft-delete extension yang sudah ada.
 *
 * STRATEGI:
 * - READ ops (findMany, findFirst, count): auto-inject { tenantId } ke WHERE
 * - WRITE ops (create): auto-inject { tenantId } ke DATA
 * - WRITE ops (update, delete): auto-inject { tenantId } ke WHERE untuk
 *   mencegah update/delete data tenant lain meski ID-nya diketahui
 * - SUPER_ADMIN: kembalikan base prisma tanpa injection (full bypass)
 *
 * KOMPATIBILITAS SOFT DELETE:
 * Extension ini diaplikasikan SETELAH soft-delete extension (chained via $extends).
 * Order matters: softDelete runs first, tenantIsolation runs after.
 * Keduanya hanya modify top-level WHERE, tidak menyentuh nested include.
 *
 * MODELS YANG DI-SCOPE (memiliki tenantId langsung):
 * Wedding, Subscription, Payment, Media, ActivityLog
 *
 * MODELS YANG TIDAK DI-SCOPE LANGSUNG (relasi via weddingId):
 * InvitationGuest, RSVP, WeddingEvent — keamanannya dijamin oleh
 * Wedding yang sudah di-scope (tidak bisa akses wedding tenant lain).
 */
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

// Model-model yang memiliki field tenantId langsung
const TENANT_SCOPED_MODELS = [
  'wedding',
  'subscription',
  'payment',
  'media',
  'activityLog',
] as const

type TenantScopedModel = (typeof TENANT_SCOPED_MODELS)[number]

function isTenantScopedModel(model: string): model is TenantScopedModel {
  return TENANT_SCOPED_MODELS.includes(model as TenantScopedModel)
}

/**
 * Buat Prisma extension untuk tenant isolation.
 * Setiap query pada model yang di-scope akan otomatis difilter/diinjeksi tenantId.
 */
function createTenantIsolationExtension(tenantId: string) {
  return Prisma.defineExtension({
    name: `tenantIsolation:${tenantId}`,
    query: {
      // ─── Wedding ────────────────────────────────────────────────────────────
      wedding: {
        findMany({ args, query }) {
          args.where = { tenantId, ...args.where }
          return query(args)
        },
        findFirst({ args, query }) {
          args.where = { tenantId, ...args.where }
          return query(args)
        },
        findFirstOrThrow({ args, query }) {
          args.where = { tenantId, ...args.where }
          return query(args)
        },
        count({ args, query }) {
          args.where = { tenantId, ...args.where }
          return query(args)
        },
        create({ args, query }) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(args.data as any).tenantId = tenantId
          return query(args)
        },
        update({ args, query }) {
          args.where = { ...args.where, tenantId } as typeof args.where
          return query(args)
        },
        updateMany({ args, query }) {
          args.where = { tenantId, ...args.where }
          return query(args)
        },
        delete({ args, query }) {
          args.where = { ...args.where, tenantId } as typeof args.where
          return query(args)
        },
        deleteMany({ args, query }) {
          args.where = { tenantId, ...args.where }
          return query(args)
        },
      },

      // ─── Subscription ───────────────────────────────────────────────────────
      subscription: {
        findMany({ args, query }) {
          args.where = { tenantId, ...args.where }
          return query(args)
        },
        findFirst({ args, query }) {
          args.where = { tenantId, ...args.where }
          return query(args)
        },
        findFirstOrThrow({ args, query }) {
          args.where = { tenantId, ...args.where }
          return query(args)
        },
        count({ args, query }) {
          args.where = { tenantId, ...args.where }
          return query(args)
        },
        create({ args, query }) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(args.data as any).tenantId = tenantId
          return query(args)
        },
        update({ args, query }) {
          args.where = { ...args.where, tenantId } as typeof args.where
          return query(args)
        },
        deleteMany({ args, query }) {
          args.where = { tenantId, ...args.where }
          return query(args)
        },
      },

      // ─── Payment ────────────────────────────────────────────────────────────
      payment: {
        findMany({ args, query }) {
          args.where = { tenantId, ...args.where }
          return query(args)
        },
        findFirst({ args, query }) {
          args.where = { tenantId, ...args.where }
          return query(args)
        },
        findFirstOrThrow({ args, query }) {
          args.where = { tenantId, ...args.where }
          return query(args)
        },
        count({ args, query }) {
          args.where = { tenantId, ...args.where }
          return query(args)
        },
        create({ args, query }) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(args.data as any).tenantId = tenantId
          return query(args)
        },
        update({ args, query }) {
          args.where = { ...args.where, tenantId } as typeof args.where
          return query(args)
        },
        deleteMany({ args, query }) {
          args.where = { tenantId, ...args.where }
          return query(args)
        },
      },

      // ─── Media ──────────────────────────────────────────────────────────────
      media: {
        findMany({ args, query }) {
          args.where = { tenantId, ...args.where }
          return query(args)
        },
        findFirst({ args, query }) {
          args.where = { tenantId, ...args.where }
          return query(args)
        },
        findFirstOrThrow({ args, query }) {
          args.where = { tenantId, ...args.where }
          return query(args)
        },
        count({ args, query }) {
          args.where = { tenantId, ...args.where }
          return query(args)
        },
        create({ args, query }) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(args.data as any).tenantId = tenantId
          return query(args)
        },
        delete({ args, query }) {
          args.where = { ...args.where, tenantId } as typeof args.where
          return query(args)
        },
        deleteMany({ args, query }) {
          args.where = { tenantId, ...args.where }
          return query(args)
        },
      },

      // ─── ActivityLog ────────────────────────────────────────────────────────
      activityLog: {
        findMany({ args, query }) {
          args.where = { tenantId, ...args.where }
          return query(args)
        },
        findFirst({ args, query }) {
          args.where = { tenantId, ...args.where }
          return query(args)
        },
        count({ args, query }) {
          args.where = { tenantId, ...args.where }
          return query(args)
        },
        create({ args, query }) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(args.data as any).tenantId = tenantId
          return query(args)
        },
        deleteMany({ args, query }) {
          args.where = { tenantId, ...args.where }
          return query(args)
        },
      },
    },
  })
}

/**
 * Buat tenant-scoped Prisma client.
 *
 * @param tenantId - ID tenant aktif dari session
 * @returns Prisma client dengan tenant isolation otomatis
 *
 * @example
 * // Dalam Server Component atau Server Action:
 * const { tenantId } = await getTenantContext()
 * const db = createTenantPrisma(tenantId)
 * const weddings = await db.wedding.findMany() // otomatis filter by tenantId
 */
export function createTenantPrisma(tenantId: string) {
  return prisma.$extends(createTenantIsolationExtension(tenantId))
}

/**
 * Type helper — type dari tenant-scoped Prisma client.
 * Gunakan ini untuk type-hint di repository atau service.
 */
export type TenantPrismaClient = ReturnType<typeof createTenantPrisma>
