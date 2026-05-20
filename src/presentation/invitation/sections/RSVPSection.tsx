'use client'
/**
 * RSVPSection — Form konfirmasi kehadiran dengan Server Action.
 * Animated with Framer Motion.
 */
import { useState, useTransition } from 'react'
import { submitRsvpAction } from '@/app/[slug]/_actions/submit-rsvp.action'
import type { SectionComponentProps } from '@/presentation/invitation/registry/section.registry'
import { motion } from 'framer-motion'
import { staggerContainer, fadeUp } from '@/presentation/invitation/components/animations/presets'
import { FadeInView } from '@/presentation/invitation/components/animations/FadeInView'

type AttendanceStatus = 'ATTENDING' | 'NOT_ATTENDING' | 'MAYBE'

export function RSVPSection({ data, props, guestCode }: SectionComponentProps) {
  const showGuestCount = (props.showGuestCount as boolean) ?? true
  const showMessage = (props.showMessage as boolean) ?? true

  const [attendance, setAttendance] = useState<AttendanceStatus | ''>('')
  const [guestName, setGuestName] = useState('')
  const [guestCount, setGuestCount] = useState(1)
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!attendance || !guestName.trim()) {
      setError('Nama dan konfirmasi kehadiran wajib diisi.')
      return
    }
    setError('')

    startTransition(async () => {
      const result = await submitRsvpAction({
        weddingId: data.id,
        guestName: guestName.trim(),
        guestCode: guestCode ?? '',
        attendance,
        totalGuest: guestCount,
        message: showMessage ? message : '',
      })

      if (result.success) {
        setSubmitted(true)
      } else {
        setError(result.error ?? 'Terjadi kesalahan. Silakan coba lagi.')
      }
    })
  }

  if (submitted) {
    return (
      <div className="py-24 px-6 text-center overflow-hidden" style={{ backgroundColor: 'var(--inv-bg)' }}>
        <FadeInView variants={staggerContainer} className="max-w-sm mx-auto space-y-6">
          <motion.div variants={fadeUp} className="text-6xl">🌸</motion.div>
          <motion.h3 variants={fadeUp} className="text-4xl" style={{ fontFamily: 'var(--inv-font-script)', color: 'var(--inv-primary)' }}>
            Terima Kasih!
          </motion.h3>
          <motion.p variants={fadeUp} className="text-sm opacity-70 leading-relaxed" style={{ fontFamily: 'var(--inv-font-body)', color: 'var(--inv-text)' }}>
            Konfirmasi kehadiran Anda telah kami terima. Kami sangat menantikan kehadiran Anda.
          </motion.p>
        </FadeInView>
      </div>
    )
  }

  const attendanceOptions: { value: AttendanceStatus; label: string; emoji: string }[] = [
    { value: 'ATTENDING', label: 'Hadir', emoji: '✅' },
    { value: 'NOT_ATTENDING', label: 'Tidak Hadir', emoji: '❌' },
    { value: 'MAYBE', label: 'Mungkin Hadir', emoji: '🤔' },
  ]

  return (
    <div className="py-24 px-6 overflow-hidden" style={{ backgroundColor: 'var(--inv-bg)' }}>
      <FadeInView variants={staggerContainer} margin="-100px" className="max-w-md mx-auto">
        <div className="text-center mb-16 flex flex-col items-center">
          <motion.p variants={fadeUp} className="text-xs tracking-[0.4em] uppercase mb-4" style={{ fontFamily: 'var(--inv-font-body)', color: 'var(--inv-accent)' }}>
            Konfirmasi
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl" style={{ fontFamily: 'var(--inv-font-script)', color: 'var(--inv-primary)' }}>
            RSVP
          </motion.h2>
          <motion.div variants={fadeUp} className="mt-6 mx-auto w-16 h-px" style={{ backgroundColor: 'var(--inv-primary)' }} />
          <motion.p variants={fadeUp} className="mt-6 text-sm opacity-75" style={{ fontFamily: 'var(--inv-font-body)', color: 'var(--inv-text)' }}>
            Mohon konfirmasi kehadiran Anda paling lambat 3 hari sebelum acara.
          </motion.p>
        </div>

        <motion.form variants={fadeUp} onSubmit={handleSubmit} className="space-y-8">
          {/* Name */}
          <div className="space-y-3">
            <label className="text-xs tracking-[0.2em] uppercase block" style={{ fontFamily: 'var(--inv-font-body)', color: 'var(--inv-accent)' }}>
              Nama Anda *
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Masukkan nama Anda"
              className="w-full px-5 py-4 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-opacity-50"
              style={{
                backgroundColor: 'var(--inv-secondary)',
                border: `1px solid var(--inv-primary)`,
                fontFamily: 'var(--inv-font-body)',
                color: 'var(--inv-text)',
                '--tw-ring-color': 'var(--inv-primary)',
              } as React.CSSProperties}
            />
          </div>

          {/* Attendance */}
          <div className="space-y-3">
            <label className="text-xs tracking-[0.2em] uppercase block" style={{ fontFamily: 'var(--inv-font-body)', color: 'var(--inv-accent)' }}>
              Konfirmasi Kehadiran *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {attendanceOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAttendance(opt.value)}
                  className="py-4 px-2 rounded-xl text-xs text-center transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: attendance === opt.value ? 'var(--inv-primary)' : 'var(--inv-secondary)',
                    color: attendance === opt.value ? '#fff' : 'var(--inv-text)',
                    border: `1px solid var(--inv-primary)`,
                    fontFamily: 'var(--inv-font-body)',
                    boxShadow: attendance === opt.value ? '0 4px 14px 0 rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  <div className="text-xl mb-1">{opt.emoji}</div>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Guest count */}
          {showGuestCount && attendance === 'ATTENDING' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
              <label className="text-xs tracking-[0.2em] uppercase block" style={{ fontFamily: 'var(--inv-font-body)', color: 'var(--inv-accent)' }}>
                Jumlah Tamu
              </label>
              <div className="flex items-center gap-6">
                <button type="button" onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  className="w-12 h-12 rounded-full text-xl transition-all hover:scale-110 active:scale-95 shadow-sm"
                  style={{ backgroundColor: 'var(--inv-secondary)', border: `1px solid var(--inv-primary)`, color: 'var(--inv-primary)' }}>−</button>
                <span className="text-2xl font-bold w-8 text-center" style={{ fontFamily: 'var(--inv-font-heading)', color: 'var(--inv-text)' }}>{guestCount}</span>
                <button type="button" onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
                  className="w-12 h-12 rounded-full text-xl transition-all hover:scale-110 active:scale-95 shadow-sm"
                  style={{ backgroundColor: 'var(--inv-secondary)', border: `1px solid var(--inv-primary)`, color: 'var(--inv-primary)' }}>+</button>
              </div>
            </motion.div>
          )}

          {/* Message */}
          {showMessage && (
            <div className="space-y-3">
              <label className="text-xs tracking-[0.2em] uppercase block" style={{ fontFamily: 'var(--inv-font-body)', color: 'var(--inv-accent)' }}>
                Pesan & Doa
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis pesan dan doa untuk mempelai..."
                rows={4}
                className="w-full px-5 py-4 rounded-xl text-sm outline-none resize-none transition-all focus:ring-2 focus:ring-opacity-50"
                style={{
                  backgroundColor: 'var(--inv-secondary)',
                  border: `1px solid var(--inv-primary)`,
                  fontFamily: 'var(--inv-font-body)',
                  color: 'var(--inv-text)',
                  '--tw-ring-color': 'var(--inv-primary)',
                } as React.CSSProperties}
              />
            </div>
          )}

          {error && (
            <p className="text-red-500 text-xs text-center bg-red-50 p-3 rounded-lg" style={{ fontFamily: 'var(--inv-font-body)' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-5 rounded-full text-sm tracking-widest uppercase transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-md hover:shadow-lg"
            style={{ backgroundColor: 'var(--inv-primary)', color: '#fff', fontFamily: 'var(--inv-font-body)' }}
          >
            {isPending ? 'Mengirim...' : 'Kirim Konfirmasi'}
          </button>
        </motion.form>
      </FadeInView>
    </div>
  )
}
