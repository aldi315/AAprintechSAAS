/**
 * PRESENTATION — Template Schema Validator & Parser
 *
 * Zod validation + safe parser untuk template schema JSON.
 * Mendukung versioning: v1 (saat ini), future v2+.
 */
import { z } from 'zod'
import type { TemplateSchema } from '@/core/entities/template-schema.entity'
import { DEFAULT_THEME } from '@/core/entities/template-schema.entity'
import { elegantRoseSchema } from './default-templates/elegant-rose'

// ─── Zod Schemas ───────────────────────────────────────────────────────────────

const ThemeSchemaZod = z.object({
  primaryColor: z.string().default('#C8A882'),
  secondaryColor: z.string().default('#F5F0EA'),
  accentColor: z.string().default('#8B6F47'),
  backgroundColor: z.string().default('#FDFAF6'),
  textColor: z.string().default('#2D2D2D'),
  fontHeading: z.enum(['playfair', 'cormorant', 'great-vibes', 'lato', 'inter']).default('playfair'),
  fontScript: z.enum(['playfair', 'cormorant', 'great-vibes', 'lato', 'inter']).default('great-vibes'),
  fontBody: z.enum(['playfair', 'cormorant', 'great-vibes', 'lato', 'inter']).default('lato'),
})

const SectionSchemaZod = z.object({
  id: z.string(),
  type: z.enum(['hero', 'couple', 'event', 'countdown', 'gallery', 'rsvp', 'closing']),
  enabled: z.boolean().default(true),
  props: z.record(z.string(), z.unknown()).default({}),
})

const TemplateSchemaV1Zod = z.object({
  version: z.literal(1),
  theme: ThemeSchemaZod,
  sections: z.array(SectionSchemaZod),
})

// ─── Parser ─────────────────────────────────────────────────────────────────────

/**
 * Parse template schema dari JSON (Prisma themeConfig).
 * Return default elegant-rose schema jika invalid/kosong.
 */
export function parseTemplateSchema(raw: unknown): TemplateSchema {
  if (!raw || typeof raw !== 'object' || Object.keys(raw as object).length === 0) {
    return elegantRoseSchema
  }

  const result = TemplateSchemaV1Zod.safeParse(raw)
  if (result.success) {
    return result.data as TemplateSchema
  }

  // Coba parse partial — ambil theme saja jika ada
  const partialResult = z.object({
    theme: ThemeSchemaZod.optional(),
    sections: z.array(SectionSchemaZod).optional(),
  }).safeParse(raw)

  if (partialResult.success) {
    return {
      version: 1,
      theme: partialResult.data.theme ?? DEFAULT_THEME,
      sections: partialResult.data.sections ?? elegantRoseSchema.sections,
    }
  }

  return elegantRoseSchema
}

/**
 * Validate apakah JSON adalah valid TemplateSchema.
 */
export function isValidTemplateSchema(raw: unknown): raw is TemplateSchema {
  return TemplateSchemaV1Zod.safeParse(raw).success
}
