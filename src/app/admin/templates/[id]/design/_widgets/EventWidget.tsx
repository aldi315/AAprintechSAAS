import React from 'react'

export const defaultEventProps = {
  title: 'Akad Nikah',
  date: 'Sabtu, 24 Oktober 2026',
  time: '08:00 - 10:00 WIB',
  locationName: 'Masjid Raya',
  address: 'Jl. Merdeka No. 1, Jakarta Pusat',
  mapUrl: 'https://maps.google.com',
  themeColor: '#C8A882',
  bgColor: '#FDFBF7',
  textColor: '#333333'
}

export function EventWidget({ props }: { props: typeof defaultEventProps }) {
  return (
    <div className="w-full py-12 px-6 text-center" style={{ backgroundColor: props.bgColor, color: props.textColor }}>
      <div className="max-w-md mx-auto p-8 rounded-2xl shadow-sm border" style={{ borderColor: `${props.themeColor}30`, backgroundColor: 'white' }}>
        <h3 className="text-2xl font-serif font-bold mb-6" style={{ color: props.themeColor }}>{props.title}</h3>
        
        <div className="space-y-4 mb-8">
          <div>
            <p className="font-semibold">{props.date}</p>
            <p className="text-sm opacity-80">{props.time}</p>
          </div>
          
          <div className="w-12 h-[1px] mx-auto opacity-20" style={{ backgroundColor: props.textColor }} />
          
          <div>
            <p className="font-semibold">{props.locationName}</p>
            <p className="text-sm opacity-80 mt-1">{props.address}</p>
          </div>
        </div>

        {props.mapUrl && (
          <a 
            href={props.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2.5 rounded-full text-sm font-medium transition-opacity hover:opacity-90 text-white"
            style={{ backgroundColor: props.themeColor }}
            onClick={(e) => e.preventDefault()} // Prevent navigation in editor
          >
            Buka di Google Maps
          </a>
        )}
      </div>
    </div>
  )
}
