'use client'
/**
 * GallerySection — Grid galeri foto dengan viewport lazy animation.
 */
import Image from 'next/image'
import { motion } from 'framer-motion'
import { staggerContainer, fadeUp, blurReveal } from '@/presentation/invitation/components/animations/presets'
import { FadeInView } from '@/presentation/invitation/components/animations/FadeInView'
import type { SectionComponentProps } from '@/presentation/invitation/registry/section.registry'

export function GallerySection({ data, props }: SectionComponentProps) {
  const columns = (props.columns as number) ?? 2
  const maxItems = (props.maxItems as number) ?? 6
  const items = data.gallery.slice(0, maxItems)

  if (items.length === 0) {
    return (
      <div className="py-24 px-6 text-center" style={{ backgroundColor: 'var(--inv-secondary)' }}>
        <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ fontFamily: 'var(--inv-font-body)', color: 'var(--inv-accent)' }}>Galeri</p>
        <h2 className="text-4xl" style={{ fontFamily: 'var(--inv-font-script)', color: 'var(--inv-primary)' }}>Galeri Foto</h2>
        <p className="mt-8 opacity-50 text-sm" style={{ fontFamily: 'var(--inv-font-body)' }}>Foto segera hadir 🌸</p>
      </div>
    )
  }

  return (
    <div className="py-24 px-6 overflow-hidden" style={{ backgroundColor: 'var(--inv-secondary)' }}>
      <FadeInView variants={staggerContainer} margin="-100px" className="max-w-2xl mx-auto">
        <div className="text-center mb-16 flex flex-col items-center">
          <motion.p variants={fadeUp} className="text-xs tracking-[0.4em] uppercase mb-4" style={{ fontFamily: 'var(--inv-font-body)', color: 'var(--inv-accent)' }}>Galeri</motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl" style={{ fontFamily: 'var(--inv-font-script)', color: 'var(--inv-primary)' }}>Galeri Foto</motion.h2>
          <motion.div variants={fadeUp} className="mt-6 mx-auto w-16 h-px" style={{ backgroundColor: 'var(--inv-primary)' }} />
        </div>

        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {items.map((item, i) => (
            <motion.div 
              key={i} 
              variants={blurReveal} 
              className="relative aspect-square rounded-xl overflow-hidden group shadow-sm"
            >
              <Image
                src={item.url}
                alt={item.caption ?? `Foto ${i + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                <p className="text-white text-xs tracking-wider" style={{ fontFamily: 'var(--inv-font-body)' }}>
                  {item.caption || '✧'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </FadeInView>
    </div>
  )
}
