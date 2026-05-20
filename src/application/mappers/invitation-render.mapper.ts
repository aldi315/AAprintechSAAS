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
  brideName: string
  groomName: string
  coverImage: string | null
  musicUrl: string | null
  gallery: unknown              // Prisma Json
  timezone: string
  metaTitle: string | null
  metaDescription: string | null
  ogImage: string | null
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
  tenant: {
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

    // Parse & validate template schema (fallback ke default jika invalid)
    const parsedSchema = parseTemplateSchema(wedding.template.themeConfig)

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
      tenant: {
        slug: wedding.tenant.slug,
        businessName: wedding.tenant.businessName,
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
