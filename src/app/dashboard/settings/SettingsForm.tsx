'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateResellerSettingsAction } from '../settings/_actions/settings.actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

interface Props {
  tenant: { id: string; businessName: string; slug: string; settings: unknown } | null
}

export function SettingsForm({ tenant }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!tenant) return <p className="text-sm text-muted-foreground">Tenant tidak ditemukan.</p>

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await updateResellerSettingsAction(formData)
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
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="businessName">Nama Bisnis</Label>
            <Input id="businessName" name="businessName" defaultValue={tenant.businessName} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={tenant.slug} disabled />
            <p className="text-xs text-muted-foreground">Slug tidak dapat diubah.</p>
          </div>

          {error && <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">{error}</div>}
          {success && <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-600">Pengaturan berhasil disimpan ✓</div>}

          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Simpan
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
