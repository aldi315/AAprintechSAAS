import React from 'react'

export const defaultRsvpProps = {
  title: 'RSVP',
  subtitle: 'Konfirmasi',
  description: 'Mohon konfirmasi kehadiran Anda paling lambat 3 hari sebelum acara.',
  showGuestCount: true,
  showMessage: true,
  themeColor: '#C8A882',
  bgColor: '#FDFBF7',
  textColor: '#333333'
}

export function RsvpWidget({ props }: { props: typeof defaultRsvpProps }) {
  return (
    <div className="w-full py-16 px-6 overflow-hidden pointer-events-none" style={{ backgroundColor: props.bgColor, color: props.textColor }}>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10 flex flex-col items-center">
          <p className="text-[10px] tracking-[0.3em] uppercase mb-2 opacity-80" style={{ color: props.themeColor }}>
            {props.subtitle}
          </p>
          <h2 className="text-3xl font-serif italic" style={{ color: props.themeColor }}>
            {props.title}
          </h2>
          <div className="mt-4 mx-auto w-12 h-px opacity-50" style={{ backgroundColor: props.themeColor }} />
          <p className="mt-4 text-xs opacity-70 leading-relaxed">
            {props.description}
          </p>
        </div>

        <div className="space-y-6 opacity-70">
          <div className="space-y-2">
            <label className="text-[10px] tracking-[0.1em] uppercase block" style={{ color: props.themeColor }}>
              Nama Anda *
            </label>
            <div className="w-full px-4 py-3 rounded-lg text-sm bg-black/5 border border-black/10">
              Contoh: Budi Santoso
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] tracking-[0.1em] uppercase block" style={{ color: props.themeColor }}>
              Konfirmasi Kehadiran *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div className="py-2 px-1 rounded-lg text-[10px] text-center border bg-white" style={{ borderColor: props.themeColor }}>
                <div className="text-lg mb-1">✅</div>
                Hadir
              </div>
              <div className="py-2 px-1 rounded-lg text-[10px] text-center border border-black/10 bg-black/5">
                <div className="text-lg mb-1">❌</div>
                Tidak
              </div>
              <div className="py-2 px-1 rounded-lg text-[10px] text-center border border-black/10 bg-black/5">
                <div className="text-lg mb-1">🤔</div>
                Mungkin
              </div>
            </div>
          </div>

          {props.showGuestCount && (
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.1em] uppercase block" style={{ color: props.themeColor }}>
                Jumlah Tamu
              </label>
              <div className="w-full px-4 py-3 rounded-lg text-sm bg-black/5 border border-black/10">
                1
              </div>
            </div>
          )}

          {props.showMessage && (
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.1em] uppercase block" style={{ color: props.themeColor }}>
                Pesan & Doa
              </label>
              <div className="w-full px-4 py-3 rounded-lg text-sm bg-black/5 border border-black/10 h-20">
                Tulis pesan...
              </div>
            </div>
          )}

          <div
            className="w-full py-4 rounded-full text-xs font-medium text-center uppercase tracking-widest text-white mt-4"
            style={{ backgroundColor: props.themeColor }}
          >
            Kirim Konfirmasi
          </div>
        </div>
      </div>
    </div>
  )
}
