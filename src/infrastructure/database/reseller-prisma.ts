/**
 * INFRASTRUCTURE LAYER — Reseller-Aware Prisma Extension
 *
 * Factory function yang menghasilkan Prisma client dengan reseller isolation
 * otomatis. Dikomposisikan di atas soft-delete extension yang sudah ada.
 */
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

// Model-model yang memiliki field resellerId langsung
const RESELLER_SCOPED_MODELS = [
  'wedding',
  'subscription',
  'payment',
  'media',
  'activityLog',
] as const

type ResellerScopedModel = (typeof RESELLER_SCOPED_MODELS)[number]

function isResellerScopedModel(model: string): model is ResellerScopedModel {
  return RESELLER_SCOPED_MODELS.includes(model as ResellerScopedModel)
}

/**
 * Buat Prisma extension untuk reseller isolation.
 * Setiap query pada model yang di-scope akan otomatis difilter/diinjeksi resellerId.
 */
function createResellerIsolationExtension(resellerId: string) {
  return Prisma.defineExtension({
    name: `resellerIsolation:${resellerId}`,
    query: {
      // ─── Wedding ────────────────────────────────────────────────────────────
      wedding: {
        findMany({ args, query }) {
          args.where = { resellerId, ...args.where }
          return query(args)
        },
        findFirst({ args, query }) {
          args.where = { resellerId, ...args.where }
          return query(args)
        },
        findFirstOrThrow({ args, query }) {
          args.where = { resellerId, ...args.where }
          return query(args)
        },
        count({ args, query }) {
          args.where = { resellerId, ...args.where }
          return query(args)
        },
        create({ args, query }) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(args.data as any).resellerId = resellerId
          return query(args)
        },
        update({ args, query }) {
          args.where = { ...args.where, resellerId } as typeof args.where
          return query(args)
        },
        updateMany({ args, query }) {
          args.where = { resellerId, ...args.where }
          return query(args)
        },
        delete({ args, query }) {
          args.where = { ...args.where, resellerId } as typeof args.where
          return query(args)
        },
        deleteMany({ args, query }) {
          args.where = { resellerId, ...args.where }
          return query(args)
        },
      },

      // ─── Subscription ───────────────────────────────────────────────────────
      subscription: {
        findMany({ args, query }) {
          args.where = { resellerId, ...args.where }
          return query(args)
        },
        findFirst({ args, query }) {
          args.where = { resellerId, ...args.where }
          return query(args)
        },
        findFirstOrThrow({ args, query }) {
          args.where = { resellerId, ...args.where }
          return query(args)
        },
        count({ args, query }) {
          args.where = { resellerId, ...args.where }
          return query(args)
        },
        create({ args, query }) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(args.data as any).resellerId = resellerId
          return query(args)
        },
        update({ args, query }) {
          args.where = { ...args.where, resellerId } as typeof args.where
          return query(args)
        },
        deleteMany({ args, query }) {
          args.where = { resellerId, ...args.where }
          return query(args)
        },
      },

      // ─── Payment ────────────────────────────────────────────────────────────
      payment: {
        findMany({ args, query }) {
          args.where = { resellerId, ...args.where }
          return query(args)
        },
        findFirst({ args, query }) {
          args.where = { resellerId, ...args.where }
          return query(args)
        },
        findFirstOrThrow({ args, query }) {
          args.where = { resellerId, ...args.where }
          return query(args)
        },
        count({ args, query }) {
          args.where = { resellerId, ...args.where }
          return query(args)
        },
        create({ args, query }) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(args.data as any).resellerId = resellerId
          return query(args)
        },
        update({ args, query }) {
          args.where = { ...args.where, resellerId } as typeof args.where
          return query(args)
        },
        deleteMany({ args, query }) {
          args.where = { resellerId, ...args.where }
          return query(args)
        },
      },

      // ─── Media ──────────────────────────────────────────────────────────────
      media: {
        findMany({ args, query }) {
          args.where = { resellerId, ...args.where }
          return query(args)
        },
        findFirst({ args, query }) {
          args.where = { resellerId, ...args.where }
          return query(args)
        },
        findFirstOrThrow({ args, query }) {
          args.where = { resellerId, ...args.where }
          return query(args)
        },
        count({ args, query }) {
          args.where = { resellerId, ...args.where }
          return query(args)
        },
        create({ args, query }) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(args.data as any).resellerId = resellerId
          return query(args)
        },
        delete({ args, query }) {
          args.where = { ...args.where, resellerId } as typeof args.where
          return query(args)
        },
        deleteMany({ args, query }) {
          args.where = { resellerId, ...args.where }
          return query(args)
        },
      },

      // ─── ActivityLog ────────────────────────────────────────────────────────
      activityLog: {
        findMany({ args, query }) {
          args.where = { resellerId, ...args.where }
          return query(args)
        },
        findFirst({ args, query }) {
          args.where = { resellerId, ...args.where }
          return query(args)
        },
        count({ args, query }) {
          args.where = { resellerId, ...args.where }
          return query(args)
        },
        create({ args, query }) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(args.data as any).resellerId = resellerId
          return query(args)
        },
        deleteMany({ args, query }) {
          args.where = { resellerId, ...args.where }
          return query(args)
        },
      },
    },
  })
}

/**
 * Buat reseller-scoped Prisma client.
 */
export function createResellerPrisma(resellerId: string) {
  return prisma.$extends(createResellerIsolationExtension(resellerId))
}

export type ResellerPrismaClient = ReturnType<typeof createResellerPrisma>
