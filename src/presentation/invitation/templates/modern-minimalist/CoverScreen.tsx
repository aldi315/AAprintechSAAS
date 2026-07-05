'use client'
import React from 'react'
import { motion } from 'framer-motion'
import type { SectionComponentProps } from '@/presentation/invitation/registry/section.registry'

export function CoverScreen({ data, props }: SectionComponentProps) {
  const title = (props.title as string) || `${data.brideName}\n&\n${data.groomName}`
  const subtitle = (props.subtitle as string) || 'We Are Getting Married'
  const dateStr = (props.date as string) || new Date().toLocaleDateString()
  const imageUrl = (props.imageUrl as string) || data.coverImage
  const themeColor = (props.themeColor as string) || '#000000'
  const bgColor = (props.bgColor as string) || '#ffffff'
  const textColor = (props.textColor as string) || '#ffffff'
  const overlayColor = (props.overlayColor as string) || 'rgba(0, 0, 0, 0.4)'

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full min-h-screen flex items-end overflow-hidden" 
      style={{ backgroundColor: bgColor }}
    >
      {/* Background Image */}
      {imageUrl && (
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0 bg-cover bg-center grayscale"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      
      {/* Overlay */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: overlayColor }}
      />
      
      {/* Content */}
      <div 
        className="relative z-10 w-full p-8 md:p-12 flex flex-col gap-6"
        style={{ color: textColor }}
      >
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs md:text-sm tracking-[0.4em] uppercase font-sans opacity-80"
        >
          {subtitle}
        </motion.p>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-6xl md:text-8xl font-sans font-light tracking-tight leading-none uppercase break-words"
        >
          {title.split('&').map((name, i) => (
            <React.Fragment key={i}>
              {name.trim()}
              {i === 0 && <br />}
            </React.Fragment>
          ))}
        </motion.h1>
        
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex items-center gap-4 mt-8 origin-left"
        >
          <div className="h-px flex-1 bg-current opacity-30" />
          <p className="text-sm md:text-base tracking-widest font-mono">{dateStr}</p>
        </motion.div>
      </div>
    </motion.div>
  )
}
