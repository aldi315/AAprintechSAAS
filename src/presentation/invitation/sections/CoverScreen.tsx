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

export function CoverScreen({ data, guestName }: SectionComponentProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

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
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: 'var(--inv-bg)' }}
        >
          {/* Background Image with Slow Zoom & Soft Blur */}
          {data.coverImage && (
            <motion.div 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
              className="absolute inset-0 z-0"
            >
              <Image
                src={data.coverImage}
                alt="Cover"
                fill
                className="object-cover blur-[2px] opacity-40"
                priority
              />
            </motion.div>
          )}

          {/* Ambient Overlay */}
          <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), var(--inv-bg))' }} />

          {/* Subtle Floating Particles */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full opacity-30"
                style={{ backgroundColor: 'var(--inv-primary)' }}
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 500),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                }}
                animate={{
                  y: [null, Math.random() * -100 - 50],
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col items-center gap-6 px-8 text-center max-w-sm mx-auto w-full">
            {/* Ornament top */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-3xl" 
              style={{ color: 'var(--inv-primary)' }}
            >
              ✦
            </motion.div>

            {/* Undangan dari */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="text-xs tracking-[0.3em] uppercase" 
              style={{ fontFamily: 'var(--inv-font-body)', color: 'var(--inv-accent)' }}
            >
              Undangan Pernikahan
            </motion.p>

            {/* Couple names */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 1.2, ease: "easeOut" }}
              className="text-5xl leading-tight"
              style={{ fontFamily: 'var(--inv-font-script)', color: 'var(--inv-primary)' }}
            >
              {data.brideName} & {data.groomName}
            </motion.h1>

            {/* Separator */}
            <motion.div 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              transition={{ delay: 1.1, duration: 1 }}
              className="flex items-center gap-3 w-full justify-center"
            >
              <div className="flex-1 h-px max-w-[80px]" style={{ backgroundColor: 'var(--inv-primary)', opacity: 0.3 }} />
              <span style={{ color: 'var(--inv-primary)' }}>❧</span>
              <div className="flex-1 h-px max-w-[80px]" style={{ backgroundColor: 'var(--inv-primary)', opacity: 0.3 }} />
            </motion.div>

            {/* Guest name */}
            {guestName && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 1 }}
                className="space-y-1 mt-4"
              >
                <p className="text-xs tracking-widest uppercase" style={{ fontFamily: 'var(--inv-font-body)', color: 'var(--inv-accent)', opacity: 0.7 }}>
                  Kepada Yth.
                </p>
                <p
                  className="text-2xl"
                  style={{ fontFamily: 'var(--inv-font-heading)', color: 'var(--inv-text)' }}
                >
                  {guestName}
                </p>
              </motion.div>
            )}

            {/* Open button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              whileHover={{ scale: 1.05, backgroundColor: 'var(--inv-accent)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              className="mt-6 px-10 py-3 rounded-full text-sm tracking-widest uppercase"
              style={{
                fontFamily: 'var(--inv-font-body)',
                backgroundColor: 'var(--inv-primary)',
                color: '#fff',
                letterSpacing: '0.2em',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2)'
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
