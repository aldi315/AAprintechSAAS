import type { Metadata } from 'next'
import { Playfair_Display, Great_Vibes, Lato } from 'next/font/google'
import '../globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-heading-loaded',
  display: 'swap',
})

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-script-loaded',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-body-loaded',
  display: 'swap',
})

export const metadata: Metadata = {
  robots: { index: true, follow: true },
}

export default function InvitationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${playfair.variable} ${greatVibes.variable} ${lato.variable}`}
      style={{
        // Map loaded font variables ke design token variables
        // Ini memastikan var(--inv-font-heading) dst resolve ke font yang benar
        ['--font-heading' as string]: 'var(--font-heading-loaded)',
        ['--font-script' as string]: 'var(--font-script-loaded)',
        ['--font-body' as string]: 'var(--font-body-loaded)',
      }}
    >
      {children}
    </div>
  )
}
