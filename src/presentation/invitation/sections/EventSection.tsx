'use client'
/**
 * EventSection — Daftar acara pernikahan (akad, resepsi, ngunduh mantu).
 * Animated with Framer Motion.
 */
import { motion } from 'framer-motion'
import { staggerContainer, fadeUp, fadeLeft } from '@/presentation/invitation/components/animations/presets'
import { FadeInView } from '@/presentation/invitation/components/animations/FadeInView'
import type { SectionComponentProps } from '@/presentation/invitation/registry/section.registry'
import type { WeddingEventDTO } from '@/core/entities/invitation-render.entity'

export function EventSection({ data, props }: SectionComponentProps) {
  const showMapsButton = (props.showMapsButton as boolean) ?? true
  const showDresscode = (props.showDresscode as boolean) ?? true

  return (
    <div className="py-24 px-6 overflow-hidden" style={{ backgroundColor: 'var(--inv-secondary)' }}>
      <FadeInView variants={staggerContainer} margin="-100px" className="max-w-lg mx-auto">
        <div className="text-center mb-16 flex flex-col items-center">
          <motion.p variants={fadeUp} className="text-xs tracking-[0.4em] uppercase mb-4" style={{ fontFamily: 'var(--inv-font-body)', color: 'var(--inv-accent)' }}>
            Acara
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl" style={{ fontFamily: 'var(--inv-font-script)', color: 'var(--inv-primary)' }}>
            Rangkaian Acara
          </motion.h2>
          <motion.div variants={fadeUp} className="mt-6 mx-auto w-16 h-px" style={{ backgroundColor: 'var(--inv-primary)' }} />
        </div>

        <div className="space-y-8">
          {data.events.map((event, i) => (
            <motion.div key={event.id} variants={fadeLeft}>
              <EventCard
                event={event}
                timezone={data.timezone}
                showMapsButton={showMapsButton}
                showDresscode={showDresscode}
                index={i}
              />
            </motion.div>
          ))}
        </div>
      </FadeInView>
    </div>
  )
}

function EventCard({
  event, timezone, showMapsButton, showDresscode, index,
}: {
  event: WeddingEventDTO
  timezone: string
  showMapsButton: boolean
  showDresscode: boolean
  index: number
}) {
  const startDate = new Date(event.startTime)
  const endDate = event.endTime ? new Date(event.endTime) : null

  const formatDate = (d: Date) =>
    d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: timezone })
  const formatTime = (d: Date) =>
    d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: timezone })

  return (
    <div
      className="rounded-2xl p-8 space-y-5 transition-shadow duration-300 hover:shadow-lg"
      style={{ backgroundColor: 'var(--inv-bg)', border: `1px solid var(--inv-primary)` }}
    >
      {/* Event name */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm"
          style={{ backgroundColor: 'var(--inv-primary)' }}>
          {index + 1}
        </div>
        <h3 className="text-2xl" style={{ fontFamily: 'var(--inv-font-heading)', color: 'var(--inv-text)' }}>
          {event.name}
        </h3>
      </div>

      <div className="w-full h-px opacity-30" style={{ backgroundColor: 'var(--inv-primary)' }} />

      {/* Date */}
      <div className="flex gap-4 items-start">
        <span className="text-base mt-0.5" style={{ color: 'var(--inv-primary)' }}>📅</span>
        <div>
          <p className="text-base font-medium" style={{ fontFamily: 'var(--inv-font-body)', color: 'var(--inv-text)' }}>
            {formatDate(startDate)}
          </p>
          <p className="text-sm opacity-70 mt-1" style={{ fontFamily: 'var(--inv-font-body)', color: 'var(--inv-text)' }}>
            {formatTime(startDate)}{endDate ? ` — ${formatTime(endDate)}` : ''} WIB
          </p>
        </div>
      </div>

      {/* Location */}
      {event.location && (
        <div className="flex gap-4 items-start">
          <span className="text-base mt-0.5" style={{ color: 'var(--inv-primary)' }}>📍</span>
          <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--inv-font-body)', color: 'var(--inv-text)' }}>
            {event.location}
          </p>
        </div>
      )}

      {/* Dresscode */}
      {showDresscode && event.dresscode && (
        <div className="flex gap-4 items-center">
          <span className="text-base" style={{ color: 'var(--inv-primary)' }}>👗</span>
          <span className="text-xs px-4 py-1.5 rounded-full" style={{ backgroundColor: 'var(--inv-secondary)', color: 'var(--inv-accent)', fontFamily: 'var(--inv-font-body)' }}>
            Dresscode: {event.dresscode}
          </span>
        </div>
      )}

      {/* Maps button */}
      {showMapsButton && event.mapsUrl && (
        <div className="pt-2">
          <a
            href={event.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs tracking-widest uppercase transition-all duration-300 hover:scale-105 active:scale-95 w-full justify-center"
            style={{ 
              backgroundColor: 'var(--inv-primary)', 
              color: '#fff', 
              fontFamily: 'var(--inv-font-body)' 
            }}
          >
            <span>🗺️</span> Petunjuk Arah
          </a>
        </div>
      )}
    </div>
  )
}
