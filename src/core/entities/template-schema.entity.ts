/**
 * CORE LAYER — Template Schema Entity
 *
 * Internal schema JSON yang disimpan di Template.themeConfig.
 * Schema-driven architecture: satu schema JSON mendrive seluruh tampilan undangan.
 *
 * Format JSON di database:
 * {
 *   "version": 1,
 *   "theme": { "primaryColor": "#C8A882", ... },
 *   "sections": [{ "id": "hero-1", "type": "hero", "enabled": true, "props": {} }]
 * }
 */

// ─── Font Registry ─────────────────────────────────────────────────────────────

export type FontKey = 'playfair' | 'cormorant' | 'great-vibes' | 'lato' | 'inter'

// ─── Theme Schema ──────────────────────────────────────────────────────────────

export interface ThemeSchema {
  primaryColor: string    // "#C8A882" — warm gold
  secondaryColor: string  // "#F5F0EA" — ivory
  accentColor: string     // "#8B6F47" — dark gold
  backgroundColor: string // "#FDFAF6" — cream
  textColor: string       // "#2D2D2D" — near-black

  fontHeading: FontKey    // → CSS var --font-heading (Playfair Display)
  fontScript: FontKey     // → CSS var --font-script  (Great Vibes)
  fontBody: FontKey       // → CSS var --font-body    (Lato)
}

// ─── Section Types ─────────────────────────────────────────────────────────────

export type SectionType =
  | 'hero'
  | 'couple'
  | 'event'
  | 'countdown'
  | 'gallery'
  | 'rsvp'
  | 'closing'

// ─── Section Props — per-section configuration ─────────────────────────────────

export interface HeroSectionProps {
  showCountdown?: boolean
  overlayOpacity?: number // 0–1
}

export interface CoupleSectionProps {
  showParents?: boolean
  layout?: 'side-by-side' | 'stacked'
}

export interface EventSectionProps {
  showDresscode?: boolean
  showMapsButton?: boolean
}

export interface CountdownSectionProps {
  targetEventIndex?: number // index dalam events[] — default 0 (event pertama)
}

export interface GallerySectionProps {
  columns?: 2 | 3
  maxItems?: number
}

export interface RsvpSectionProps {
  showGuestCount?: boolean
  showMessage?: boolean
  requireGuestCode?: boolean
}

export interface ClosingSectionProps {
  message?: string
  hashtag?: string
}

export type SectionProps =
  | HeroSectionProps
  | CoupleSectionProps
  | EventSectionProps
  | CountdownSectionProps
  | GallerySectionProps
  | RsvpSectionProps
  | ClosingSectionProps

// ─── Section Schema ─────────────────────────────────────────────────────────────

export interface SectionSchema {
  id: string          // Unique ID dalam template (e.g., "hero-1")
  type: SectionType
  enabled: boolean    // false → skip rendering
  props: SectionProps // Configuration per section
}

// ─── Template Schema (versioned) ───────────────────────────────────────────────

export interface TemplateSchemaV1 {
  version: 1
  theme: ThemeSchema
  sections: SectionSchema[]
}

/** Union untuk future versioning support */
export type TemplateSchema = TemplateSchemaV1

// ─── Default theme (fallback) ──────────────────────────────────────────────────

export const DEFAULT_THEME: ThemeSchema = {
  primaryColor: '#C8A882',
  secondaryColor: '#F5F0EA',
  accentColor: '#8B6F47',
  backgroundColor: '#FDFAF6',
  textColor: '#2D2D2D',
  fontHeading: 'playfair',
  fontScript: 'great-vibes',
  fontBody: 'lato',
}
