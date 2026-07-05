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
  const items = (props.images as string[]) || data.gallery.map(g => g.url) || []
  
  const title = (props.title as string) || 'Galeri Foto'
  const themeColor = (props.themeColor as string) || 'var(--inv-primary)'
  const bgColor = (props.bgColor as string) || 'var(--inv-secondary)'
  const textColor = (props.textColor as string) || 'var(--inv-text)'

  // Fallback if no images
  if (items.length === 0) {
    return (
      <div className="py-24 px-6 text-center" style={{ backgroundColor: bgColor, color: textColor }}>
        <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ fontFamily: 'var(--inv-font-body)', color: themeColor, opacity: 0.8 }}>Galeri</p>
        <h2 className="text-4xl" style={{ fontFamily: 'var(--inv-font-script)', color: themeColor }}>{title}</h2>
        <p className="mt-8 opacity-50 text-sm" style={{ fontFamily: 'var(--inv-font-body)' }}>Foto segera hadir 🌸</p>
      </div>
    )
  }

  return (
    <div className="w-full py-16 px-6 text-center overflow-hidden" style={{ backgroundColor: bgColor, color: textColor }}>
      <FadeInView variants={staggerContainer} margin="-100px" className="max-w-4xl mx-auto flex flex-col items-center">
        <motion.h3 variants={fadeUp} className="text-3xl font-serif italic mb-8" style={{ color: themeColor }}>
          {title}
        </motion.h3>

        <motion.div 
          variants={fadeUp}
          className="grid gap-4 max-w-4xl mx-auto w-full"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {items.slice(0, maxItems).filter(img => typeof img === 'string' && img.trim() !== '').map((url, i) => (
            <motion.div 
              key={i} 
              variants={blurReveal} 
              className="aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
            >
              <Image
                src={url as string}
                alt={`Gallery ${i + 1}`}
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </motion.div>
          ))}
        </motion.div>
      </FadeInView>
    </div>
  )
}
