/**
 * CORE LAYER — Invitation Render DTO
 *
 * Shape bersih yang diterima oleh renderer engine.
 * TIDAK ada Prisma types di sini — isolasi database dari UI.
 *
 * Semua tanggal dalam ISO string (JSON-serializable untuk
 * props Server→Client Component di Next.js App Router).
 */

export interface GalleryItem {
  url: string
  caption?: string
}

export interface WeddingEventDTO {
  id: string
  name: string        // "Akad Nikah", "Resepsi", "Ngunduh Mantu"
  startTime: string   // ISO string
  endTime: string | null
  location: string | null
  mapsUrl: string | null
  dresscode: string | null
  note: string | null
}

export interface SeoMetaDTO {
  title: string | null
  description: string | null
  ogImage: string | null
}

export interface ResellerDTO {
  slug: string
  businessName: string
}

export interface TemplateDTO {
  id: string
  name: string
  /** Full template schema JSON (version, theme, sections[]) */
  themeConfig: Record<string, unknown>
}

/**
 * InvitationRenderDTO — satu-satunya input ke renderer engine.
 * Dibuat dari Wedding entity via InvitationRenderMapper.
 */
export interface InvitationRenderDTO {
  id: string
  slug: string

  // Pasangan
  brideName: string
  groomName: string

  // Media
  coverImage: string | null
  musicUrl: string | null
  gallery: GalleryItem[]

  // Events (multi-event: akad, resepsi, ngunduh mantu)
  events: WeddingEventDTO[]

  // Waktu & lokasi fallback
  timezone: string // "Asia/Jakarta"

  // Template
  template: TemplateDTO

  // SEO (for WhatsApp sharing)
  seoMeta: SeoMetaDTO

  // Reseller context (public, non-sensitive)
  reseller: ResellerDTO
}
