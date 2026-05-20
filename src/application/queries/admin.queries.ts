/**
 * APPLICATION QUERIES — Admin Super Dashboard
 * Mengambil data global (cross-tenant) untuk keperluan SUPER_ADMIN.
 */
import { prisma } from '@/lib/prisma'

export interface AdminSystemStats {
  tenantCount: number
  weddingCount: number
  rsvpCount: number
  activeSubscriptions: number
  totalRevenue: number
}

export async function getAdminSystemStats(): Promise<AdminSystemStats> {
  const [tenantCount, weddingCount, rsvpCount, subscriptions, payments] = await Promise.all([
    (prisma as any).tenant.count(),
    (prisma as any).wedding.count(),
    (prisma as any).rSVP.count(),
    (prisma as any).subscription.count({ where: { paymentStatus: 'PAID' } }),
    (prisma as any).payment.findMany({ where: { status: 'PAID' }, select: { amount: true } })
  ])

  const totalRevenue = payments.reduce((acc: number, p: any) => acc + Number(p.amount), 0)

  return {
    tenantCount,
    weddingCount,
    rsvpCount,
    activeSubscriptions: subscriptions,
    totalRevenue
  }
}

export async function getAllTenants() {
  return (prisma as any).tenant.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      owner: { select: { email: true, name: true } },
      _count: {
        select: { weddings: true, media: true }
      }
    }
  })
}

export async function getAllPayments() {
  return (prisma as any).payment.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      tenant: { select: { businessName: true, owner: { select: { email: true } } } }
    },
    take: 100
  })
}

export async function getAllTemplates() {
  return (prisma as any).template.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

export async function getAllMedia() {
  return (prisma as any).media.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      tenant: { select: { businessName: true } }
    },
    take: 100
  })
}

export async function getGlobalActivityLogs() {
  return (prisma as any).activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      tenant: { select: { businessName: true } }
    },
    take: 100
  })
}
