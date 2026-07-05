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
  const message = (props.description as string) || (props.message as string) || 'Merupakan suatu kehormatan apabila Bapak/Ibu/Saudara/i berkenan hadir.'
  const title = (props.title as string) || 'Terima Kasih'
  const themeColor = (props.themeColor as string) || 'var(--inv-primary)'
  const bgColor = (props.bgColor as string) || 'var(--inv-secondary)'
  const textColor = (props.textColor as string) || 'var(--inv-text)'

  return (
    <div className="py-24 px-6 text-center overflow-hidden" style={{ backgroundColor: bgColor }}>
      <FadeInView variants={staggerContainer} margin="-100px" className="max-w-md mx-auto flex flex-col items-center">
        <motion.div variants={fadeUp} className="text-4xl mb-8" style={{ color: themeColor }}>✦</motion.div>

        <motion.p variants={fadeUp} className="text-sm leading-loose italic opacity-80 mb-12 px-4" style={{ fontFamily: 'var(--inv-font-body)', color: textColor }}>
          "{message}"
        </motion.p>

        <motion.div variants={staggerContainer} className="space-y-3 mb-10">
          <motion.p variants={fadeUp} className="text-xs tracking-[0.2em] uppercase opacity-70" style={{ fontFamily: 'var(--inv-font-body)', color: textColor }}>
            {title}
          </motion.p>
          <motion.p variants={fadeUp} className="text-5xl md:text-6xl" style={{ fontFamily: 'var(--inv-font-script)', color: themeColor }}>
            {data.brideName} &amp; {data.groomName}
          </motion.p>
        </motion.div>

        <motion.div variants={fadeUp} className="pt-4 flex items-center gap-4 justify-center w-full mb-8">
          <div className="flex-1 h-px max-w-[80px]" style={{ backgroundColor: themeColor, opacity: 0.3 }} />
          <span className="text-xl" style={{ color: themeColor }}>🌸</span>
          <div className="flex-1 h-px max-w-[80px]" style={{ backgroundColor: themeColor, opacity: 0.3 }} />
        </motion.div>

        <motion.p variants={fadeUp} className="text-[10px] tracking-widest uppercase opacity-40 mt-12" style={{ fontFamily: 'var(--inv-font-body)', color: textColor }}>
          Dibuat dengan ♡ menggunakan {data.reseller.businessName}
        </motion.p>
      </FadeInView>
    </div>
  )
}
