/**
 * PRESENTATION — Theme Config
 * Map FontKey → CSS font-family string dan generate CSS variables.
 */
import type { ThemeSchema, FontKey } from '@/core/entities/template-schema.entity'

export const FONT_MAP: Record<FontKey, string> = {
  'playfair': '"Playfair Display", Georgia, serif',
  'cormorant': '"Cormorant Garamond", Georgia, serif',
  'great-vibes': '"Great Vibes", cursive',
  'lato': '"Lato", "Helvetica Neue", Helvetica, Arial, sans-serif',
  'inter': '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
}

/** Build CSS variables object dari ThemeSchema */
export function buildThemeCssVars(theme: ThemeSchema): Record<string, string> {
  return {
    '--inv-primary': theme.primaryColor,
    '--inv-secondary': theme.secondaryColor,
    '--inv-accent': theme.accentColor,
    '--inv-bg': theme.backgroundColor,
    '--inv-text': theme.textColor,
    '--inv-font-heading': FONT_MAP[theme.fontHeading] ?? FONT_MAP['playfair'],
    '--inv-font-script': FONT_MAP[theme.fontScript] ?? FONT_MAP['great-vibes'],
    '--inv-font-body': FONT_MAP[theme.fontBody] ?? FONT_MAP['lato'],
  }
}
