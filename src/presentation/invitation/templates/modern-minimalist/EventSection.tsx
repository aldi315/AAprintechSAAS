'use client'
import React from 'react'
import { motion } from 'framer-motion'
import type { SectionComponentProps } from '@/presentation/invitation/registry/section.registry'

export function EventSection({ data, props }: SectionComponentProps) {
  const bgColor = (props.bgColor as string) || '#ffffff'
  const textColor = (props.textColor as string) || '#000000'

  return (
    <div className="w-full py-32 px-6" style={{ backgroundColor: bgColor, color: textColor }}>
      <div className="max-w-xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl font-sans font-medium uppercase tracking-tight mb-20"
        >
          Agenda
        </motion.h2>

        <div className="flex flex-col gap-12">
          {data.events.map((event, i) => {
            const startDate = new Date(event.startTime)
            const formatDate = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric', timeZone: data.timezone })
            const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: data.timezone })

            return (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="border-t py-10" 
                style={{ borderColor: 'rgba(0,0,0,0.1)' }}
              >
                <h3 className="text-3xl font-sans font-medium uppercase tracking-tight mb-8">{event.name}</h3>
                
                <div className="flex flex-col md:flex-row gap-8 md:gap-16 font-sans">
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] tracking-widest uppercase opacity-50 mb-2">When</span>
                    <span className="text-lg font-medium">{formatDate(startDate)}</span>
                    <span className="text-base opacity-80 mt-1">{formatTime(startDate)}</span>
                  </div>
                  
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] tracking-widest uppercase opacity-50 mb-2">Where</span>
                    <span className="text-lg font-medium">{event.location || 'TBA'}</span>
                    <span className="text-base opacity-80 mt-1">{event.note}</span>
                  </div>
                </div>

                {event.mapsUrl && (
                  <a 
                    href={event.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-10 text-sm font-medium uppercase tracking-widest border-b pb-1 hover:opacity-70 transition-opacity"
                    style={{ borderBottomColor: textColor }}
                  >
                    View Map
                  </a>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
