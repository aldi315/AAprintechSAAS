/**
 * APPLICATION QUERIES — Admin Super Dashboard
 * Mengambil data global (cross-tenant) untuk keperluan SUPER_ADMIN.
 */
import { prisma } from '@/lib/prisma'
import { readdir, stat, mkdir } from 'fs/promises'
import path from 'path'

export interface AdminSystemStats {
  resellerCount: number
  weddingCount: number
  rsvpCount: number
  activeSubscriptions: number
  totalRevenue: number
}

export async function getAdminSystemStats(): Promise<AdminSystemStats> {
  const [resellerCount, weddingCount, rsvpCount, subscriptions, payments] = await Promise.all([
    (prisma as any).reseller.count(),
    (prisma as any).wedding.count(),
    (prisma as any).rSVP.count(),
    (prisma as any).subscription.count({ where: { paymentStatus: 'PAID' } }),
    (prisma as any).payment.findMany({ where: { status: 'PAID' }, select: { amount: true } })
  ])

  const totalRevenue = payments.reduce((acc: number, p: any) => acc + Number(p.amount), 0)

  return {
    resellerCount,
    weddingCount,
    rsvpCount,
    activeSubscriptions: subscriptions,
    totalRevenue
  }
}

export async function getAllResellers() {
  return (prisma as any).reseller.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      owner: { select: { email: true, name: true, role: true } },
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
      reseller: { select: { businessName: true, owner: { select: { email: true } } } }
    },
    take: 100
  })
}

export async function getAllTemplates() {
  return (prisma as any).template.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: true
    }
  })
}

export async function getAllCategories() {
  return (prisma as any).templateCategory.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { templates: true }
      }
    }
  })
}

export async function getAllMedia() {
  return (prisma as any).media.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      reseller: { select: { businessName: true } }
    },
    take: 100
  })
}

export async function getGlobalActivityLogs() {
  return (prisma as any).activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      reseller: { select: { businessName: true } }
    },
    take: 100
  })
}

export async function getAllWeddings() {
  return (prisma as any).wedding.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      reseller: { select: { businessName: true } },
      template: { select: { name: true } },
      _count: {
        select: { guests: true, rsvps: true }
      }
    }
  })
}

export async function getWeddingDetails(id: string) {
  return (prisma as any).wedding.findUnique({
    where: { id },
    include: {
      reseller: { select: { businessName: true } },
      template: { select: { name: true } }
    }
  })
}

export async function getWeddingGuests(weddingId: string) {
  return (prisma as any).invitationGuest.findMany({
    where: { weddingId },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getWeddingRSVPs(weddingId: string) {
  return (prisma as any).rSVP.findMany({
    where: { weddingId },
    orderBy: { createdAt: 'desc' },
    include: {
      guest: { select: { guestName: true, guestCode: true } }
    }
  })
}

export async function getAllUsers() {
  return (prisma as any).user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { ownedResellers: true }
      }
    }
  })
}

export async function getLocalUploadsAsMedia() {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    try { await mkdir(uploadDir, { recursive: true }) } catch (e) {}

    const files = await readdir(uploadDir)
    
    const localMedia = await Promise.all(
      files.map(async (filename) => {
        const filepath = path.join(uploadDir, filename)
        const fileStat = await stat(filepath)
        
        let ext = path.extname(filename).toLowerCase()
        let fileType = 'application/octet-stream'
        if (['.jpg', '.jpeg'].includes(ext)) fileType = 'image/jpeg'
        if (ext === '.png') fileType = 'image/png'
        if (ext === '.webp') fileType = 'image/webp'
        
        return {
          id: `local-${filename}`,
          resellerId: 'system',
          weddingId: null,
          provider: 'local',
          fileUrl: `/uploads/${filename}`,
          fileType: fileType,
          size: fileStat.size,
          createdAt: fileStat.mtime,
          reseller: { businessName: 'System (Local)' }
        }
      })
    )
    return localMedia
  } catch (error) {
    console.error('Error reading local uploads:', error)
    return []
  }
}
