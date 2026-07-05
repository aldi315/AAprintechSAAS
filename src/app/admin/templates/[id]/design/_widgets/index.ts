import React from 'react'
// Floral Garden
import { CoverWidget, defaultCoverProps } from './floral-garden/CoverWidget'
import { HeroWidget, defaultHeroProps } from './floral-garden/HeroWidget'
import { TextWidget, defaultTextProps } from './floral-garden/TextWidget'
import { SpacerWidget, defaultSpacerProps } from './floral-garden/SpacerWidget'
import { CoupleWidget, defaultCoupleProps } from './floral-garden/CoupleWidget'
import { EventWidget, defaultEventProps } from './floral-garden/EventWidget'
import { CountdownWidget, defaultCountdownProps } from './floral-garden/CountdownWidget'
import { GalleryWidget, defaultGalleryProps } from './floral-garden/GalleryWidget'
import { GiftWidget, defaultGiftProps } from './floral-garden/GiftWidget'
import { MusicWidget, defaultMusicProps } from './floral-garden/MusicWidget'
import { RsvpWidget, defaultRsvpProps } from './floral-garden/RsvpWidget'

// Modern Minimalist
import { CoverMinimalistWidget, defaultCoverMinimalistProps } from './modern-minimalist/CoverWidget'
import { HeroMinimalistWidget, defaultHeroMinimalistProps } from './modern-minimalist/HeroWidget'
import { CoupleMinimalistWidget, defaultCoupleMinimalistProps } from './modern-minimalist/CoupleWidget'
import { EventMinimalistWidget, defaultEventMinimalistProps } from './modern-minimalist/EventWidget'
import { GalleryMinimalistWidget, defaultGalleryMinimalistProps } from './modern-minimalist/GalleryWidget'

export type WidgetType = 
  // Base / Floral Garden
  | 'cover' | 'hero' | 'text' | 'spacer' | 'couple' | 'event' | 'countdown' | 'gallery' | 'gift' | 'music' | 'rsvp'
  // Modern Minimalist
  | 'cover_minimalist' | 'hero_minimalist' | 'couple_minimalist' | 'event_minimalist' | 'gallery_minimalist'

export interface WidgetData {
  id: string
  type: WidgetType
  props: any
}

export const WIDGET_REGISTRY = {
  cover: {
    name: 'Cover',
    component: CoverWidget,
    defaultProps: defaultCoverProps,
    icon: 'BookOpen'
  },
  hero: {
    name: 'Hero Cover',
    component: HeroWidget,
    defaultProps: defaultHeroProps,
    icon: 'Image'
  },
  couple: {
    name: 'Mempelai (Couple)',
    component: CoupleWidget,
    defaultProps: defaultCoupleProps,
    icon: 'Heart'
  },
  event: {
    name: 'Jadwal Acara',
    component: EventWidget,
    defaultProps: defaultEventProps,
    icon: 'Calendar'
  },
  countdown: {
    name: 'Hitung Mundur',
    component: CountdownWidget,
    defaultProps: defaultCountdownProps,
    icon: 'Clock'
  },
  gallery: {
    name: 'Galeri Foto',
    component: GalleryWidget,
    defaultProps: defaultGalleryProps,
    icon: 'LayoutGrid'
  },
  gift: {
    name: 'Wedding Gift',
    component: GiftWidget,
    defaultProps: defaultGiftProps,
    icon: 'Gift'
  },
  text: {
    name: 'Text Block',
    component: TextWidget,
    defaultProps: defaultTextProps,
    icon: 'Type'
  },
  spacer: {
    name: 'Spacer',
    component: SpacerWidget,
    defaultProps: defaultSpacerProps,
    icon: 'MoveVertical'
  },
  music: {
    name: 'Music',
    component: MusicWidget,
    defaultProps: defaultMusicProps,
    icon: 'Music'
  },
  rsvp: {
    name: 'RSVP Form',
    component: RsvpWidget,
    defaultProps: defaultRsvpProps,
    icon: 'MailOpen' // MailOpen or MessageSquare
  },

  // --- MODERN MINIMALIST ---
  cover_minimalist: {
    name: 'Cover (Minimalist)',
    component: CoverMinimalistWidget,
    defaultProps: defaultCoverMinimalistProps,
    icon: 'BookOpen'
  },
  hero_minimalist: {
    name: 'Hero (Minimalist)',
    component: HeroMinimalistWidget,
    defaultProps: defaultHeroMinimalistProps,
    icon: 'Image'
  },
  couple_minimalist: {
    name: 'Mempelai (Minimalist)',
    component: CoupleMinimalistWidget,
    defaultProps: defaultCoupleMinimalistProps,
    icon: 'Heart'
  },
  event_minimalist: {
    name: 'Jadwal Acara (Minimalist)',
    component: EventMinimalistWidget,
    defaultProps: defaultEventMinimalistProps,
    icon: 'Calendar'
  },
  gallery_minimalist: {
    name: 'Galeri (Minimalist)',
    component: GalleryMinimalistWidget,
    defaultProps: defaultGalleryMinimalistProps,
    icon: 'LayoutGrid'
  }
}
