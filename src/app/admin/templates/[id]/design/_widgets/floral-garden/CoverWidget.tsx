'use client'
import React, { useEffect, useState } from 'react'

export const defaultCoverProps = {
  title: 'Undangan Pernikahan',
  brideName: 'Juliet',
  groomName: 'Romeo',
  bgImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400&auto=format&fit=crop',
  themeColor: '#C8A882',
  textColor: '#ffffff',
  overlayColor: 'rgba(0,0,0,0.5)',
}

export function CoverWidget({ props, isPreview = false }: { props: typeof defaultCoverProps, isPreview?: boolean }) {
  const [guestName, setGuestName] = useState('Nama Tamu Undangan')
  const [location, setLocation] = useState('Di Tempat')
  const [isOpen, setIsOpen] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const to = params.get('to')
      const at = params.get('at')
      if (to) setGuestName(to)
      if (at) setLocation(at)
    }
  }, [])

  useEffect(() => {
    if (isPreview) {
      if (!isOpen && !isFadingOut) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'unset'
      }
    }
    return () => {
      if (isPreview) document.body.style.overflow = 'unset'
    }
  }, [isPreview, isOpen, isFadingOut])

  if (isPreview && isOpen) return null

  return (
    <div 
      className={`w-full h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 ease-in-out ${isPreview ? 'fixed inset-0 z-[9999]' : 'relative max-h-[900px]'}`}
      style={{
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? 'translateY(-20px)' : 'translateY(0)',
        pointerEvents: isFadingOut ? 'none' : 'auto'
      }}
    >
      {/* Background Image */}
      {props.bgImage && (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${props.bgImage})` }}
        />
      )}
      
      {/* Overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{ backgroundColor: props.overlayColor }}
      />

      {/* Content */}
      <div 
        className="relative z-20 flex flex-col items-center justify-center text-center px-6 w-full"
        style={{ color: props.textColor }}
      >
        <p className="text-sm tracking-widest uppercase mb-4 opacity-90">
          {props.title}
        </p>

        <h1 
          className="text-5xl md:text-6xl font-serif mb-8"
          style={{ color: props.themeColor }}
        >
          {props.brideName} & {props.groomName}
        </h1>

        <div className="w-full max-w-xs p-6 rounded-2xl backdrop-blur-sm border border-white/20 mb-8" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <p className="text-xs uppercase tracking-widest mb-2 opacity-80">
            Kepada Yth. Tamu Undangan
          </p>
          <p className="text-xl font-medium mb-1">{guestName}</p>
          <p className="text-sm opacity-80">{location}</p>
        </div>

        <button 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (isPreview) {
              setIsFadingOut(true)
              window.dispatchEvent(new CustomEvent('invitation-opened'))
              setTimeout(() => setIsOpen(true), 1000)
            }
          }}
          className="px-8 py-3 rounded-full text-sm font-medium tracking-widest uppercase transition-transform hover:scale-105 active:scale-95 shadow-lg"
          style={{ backgroundColor: props.themeColor, color: '#fff' }}
        >
          Buka Undangan
        </button>
      </div>
    </div>
  )
}
