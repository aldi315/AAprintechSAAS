'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createGuestAction } from '../_actions/guest.actions'
import { Input, Select } from '@/presentation/dashboard/components/ui/Input'
import { Button } from '@/presentation/dashboard/components/ui/Button'
import { Card } from '@/presentation/dashboard/components/ui/Card'

interface Props {
  weddings: { id: string; label: string }[]
}

export function CreateGuestForm({ weddings }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await createGuestAction(formData)
      if (result.success) {
        router.push('/dashboard/guests')
      } else {
        setError(result.error ?? 'Gagal menambahkan tamu.')
      }
    })
  }

  const weddingOptions = [{ value: '', label: '— Pilih undangan —' }, ...weddings.map(w => ({ value: w.id, label: w.label }))]

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Select name="weddingId" label="Undangan" options={weddingOptions} required />
        <Input name="guestName" label="Nama Tamu" placeholder="Budi Santoso" required />
        <Input name="phone" label="No. Telepon" placeholder="08123456789" />

        {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={isPending}>Tambah Tamu</Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>Batal</Button>
        </div>
      </form>
    </Card>
  )
}
