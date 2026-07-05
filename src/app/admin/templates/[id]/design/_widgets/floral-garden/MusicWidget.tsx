'use client'
import React, { useEffect, useRef, useState } from 'react'

export const defaultMusicProps = {
  musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  themeColor: '#C8A882'
}

export function MusicWidget({ props }: { props: typeof defaultMusicProps }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Clean up audio on unmount or URL change
  useEffect(() => {
    const audio = new Audio(props.musicUrl)
    audio.loop = true
    audioRef.current = audio
    
    const handleOpen = () => {
      audio.play().then(() => setIsPlaying(true)).catch(() => {})
    }
    window.addEventListener('invitation-opened', handleOpen)

    return () => {
      audio.pause()
      window.removeEventListener('invitation-opened', handleOpen)
    }
  }, [props.musicUrl])

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const audio = audioRef.current
    if (!audio) return
    
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }

  return (
    <div className="absolute bottom-6 right-6 z-40 pointer-events-auto">
      <button
        onClick={toggle}
        className="w-12 h-12 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20"
        style={{ backgroundColor: props.themeColor }}
      >
        {isPlaying && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: props.themeColor }} />
        )}
        <svg
          className={`w-5 h-5 text-white ${isPlaying ? 'animate-spin' : ''}`}
          style={{ animationDuration: '3s' }}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      </button>
    </div>
  )
}
