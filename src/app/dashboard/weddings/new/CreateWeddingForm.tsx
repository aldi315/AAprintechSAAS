'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createWeddingAction } from '../_actions/wedding.actions'
import { Input } from '@/presentation/dashboard/components/ui/Input'
import { Select } from '@/presentation/dashboard/components/ui/Input'
import { Button } from '@/presentation/dashboard/components/ui/Button'
import { Card } from '@/presentation/dashboard/components/ui/Card'

interface Props {
  templates: { id: string; name: string; category: string }[]
}

export function CreateWeddingForm({ templates }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)

    // Auto-generate slug from names
    const bride = (formData.get('brideName') as string).toLowerCase().split(' ')[0]
    const groom = (formData.get('groomName') as string).toLowerCase().split(' ')[0]
    if (!formData.get('slug')) {
      formData.set('slug', `${groom}-${bride}`)
    }

    startTransition(async () => {
      const result = await createWeddingAction(formData)
      if (result.success && result.id) {
        router.push(`/dashboard/weddings/${result.id}`)
      } else {
        setError(result.error ?? 'Gagal membuat undangan.')
      }
    })
  }

  const templateOptions = templates.map((t) => ({ value: t.id, label: `${t.name} (${t.category})` }))

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input name="brideName" label="Nama Mempelai Wanita" placeholder="Sinta Maharani" required />
          <Input name="groomName" label="Nama Mempelai Pria" placeholder="Andi Pratama" required />
        </div>

        <Input name="slug" label="Slug URL" placeholder="andi-sinta" helperText="URL undangan: domain.com/slug" />

        <Select
          name="templateId"
          label="Template"
          options={[{ value: '', label: '— Pilih template —' }, ...templateOptions]}
          required
        />

        <input type="hidden" name="timezone" value="Asia/Jakarta" />

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={isPending}>Buat Undangan</Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>Batal</Button>
        </div>
      </form>
    </Card>
  )
}
