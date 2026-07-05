'use client'
/**
 * TextSection — Public renderer for text block sections.
 */
import { motion } from 'framer-motion'
import { fadeUp } from '@/presentation/invitation/components/animations/presets'
import type { SectionComponentProps } from '@/presentation/invitation/registry/section.registry'

export function TextSection({ props }: SectionComponentProps) {
  const content = (props.content as string) ?? ''
  const fontSize = (props.fontSize as number) ?? 16
  const color = (props.color as string) ?? 'var(--inv-text)'
  const align = (props.align as string) ?? 'center'
  const fontFamily = (props.fontFamily as string) ?? 'sans-serif'
  const padding = (props.padding as string) ?? '24px'

  const fontMap: Record<string, string> = {
    'sans-serif': 'var(--inv-font-body)',
    'serif': 'var(--inv-font-heading)',
    'cursive': 'var(--inv-font-script)',
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={fadeUp}
      style={{ padding }}
    >
      <p
        style={{
          fontSize: `${fontSize}px`,
          color,
          textAlign: align as any,
          fontFamily: fontMap[fontFamily] || fontFamily,
          lineHeight: 1.6,
        }}
      >
        {content}
      </p>
    </motion.div>
  )
}
