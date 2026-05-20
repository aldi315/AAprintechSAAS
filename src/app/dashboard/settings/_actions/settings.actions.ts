'use server'
/**
 * Server Actions — Tenant Settings
 */
import { z } from 'zod'
import { requireTenant } from '@/lib/tenant-guard'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const UpdateSettingsSchema = z.object({
  businessName: z.string().min(2, 'Nama bisnis minimal 2 karakter').max(100),
})

interface ActionResult { success: boolean; error?: string }

export async function updateTenantSettingsAction(formData: FormData): Promise<ActionResult> {
  const ctx = await requireTenant()

  const parsed = UpdateSettingsSchema.safeParse({
    businessName: formData.get('businessName'),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Input tidak valid.' }
  }

  await (prisma as any).tenant.update({
    where: { id: ctx.tenantId },
    data: { businessName: parsed.data.businessName },
  })

  revalidatePath('/dashboard/settings')
  revalidatePath('/dashboard')
  return { success: true }
}
