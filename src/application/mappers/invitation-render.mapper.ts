/**
 * APPLICATION LAYER — Invitation Render Mapper
 *
 * Map Prisma Wedding entity (dengan includes) → InvitationRenderDTO.
 * Semua tanggal dikonversi ke ISO string untuk JSON-serialization.
 * Pisahkan database model dari UI renderer.
 */
import type { InvitationRenderDTO, GalleryItem, WeddingEventDTO } from '@/core/entities/invitation-render.entity'
import type { TemplateSchema } from '@/core/entities/template-schema.entity'
import { DEFAULT_THEME } from '@/core/entities/template-schema.entity'
import { parseTemplateSchema } from '@/presentation/invitation/schemas/template.schema'

/** Shape Prisma Wedding dengan includes yang dibutuhkan mapper */
export interface WeddingWithIncludes {
  id: string
  slug: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  brideName: string
  groomName: string
  coverImage: string | null
  musicUrl: string | null
  gallery: unknown              // Prisma Json
  timezone: string
  metaTitle: string | null
  metaDescription: string | null
  ogImage: string | null
  customConfig: unknown         // Prisma Json
  events: Array<{
    id: string
    name: string
    startTime: Date
    endTime: Date | null
    location: string | null
    mapsUrl: string | null
    dresscode: string | null
    note: string | null
  }>
  template: {
    id: string
    name: string
    themeConfig: unknown         // Prisma Json
  }
  reseller: {
    slug: string
    businessName: string
  }
}

export class InvitationRenderMapper {
  static toDTO(wedding: WeddingWithIncludes): InvitationRenderDTO {
    // Parse gallery JSON safely
    const gallery = InvitationRenderMapper.parseGallery(wedding.gallery)

    // Parse events
    const events: WeddingEventDTO[] = wedding.events.map((e) => ({
      id: e.id,
      name: e.name,
      startTime: e.startTime.toISOString(),
      endTime: e.endTime?.toISOString() ?? null,
      location: e.location,
      mapsUrl: e.mapsUrl,
      dresscode: e.dresscode,
      note: e.note,
    }))

    // Parse wedding customConfig overrides or snapshot
    let customConfig: Record<string, any> | null = null
    if (wedding.customConfig && typeof wedding.customConfig === 'object') {
      customConfig = wedding.customConfig as Record<string, any>
    }

    // Prioritaskan customConfig sebagai konfigurasi absolut (snapshot) jika memiliki array sections.
    // Hal ini memastikan desain undangan tidak berubah jika master template dimodifikasi di masa depan.
    const baseConfig = (customConfig && customConfig.sections && Array.isArray(customConfig.sections))
      ? customConfig
      : wedding.template.themeConfig

    // Parse & validate template schema
    const parsedSchema = parseTemplateSchema(baseConfig)

    // Fallback: Jika customConfig hanya berisi partial override (legacy data), merge theme secara manual
    if (customConfig && customConfig.theme && baseConfig === wedding.template.themeConfig) {
      parsedSchema.theme = { ...parsedSchema.theme, ...customConfig.theme }
    }

    return {
      id: wedding.id,
      slug: wedding.slug,
      brideName: wedding.brideName,
      groomName: wedding.groomName,
      coverImage: wedding.coverImage,
      musicUrl: wedding.musicUrl,
      gallery,
      events,
      timezone: wedding.timezone,
      template: {
        id: wedding.template.id,
        name: wedding.template.name,
        themeConfig: parsedSchema as unknown as Record<string, unknown>,
      },
      seoMeta: {
        title: wedding.metaTitle,
        description: wedding.metaDescription,
        ogImage: wedding.ogImage,
      },
      reseller: {
        slug: wedding.reseller.slug,
        businessName: wedding.reseller.businessName,
      },
    }
  }

  private static parseGallery(raw: unknown): GalleryItem[] {
    if (!Array.isArray(raw)) return []
    return raw
      .filter((item): item is { url: string; caption?: string } =>
        typeof item === 'object' && item !== null && typeof (item as any).url === 'string',
      )
      .map((item) => ({
        url: item.url,
        caption: item.caption,
      }))
  }
}
