'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, Image as ImageIcon, Upload, Library } from 'lucide-react'
import { uploadImage } from '@/application/actions/upload.actions'
import { MediaLibraryModal } from './MediaLibraryModal'
import { ImageCropperModal } from './ImageCropperModal'
import { useAlert } from '@/presentation/components/ui/AlertProvider'

interface TemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => Promise<void>
  initialData?: any | null
  categories: any[]
}

export function TemplateModal({ isOpen, onClose, onSave, initialData, categories }: TemplateModalProps) {
  const { showAlert } = useAlert()
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [previewImage, setPreviewImage] = useState('')
  const [premium, setPremium] = useState(false)
  const [active, setActive] = useState(true)
  const [loading, setLoading] = useState(false)
  
  // Media states
  const [file, setFile] = useState<File | Blob | null>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  
  // Modals
  const [isMediaLibOpen, setIsMediaLibOpen] = useState(false)
  const [isCropperOpen, setIsCropperOpen] = useState(false)
  const [rawImageSrc, setRawImageSrc] = useState('')

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '')
      setCategoryId(initialData.categoryId || '')
      setPreviewImage(initialData.previewImage || '')
      setPremium(initialData.premium || false)
      setActive(initialData.active ?? true)
    } else {
      setName('')
      setCategoryId(categories.length > 0 ? categories[0].id : '')
      setPreviewImage('')
      setPremium(false)
      setActive(true)
    }
    setFile(null)
    setLocalPreview(null)
  }, [initialData, isOpen, categories])

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setRawImageSrc(reader.result?.toString() || '')
        setIsCropperOpen(true)
      })
      reader.readAsDataURL(e.target.files[0])
      // reset input
      e.target.value = ''
    }
  }

  const handleCropComplete = (croppedBlob: Blob) => {
    setFile(croppedBlob)
    const url = URL.createObjectURL(croppedBlob)
    setLocalPreview(url)
    setPreviewImage('') // clear external url since we have a local file
  }

  const handleSelectFromLibrary = (url: string) => {
    setPreviewImage(url)
    setFile(null)
    setLocalPreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let finalImageUrl = previewImage;
      if (file) {
        const formData = new FormData()
        formData.append('file', file, 'cropped-image.jpg')
        const uploadRes = await uploadImage(formData)
        if (!uploadRes.success) throw new Error(uploadRes.error)
        finalImageUrl = uploadRes.url
      }
      
      await onSave({ name, categoryId, previewImage: finalImageUrl, premium, active })
      onClose()
    } catch (error: any) {
      showAlert('Gagal Menyimpan', error.message || "Terjadi kesalahan saat menyimpan.", 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">
              {initialData ? 'Edit Template' : 'Add New Template'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 block">Template Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-slate-900 bg-white"
                placeholder="e.g. Elegant Rose"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 block">Category</label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-slate-900 bg-white"
              >
                <option value="" disabled>Pilih kategori...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 block">Preview Image</label>
              <div className="flex items-center gap-4">
                {/* Thumbnail Display */}
                <div className="w-20 h-20 rounded-lg bg-slate-50 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                  {(localPreview || previewImage) ? (
                    <img src={localPreview || previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-300" />
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex-1 flex flex-col gap-2">
                  <label className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg cursor-pointer text-sm font-medium transition-colors border border-indigo-100">
                    <Upload className="w-4 h-4" />
                    Upload & Crop
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
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
              </div>
            </div>

            <div className="flex gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={premium}
                  onChange={(e) => setPremium(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-slate-700">Premium Template</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-slate-700">Active</span>
              </label>
            </div>

            <div className="pt-6 flex justify-end gap-3 border-t border-slate-100 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {initialData ? 'Save Changes' : 'Create Template'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <MediaLibraryModal 
        isOpen={isMediaLibOpen}
        onClose={() => setIsMediaLibOpen(false)}
        onSelect={handleSelectFromLibrary}
      />

      <ImageCropperModal
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        imageSrc={rawImageSrc}
        onCropComplete={handleCropComplete}
      />
    </>
  )
}
