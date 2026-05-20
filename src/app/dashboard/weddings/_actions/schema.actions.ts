'use server'
/**
 * Server Actions — Schema Editor
 * Update template sections + theme pada wedding's template themeConfig.
 */
import { z } from 'zod'
import { requireTenant } from '@/lib/tenant-guard'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

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
  const ctx = await requireTenant()
  const parsed = UpdateSchemaInput.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Input tidak valid.' }
  }

  const { weddingId, sections, theme } = parsed.data

  // Verify ownership
  const wedding = await (prisma as any).wedding.findFirst({
    where: { id: weddingId, tenantId: ctx.tenantId },
    select: { id: true, templateId: true },
  })
  if (!wedding) return { success: false, error: 'Wedding tidak ditemukan.' }

  // Load current themeConfig
  const template = await (prisma as any).template.findFirst({
    where: { id: wedding.templateId },
    select: { themeConfig: true },
  })

  const currentConfig = (template?.themeConfig as any) ?? { version: 1, theme: {}, sections: [] }

  // Merge updates
  const updatedConfig = {
    version: 1,
    theme: theme ?? currentConfig.theme ?? {},
    sections: sections ?? currentConfig.sections ?? [],
  }

  // Update template themeConfig
  await (prisma as any).template.update({
    where: { id: wedding.templateId },
    data: { themeConfig: updatedConfig },
  })

  revalidatePath(`/dashboard/weddings/${weddingId}/editor`)
  revalidatePath(`/${weddingId}`) // revalidate public page
  return { success: true }
}

export async function switchTemplateAction(weddingId: string, templateId: string): Promise<ActionResult> {
  const ctx = await requireTenant()

  const wedding = await (prisma as any).wedding.findFirst({
    where: { id: weddingId, tenantId: ctx.tenantId },
    select: { id: true },
  })
  if (!wedding) return { success: false, error: 'Wedding tidak ditemukan.' }

  const template = await (prisma as any).template.findFirst({
    where: { id: templateId },
    select: { id: true },
  })
  if (!template) return { success: false, error: 'Template tidak ditemukan.' }

  await (prisma as any).wedding.update({
    where: { id: weddingId },
    data: { templateId },
  })

  revalidatePath('/dashboard/weddings')
  revalidatePath(`/dashboard/weddings/${weddingId}`)
  return { success: true }
}
