'use server'
/**
 * SERVER ACTION — Submit RSVP
 * Upsert berdasarkan weddingId + guestCode (atau guestName sebagai fallback).
 */
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const RsvpInputSchema = z.object({
  weddingId: z.string().min(1),
  guestName: z.string().min(1, 'Nama wajib diisi.').max(100),
  guestCode: z.string().optional(),
  attendance: z.enum(['ATTENDING', 'NOT_ATTENDING', 'MAYBE']),
  totalGuest: z.number().int().min(1).max(10).default(1),
  message: z.string().max(500).optional(),
})

type RsvpInput = z.infer<typeof RsvpInputSchema>

interface ActionResult {
  success: boolean
  error?: string
}

export async function submitRsvpAction(input: RsvpInput): Promise<ActionResult> {
  // Validate input
  const parsed = RsvpInputSchema.safeParse(input)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return { success: false, error: firstError?.message ?? 'Input tidak valid.' }
  }

  const { weddingId, guestName, guestCode, attendance, totalGuest, message } = parsed.data

  try {
    // Verifikasi wedding exists + PUBLISHED (security check)
    const wedding = await (prisma as any).wedding.findFirst({
      where: { id: weddingId, status: 'PUBLISHED' },
      select: { id: true },
    })

    if (!wedding) {
      return { success: false, error: 'Undangan tidak ditemukan.' }
    }

    // Temukan atau buat InvitationGuest berdasarkan guestCode (jika ada)
    let guest = null
    if (guestCode) {
      guest = await (prisma as any).invitationGuest.findFirst({
        where: { weddingId, guestCode },
        select: { id: true },
      })
    }

    if (!guest) {
      // Buat guest baru jika belum ada
      guest = await (prisma as any).invitationGuest.create({
        data: {
          weddingId,
          guestName,
          guestCode: guestCode ?? `manual-${Date.now()}`,
          attendanceStatus: attendance,
        },
      })
    } else {
      // Update attendanceStatus guest
      await (prisma as any).invitationGuest.update({
        where: { id: guest.id },
        data: { attendanceStatus: attendance },
      })
    }

    // Upsert RSVP
    const existing = await (prisma as any).rSVP.findFirst({
      where: { weddingId, guestId: guest.id },
      select: { id: true },
    })

    if (existing) {
      await (prisma as any).rSVP.update({
        where: { id: existing.id },
        data: {
          attendance,
          totalGuest,
          message: message ?? '',
          updatedAt: new Date(),
        },
      })
    } else {
      await (prisma as any).rSVP.create({
        data: {
          weddingId,
          guestId: guest.id,
          attendance,
          totalGuest,
          message: message ?? '',
        },
      })
    }

    return { success: true }
  } catch (err) {
    console.error('[submitRsvpAction]', err)
    return { success: false, error: 'Terjadi kesalahan server. Silakan coba lagi.' }
  }
}
