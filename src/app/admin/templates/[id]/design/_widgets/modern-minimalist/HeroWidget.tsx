import React from 'react'

export const defaultHeroMinimalistProps = {
  title: 'Romeo\n&\nJuliet',
  subtitle: 'The Wedding Celebration',
  date: 'Saturday, Oct 24th 2026',
  imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
  themeColor: '#000000',
  bgColor: '#ffffff',
  textColor: '#000000'
}

export function HeroMinimalistWidget({ props }: { props: typeof defaultHeroMinimalistProps }) {
  return (
    <div className="flex flex-col w-full h-full min-h-[500px]" style={{ backgroundColor: props.bgColor }}>
      <div className="w-full h-1/2 min-h-[250px] relative">
        {props.imageUrl && (
          <img src={props.imageUrl} alt="Hero" className="w-full h-full object-cover grayscale" />
        )}
      </div>
      <div className="w-full h-1/2 p-8 flex flex-col justify-center items-center text-center" style={{ color: props.textColor }}>
        <p className="text-xs tracking-[0.3em] uppercase mb-4 opacity-50">{props.subtitle}</p>
        <h1 className="text-5xl font-sans font-medium uppercase leading-[0.9] tracking-tighter whitespace-pre-line">
          {props.title}
        </h1>
        <p className="mt-6 text-sm tracking-widest font-mono opacity-80">{props.date}</p>
      </div>
    </div>
  )
}
