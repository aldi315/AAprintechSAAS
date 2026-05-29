import React from 'react'
import { CoverWidget, defaultCoverProps } from './CoverWidget'
import { HeroWidget, defaultHeroProps } from './HeroWidget'
import { TextWidget, defaultTextProps } from './TextWidget'
import { SpacerWidget, defaultSpacerProps } from './SpacerWidget'
import { CoupleWidget, defaultCoupleProps } from './CoupleWidget'
import { EventWidget, defaultEventProps } from './EventWidget'
import { CountdownWidget, defaultCountdownProps } from './CountdownWidget'
import { GalleryWidget, defaultGalleryProps } from './GalleryWidget'
import { GiftWidget, defaultGiftProps } from './GiftWidget'
import { MusicWidget, defaultMusicProps } from './MusicWidget'

export type WidgetType = 'cover' | 'hero' | 'text' | 'spacer' | 'couple' | 'event' | 'countdown' | 'gallery' | 'gift' | 'music'

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
  }
}
