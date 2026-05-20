'use server'
/**
 * Server Actions — Guest CRUD
 */
import { z } from 'zod'
import { requireTenant } from '@/lib/tenant-guard'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { randomBytes } from 'crypto'

const CreateGuestSchema = z.object({
  weddingId: z.string().min(1),
  guestName: z.string().min(1, 'Nama tamu wajib diisi').max(100),
  phone: z.string().optional(),
})

interface ActionResult { success: boolean; error?: string }

function generateGuestCode(): string {
  return randomBytes(4).toString('hex').toUpperCase()
}

export async function createGuestAction(formData: FormData): Promise<ActionResult> {
  const ctx = await requireTenant()
  const parsed = CreateGuestSchema.safeParse({
    weddingId: formData.get('weddingId'),
    guestName: formData.get('guestName'),
    phone: formData.get('phone') || undefined,
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Input tidak valid.' }
  }

  // Verify wedding ownership
  const wedding = await (prisma as any).wedding.findFirst({
    where: { id: parsed.data.weddingId, tenantId: ctx.tenantId },
    select: { id: true },
  })
  if (!wedding) return { success: false, error: 'Wedding tidak ditemukan.' }

  await (prisma as any).invitationGuest.create({
    data: {
      weddingId: parsed.data.weddingId,
      guestName: parsed.data.guestName,
      phone: parsed.data.phone ?? null,
      guestCode: generateGuestCode(),
      attendanceStatus: 'PENDING',
    },
  })

  revalidatePath('/dashboard/guests')
  return { success: true }
}

export async function deleteGuestAction(guestId: string): Promise<ActionResult> {
  const ctx = await requireTenant()

  const guest = await (prisma as any).invitationGuest.findFirst({
    where: { id: guestId, wedding: { tenantId: ctx.tenantId } },
    select: { id: true },
  })
  if (!guest) return { success: false, error: 'Tamu tidak ditemukan.' }

  // Delete related RSVPs first
  await (prisma as any).rSVP.deleteMany({ where: { guestId } })
  await (prisma as any).invitationGuest.delete({ where: { id: guestId } })

  revalidatePath('/dashboard/guests')
  return { success: true }
}
