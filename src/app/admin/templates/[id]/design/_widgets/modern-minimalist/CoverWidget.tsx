import React from 'react'

export const defaultCoverMinimalistProps = {
  title: 'Romeo & Juliet',
  subtitle: 'We Are Getting Married',
  date: '24 . 10 . 2026',
  imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
  themeColor: '#000000',
  bgColor: '#ffffff',
  textColor: '#ffffff',
  overlayColor: 'rgba(0, 0, 0, 0.4)'
}

export function CoverMinimalistWidget({ props }: { props: typeof defaultCoverMinimalistProps }) {
  return (
    <div className="relative w-full h-full min-h-[500px] flex items-end overflow-hidden" style={{ backgroundColor: props.bgColor }}>
      {/* Background Image */}
      {props.imageUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale"
          style={{ backgroundImage: `url(${props.imageUrl})` }}
        />
      )}
      
      {/* Overlay */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: props.overlayColor }}
      />
      
      {/* Content */}
      <div 
        className="relative z-10 w-full p-8 flex flex-col gap-6"
        style={{ color: props.textColor }}
      >
        <p className="text-xs tracking-[0.4em] uppercase font-sans opacity-80">{props.subtitle}</p>
        
        <h1 className="text-5xl md:text-6xl font-sans font-light tracking-tight leading-none uppercase break-words">
          {props.title.split('&').map((name, i) => (
            <React.Fragment key={i}>
              {name.trim()}
              {i === 0 && <br />}
            </React.Fragment>
          ))}
        </h1>
        
        <div className="flex items-center gap-4 mt-4">
          <div className="h-px flex-1 bg-current opacity-30" />
          <p className="text-sm tracking-widest font-mono">{props.date}</p>
        </div>
      </div>
    </div>
  )
}
