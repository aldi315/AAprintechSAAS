'use client'
import React from 'react'
import { motion } from 'framer-motion'
import type { SectionComponentProps } from '@/presentation/invitation/registry/section.registry'

export function HeroSection({ data, props }: SectionComponentProps) {
  const title = (props.title as string) || `${data.brideName}\n&\n${data.groomName}`
  const subtitle = (props.subtitle as string) || 'The Wedding Celebration'
  const dateStr = (props.date as string) || new Date().toLocaleDateString()
  const imageUrl = (props.imageUrl as string) || data.coverImage
  const bgColor = (props.bgColor as string) || '#ffffff'
  const textColor = (props.textColor as string) || '#000000'

  return (
    <div className="flex flex-col w-full min-h-screen" style={{ backgroundColor: bgColor }}>
      <div className="w-full h-[50vh] relative overflow-hidden">
        {imageUrl && (
          <motion.img 
            initial={{ scale: 1.2 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true }}
            src={imageUrl} 
            alt="Hero" 
            className="w-full h-full object-cover grayscale" 
          />
        )}
      </div>
      <div className="w-full min-h-[50vh] p-8 md:p-16 flex flex-col justify-center items-center text-center" style={{ color: textColor }}>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs md:text-sm tracking-[0.3em] uppercase mb-6 opacity-50"
        >
          {subtitle}
        </motion.p>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-6xl md:text-8xl font-sans font-medium uppercase leading-[0.9] tracking-tighter whitespace-pre-line"
        >
          {title}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-10 text-sm md:text-base tracking-widest font-mono opacity-80"
        >
          {dateStr}
        </motion.p>
      </div>
    </div>
  )
}
