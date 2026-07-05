'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, Image as ImageIcon, Upload, Library } from 'lucide-react'
import { uploadImage } from '@/application/actions/upload.actions'
import { MediaLibraryModal } from './MediaLibraryModal'
import { ImageCropperModal } from './ImageCropperModal'
import { useAlert } from '@/presentation/components/ui/AlertProvider'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

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
  const [price, setPrice] = useState<number>(0)
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
      setPrice(initialData.price || 0)
      setActive(initialData.active ?? true)
    } else {
      setName('')
      setCategoryId(categories.length > 0 ? categories[0].id : '')
      setPreviewImage('')
      setPrice(0)
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
        finalImageUrl = uploadRes.url || ''
      }
      
      await onSave({ name, categoryId, previewImage: finalImageUrl, price, active })
      onClose()
    } catch (error: any) {
      showAlert('Gagal Menyimpan', error.message || "Terjadi kesalahan saat menyimpan.", 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {initialData ? 'Edit Template' : 'Add New Template'}
            </DialogTitle>
          </DialogHeader>

          <form id="template-form" onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Template Name</Label>
              <Input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Elegant Rose"
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select required value={categoryId} onValueChange={(val) => setCategoryId(val as string)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Harga (Rp)</Label>
              <Input
                required
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label>Preview Image</Label>
              <div className="flex items-center gap-4">
                {/* Thumbnail Display */}
                <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden shrink-0 border border-input flex items-center justify-center">
                  {(localPreview || previewImage) ? (
                    <img src={localPreview || previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex-1 flex flex-col gap-2">
                  <Button type="button" variant="outline" className="w-full relative overflow-hidden" asChild>
                    <label className="cursor-pointer flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload & Crop
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </Button>
                  
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsMediaLibOpen(true)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Library className="w-4 h-4" />
                    Pilih dari Galeri
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="active" 
                checked={active} 
                onCheckedChange={(checked) => setActive(checked as boolean)} 
              />
              <Label htmlFor="active" className="cursor-pointer">Active</Label>
            </div>
          </form>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" form="template-form" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {initialData ? 'Save Changes' : 'Create Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
