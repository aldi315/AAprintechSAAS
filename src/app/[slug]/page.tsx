import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { publicWeddingRepository } from '@/infrastructure/repositories/public-wedding.repository'
import { InvitationRenderMapper } from '@/application/mappers/invitation-render.mapper'
import { InvitationRenderer } from '@/presentation/invitation/renderer/InvitationRenderer'
import { CoverScreen } from '@/presentation/invitation/sections/CoverScreen'
import { MusicPlayer } from '@/presentation/invitation/sections/MusicPlayer'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ to?: string; code?: string }>
}

// ─── Dynamic Metadata (SEO + OG) ──────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const wedding = await publicWeddingRepository.findPublishedBySlug(slug)

  if (!wedding) {
    return { title: 'Undangan tidak ditemukan', robots: { index: false } }
  }

  const dto = InvitationRenderMapper.toDTO(wedding)
  const title = dto.seoMeta.title ?? `Undangan Pernikahan ${dto.brideName} & ${dto.groomName}`
  const description = dto.seoMeta.description ?? `Dengan penuh kebahagiaan, kami mengundang Anda untuk hadir di pernikahan ${dto.brideName} & ${dto.groomName}.`
  const ogImage = dto.seoMeta.ogImage ?? dto.coverImage

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'id_ID',
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function InvitationPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { to: guestName, code: guestCode } = await searchParams

  // Load ONLY published wedding — return 404 for draft/archived/deleted
  const wedding = await publicWeddingRepository.findPublishedBySlug(slug)
  if (!wedding) notFound()

  // Increment view count (fire and forget)
  publicWeddingRepository.incrementViewCount(wedding.id)

  // Map DB entity → Renderer DTO
  const dto = InvitationRenderMapper.toDTO(wedding)

  return (
    <>
      {/* Cover screen — selalu tampil, fade out saat diklik */}
      <CoverScreen
        data={dto}
        props={{}}
        guestName={guestName}
        guestCode={guestCode}
      />

      {/* Main invitation renderer */}
      <main>
        <InvitationRenderer
          data={dto}
          guestName={guestName}
          guestCode={guestCode}
        />
      </main>

      {/* Floating music player — hanya jika ada musicUrl */}
      {dto.musicUrl && <MusicPlayer musicUrl={dto.musicUrl} />}
    </>
  )
}
