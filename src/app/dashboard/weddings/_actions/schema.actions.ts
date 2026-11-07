'use server'
/**
 * Server Actions — Schema Editor
 * Update sections + theme pada wedding.customConfig (snapshot per wedding).
 */
import { z } from 'zod'
import { requireReseller } from '@/lib/reseller-guard'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getEffectiveConfig } from '@/application/queries/wedding-config.queries'

const SectionItemSchema = z.object({
  id: z.string(),
  type: z.string(),
  enabled: z.boolean(),
  props: z.record(z.string(), z.unknown()),
})

const ThemeDataSchema = z.object({
  primaryColor: z.string(),
  secondaryColor: z.string(),
  accentColor: z.string(),
  backgroundColor: z.string(),
  textColor: z.string(),
  fontHeading: z.string(),
  fontScript: z.string(),
  fontBody: z.string(),
})

const UpdateSchemaInput = z.object({
  weddingId: z.string().min(1),
  sections: z.array(SectionItemSchema).optional(),
  theme: ThemeDataSchema.optional(),
})

interface ActionResult { success: boolean; error?: string }

export async function updateSchemaAction(input: z.infer<typeof UpdateSchemaInput>): Promise<ActionResult> {
  const ctx = await requireReseller()
  const parsed = UpdateSchemaInput.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Input tidak valid.' }
  }

  const { weddingId, sections, theme } = parsed.data

  // Verify ownership
  const wedding = await (prisma as any).wedding.findFirst({
    where: { id: weddingId, resellerId: ctx.resellerId },
    select: { id: true, slug: true, templateId: true, customConfig: true },
  })
  if (!wedding) return { success: false, error: 'Wedding tidak ditemukan.' }

  // Konfigurasi efektif = snapshot milik wedding (customConfig) jika ada,
  // selain itu master template. Urutan ini sama dengan InvitationRenderMapper.
  const currentConfig = await getEffectiveConfig(wedding)

  const updatedConfig = {
    ...currentConfig,
    version: 1,
    theme: theme ?? currentConfig.theme ?? {},
    sections: sections ?? currentConfig.sections ?? [],
  }

  // PENTING: simpan ke wedding.customConfig milik reseller ini, BUKAN ke Template.
  // Template adalah master global yang dipakai semua reseller — menulis ke sana
  // membuat editan reseller A ikut mengubah undangan reseller lain.
  await (prisma as any).wedding.update({
    where: { id: wedding.id },
    data: { customConfig: updatedConfig },
  })

  revalidatePath(`/dashboard/weddings/${weddingId}/editor`)
  revalidatePath(`/invitation/${wedding.slug}`) // revalidate public page
  return { success: true }
}


export async function switchTemplateAction(weddingId: string, templateId: string): Promise<ActionResult> {
  const ctx = await requireReseller()

  const wedding = await (prisma as any).wedding.findFirst({
    where: { id: weddingId, resellerId: ctx.resellerId },
    select: { id: true },
  })
  if (!wedding) return { success: false, error: 'Wedding tidak ditemukan.' }

  const template = await (prisma as any).template.findFirst({
    where: { id: templateId, active: true },
    select: { id: true, themeConfig: true },
  })
  if (!template) return { success: false, error: 'Template tidak ditemukan.' }

  // Reset snapshot desain ke template baru; kalau tidak, customConfig lama
  // (milik template sebelumnya) tetap diprioritaskan dan pergantian tidak terlihat.
  await (prisma as any).wedding.update({
    where: { id: weddingId },
    data: { templateId, customConfig: template.themeConfig ?? {} },
  })

  revalidatePath('/dashboard/weddings')
  revalidatePath(`/dashboard/weddings/${weddingId}`)
  return { success: true }
}
