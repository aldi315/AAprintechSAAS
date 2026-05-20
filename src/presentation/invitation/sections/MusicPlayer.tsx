'use client'
/**
 * MusicPlayer — Floating audio player (bottom-right).
 * State persistent via localStorage (prevent brutal reset on refresh).
 * Autoplay after "Buka Undangan" (event: invitation-opened).
 */
import { useEffect, useRef, useState } from 'react'

interface MusicPlayerProps {
  musicUrl: string
}

export function MusicPlayer({ musicUrl }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    // Check localStorage preference
    const storedState = localStorage.getItem('invit-music-enabled')
    const shouldPlay = storedState !== 'false' // default true
    
    const audio = new Audio(musicUrl)
    audio.loop = true
    audioRef.current = audio

    const handleOpen = () => {
      if (shouldPlay) {
        audio.play().then(() => {
          setIsPlaying(true)
          localStorage.setItem('invit-music-enabled', 'true')
        }).catch(() => {})
      }
    }

    // Listen to custom event from CoverScreen
    window.addEventListener('invitation-opened', handleOpen)

    return () => {
      audio.pause()
      window.removeEventListener('invitation-opened', handleOpen)
    }
  }, [musicUrl])

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    const audio = audioRef.current
    if (!audio) return
    
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      localStorage.setItem('invit-music-enabled', 'false')
    } else {
      audio.play().then(() => {
        setIsPlaying(true)
        localStorage.setItem('invit-music-enabled', 'true')
      }).catch(() => {})
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={isPlaying ? 'Pause musik' : 'Play musik'}
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20"
      style={{ backgroundColor: 'var(--inv-primary)' }}
    >
      {/* Pulse ring saat playing */}
      {isPlaying && (
        <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: 'var(--inv-primary)' }} />
      )}
      {/* Icon */}
      <svg
        className={`w-5 h-5 text-white ${isPlaying ? 'animate-spin' : ''}`}
        style={{ animationDuration: '3s' }}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
      </svg>
    </button>
  )
}
