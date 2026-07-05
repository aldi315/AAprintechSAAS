import { PrismaClient, Prisma } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Model yang menggunakan soft delete (memiliki field deletedAt)
const SOFT_DELETE_MODELS: Prisma.ModelName[] = ['User', 'Reseller', 'Wedding']

/**
 * SOFT DELETE EXTENSION — AMAN DENGAN INCLUDE/RELATION
 *
 * Bug umum Prisma: jika kita replace args.where = { deletedAt: null, ...args.where },
 * ini bisa merusak nested filter saat ada `include` dengan `where`.
 *
 * Solusi yang benar:
 * - Hanya tambahkan deletedAt filter di top-level WHERE, bukan di nested relation.
 * - Gunakan spread yang menempatkan user where SETELAH deletedAt:null,
 *   sehingga user bisa override jika memang perlu query data yang sudah di-soft-delete
 *   (misal: halaman admin "restore data").
 * - TIDAK menggunakan $allModels karena akan mencoba intercept Subscription, RSVP, dll
 *   yang tidak punya deletedAt — ini bisa menyebabkan error silent di PostgreSQL.
 */
const softDeleteExtension = Prisma.defineExtension({
  name: 'softDelete',
  query: {
    user: {
      findMany({ args, query }) {
        // Spread user where setelah deletedAt:null agar user bisa override
        // Contoh override: prisma.user.findMany({ where: { deletedAt: { not: null } } })
        args.where = { deletedAt: null, ...args.where }
        return query(args)
      },
      findFirst({ args, query }) {
        args.where = { deletedAt: null, ...args.where }
        return query(args)
      },
      findFirstOrThrow({ args, query }) {
        args.where = { deletedAt: null, ...args.where }
        return query(args)
      },
      findUnique({ args, query }) {
        // findUnique tidak support deletedAt filter langsung (harus pakai unique field)
        // Gunakan findUniqueOrThrow / findFirst jika perlu soft delete check
        return query(args)
      },
      count({ args, query }) {
        args.where = { deletedAt: null, ...args.where }
        return query(args)
      },
    },
    reseller: {
      findMany({ args, query }) {
        args.where = { deletedAt: null, ...args.where }
        return query(args)
      },
      findFirst({ args, query }) {
        args.where = { deletedAt: null, ...args.where }
        return query(args)
      },
      findFirstOrThrow({ args, query }) {
        args.where = { deletedAt: null, ...args.where }
        return query(args)
      },
      count({ args, query }) {
        args.where = { deletedAt: null, ...args.where }
        return query(args)
      },
    },
    wedding: {
      findMany({ args, query }) {
        args.where = { deletedAt: null, ...args.where }
        return query(args)
      },
      findFirst({ args, query }) {
        args.where = { deletedAt: null, ...args.where }
        return query(args)
      },
      findFirstOrThrow({ args, query }) {
        args.where = { deletedAt: null, ...args.where }
        return query(args)
      },
      count({ args, query }) {
        args.where = { deletedAt: null, ...args.where }
        return query(args)
      },
    },
  },
})

const prismaClientSingleton = () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)

  return new PrismaClient({ adapter }).$extends(softDeleteExtension)
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/**
 * CARA PENGGUNAAN SOFT DELETE:
 *
 * // DELETE (soft) — set deletedAt, jangan gunakan prisma.user.delete()
 * await prisma.user.update({ where: { id }, data: { deletedAt: new Date() } })
 *
 * // QUERY normal — deletedAt: null otomatis diterapkan
 * await prisma.wedding.findMany({ where: { resellerId }, include: { events: true } })
 * // ✅ AMAN: include.events tidak tersentuh oleh extension ini
 *
 * // QUERY termasuk data yang sudah di-soft-delete (misal halaman admin restore)
 * await prisma.user.findMany({ where: { deletedAt: { not: null } } })
 * // ✅ AMAN: user where { deletedAt: not null } akan override { deletedAt: null }
 */
