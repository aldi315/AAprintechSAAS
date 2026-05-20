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
  const targetIdx = (props.targetEventIndex as number) ?? 0
  const targetEvent = data.events[targetIdx]
  const [time, setTime] = useState<TimeLeft | null>(null)

  useEffect(() => {
    if (!targetEvent) return
    setTime(calcTimeLeft(targetEvent.startTime, data.timezone))
    const id = setInterval(() => setTime(calcTimeLeft(targetEvent.startTime, data.timezone)), 1000)
    return () => clearInterval(id)
  }, [targetEvent, data.timezone])

  if (!targetEvent) return null

  const isPast = time && time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0

  return (
    <div className="py-24 px-6 text-center overflow-hidden" style={{ backgroundColor: 'var(--inv-bg)' }}>
      <FadeInView variants={staggerContainer} margin="-100px" className="max-w-xl mx-auto flex flex-col items-center">
        <motion.p variants={fadeUp} className="text-xs tracking-[0.4em] uppercase mb-4" style={{ fontFamily: 'var(--inv-font-body)', color: 'var(--inv-accent)' }}>
          Menuju Hari Bahagia
        </motion.p>
        <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl mb-2" style={{ fontFamily: 'var(--inv-font-script)', color: 'var(--inv-primary)' }}>
          {targetEvent.name}
        </motion.h2>
        <motion.div variants={fadeUp} className="mt-4 mx-auto w-16 h-px mb-16" style={{ backgroundColor: 'var(--inv-primary)' }} />

        {isPast ? (
          <motion.p variants={fadeUp} className="text-3xl" style={{ fontFamily: 'var(--inv-font-heading)', color: 'var(--inv-primary)' }}>
            Alhamdulillah, hari bahagia telah tiba 🌸
          </motion.p>
        ) : (
          <motion.div variants={staggerContainer} className="flex justify-center gap-4 md:gap-8">
            {time && (
              <>
                <motion.div variants={zoomIn}><CountUnit value={time.days} label="Hari" /></motion.div>
                <motion.div variants={fadeUp}><Dot /></motion.div>
                <motion.div variants={zoomIn}><CountUnit value={time.hours} label="Jam" /></motion.div>
                <motion.div variants={fadeUp}><Dot /></motion.div>
                <motion.div variants={zoomIn}><CountUnit value={time.minutes} label="Menit" /></motion.div>
                <motion.div variants={fadeUp}><Dot /></motion.div>
                <motion.div variants={zoomIn}><CountUnit value={time.seconds} label="Detik" /></motion.div>
              </>
            )}
          </motion.div>
        )}
      </FadeInView>
    </div>
  )
}

function CountUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-16 h-16 md:w-24 md:h-24 rounded-2xl flex items-center justify-center shadow-sm relative overflow-hidden"
        style={{ backgroundColor: 'var(--inv-secondary)', border: `1px solid var(--inv-primary)` }}
      >
        <div className="absolute inset-0 bg-white/40 border-b border-white/50 w-full h-1/2" />
        <span className="text-3xl md:text-5xl font-bold tabular-nums relative z-10 drop-shadow-sm" style={{ fontFamily: 'var(--inv-font-heading)', color: 'var(--inv-primary)' }}>
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] tracking-widest uppercase" style={{ fontFamily: 'var(--inv-font-body)', color: 'var(--inv-accent)' }}>
        {label}
      </span>
    </div>
  )
}

function Dot() {
  return (
    <div className="flex flex-col justify-center gap-3 pb-8 h-full">
      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full opacity-50" style={{ backgroundColor: 'var(--inv-primary)' }} />
      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full opacity-50" style={{ backgroundColor: 'var(--inv-primary)' }} />
    </div>
  )
}
