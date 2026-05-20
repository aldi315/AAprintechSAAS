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
  const overlayOpacity = (props.overlayOpacity as number) ?? 0.45

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      {data.coverImage ? (
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <Image
            src={data.coverImage}
            alt={`${data.brideName} & ${data.groomName}`}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      ) : (
        // Gradient fallback jika tidak ada cover image
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, var(--inv-secondary) 0%, var(--inv-bg) 50%, var(--inv-secondary) 100%)`,
          }}
        />
      )}

      {/* Dark overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: `rgba(0,0,0,${overlayOpacity})`,
          background: data.coverImage
            ? `linear-gradient(to bottom, rgba(0,0,0,${overlayOpacity * 0.6}) 0%, rgba(0,0,0,${overlayOpacity}) 50%, rgba(0,0,0,${overlayOpacity * 0.8}) 100%)`
            : undefined,
        }}
      />

      {/* Content */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 flex flex-col items-center text-center px-8 gap-4"
      >
        {/* Wedding label */}
        <motion.p
          variants={fadeUp}
          className="text-xs tracking-[0.4em] uppercase"
          style={{
            fontFamily: 'var(--inv-font-body)',
            color: 'var(--inv-primary)',
          }}
        >
          The Wedding Of
        </motion.p>

        {/* Ornament */}
        <motion.div variants={fadeUp} style={{ color: 'var(--inv-primary)', opacity: 0.8 }}>
          <svg width="120" height="20" viewBox="0 0 120 20" fill="none">
            <path d="M0 10 Q30 0 60 10 Q90 20 120 10" stroke="currentColor" strokeWidth="0.5" fill="none" />
          </svg>
        </motion.div>

        {/* Bride Name */}
        <motion.h1
          variants={fadeUp}
          className="text-6xl md:text-8xl leading-none"
          style={{ fontFamily: 'var(--inv-font-script)', color: '#fff' }}
        >
          {data.brideName}
        </motion.h1>

        {/* Separator & */}
        <motion.p
          variants={fadeUp}
          className="text-2xl"
          style={{ fontFamily: 'var(--inv-font-heading)', color: 'var(--inv-primary)', fontStyle: 'italic' }}
        >
          &amp;
        </motion.p>

        {/* Groom Name */}
        <motion.h2
          variants={fadeUp}
          className="text-6xl md:text-8xl leading-none"
          style={{ fontFamily: 'var(--inv-font-script)', color: '#fff' }}
        >
          {data.groomName}
        </motion.h2>

        {/* Ornament bottom */}
        <motion.div variants={fadeUp} style={{ color: 'var(--inv-primary)', opacity: 0.8, transform: 'scaleY(-1)' }}>
          <svg width="120" height="20" viewBox="0 0 120 20" fill="none">
            <path d="M0 10 Q30 0 60 10 Q90 20 120 10" stroke="currentColor" strokeWidth="0.5" fill="none" />
          </svg>
        </motion.div>

        {/* First event date */}
        {data.events[0] && (
          <motion.p
            variants={fadeUp}
            className="text-base tracking-widest mt-2"
            style={{ fontFamily: 'var(--inv-font-heading)', color: 'rgba(255,255,255,0.85)' }}
          >
            {new Date(data.events[0].startTime).toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              timeZone: data.timezone,
            })}
          </motion.p>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <FadeInView delay={1} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div
          className="w-px h-12 animate-pulse"
          style={{ backgroundColor: 'var(--inv-primary)', opacity: 0.6 }}
        />
        <p
          className="text-xs tracking-widest uppercase"
          style={{ fontFamily: 'var(--inv-font-body)', color: 'rgba(255,255,255,0.5)' }}
        >
          Scroll
        </p>
      </FadeInView>
    </div>
  )
}
