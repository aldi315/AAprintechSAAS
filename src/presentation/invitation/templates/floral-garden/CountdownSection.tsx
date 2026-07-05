'use client'
/**
 * CountdownSection — Real-time countdown ke event pertama.
 * Animated with Framer Motion stagger.
 */
import { useEffect, useState } from 'react'
import type { SectionComponentProps } from '@/presentation/invitation/registry/section.registry'
import { motion } from 'framer-motion'
import { staggerContainer, fadeUp, zoomIn } from '@/presentation/invitation/components/animations/presets'
import { FadeInView } from '@/presentation/invitation/components/animations/FadeInView'

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number }

function calcTimeLeft(targetISO: string, timezone: string): TimeLeft {
  const now = Date.now()
  const target = new Date(targetISO).getTime()
  const diff = Math.max(0, target - now)
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export function CountdownSection({ data, props }: SectionComponentProps) {
  const title = (props.title as string) || 'Menuju Hari Bahagia'
  const themeColor = (props.themeColor as string) || 'var(--inv-primary)'
  const bgColor = (props.bgColor as string) || 'var(--inv-bg)'
  const textColor = (props.textColor as string) || 'var(--inv-text)'
  
  // Parse target date from props, or fallback to first event
  let targetEventTime: string | null = props.targetDate as string
  let targetEventName = ''
  
  if (!targetEventTime && data.events[0]) {
    targetEventTime = data.events[0].startTime as unknown as string
    targetEventName = data.events[0].name
  } else if (targetEventTime) {
    targetEventName = 'Acara Spesial' // generic name if custom date
  }

  const [time, setTime] = useState<TimeLeft | null>(null)

  useEffect(() => {
    if (!targetEventTime) return
    setTime(calcTimeLeft(targetEventTime, data.timezone))
    const id = setInterval(() => setTime(calcTimeLeft(targetEventTime!, data.timezone)), 1000)
    return () => clearInterval(id)
  }, [targetEventTime, data.timezone])

  if (!targetEventTime || !time) return null

  return (
    <div className="w-full py-12 px-6 text-center overflow-hidden" style={{ backgroundColor: bgColor, color: textColor }}>
      <FadeInView variants={staggerContainer} margin="-100px" className="max-w-xl mx-auto flex flex-col items-center">
        <motion.h3 variants={fadeUp} className="text-xl font-serif mb-8" style={{ color: textColor }}>
          {title}
        </motion.h3>

        <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 sm:gap-6">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold shadow-sm mb-2 text-white" style={{ backgroundColor: themeColor }}>
              {String(time.days).padStart(2, '0')}
            </div>
            <span className="text-xs sm:text-sm uppercase tracking-wider opacity-80" style={{ fontFamily: 'var(--inv-font-body)' }}>Hari</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold shadow-sm mb-2 text-white" style={{ backgroundColor: themeColor }}>
              {String(time.hours).padStart(2, '0')}
            </div>
            <span className="text-xs sm:text-sm uppercase tracking-wider opacity-80" style={{ fontFamily: 'var(--inv-font-body)' }}>Jam</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold shadow-sm mb-2 text-white" style={{ backgroundColor: themeColor }}>
              {String(time.minutes).padStart(2, '0')}
            </div>
            <span className="text-xs sm:text-sm uppercase tracking-wider opacity-80" style={{ fontFamily: 'var(--inv-font-body)' }}>Menit</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold shadow-sm mb-2 text-white" style={{ backgroundColor: themeColor }}>
              {String(time.seconds).padStart(2, '0')}
            </div>
            <span className="text-xs sm:text-sm uppercase tracking-wider opacity-80" style={{ fontFamily: 'var(--inv-font-body)' }}>Detik</span>
          </div>
        </motion.div>
      </FadeInView>
    </div>
  )
}

function CountUnit({ value, label, themeColor, textColor }: { value: number; label: string; themeColor: string; textColor: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-16 h-16 md:w-24 md:h-24 rounded-2xl flex items-center justify-center shadow-sm relative overflow-hidden"
        style={{ backgroundColor: 'var(--inv-secondary)', border: `1px solid ${themeColor}` }}
      >
        <div className="absolute inset-0 bg-white/40 border-b border-white/50 w-full h-1/2" />
        <span className="text-3xl md:text-5xl font-bold tabular-nums relative z-10 drop-shadow-sm" style={{ fontFamily: 'var(--inv-font-heading)', color: themeColor }}>
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] tracking-widest uppercase" style={{ fontFamily: 'var(--inv-font-body)', color: textColor, opacity: 0.8 }}>
        {label}
      </span>
    </div>
  )
}

function Dot({ themeColor }: { themeColor: string }) {
  return (
    <div className="flex flex-col justify-center gap-3 pb-8 h-full">
      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full opacity-50" style={{ backgroundColor: themeColor }} />
      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full opacity-50" style={{ backgroundColor: themeColor }} />
    </div>
  )
}
