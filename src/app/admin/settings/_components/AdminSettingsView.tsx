'use client'

import { useState, useTransition } from 'react'
import { Building2, Globe, Save, Loader2, Check, Shield, AlertTriangle, User, Bell, Lock, Plus } from 'lucide-react'
import { updateAdminTenantSettings, createAdminTenantAction } from '../_actions/settings.actions'
import { useAlert } from '@/presentation/components/ui/AlertProvider'
import { signOut } from 'next-auth/react'

interface AdminSettingsViewProps {
  adminTenant: {
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

export function AdminSettingsView({ adminTenant, adminUser }: AdminSettingsViewProps) {
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
      const res = await updateAdminTenantSettings(formData)
      if (res.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        showAlert('Gagal Menyimpan', res.error || 'Terjadi kesalahan.', 'error')
      }
    })
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">System Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Konfigurasi global platform dan profil bisnis Super Admin.</p>
      </div>

      {/* Admin Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <User className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Profil Super Admin</h2>
            <p className="text-xs text-slate-500">Informasi akun administrator utama.</p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Nama</label>
              <p className="text-sm font-medium text-slate-800">{adminUser?.name || '-'}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Email</label>
              <p className="text-sm font-medium text-slate-800">{adminUser?.email || '-'}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Role</label>
              <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                {adminUser?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Business Profile */}
      {adminTenant ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">Profil Bisnis Admin</h2>
              <p className="text-xs text-slate-500">Informasi tenant yang dimiliki Super Admin.</p>
            </div>
          </div>
          <div className="p-6">
            <form onSubmit={handleBusinessSave} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="businessName" className="block text-sm font-medium text-slate-700">
                  Nama Bisnis
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  defaultValue={adminTenant.businessName}
                  required
                  minLength={2}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Slug (Domain Path)
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 text-sm flex items-center gap-2">
                    <Globe className="w-4 h-4 shrink-0" />
                    <span>/{adminTenant.slug}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400">Slug tidak dapat diubah untuk menjaga konsistensi URL.</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Status Subscription</label>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  adminTenant.subscriptionStatus === 'ACTIVE' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {adminTenant.subscriptionStatus}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {isPending ? 'Menyimpan...' : saved ? 'Tersimpan!' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* No tenant yet — show create form */
        <CreateAdminTenantForm />
      )}

      {/* Feature Flags */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-amber-50 rounded-lg">
            <Shield className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Feature Flags</h2>
            <p className="text-xs text-slate-500">Nyalakan atau matikan fitur sistem secara global.</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Maintenance Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className={`w-5 h-5 ${maintenanceMode ? 'text-red-500' : 'text-slate-300'}`} />
              <div>
                <p className="text-sm font-medium text-slate-900">Maintenance Mode</p>
                <p className="text-xs text-slate-500 mt-0.5">Hanya Super Admin yang bisa mengakses sistem.</p>
              </div>
            </div>
            <button
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${maintenanceMode ? 'bg-red-500' : 'bg-slate-200'}`}
            >
              <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <hr className="border-slate-100" />

          {/* Allow Registration */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className={`w-5 h-5 ${allowRegistration ? 'text-green-500' : 'text-slate-300'}`} />
              <div>
                <p className="text-sm font-medium text-slate-900">Izinkan Pendaftaran Tenant</p>
                <p className="text-xs text-slate-500 mt-0.5">Buka atau tutup pendaftaran tenant baru.</p>
              </div>
            </div>
            <button
              onClick={() => setAllowRegistration(!allowRegistration)}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${allowRegistration ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${allowRegistration ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <hr className="border-slate-100" />

          {/* Debug Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className={`w-5 h-5 ${debugMode ? 'text-purple-500' : 'text-slate-300'}`} />
              <div>
                <p className="text-sm font-medium text-slate-900">Debug Mode</p>
                <p className="text-xs text-slate-500 mt-0.5">Tampilkan log error detail kepada developer.</p>
              </div>
            </div>
            <button
              onClick={() => setDebugMode(!debugMode)}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${debugMode ? 'bg-purple-600' : 'bg-slate-200'}`}
            >
              <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${debugMode ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <strong>Catatan:</strong> Feature Flags saat ini hanya menyimpan state di sesi browser (UI). Persistensi ke database dapat ditambahkan dengan membuat model <code className="px-1 bg-amber-100 rounded">SystemSetting</code> di Prisma.
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
      const res = await createAdminTenantAction(formData)
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
    <div className="bg-white rounded-xl border border-indigo-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-indigo-100 flex items-center gap-3 bg-indigo-50/50">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Plus className="w-4 h-4 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-800">Buat Profil Bisnis Admin</h2>
          <p className="text-xs text-slate-500">Akun admin belum memiliki profil bisnis. Buat sekarang agar bisa menjadi Owner undangan.</p>
        </div>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="create-businessName" className="block text-sm font-medium text-slate-700">
              Nama Bisnis
            </label>
            <input
              id="create-businessName"
              name="businessName"
              type="text"
              defaultValue="AA Printech"
              required
              minLength={2}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
            <p className="text-xs text-slate-400">Nama ini akan muncul sebagai Owner di form pembuatan undangan.</p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {isPending ? 'Membuat...' : 'Buat Profil Bisnis'}
          </button>
        </form>
      </div>
    </div>
  )
}
