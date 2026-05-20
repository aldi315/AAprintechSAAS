'use client'
/**
 * PRESENTATION — Section Registry
 *
 * Maps SectionType string → React component via dynamic import.
 * PENTING: next/dynamic options HARUS inline object literal (tidak boleh variable).
 * Ini adalah requirement Next.js static analysis / Turbopack.
 */
import dynamic from 'next/dynamic'
import type { SectionType } from '@/core/entities/template-schema.entity'
import type { InvitationRenderDTO } from '@/core/entities/invitation-render.entity'
import { UnknownSection } from '@/presentation/invitation/renderer/UnknownSection'

export interface SectionComponentProps {
  data: InvitationRenderDTO
  props: Record<string, unknown>
  guestName?: string
  guestCode?: string
}

type SectionComponent = React.ComponentType<SectionComponentProps>

// Loading skeleton
function SectionSkeleton() {
  return (
    <div className="w-full py-16 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--inv-primary,#C8A882)] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

// ─── Registry — options HARUS inline object literal (Next.js requirement) ─────

const SECTION_REGISTRY: Record<SectionType, SectionComponent> = {
  hero: dynamic(
    () => import('@/presentation/invitation/sections/HeroSection').then((m) => m.HeroSection),
    { loading: () => <SectionSkeleton />, ssr: true },
  ),
  couple: dynamic(
    () => import('@/presentation/invitation/sections/CoupleSection').then((m) => m.CoupleSection),
    { loading: () => <SectionSkeleton />, ssr: true },
  ),
  event: dynamic(
    () => import('@/presentation/invitation/sections/EventSection').then((m) => m.EventSection),
    { loading: () => <SectionSkeleton />, ssr: true },
  ),
  countdown: dynamic(
    () => import('@/presentation/invitation/sections/CountdownSection').then((m) => m.CountdownSection),
    { loading: () => <SectionSkeleton />, ssr: true },
  ),
  gallery: dynamic(
    () => import('@/presentation/invitation/sections/GallerySection').then((m) => m.GallerySection),
    { loading: () => <SectionSkeleton />, ssr: true },
  ),
  rsvp: dynamic(
    () => import('@/presentation/invitation/sections/RSVPSection').then((m) => m.RSVPSection),
    { loading: () => <SectionSkeleton />, ssr: true },
  ),
  closing: dynamic(
    () => import('@/presentation/invitation/sections/ClosingSection').then((m) => m.ClosingSection),
    { loading: () => <SectionSkeleton />, ssr: true },
  ),
}

export function resolveSection(type: string): SectionComponent {
  return SECTION_REGISTRY[type as SectionType] ?? UnknownSection
}
