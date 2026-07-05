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

const SECTION_REGISTRY: Record<string, SectionComponent> = {
  // --- FLORAL GARDEN ---
  'cover': dynamic(
    () => import('@/presentation/invitation/templates/floral-garden/CoverScreen').then((m) => m.CoverScreen),
    { loading: () => <SectionSkeleton />, ssr: true },
  ),
  'hero': dynamic(
    () => import('@/presentation/invitation/templates/floral-garden/HeroSection').then((m) => m.HeroSection),
    { loading: () => <SectionSkeleton />, ssr: true },
  ),
  'couple': dynamic(
    () => import('@/presentation/invitation/templates/floral-garden/CoupleSection').then((m) => m.CoupleSection),
    { loading: () => <SectionSkeleton />, ssr: true },
  ),
  'event': dynamic(
    () => import('@/presentation/invitation/templates/floral-garden/EventSection').then((m) => m.EventSection),
    { loading: () => <SectionSkeleton />, ssr: true },
  ),
  'countdown': dynamic(
    () => import('@/presentation/invitation/templates/floral-garden/CountdownSection').then((m) => m.CountdownSection),
    { loading: () => <SectionSkeleton />, ssr: true },
  ),
  'gallery': dynamic(
    () => import('@/presentation/invitation/templates/floral-garden/GallerySection').then((m) => m.GallerySection),
    { loading: () => <SectionSkeleton />, ssr: true },
  ),
  'rsvp': dynamic(
    () => import('@/presentation/invitation/templates/floral-garden/RSVPSection').then((m) => m.RSVPSection),
    { loading: () => <SectionSkeleton />, ssr: true },
  ),
  'closing': dynamic(
    () => import('@/presentation/invitation/templates/floral-garden/ClosingSection').then((m) => m.ClosingSection),
    { loading: () => <SectionSkeleton />, ssr: true },
  ),
  'text': dynamic(
    () => import('@/presentation/invitation/templates/floral-garden/TextSection').then((m) => m.TextSection),
    { loading: () => <SectionSkeleton />, ssr: true },
  ),
  'spacer': dynamic(
    () => import('@/presentation/invitation/templates/floral-garden/SpacerSection').then((m) => m.SpacerSection),
    { loading: () => <SectionSkeleton />, ssr: true },
  ),
  'gift': dynamic(
    () => import('@/presentation/invitation/templates/floral-garden/GiftSection').then((m) => m.GiftSection),
    { loading: () => <SectionSkeleton />, ssr: true },
  ),
  'music': dynamic(
    () => import('@/presentation/invitation/templates/floral-garden/MusicPlayer').then((m) => m.MusicPlayer),
    { loading: () => <SectionSkeleton />, ssr: true },
  ),

  // --- MODERN MINIMALIST ---
  'cover_minimalist': dynamic(
    () => import('@/presentation/invitation/templates/modern-minimalist/CoverScreen').then((m) => m.CoverScreen),
    { loading: () => <SectionSkeleton />, ssr: true },
  ),
  'hero_minimalist': dynamic(
    () => import('@/presentation/invitation/templates/modern-minimalist/HeroSection').then((m) => m.HeroSection),
    { loading: () => <SectionSkeleton />, ssr: true },
  ),
  'couple_minimalist': dynamic(
    () => import('@/presentation/invitation/templates/modern-minimalist/CoupleSection').then((m) => m.CoupleSection),
    { loading: () => <SectionSkeleton />, ssr: true },
  ),
  'event_minimalist': dynamic(
    () => import('@/presentation/invitation/templates/modern-minimalist/EventSection').then((m) => m.EventSection),
    { loading: () => <SectionSkeleton />, ssr: true },
  ),
  'gallery_minimalist': dynamic(
    () => import('@/presentation/invitation/templates/modern-minimalist/GallerySection').then((m) => m.GallerySection),
    { loading: () => <SectionSkeleton />, ssr: true },
  ),
}

export function resolveSection(type: string): SectionComponent {
  return SECTION_REGISTRY[type] ?? UnknownSection
}
