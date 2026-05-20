'use client'
/**
 * CoupleSection — Profil singkat pasangan pengantin.
 * Animated with Framer Motion stagger.
 */
import { motion } from 'framer-motion'
import { staggerContainer, fadeUp } from '@/presentation/invitation/components/animations/presets'
import { FadeInView } from '@/presentation/invitation/components/animations/FadeInView'
import type { SectionComponentProps } from '@/presentation/invitation/registry/section.registry'

export function CoupleSection({ data }: SectionComponentProps) {
  return (
    <div className="py-24 px-6 overflow-hidden" style={{ backgroundColor: 'var(--inv-bg)' }}>
      <FadeInView variants={staggerContainer} margin="-100px" className="max-w-2xl mx-auto flex flex-col items-center">
        {/* Section header */}
        <div className="text-center mb-20 flex flex-col items-center">
          <motion.p variants={fadeUp} className="text-xs tracking-[0.4em] uppercase mb-4" style={{ fontFamily: 'var(--inv-font-body)', color: 'var(--inv-accent)' }}>
            Mempelai
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl" style={{ fontFamily: 'var(--inv-font-script)', color: 'var(--inv-primary)' }}>
            Bismillahirrahmanirrahim
          </motion.h2>
          <motion.div variants={fadeUp} className="mt-6 mx-auto w-16 h-px" style={{ backgroundColor: 'var(--inv-primary)' }} />
        </div>

        {/* Couple cards */}
        <div className="w-full flex flex-col md:flex-row gap-16 md:gap-8 items-center justify-between">
          {/* Bride */}
          <motion.div variants={fadeUp} className="flex-1">
            <CoupleCard name={data.brideName} role="Mempelai Wanita" />
          </motion.div>

          {/* Divider */}
          <motion.div variants={fadeUp} className="flex flex-col items-center gap-4 shrink-0">
            <div className="w-px h-16 md:w-16 md:h-px" style={{ backgroundColor: 'var(--inv-primary)', opacity: 0.3 }} />
            <span className="text-3xl" style={{ color: 'var(--inv-primary)' }}>♡</span>
            <div className="w-px h-16 md:w-16 md:h-px" style={{ backgroundColor: 'var(--inv-primary)', opacity: 0.3 }} />
          </motion.div>

          {/* Groom */}
          <motion.div variants={fadeUp} className="flex-1">
            <CoupleCard name={data.groomName} role="Mempelai Pria" />
          </motion.div>
        </div>

        {/* Ayat Al-Quran */}
        <motion.div variants={fadeUp} className="mt-24 max-w-lg mx-auto text-center space-y-4">
          <div className="w-8 h-px mx-auto" style={{ backgroundColor: 'var(--inv-primary)' }} />
          <p className="text-sm italic leading-loose" style={{ fontFamily: 'var(--inv-font-body)', color: 'var(--inv-text)', opacity: 0.75 }}>
            &ldquo;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya.&rdquo;
          </p>
          <p className="text-xs tracking-widest pt-2" style={{ fontFamily: 'var(--inv-font-body)', color: 'var(--inv-accent)' }}>
            — QS. Ar-Rum: 21 —
          </p>
        </motion.div>
      </FadeInView>
    </div>
  )
}

function CoupleCard({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      {/* Avatar circle */}
      <div
        className="w-36 h-36 rounded-full flex items-center justify-center relative group"
        style={{ border: `1px solid var(--inv-primary)`, backgroundColor: 'var(--inv-secondary)' }}
      >
        <span className="text-5xl transition-transform duration-700 group-hover:scale-110" style={{ fontFamily: 'var(--inv-font-script)', color: 'var(--inv-primary)' }}>
          {name.charAt(0)}
        </span>
        <div className="absolute inset-2 rounded-full border border-dashed opacity-30" style={{ borderColor: 'var(--inv-primary)' }} />
      </div>

      <div>
        {/* Role */}
        <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ fontFamily: 'var(--inv-font-body)', color: 'var(--inv-accent)', opacity: 0.7 }}>
          {role}
        </p>

        {/* Name */}
        <h3 className="text-3xl md:text-4xl" style={{ fontFamily: 'var(--inv-font-script)', color: 'var(--inv-primary)' }}>
          {name}
        </h3>
      </div>
    </div>
  )
}
