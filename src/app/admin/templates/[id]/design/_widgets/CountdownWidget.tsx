import React from 'react'

export const defaultCountdownProps = {
  title: 'Menuju Hari Bahagia',
  targetDate: '2026-10-24T08:00:00',
  themeColor: '#C8A882',
  bgColor: '#ffffff',
  textColor: '#333333'
}

export function CountdownWidget({ props }: { props: typeof defaultCountdownProps }) {
  // Static visual representation for editor
  const timeUnits = [
    { label: 'Hari', value: '14' },
    { label: 'Jam', value: '08' },
    { label: 'Menit', value: '45' },
    { label: 'Detik', value: '30' }
  ]

  return (
    <div className="w-full py-12 px-6 text-center" style={{ backgroundColor: props.bgColor, color: props.textColor }}>
      <h3 className="text-xl font-serif mb-8">{props.title}</h3>
      
      <div className="flex items-center justify-center gap-3 sm:gap-6">
        {timeUnits.map((unit, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div 
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold shadow-sm mb-2 text-white"
              style={{ backgroundColor: props.themeColor }}
            >
              {unit.value}
            </div>
            <span className="text-xs sm:text-sm uppercase tracking-wider opacity-80">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
