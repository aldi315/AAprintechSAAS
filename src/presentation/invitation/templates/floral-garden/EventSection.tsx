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
  const themeColor = (props.themeColor as string) || 'var(--inv-primary)'
  const bgColor = (props.bgColor as string) || 'var(--inv-secondary)'
  const textColor = (props.textColor as string) || 'var(--inv-text)'

  return (
    <div className="w-full py-16 px-6 text-center overflow-hidden" style={{ backgroundColor: bgColor, color: textColor }}>
      <FadeInView variants={staggerContainer} margin="-100px" className="max-w-lg mx-auto">
        <motion.h3 variants={fadeUp} className="text-3xl font-serif italic mb-8" style={{ color: themeColor }}>
          Rangkaian Acara
        </motion.h3>

        <div className="space-y-8">
          {data.events.map((event, i) => (
            <motion.div key={event.id} variants={fadeLeft}>
              <EventCard
                event={event}
                timezone={data.timezone}
                showMapsButton={showMapsButton}
                showDresscode={showDresscode}
                index={i}
                themeColor={themeColor}
                textColor={textColor}
              />
            </motion.div>
          ))}
        </div>
      </FadeInView>
    </div>
  )
}

function EventCard({
  event, timezone, showMapsButton, showDresscode, index, themeColor, textColor
}: {
  event: WeddingEventDTO
  timezone: string
  showMapsButton: boolean
  showDresscode: boolean
  index: number
  themeColor: string
  textColor: string
}) {
  const startDate = new Date(event.startTime)
  const endDate = event.endTime ? new Date(event.endTime) : null

  const formatDate = (d: Date) =>
    d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: timezone })
  const formatTime = (d: Date) =>
    d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: timezone })

  const timeString = `${formatTime(startDate)}${endDate ? ` — ${formatTime(endDate)}` : ''} WIB`

  return (
    <div className="w-full text-center overflow-hidden" style={{ color: textColor }}>
      <FadeInView variants={staggerContainer} margin="-100px" className="max-w-md mx-auto">
        <div className="p-8 rounded-2xl shadow-sm border text-center" style={{ borderColor: `${themeColor}30`, backgroundColor: 'white' }}>
          <motion.h3 variants={fadeUp} className="text-2xl font-serif font-bold mb-6" style={{ color: themeColor }}>
            {event.name}
          </motion.h3>
          
          <motion.div variants={fadeUp} className="space-y-4 mb-8">
            <div>
              <p className="font-semibold" style={{ fontFamily: 'var(--inv-font-body)' }}>{formatDate(startDate)}</p>
              <p className="text-sm opacity-80" style={{ fontFamily: 'var(--inv-font-body)' }}>{timeString}</p>
            </div>
            
            <div className="w-12 h-[1px] mx-auto opacity-20" style={{ backgroundColor: textColor }} />
            
            <div>
              <p className="text-sm opacity-80 mt-1" style={{ fontFamily: 'var(--inv-font-body)' }}>{event.location}</p>
            </div>

            {showDresscode && event.dresscode && (
              <div className="text-xs px-4 py-1.5 rounded-full inline-block" style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: 'var(--inv-text)', fontFamily: 'var(--inv-font-body)' }}>
                Dresscode: {event.dresscode}
              </div>
            )}
          </motion.div>

          {showMapsButton && event.mapsUrl && (
            <motion.a 
              variants={fadeUp}
              href={event.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2.5 rounded-full text-sm font-medium transition-opacity hover:opacity-90 text-white"
              style={{ backgroundColor: themeColor, fontFamily: 'var(--inv-font-body)' }}
            >
              Buka di Google Maps
            </motion.a>
          )}
        </div>
      </FadeInView>
    </div>
  )
}
