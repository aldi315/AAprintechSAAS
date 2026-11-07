/**
 * Konfigurasi desain efektif sebuah wedding.
 * Sengaja TIDAK di file 'use server' agar tidak terekspos sebagai Server Action publik.
 */
import { prisma } from '@/lib/prisma'

/**
 * Snapshot wedding (customConfig dengan array sections) diprioritaskan;
 * fallback ke themeConfig master template.
 */
export async function getEffectiveConfig(wedding: {
  templateId: string
  customConfig: unknown
}): Promise<Record<string, any>> {
  const custom = wedding.customConfig as Record<string, any> | null
  if (custom && typeof custom === 'object' && Array.isArray(custom.sections)) {
    return custom
  }

  const template = await (prisma as any).template.findFirst({
    where: { id: wedding.templateId },
    select: { themeConfig: true },
  })
  const base = (template?.themeConfig as Record<string, any>) ?? { version: 1, theme: {}, sections: [] }

  // Data lama: customConfig hanya berisi override theme parsial
  if (custom && typeof custom === 'object' && custom.theme) {
    return { ...base, theme: { ...(base.theme ?? {}), ...custom.theme } }
  }
  return base
}
