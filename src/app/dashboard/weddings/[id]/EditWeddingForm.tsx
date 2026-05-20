'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateWeddingAction } from '../_actions/wedding.actions'
import { Input, Textarea } from '@/presentation/dashboard/components/ui/Input'
import { Button } from '@/presentation/dashboard/components/ui/Button'
import { Card } from '@/presentation/dashboard/components/ui/Card'
import type { WeddingDetail } from '@/application/queries/wedding.queries'

interface Props {
  wedding: WeddingDetail
  templates: { id: string; name: string; category: string }[]
}

export function EditWeddingForm({ wedding, templates }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await updateWeddingAction(wedding.id, formData)
      if (result.success) {
        setSuccess(true)
        router.refresh()
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(result.error ?? 'Gagal menyimpan.')
      }
    })
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input name="brideName" label="Nama Mempelai Wanita" defaultValue={wedding.brideName} required />
          <Input name="groomName" label="Nama Mempelai Pria" defaultValue={wedding.groomName} required />
        </div>

        <Input name="slug" label="Slug URL" defaultValue={wedding.slug} helperText="URL: domain.com/slug" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input name="coverImage" label="Cover Image URL" defaultValue={wedding.coverImage ?? ''} />
          <Input name="musicUrl" label="Music URL" defaultValue={wedding.musicUrl ?? ''} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input name="location" label="Lokasi" defaultValue={wedding.location ?? ''} />
          <Input name="mapsUrl" label="Google Maps URL" defaultValue={wedding.mapsUrl ?? ''} />
        </div>

        <hr className="border-slate-100" />
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">SEO & Social Sharing</p>

        <Input name="metaTitle" label="Meta Title" defaultValue={wedding.metaTitle ?? ''} helperText="Judul saat dibagikan via WhatsApp" />
        <Input name="metaDescription" label="Meta Description" defaultValue={wedding.metaDescription ?? ''} helperText="Deskripsi saat dibagikan via WhatsApp" />

        {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}
        {success && <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-600">Perubahan berhasil disimpan ✓</div>}

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={isPending}>Simpan Perubahan</Button>
          <Button type="button" variant="ghost" onClick={() => router.push('/dashboard/weddings')}>Kembali</Button>
        </div>
      </form>
    </Card>
  )
}
