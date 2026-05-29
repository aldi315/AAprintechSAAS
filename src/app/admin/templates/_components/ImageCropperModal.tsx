'use client'

import { useState, useRef } from 'react'
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { X, Check, Loader2 } from 'lucide-react'
import { useAlert } from '@/presentation/components/ui/AlertProvider'

interface ImageCropperModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  onCropComplete: (croppedBlob: Blob) => void
}

export function ImageCropperModal({ isOpen, onClose, imageSrc, onCropComplete }: ImageCropperModalProps) {
  const { showAlert } = useAlert()
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>({
    unit: '%', // Can be 'px' or '%'
    x: 10,
    y: 10,
    width: 80,
    height: 80
  })
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null)
  const [processing, setProcessing] = useState(false)

  if (!isOpen) return null

  const getCroppedImg = async (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('No 2d context')
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'))
            return
          }
          resolve(blob)
        },
        'image/jpeg',
        0.9
      )
    })
  }

  const handleSave = async () => {
    if (!completedCrop || !imgRef.current) return
    setProcessing(true)
    try {
      const blob = await getCroppedImg(imgRef.current, completedCrop)
      onCropComplete(blob)
      onClose()
    } catch (e) {
      console.error(e)
      showAlert('Gagal', 'Gagal memotong gambar.', 'error')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-slate-950 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 border border-slate-800">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900">
          <h2 className="text-xl font-bold text-white">
            Crop Gambar
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex-1 flex flex-col items-center justify-center min-h-[400px] overflow-auto bg-slate-950">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1} // Standard template aspect ratio (square 1:1)
            className="max-h-[60vh]"
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop me"
              className="max-w-full max-h-[60vh] object-contain"
              onLoad={(e) => {
                // Initial crop centering can be done here if needed
              }}
            />
          </ReactCrop>
          <p className="text-slate-400 text-sm mt-4">Tarik ujung kotak untuk menyesuaikan porsi gambar (Rasio 1:1).</p>
        </div>

        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            disabled={processing}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={processing || !completedCrop?.width || !completedCrop?.height}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Terapkan Crop
          </button>
        </div>
      </div>
    </div>
  )
}
