'use client'
/**
 * HeroSection — Full-viewport hero dengan cover image dan nama pengantin.
 * Cinematic overlay + elegant typography.
 * Animated with Framer Motion.
 */
import Image from 'next/image'
import { motion } from 'framer-motion'
import { staggerContainer, fadeUp } from '@/presentation/invitation/components/animations/presets'
import { FadeInView } from '@/presentation/invitation/components/animations/FadeInView'
import type { SectionComponentProps } from '@/presentation/invitation/registry/section.registry'

export function HeroSection({ data, props }: SectionComponentProps) {
  const imageUrl = (props.imageUrl as string) || data.coverImage
  const overlayColor = (props.overlayColor as string) || 'rgba(0,0,0,0.45)'
  const textColor = (props.textColor as string) || '#ffffff'
  const align = (props.align as 'left' | 'center' | 'right') || 'center'
  
  const title = (props.title as string) || `${data.brideName} & ${data.groomName}`
  const subtitle = (props.subtitle as string) || 'The Wedding Of'
  
  // Try to use date from props, fallback to first event
  let displayDate = props.date as string
  if (!displayDate && data.events[0]) {
    displayDate = new Date(data.events[0].startTime).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: data.timezone,
    })
  }

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Background Image */}
      {imageUrl && (
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: 'easeOut' }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundColor: overlayColor }}
      />

      {/* Content */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 w-full px-6 py-12 flex flex-col gap-4"
        style={{ 
          alignItems: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end', 
          textAlign: align, 
          color: textColor 
        }}
      >
        <motion.p
          variants={fadeUp}
          className="text-sm tracking-[0.3em] uppercase"
        >
          {subtitle}
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-6xl font-serif font-bold italic"
        >
          {title}
        </motion.h1>

        <motion.div variants={fadeUp} className="w-16 h-[1px] bg-current my-4 opacity-50" style={{ marginInline: align === 'center' ? 'auto' : '0' }} />

        {displayDate && (
          <motion.p
            variants={fadeUp}
            className="text-lg tracking-widest"
          >
            {displayDate}
          </motion.p>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <FadeInView delay={1} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div
          className="w-px h-12 animate-pulse"
          style={{ backgroundColor: textColor, opacity: 0.6 }}
        />
        <p
          className="text-xs tracking-widest uppercase"
          style={{ color: textColor, opacity: 0.5 }}
        >
          Scroll
        </p>
      </FadeInView>
    </div>
  )
}
