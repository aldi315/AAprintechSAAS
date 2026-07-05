'use client'
import React from 'react'
import { motion } from 'framer-motion'
import type { SectionComponentProps } from '@/presentation/invitation/registry/section.registry'

export function GallerySection({ data, props }: SectionComponentProps) {
  const title = (props.title as string) || 'Gallery'
  const bgColor = (props.bgColor as string) || '#ffffff'
  const textColor = (props.textColor as string) || '#000000'
  
  // Extract images from gallery JSON
  const images = (Array.isArray(data.gallery) && data.gallery.length > 0) 
    ? data.gallery.map((img: any) => img.url) 
    : []

  if (images.length === 0) return null

  return (
    <div className="w-full py-32 px-6" style={{ backgroundColor: bgColor, color: textColor }}>
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl font-sans font-medium uppercase tracking-tight mb-20"
        >
          {title}
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((img, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: (idx % 2) * 0.2 }}
              className={`w-full overflow-hidden ${idx % 3 === 0 ? 'aspect-square' : 'aspect-[3/4]'}`}
            >
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7 }}
                src={img} 
                alt={`Gallery ${idx + 1}`} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
