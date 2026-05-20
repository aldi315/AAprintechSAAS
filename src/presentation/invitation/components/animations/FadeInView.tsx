'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fadeUp } from './presets'

interface FadeInViewProps {
  children: React.ReactNode
  className?: string
  variants?: Variants
  delay?: number
  once?: boolean
  margin?: string
}

export function FadeInView({ 
  children, 
  className, 
  variants = fadeUp, 
  delay = 0,
  once = true,
  margin = '-100px'
}: FadeInViewProps) {
  const prefersReducedMotion = useReducedMotion()

  // Jika user prefers reduced motion, kita tetap render children tapi tanpa animasi berat
  const effectiveVariants = prefersReducedMotion ? {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5 } }
  } : variants

  // Jika variants punya 'show', tambahkan custom delay
  const customVariants = { ...effectiveVariants }
  if (customVariants.show && (customVariants.show as any).transition && delay > 0) {
    customVariants.show = {
      ...customVariants.show as any,
      transition: {
        ...(customVariants.show as any).transition,
        delay,
      }
    }
  }

  return (
    <motion.div
      variants={customVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
