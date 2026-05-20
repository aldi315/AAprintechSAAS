'use client'

import { useState, useTransition, useRef } from 'react'
import { uploadMediaAction } from './_actions/media.actions'
import { Button } from '@/presentation/dashboard/components/ui/Button'
import { Select } from '@/presentation/dashboard/components/ui/Input'
import { UploadCloud, X, Loader2 } from 'lucide-react'

interface Props {
  weddings: { id: string; label: string }[]
}

export function MediaUploader({ weddings }: Props) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [file, setFile] = useState<File | null>(null)
  const [weddingId, setWeddingId] = useState<string>('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError('')
      setSuccess(false)
    }
  }

  const handleUpload = () => {
    if (!file) {
      setError('Pilih file terlebih dahulu.')
      return
    }
    if (!weddingId) {
      setError('Pilih undangan (Wedding) terlebih dahulu.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('weddingId', weddingId)

    startTransition(async () => {
      setError('')
      setSuccess(false)
      const res = await uploadMediaAction(formData)
      if (res.success) {
        setSuccess(true)
        setFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(res.error || 'Upload gagal')
      }
    })
  }

  const weddingOptions = [{ value: '', label: '— Pilih Undangan —' }, ...weddings.map(w => ({ value: w.id, label: w.label }))]

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-slate-800">Upload Media Baru</h3>
      
      <div className="max-w-md">
        <Select 
          label="Pilih Undangan" 
          options={weddingOptions} 
          value={weddingId} 
          onChange={(e) => setWeddingId(e.target.value)} 
          disabled={isPending}
        />
      </div>

      <div 
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors ${
          file ? 'border-emerald-200 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          accept="image/jpeg,image/png,image/webp"
          className="hidden" 
        />
        
        {file ? (
          <div className="text-center">
            <p className="text-sm font-medium text-emerald-800 truncate max-w-xs">{file.name}</p>
            <p className="text-xs text-emerald-600 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <button 
              onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
              className="mt-3 text-xs text-red-500 hover:underline flex items-center justify-center gap-1 mx-auto"
              disabled={isPending}
            >
              <X className="w-3 h-3" /> Batal
            </button>
          </div>
        ) : (
          <div className="text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-500">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-700">Klik untuk memilih file</p>
            <p className="text-xs text-slate-500 mt-1">JPG, PNG, WEBP (Max 5MB)</p>
          </div>
        )}
      </div>

      {error && <div className="text-sm text-red-500 bg-red-50 p-2 rounded">{error}</div>}
      {success && <div className="text-sm text-emerald-600 bg-emerald-50 p-2 rounded">Berhasil diunggah ✓</div>}

      <Button onClick={handleUpload} loading={isPending} disabled={!file || !weddingId}>
        {isPending ? 'Mengunggah...' : 'Upload File'}
      </Button>
    </div>
  )
}
