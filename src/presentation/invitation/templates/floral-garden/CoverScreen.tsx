'use client'
/**
 * CoverScreen — Opening overlay dengan guest name + animation.
 * Muncul di atas undangan, fade out saat tombol diklik.
 * Termasuk scroll-lock, slow zoom, soft blur, floating particles.
 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { SectionComponentProps } from '@/presentation/invitation/registry/section.registry'

export function CoverScreen({ data, props, guestName }: SectionComponentProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Extract props (from widget) with fallback to global data
  const title = (props.title as string) || 'Undangan Pernikahan'
  const bgImage = (props.bgImage as string) || data.coverImage
  const brideName = (props.brideName as string) || data.brideName
  const groomName = (props.groomName as string) || data.groomName
  const overlayColor = (props.overlayColor as string) || 'rgba(0,0,0,0.5)'
  const themeColor = (props.themeColor as string) || '#C8A882'
  const textColor = (props.textColor as string) || '#ffffff'

  // Scroll lock effect
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleOpen = () => {
    setIsAnimating(true)
    // Dispatch event for MusicPlayer to start
    window.dispatchEvent(new CustomEvent('invitation-opened'))
    setTimeout(() => setIsOpen(true), 1200)
  }

  if (isOpen) return null

  return (
    <AnimatePresence>
      {!isAnimating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-slate-900"
        >
          {/* Background Image */}
          {bgImage && (
            <motion.div 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${bgImage})` }}
            />
          )}

          {/* Overlay */}
          <div 
            className="absolute inset-0 z-10" 
            style={{ backgroundColor: overlayColor }} 
          />

          {/* Content matching CoverWidget */}
          <div 
            className="relative z-20 flex flex-col items-center justify-center text-center px-6 w-full" 
            style={{ color: textColor }}
          >
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-sm tracking-widest uppercase mb-4 opacity-90" 
            >
              {title}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 1.2, ease: "easeOut" }}
              className="text-5xl md:text-6xl font-serif mb-8"
              style={{ color: themeColor }}
            >
              {brideName} & {groomName}
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 1 }}
              className="w-full max-w-xs p-6 rounded-2xl backdrop-blur-sm border border-white/20 mb-8"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            >
              <p className="text-xs uppercase tracking-widest mb-2 opacity-80">
                Kepada Yth. Tamu Undangan
              </p>
              <p className="text-xl font-medium mb-1">{guestName || 'Nama Tamu'}</p>
              <p className="text-sm opacity-80">Di Tempat</p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              className="px-8 py-3 rounded-full text-sm font-medium tracking-widest uppercase shadow-lg"
              style={{
                backgroundColor: themeColor,
                color: '#fff',
              }}
            >
              Buka Undangan
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
