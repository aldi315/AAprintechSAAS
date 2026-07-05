'use client'
import React from 'react'
import { motion } from 'framer-motion'
import type { SectionComponentProps } from '@/presentation/invitation/registry/section.registry'

export function CoupleSection({ data, props }: SectionComponentProps) {
  const brideDesc = (props.brideDesc as string) || 'Putri dari Bapak & Ibu ...'
  const groomDesc = (props.groomDesc as string) || 'Putra dari Bapak & Ibu ...'
  const bridePhoto = (props.bridePhoto as string) || null
  const groomPhoto = (props.groomPhoto as string) || null
  
  const bgColor = (props.bgColor as string) || '#f9fafb'
  const textColor = (props.textColor as string) || '#111827'

  return (
    <div className="w-full py-32 px-6 overflow-hidden" style={{ backgroundColor: bgColor, color: textColor }}>
      <div className="max-w-xl mx-auto flex flex-col gap-32">
        {/* Bride */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-8"
        >
          <div className="w-full aspect-[3/4] overflow-hidden bg-gray-200">
            {bridePhoto && (
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
                src={bridePhoto} 
                alt={data.brideName} 
                className="w-full h-full object-cover grayscale" 
              />
            )}
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-sans font-medium uppercase tracking-tight mb-4">{data.brideName}</h3>
            <p className="text-base md:text-lg opacity-70 leading-relaxed max-w-md">{brideDesc}</p>
          </div>
        </motion.div>

        {/* Separator */}
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          className="w-full h-px bg-current opacity-20 origin-left" 
        />

        {/* Groom */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-8 text-right items-end"
        >
          <div className="w-full aspect-[3/4] overflow-hidden bg-gray-200">
            {groomPhoto && (
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
                src={groomPhoto} 
                alt={data.groomName} 
                className="w-full h-full object-cover grayscale" 
              />
            )}
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-sans font-medium uppercase tracking-tight mb-4">{data.groomName}</h3>
            <p className="text-base md:text-lg opacity-70 leading-relaxed max-w-md ml-auto">{groomDesc}</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
