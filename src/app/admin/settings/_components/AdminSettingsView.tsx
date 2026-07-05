'use client'

import { useState, useTransition } from 'react'
import { Building2, Globe, Save, Loader2, Check, Shield, AlertTriangle, User, Bell, Lock, Plus } from 'lucide-react'
import { updateAdminResellerSettings, createAdminResellerAction } from '../_actions/settings.actions'
import { useAlert } from '@/presentation/components/ui/AlertProvider'
import { signOut } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface AdminSettingsViewProps {
  adminReseller: {
    id: string
    businessName: string
    slug: string
    subscriptionStatus: string
  } | null
  adminUser: {
    id: string
    name: string
    email: string
    role: string
  } | null
}

export function AdminSettingsView({ adminReseller, adminUser }: AdminSettingsViewProps) {
  const { showAlert } = useAlert()
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  // Feature flags (UI state only — could persist to DB via a SystemSetting model)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [allowRegistration, setAllowRegistration] = useState(true)
  const [debugMode, setDebugMode] = useState(false)

  const handleBusinessSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const res = await updateAdminResellerSettings(formData)
      if (res.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        showAlert('Gagal Menyimpan', res.error || 'Terjadi kesalahan.', 'error')
      }
    })
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Konfigurasi global platform dan profil bisnis Super Admin.</p>
      </div>

      {/* Admin Profile Card */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-base">Profil Super Admin</CardTitle>
            <CardDescription className="text-xs">Informasi akun administrator utama.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Nama</Label>
              <p className="text-sm font-medium">{adminUser?.name || '-'}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Email</Label>
              <p className="text-sm font-medium">{adminUser?.email || '-'}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Role</Label>
              <div>
                <Badge variant="default" className="mt-1">{adminUser?.role}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Profile */}
      {adminReseller ? (
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-500" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-base">Profil Bisnis Admin</CardTitle>
              <CardDescription className="text-xs">Informasi tenant yang dimiliki Super Admin.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBusinessSave} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="businessName">Nama Bisnis</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  type="text"
                  defaultValue={adminReseller.businessName}
                  required
                  minLength={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Slug (Domain Path)</Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-10 px-3 border border-input rounded-md bg-muted text-muted-foreground text-sm flex items-center gap-2">
                    <Globe className="w-4 h-4 shrink-0" />
                    <span>/{adminReseller.slug}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Slug tidak dapat diubah untuk menjaga konsistensi URL.</p>
              </div>

              <div className="space-y-2">
                <Label>Status Subscription</Label>
                <div>
                  <Badge variant={adminReseller.subscriptionStatus === 'ACTIVE' ? 'default' : 'secondary'}>
                    {adminReseller.subscriptionStatus}
                  </Badge>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={isPending}>
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : saved ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  {isPending ? 'Menyimpan...' : saved ? 'Tersimpan!' : 'Simpan Perubahan'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <CreateAdminTenantForm />
      )}

      {/* Feature Flags */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Shield className="w-5 h-5 text-amber-500" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-base">Feature Flags</CardTitle>
            <CardDescription className="text-xs">Nyalakan atau matikan fitur sistem secara global.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Maintenance Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className={`w-5 h-5 ${maintenanceMode ? 'text-destructive' : 'text-muted-foreground'}`} />
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-xs text-muted-foreground">Hanya Super Admin yang bisa mengakses sistem.</p>
              </div>
            </div>
            <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
          </div>

          <hr className="border-border" />

          {/* Allow Registration */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className={`w-5 h-5 ${allowRegistration ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="space-y-0.5">
                <Label>Izinkan Pendaftaran Tenant</Label>
                <p className="text-xs text-muted-foreground">Buka atau tutup pendaftaran tenant baru.</p>
              </div>
            </div>
            <Switch checked={allowRegistration} onCheckedChange={setAllowRegistration} />
          </div>

          <hr className="border-border" />

          {/* Debug Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className={`w-5 h-5 ${debugMode ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="space-y-0.5">
                <Label>Debug Mode</Label>
                <p className="text-xs text-muted-foreground">Tampilkan log error detail kepada developer.</p>
              </div>
            </div>
            <Switch checked={debugMode} onCheckedChange={setDebugMode} />
          </div>
        </CardContent>
      </Card>

      {/* Info box */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-700 dark:text-amber-400 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <strong>Catatan:</strong> Feature Flags saat ini hanya menyimpan state di sesi browser (UI). Persistensi ke database dapat ditambahkan dengan membuat model <code className="px-1 bg-amber-500/20 rounded">SystemSetting</code> di Prisma.
        </div>
      </div>
    </div>
  )
}

function CreateAdminTenantForm() {
  const { showAlert } = useAlert()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const res = await createAdminResellerAction(formData)
      if (res.success) {
        showAlert(
          'Profil Bisnis Dibuat!',
          'Tenant berhasil dibuat. Silakan login ulang agar perubahan sesi berlaku, lalu kembali ke halaman Buat Undangan.',
          'success',
          () => signOut({ callbackUrl: '/login' })
        )
      } else {
        showAlert('Gagal', res.error || 'Terjadi kesalahan.', 'error')
      }
    })
  }

  return (
    <Card className="border-primary/50 shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 bg-primary/5 border-b border-primary/10">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Plus className="w-4 h-4 text-primary" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-base">Buat Profil Bisnis Admin</CardTitle>
          <CardDescription className="text-xs">Akun admin belum memiliki profil bisnis. Buat sekarang agar bisa menjadi Owner undangan.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="create-businessName">Nama Bisnis</Label>
            <Input
              id="create-businessName"
              name="businessName"
              type="text"
              defaultValue="AA Printech"
              required
              minLength={2}
            />
            <p className="text-xs text-muted-foreground">Nama ini akan muncul sebagai Owner di form pembuatan undangan.</p>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {isPending ? 'Membuat...' : 'Buat Profil Bisnis'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
