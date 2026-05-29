'use client'

import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { useAlert } from '@/presentation/components/ui/AlertProvider'

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Edit Kategori' : 'Tambah Kategori'}
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
            <label className="text-sm font-medium text-slate-700 block">Nama Kategori</label>
            <input
              required
              type="text"
              value={name}
              onChange={handleNameChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              placeholder="e.g. Minimalist"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 block">Slug</label>
            <input
              required
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              placeholder="e.g. minimalist"
            />
            <p className="text-xs text-slate-500">Unik dan tanpa spasi, digunakan untuk URL jika diperlukan.</p>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {initialData ? 'Simpan Perubahan' : 'Buat Kategori'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
