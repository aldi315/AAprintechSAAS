'use client'
/**
 * RSVPSection — Form konfirmasi kehadiran dengan Server Action.
 * Animated with Framer Motion.
 */
import { useState, useTransition } from 'react'
import { submitRsvpAction } from '@/app/invitation/[slug]/_actions/submit-rsvp.action'
import type { SectionComponentProps } from '@/presentation/invitation/registry/section.registry'
import { motion } from 'framer-motion'
import { staggerContainer, fadeUp } from '@/presentation/invitation/components/animations/presets'
import { FadeInView } from '@/presentation/invitation/components/animations/FadeInView'

type AttendanceStatus = 'ATTENDING' | 'NOT_ATTENDING' | 'MAYBE'

export function RSVPSection({ data, props, guestCode }: SectionComponentProps) {
  const showGuestCount = (props.showGuestCount as boolean) ?? true
  const showMessage = (props.showMessage as boolean) ?? true
  const themeColor = (props.themeColor as string) || 'var(--inv-primary)'
  const bgColor = (props.bgColor as string) || 'var(--inv-bg)'
  const textColor = (props.textColor as string) || 'var(--inv-text)'

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
      <div className="py-24 px-6 text-center overflow-hidden" style={{ backgroundColor: bgColor }}>
        <FadeInView variants={staggerContainer} className="max-w-sm mx-auto space-y-6">
          <motion.div variants={fadeUp} className="text-6xl">🌸</motion.div>
          <motion.h3 variants={fadeUp} className="text-4xl" style={{ fontFamily: 'var(--inv-font-script)', color: themeColor }}>
            Terima Kasih!
          </motion.h3>
          <motion.p variants={fadeUp} className="text-sm opacity-70 leading-relaxed" style={{ fontFamily: 'var(--inv-font-body)', color: textColor }}>
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
    <div className="w-full py-16 px-6 overflow-hidden" style={{ backgroundColor: bgColor, color: textColor }}>
      <FadeInView variants={staggerContainer} margin="-100px" className="max-w-md mx-auto">
        <div className="text-center mb-10 flex flex-col items-center">
          <motion.p variants={fadeUp} className="text-[10px] tracking-[0.3em] uppercase mb-2 opacity-80" style={{ color: themeColor }}>
            {(props.subtitle as string) || 'Konfirmasi'}
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl font-serif italic" style={{ color: themeColor }}>
            {(props.title as string) || 'RSVP'}
          </motion.h2>
          <motion.div variants={fadeUp} className="mt-4 mx-auto w-12 h-px opacity-50" style={{ backgroundColor: themeColor }} />
          <motion.p variants={fadeUp} className="mt-4 text-xs opacity-70 leading-relaxed">
            {(props.description as string) || 'Mohon konfirmasi kehadiran Anda paling lambat 3 hari sebelum acara.'}
          </motion.p>
        </div>

        <motion.form variants={fadeUp} onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-[10px] tracking-[0.1em] uppercase block" style={{ color: themeColor }}>
              Nama Anda *
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full px-4 py-3 rounded-lg text-sm bg-black/5 border border-black/10 outline-none transition-all focus:ring-2 focus:ring-opacity-50"
              style={{
                backgroundColor: 'rgba(0,0,0,0.05)',
                color: textColor,
                '--tw-ring-color': themeColor,
              } as React.CSSProperties}
            />
          </div>

          {/* Attendance */}
          <div className="space-y-2">
            <label className="text-[10px] tracking-[0.1em] uppercase block" style={{ color: themeColor }}>
              Konfirmasi Kehadiran *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {attendanceOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAttendance(opt.value)}
                  className="py-2 px-1 rounded-lg text-[10px] text-center transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border"
                  style={{
                    backgroundColor: attendance === opt.value ? 'white' : 'rgba(0,0,0,0.05)',
                    borderColor: attendance === opt.value ? themeColor : 'rgba(0,0,0,0.1)',
                    boxShadow: attendance === opt.value ? '0 2px 8px 0 rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  <div className="text-lg mb-1">{opt.emoji}</div>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Guest count */}
          {showGuestCount && attendance === 'ATTENDING' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
              <label className="text-[10px] tracking-[0.1em] uppercase block" style={{ color: themeColor }}>
                Jumlah Tamu
              </label>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all hover:scale-105 active:scale-95 bg-black/5 border border-black/10"
                  style={{ color: themeColor }}>−</button>
                <span className="text-lg font-medium w-8 text-center">{guestCount}</span>
                <button type="button" onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all hover:scale-105 active:scale-95 bg-black/5 border border-black/10"
                  style={{ color: themeColor }}>+</button>
              </div>
            </motion.div>
          )}

          {/* Message */}
          {showMessage && (
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.1em] uppercase block" style={{ color: themeColor }}>
                Pesan & Doa
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis pesan..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg text-sm bg-black/5 border border-black/10 outline-none resize-none transition-all focus:ring-2 focus:ring-opacity-50"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  color: textColor,
                  '--tw-ring-color': themeColor,
                } as React.CSSProperties}
              />
            </div>
          )}

          {error && (
            <p className="text-red-500 text-xs text-center bg-red-50 p-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 rounded-full text-xs font-medium uppercase tracking-widest text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            style={{ backgroundColor: themeColor }}
          >
            {isPending ? 'Mengirim...' : 'Kirim Konfirmasi'}
          </button>
        </motion.form>
      </FadeInView>
    </div>
  )
}
