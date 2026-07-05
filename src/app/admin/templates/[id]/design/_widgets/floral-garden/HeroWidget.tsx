import React from 'react'

export const defaultHeroProps = {
  title: 'Romeo & Juliet',
  subtitle: 'We Are Getting Married',
  date: '24 . 10 . 2026',
  imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
  overlayColor: 'rgba(0,0,0,0.4)',
  textColor: '#ffffff',
  align: 'center' as 'left' | 'center' | 'right'
}

export function HeroWidget({ props }: { props: typeof defaultHeroProps }) {
  return (
    <div className="relative w-full min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${props.imageUrl})` }}
      />
      {/* Overlay */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: props.overlayColor }}
      />
      
      {/* Content */}
      <div 
        className="relative z-10 w-full px-6 py-12 flex flex-col gap-4"
        style={{ 
          textAlign: props.align,
          color: props.textColor
        }}
      >
        <p className="text-sm tracking-[0.3em] uppercase">{props.subtitle}</p>
        <h1 className="text-5xl md:text-6xl font-serif font-bold italic">{props.title}</h1>
        <div className="w-16 h-[1px] bg-current mx-auto my-4 opacity-50" />
        <p className="text-lg tracking-widest">{props.date}</p>
      </div>
    </div>
  )
}
