'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useAlert } from '@/presentation/components/ui/AlertProvider'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => Promise<void>
  initialData?: any | null
}

export function CategoryModal({ isOpen, onClose, onSave, initialData }: CategoryModalProps) {
  const { showAlert } = useAlert()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '')
      setSlug(initialData.slug || '')
    } else {
      setName('')
      setSlug('')
    }
  }, [initialData, isOpen])

  // Auto-generate slug when name changes, but only if editing new or if user hasn't typed a custom slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setName(val)
    if (!initialData) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
    }
  }

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave({ name, slug })
      onClose()
    } catch (error: any) {
      console.error(error)
      showAlert('Gagal Menyimpan', error.message || 'Terjadi kesalahan saat menyimpan kategori.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Kategori' : 'Tambah Kategori'}
          </DialogTitle>
        </DialogHeader>

        <form id="category-form" onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nama Kategori</Label>
            <Input
              required
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Minimalist"
            />
          </div>

          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              required
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. minimalist"
            />
            <p className="text-[0.8rem] text-muted-foreground">Unik dan tanpa spasi, digunakan untuk URL jika diperlukan.</p>
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button type="submit" form="category-form" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {initialData ? 'Simpan Perubahan' : 'Buat Kategori'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
