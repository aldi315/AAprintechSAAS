'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/infrastructure/auth/authOptions'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function requireSuperAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    redirect('/admin')
  }
  return session
}

export async function updateAdminTenantSettings(formData: FormData) {
  const session = await requireSuperAdmin()

  const businessName = formData.get('businessName') as string
  if (!businessName || businessName.trim().length < 2) {
    return { success: false, error: 'Nama bisnis minimal 2 karakter.' }
  }

  if (!session.user.tenantId) {
    return { success: false, error: 'Tenant admin tidak ditemukan.' }
  }

  try {
    await (prisma as any).tenant.update({
      where: { id: session.user.tenantId },
      data: { businessName: businessName.trim() }
    })

    revalidatePath('/admin/settings')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal menyimpan pengaturan.' }
  }
}

export async function createAdminTenantAction(formData: FormData) {
  const session = await requireSuperAdmin()

  if (session.user.tenantId) {
    return { success: false, error: 'Admin sudah memiliki tenant.' }
  }

  const businessName = formData.get('businessName') as string

  if (!businessName || businessName.trim().length < 2) {
    return { success: false, error: 'Nama bisnis minimal 2 karakter.' }
  }

  try {
    // Auto-generate a unique slug for the admin tenant (not publicly visible)
    const baseSlug = 'admin-' + businessName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
    let slug = baseSlug
    let counter = 0
    while (await (prisma as any).tenant.findUnique({ where: { slug } })) {
      counter++
      slug = `${baseSlug}-${counter}`
    }

    await (prisma as any).tenant.create({
      data: {
        businessName: businessName.trim(),
        slug,
        ownerId: session.user.id,
        subscriptionStatus: 'ACTIVE',
      }
    })

    revalidatePath('/admin/settings')
    revalidatePath('/admin/weddings')
    return { success: true, needsRelogin: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal membuat profil bisnis.' }
  }
}
