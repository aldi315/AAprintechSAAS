'use server'
/**
 * Server Actions — Wedding CRUD
 * Tenant-safe via requireTenant() + tenant-scoped Prisma.
 */
import { z } from 'zod'
import { requireTenant } from '@/lib/tenant-guard'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const CreateWeddingSchema = z.object({
  brideName: z.string().min(2, 'Nama mempelai wanita wajib diisi'),
  groomName: z.string().min(2, 'Nama mempelai pria wajib diisi'),
  slug: z.string().min(3, 'Slug minimal 3 karakter').regex(/^[a-z0-9-]+$/, 'Slug hanya huruf kecil, angka, dan dash'),
  templateId: z.string().min(1, 'Pilih template'),
  timezone: z.string().default('Asia/Jakarta'),
})

const UpdateWeddingSchema = z.object({
  brideName: z.string().min(2).optional(),
  groomName: z.string().min(2).optional(),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/).optional(),
  coverImage: z.string().nullable().optional(),
  musicUrl: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  mapsUrl: z.string().nullable().optional(),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  timezone: z.string().optional(),
})

interface ActionResult {
  success: boolean
  error?: string
  id?: string
}

export async function createWeddingAction(formData: FormData): Promise<ActionResult> {
  const ctx = await requireTenant()

  const parsed = CreateWeddingSchema.safeParse({
    brideName: formData.get('brideName'),
    groomName: formData.get('groomName'),
    slug: formData.get('slug'),
    templateId: formData.get('templateId'),
    timezone: formData.get('timezone') ?? 'Asia/Jakarta',
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Input tidak valid.' }
  }

  const { brideName, groomName, slug, templateId, timezone } = parsed.data

  // Check slug uniqueness
  const existing = await (prisma as any).wedding.findFirst({ where: { slug } })
  if (existing) return { success: false, error: 'Slug sudah digunakan. Pilih slug lain.' }

  const wedding = await (prisma as any).wedding.create({
    data: {
      tenantId: ctx.tenantId,
      brideName,
      groomName,
      slug,
      templateId,
      timezone,
      status: 'DRAFT',
    },
  })

  revalidatePath('/dashboard/weddings')
  return { success: true, id: wedding.id }
}

export async function updateWeddingAction(weddingId: string, formData: FormData): Promise<ActionResult> {
  const ctx = await requireTenant()

  // Verify ownership
  const wedding = await (prisma as any).wedding.findFirst({
    where: { id: weddingId, tenantId: ctx.tenantId },
    select: { id: true },
  })
  if (!wedding) return { success: false, error: 'Wedding tidak ditemukan.' }

  const data: Record<string, unknown> = {}
  const fields = ['brideName', 'groomName', 'slug', 'coverImage', 'musicUrl', 'location', 'mapsUrl', 'metaTitle', 'metaDescription', 'timezone']
  for (const f of fields) {
    const val = formData.get(f)
    if (val !== null) data[f] = val === '' ? null : val
  }

  // Re-validate slug uniqueness if changed
  if (data.slug) {
    const slugConflict = await (prisma as any).wedding.findFirst({
      where: { slug: data.slug as string, id: { not: weddingId } },
      select: { id: true },
    })
    if (slugConflict) return { success: false, error: 'Slug sudah digunakan.' }
  }

  await (prisma as any).wedding.update({
    where: { id: weddingId },
    data,
  })

  revalidatePath('/dashboard/weddings')
  revalidatePath(`/dashboard/weddings/${weddingId}`)
  return { success: true }
}

export async function deleteWeddingAction(weddingId: string): Promise<ActionResult> {
  const ctx = await requireTenant()
  const wedding = await (prisma as any).wedding.findFirst({
    where: { id: weddingId, tenantId: ctx.tenantId },
    select: { id: true },
  })
  if (!wedding) return { success: false, error: 'Wedding tidak ditemukan.' }

  await (prisma as any).wedding.delete({ where: { id: weddingId } })
  revalidatePath('/dashboard/weddings')
  return { success: true }
}

export async function togglePublishAction(weddingId: string): Promise<ActionResult> {
  const ctx = await requireTenant()
  const wedding = await (prisma as any).wedding.findFirst({
    where: { id: weddingId, tenantId: ctx.tenantId },
    select: { id: true, status: true },
  })
  if (!wedding) return { success: false, error: 'Wedding tidak ditemukan.' }

  const newStatus = wedding.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
  await (prisma as any).wedding.update({ where: { id: weddingId }, data: { status: newStatus } })

  revalidatePath('/dashboard/weddings')
  return { success: true }
}
