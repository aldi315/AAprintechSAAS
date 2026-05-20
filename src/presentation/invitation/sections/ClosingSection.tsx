'use client'
/**
 * ClosingSection — Pesan penutup undangan.
 * Animated with Framer Motion stagger.
 */
import type { SectionComponentProps } from '@/presentation/invitation/registry/section.registry'
import { motion } from 'framer-motion'
import { staggerContainer, fadeUp } from '@/presentation/invitation/components/animations/presets'
import { FadeInView } from '@/presentation/invitation/components/animations/FadeInView'

export function ClosingSection({ data, props }: SectionComponentProps) {
  const message = (props.message as string) ?? 'Merupakan suatu kehormatan apabila Bapak/Ibu/Saudara/i berkenan hadir.'
  const hashtag = (props.hashtag as string) ?? ''

  return (
    <div className="py-24 px-6 text-center overflow-hidden" style={{ backgroundColor: 'var(--inv-secondary)' }}>
      <FadeInView variants={staggerContainer} margin="-100px" className="max-w-md mx-auto flex flex-col items-center">
        <motion.div variants={fadeUp} className="text-4xl mb-8" style={{ color: 'var(--inv-primary)' }}>✦</motion.div>

        <motion.p variants={fadeUp} className="text-sm leading-loose italic opacity-80 mb-12 px-4" style={{ fontFamily: 'var(--inv-font-body)', color: 'var(--inv-text)' }}>
          "{message}"
        </motion.p>

        <motion.div variants={staggerContainer} className="space-y-3 mb-10">
          <motion.p variants={fadeUp} className="text-xs tracking-[0.2em] uppercase opacity-70" style={{ fontFamily: 'var(--inv-font-body)', color: 'var(--inv-text)' }}>
            Dengan penuh cinta,
          </motion.p>
          <motion.p variants={fadeUp} className="text-5xl md:text-6xl" style={{ fontFamily: 'var(--inv-font-script)', color: 'var(--inv-primary)' }}>
            {data.brideName} &amp; {data.groomName}
          </motion.p>
        </motion.div>

        {hashtag && (
          <motion.p variants={fadeUp} className="text-sm font-medium tracking-wide mb-6" style={{ color: 'var(--inv-accent)', fontFamily: 'var(--inv-font-body)' }}>
            #{hashtag}
          </motion.p>
        )}

        <motion.div variants={fadeUp} className="pt-4 flex items-center gap-4 justify-center w-full mb-8">
          <div className="flex-1 h-px max-w-[80px]" style={{ backgroundColor: 'var(--inv-primary)', opacity: 0.3 }} />
          <span className="text-xl" style={{ color: 'var(--inv-primary)' }}>🌸</span>
          <div className="flex-1 h-px max-w-[80px]" style={{ backgroundColor: 'var(--inv-primary)', opacity: 0.3 }} />
        </motion.div>

        <motion.p variants={fadeUp} className="text-[10px] tracking-widest uppercase opacity-40 mt-12" style={{ fontFamily: 'var(--inv-font-body)', color: 'var(--inv-text)' }}>
          Dibuat dengan ♡ menggunakan {data.tenant.businessName}
        </motion.p>
      </FadeInView>
    </div>
  )
}
