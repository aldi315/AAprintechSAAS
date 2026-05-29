import React, { useState } from 'react'
import { Upload, Library, Loader2, Image as ImageIcon } from 'lucide-react'
import { uploadImage } from '@/application/actions/upload.actions'
import { useAlert } from '@/presentation/components/ui/AlertProvider'
import { MediaLibraryModal } from '../../../_components/MediaLibraryModal'

interface ImagePickerFieldProps {
  value: string
  onChange: (url: string) => void
}

export function ImagePickerField({ value, onChange }: ImagePickerFieldProps) {
  const { showAlert } = useAlert()
  const [uploading, setUploading] = useState(false)
  const [isMediaLibOpen, setIsMediaLibOpen] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)
        const res = await uploadImage(formData)
        if (res.success && res.url) {
          onChange(res.url)
        } else {
          showAlert('Upload Gagal', res.error || 'Terjadi kesalahan.', 'error')
        }
      } catch (error) {
        console.error(error)
        showAlert('Upload Gagal', 'Terjadi kesalahan sistem.', 'error')
      } finally {
        setUploading(false)
        e.target.value = ''
      }
    }
  }

  return (
    <div className="space-y-2 mt-2">
      {/* Preview */}
      <div className="w-full h-32 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
        {value ? (
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="w-8 h-8 text-slate-300" />
        )}
      </div>
      
      {/* Actions */}
      <div className="flex flex-col gap-2">
        <label className={`w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg cursor-pointer text-sm font-medium transition-colors border border-indigo-100 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Uploading...' : 'Upload Foto'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
        
        <button
          type="button"
          onClick={() => setIsMediaLibOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer text-sm font-medium transition-colors border border-slate-200"
        >
          <Library className="w-4 h-4" />
          Pilih dari Galeri
        </button>
      </div>

      <MediaLibraryModal 
        isOpen={isMediaLibOpen}
        onClose={() => setIsMediaLibOpen(false)}
        onSelect={(url) => {
          onChange(url)
          setIsMediaLibOpen(false)
        }}
      />
    </div>
  )
}
