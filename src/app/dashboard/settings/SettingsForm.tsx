'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateTenantSettingsAction } from '../settings/_actions/settings.actions'
import { Input } from '@/presentation/dashboard/components/ui/Input'
import { Button } from '@/presentation/dashboard/components/ui/Button'
import { Card } from '@/presentation/dashboard/components/ui/Card'

interface Props {
  tenant: { id: string; businessName: string; slug: string; settings: unknown } | null
}

export function SettingsForm({ tenant }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!tenant) return <p className="text-sm text-slate-500">Tenant tidak ditemukan.</p>

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await updateTenantSettingsAction(formData)
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
        <Input name="businessName" label="Nama Bisnis" defaultValue={tenant.businessName} required />
        <Input label="Slug" value={tenant.slug} disabled helperText="Slug tidak dapat diubah." />

        {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}
        {success && <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-600">Pengaturan berhasil disimpan ✓</div>}

        <Button type="submit" loading={isPending}>Simpan</Button>
      </form>
    </Card>
  )
}
