import type { Variants } from 'framer-motion'

export const DURATION = 1.2
export const EASE = [0.16, 1, 0.3, 1] as const // Custom ease out for luxury feel

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: DURATION, ease: EASE }
  }
}

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  show: { 
    opacity: 1, 
    x: 0,
    transition: { duration: DURATION, ease: EASE }
  }
}

export const zoomIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: DURATION, ease: EASE }
  }
}

export const blurReveal: Variants = {
  hidden: { opacity: 0, filter: 'blur(10px)' },
  show: { 
    opacity: 1, 
    filter: 'blur(0px)',
    transition: { duration: DURATION, ease: EASE }
  }
}

export const scaleSoft: Variants = {
  hidden: { scale: 1.05, opacity: 0 },
  show: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: DURATION * 1.5, ease: EASE }
  }
}
