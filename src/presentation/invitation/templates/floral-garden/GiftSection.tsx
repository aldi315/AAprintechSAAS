'use client'
/**
 * GiftSection — Public renderer for wedding gift / cashless sections.
 * Animated with Framer Motion.
 */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, fadeUp } from '@/presentation/invitation/components/animations/presets'
import type { SectionComponentProps } from '@/presentation/invitation/registry/section.registry'

interface GiftAccount {
  bankName: string
  accountNumber: string
  accountName: string
}

export function GiftSection({ props }: SectionComponentProps) {
  const title = (props.title as string) ?? 'Wedding Gift'
  const description = (props.description as string) ?? ''
  const accounts = (props.accounts as GiftAccount[]) ?? []
  const themeColor = (props.themeColor as string) ?? 'var(--inv-primary)'
  const bgColor = (props.bgColor as string) ?? 'var(--inv-bg)'
  const textColor = (props.textColor as string) ?? 'var(--inv-text)'

  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 2000)
    }).catch(() => {})
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      className="w-full py-16 px-6 text-center"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="max-w-md mx-auto">
        <motion.h3
          variants={fadeUp}
          className="text-3xl font-serif italic mb-4"
          style={{ color: themeColor }}
        >
          {title}
        </motion.h3>

        {description && (
          <motion.p
            variants={fadeUp}
            className="text-sm opacity-80 mb-8 leading-relaxed"
          >
            {description}
          </motion.p>
        )}

        <div className="space-y-6">
          {accounts.map((acc, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              className="p-6 rounded-2xl bg-white shadow-sm border"
              style={{ borderColor: `${themeColor}30` }}
            >
              <p className="font-bold text-lg mb-2">{acc.bankName}</p>
              <p className="text-xl tracking-wider font-mono mb-2">{acc.accountNumber}</p>
              <p className="text-sm opacity-80 mb-6">a.n. {acc.accountName}</p>
              <button
                onClick={() => handleCopy(acc.accountNumber, idx)}
                className="w-full py-3 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90 active:scale-95"
                style={{ backgroundColor: themeColor }}
              >
                {copiedIdx === idx ? '✓ Tersalin!' : 'Salin Nomor Rekening'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
