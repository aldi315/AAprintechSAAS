'use client'

import { useState, useTransition, useRef } from 'react'
import { uploadMediaAction } from './_actions/media.actions'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
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
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Upload Media Baru</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-w-md space-y-2">
          <Label>Pilih Undangan</Label>
          <Select value={weddingId} onValueChange={(val) => setWeddingId(val ?? '')} disabled={isPending}>
            <SelectTrigger>
              <SelectValue placeholder="— Pilih Undangan —" />
            </SelectTrigger>
            <SelectContent>
              {weddings.map(w => (
                <SelectItem key={w.id} value={w.id}>{w.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div 
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors ${
            file ? 'border-emerald-200 bg-emerald-500/10' : 'border-border bg-muted/50 hover:bg-muted'
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
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 truncate max-w-xs">{file.name}</p>
              <p className="text-xs text-emerald-600 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <button 
                onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                className="mt-3 text-xs text-destructive hover:underline flex items-center justify-center gap-1 mx-auto"
                disabled={isPending}
              >
                <X className="w-3 h-3" /> Batal
              </button>
            </div>
          ) : (
            <div className="text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-foreground">Klik untuk memilih file</p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP (Max 5MB)</p>
            </div>
          )}
        </div>

        {error && <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</div>}
        {success && <div className="text-sm text-emerald-600 bg-emerald-50 p-2 rounded">Berhasil diunggah ✓</div>}

        <Button onClick={handleUpload} disabled={isPending || !file || !weddingId}>
          {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          {isPending ? 'Mengunggah...' : 'Upload File'}
        </Button>
      </CardContent>
    </Card>
  )
}
