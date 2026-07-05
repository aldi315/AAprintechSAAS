import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { publicWeddingRepository } from '@/infrastructure/repositories/public-wedding.repository'
import { InvitationRenderMapper } from '@/application/mappers/invitation-render.mapper'
import { InvitationRenderer } from '@/presentation/invitation/renderer/InvitationRenderer'
import { getSession } from '@/lib/session'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ to?: string; code?: string }>
}

// ─── Dynamic Metadata (SEO + OG) ──────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const wedding = await publicWeddingRepository.findBySlug(slug)

  if (!wedding || wedding.status === 'ARCHIVED') {
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

  const wedding = await publicWeddingRepository.findBySlug(slug)
  if (!wedding || wedding.status === 'ARCHIVED') notFound()

  // Handle DRAFT status
  if (wedding.status === 'DRAFT') {
    const session = await getSession()
    
    // Jika tidak ada session yang aktif, tampilkan halaman khusus belum publish
    if (!session?.user) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-center font-sans">
          <div className="max-w-md space-y-4">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Undangan Belum Dipublikasikan</h1>
            <p className="text-slate-600 leading-relaxed">
              Pemilik undangan ini belum mempublikasikan undangan ini ke publik. 
            </p>
            <div className="pt-6 border-t border-slate-200 mt-6">
              <p className="text-sm text-slate-500 mb-4">Jika Anda pemilik undangan ini, log in untuk mempublikasikan.</p>
              <a href="/login" className="inline-block px-6 py-2 bg-slate-800 text-white text-sm font-medium rounded-full hover:bg-slate-700 transition-colors">
                Log In
              </a>
            </div>
          </div>
        </div>
      )
    }
  }

  // Increment view count (fire and forget) only if it's published
  if (wedding.status === 'PUBLISHED') {
    publicWeddingRepository.incrementViewCount(wedding.id)
  }

  // Map DB entity → Renderer DTO
  const dto = InvitationRenderMapper.toDTO(wedding)

  return (
    <main>
      {wedding.status === 'DRAFT' && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg pointer-events-none">
          PREVIEW DRAFT
        </div>
      )}
      <InvitationRenderer
        data={dto}
        guestName={guestName}
        guestCode={guestCode}
      />
    </main>
  )
}
