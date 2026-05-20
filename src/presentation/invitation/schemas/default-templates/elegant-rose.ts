/**
 * DEFAULT TEMPLATE — Elegant Rose
 *
 * Template schema default untuk preview dan fallback.
 * Semua tenant yang belum punya custom schema akan menggunakan ini.
 */
import type { TemplateSchemaV1 } from '@/core/entities/template-schema.entity'

export const elegantRoseSchema: TemplateSchemaV1 = {
  version: 1,
  theme: {
    primaryColor: '#C8A882',
    secondaryColor: '#F5F0EA',
    accentColor: '#8B6F47',
    backgroundColor: '#FDFAF6',
    textColor: '#2D2D2D',
    fontHeading: 'playfair',
    fontScript: 'great-vibes',
    fontBody: 'lato',
  },
  sections: [
    {
      id: 'hero-1',
      type: 'hero',
      enabled: true,
      props: {
        showCountdown: true,
        overlayOpacity: 0.45,
      },
    },
    {
      id: 'couple-1',
      type: 'couple',
      enabled: true,
      props: {
        showParents: true,
        layout: 'side-by-side',
      },
    },
    {
      id: 'event-1',
      type: 'event',
      enabled: true,
      props: {
        showDresscode: true,
        showMapsButton: true,
      },
    },
    {
      id: 'countdown-1',
      type: 'countdown',
      enabled: true,
      props: {
        targetEventIndex: 0,
      },
    },
    {
      id: 'gallery-1',
      type: 'gallery',
      enabled: true,
      props: {
        columns: 2,
        maxItems: 6,
      },
    },
    {
      id: 'rsvp-1',
      type: 'rsvp',
      enabled: true,
      props: {
        showGuestCount: true,
        showMessage: true,
        requireGuestCode: false,
      },
    },
    {
      id: 'closing-1',
      type: 'closing',
      enabled: true,
      props: {
        message: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.',
        hashtag: '',
      },
    },
  ],
}
