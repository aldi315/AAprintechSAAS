import React from 'react'

export const defaultEventMinimalistProps = {
  title: 'Wedding Ceremony',
  date: 'SATURDAY, 24 OCT 2026',
  time: '08:00 AM',
  locationName: 'St. Peter\'s Cathedral',
  address: '123 Main Street, New York, NY',
  mapUrl: 'https://maps.google.com',
  themeColor: '#000000',
  bgColor: '#ffffff',
  textColor: '#000000'
}

export function EventMinimalistWidget({ props }: { props: typeof defaultEventMinimalistProps }) {
  return (
    <div className="w-full py-16 px-6" style={{ backgroundColor: props.bgColor, color: props.textColor }}>
      <div className="max-w-md mx-auto border-t border-b py-10" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
        <h3 className="text-2xl font-sans font-medium uppercase tracking-tight mb-8">{props.title}</h3>
        
        <div className="flex flex-col gap-6 font-sans">
          <div className="flex flex-col">
            <span className="text-[10px] tracking-widest uppercase opacity-50 mb-1">When</span>
            <span className="text-sm font-medium">{props.date}</span>
            <span className="text-sm opacity-80">{props.time}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-[10px] tracking-widest uppercase opacity-50 mb-1">Where</span>
            <span className="text-sm font-medium">{props.locationName}</span>
            <span className="text-sm opacity-80 mt-1">{props.address}</span>
          </div>
        </div>

        {props.mapUrl && (
          <a 
            href={props.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-8 text-xs font-medium uppercase tracking-widest border-b pb-1 hover:opacity-70 transition-opacity"
            style={{ borderBottomColor: props.textColor }}
            onClick={(e) => e.preventDefault()}
          >
            View Map
          </a>
        )}
      </div>
    </div>
  )
}
