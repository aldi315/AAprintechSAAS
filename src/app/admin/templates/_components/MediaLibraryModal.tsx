'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, Image as ImageIcon } from 'lucide-react'
import { getPublicUploads } from '@/application/actions/upload.actions'

interface MediaLibraryModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (url: string) => void
}

export function MediaLibraryModal({ isOpen, onClose, onSelect }: MediaLibraryModalProps) {
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      loadImages()
    }
  }, [isOpen])

  const loadImages = async () => {
    setLoading(true)
    try {
      const res = await getPublicUploads()
      if (res.success && res.data) {
        setImages(res.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-500" />
            Media Library
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <p>Memuat galeri...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
              <p>Belum ada gambar yang diunggah.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((url, i) => (
                <div 
                  key={i}
                  onClick={() => {
                    onSelect(url)
                    onClose()
                  }}
                  className="group relative aspect-square bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-500 hover:border-indigo-500 transition-all shadow-sm hover:shadow-md"
                >
                  <img 
                    src={url} 
                    alt="Media" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/10 transition-colors" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
