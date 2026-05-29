import { Header } from '@/presentation/components/landing/Header'
import { HeroSection } from '@/presentation/components/landing/HeroSection'
import { FeaturesSection } from '@/presentation/components/landing/FeaturesSection'
import { TemplatesShowcase } from '@/presentation/components/landing/TemplatesShowcase'
import { PricingSection } from '@/presentation/components/landing/PricingSection'
import { Footer } from '@/presentation/components/landing/Footer'

export const metadata = {
  title: 'AAP Wedding | Undangan Pernikahan Digital Premium',
  description: 'Buat undangan pernikahan digital elegan dengan mudah. Tersedia fitur manajemen RSVP, galeri premium, dan custom domain.',
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#C8A882]/20 selection:text-slate-900 font-sans">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TemplatesShowcase />
        <PricingSection />
      </main>
      <Footer />
    </div>
  )
}
