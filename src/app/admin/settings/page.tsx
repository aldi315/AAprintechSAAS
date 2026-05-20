'use client'

import { useState } from 'react'

export default function AdminSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [allowRegistration, setAllowRegistration] = useState(true)

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">System Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Konfigurasi global platform (Mock UI).</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-800">Feature Flags</h2>
          <p className="text-xs text-slate-500 mt-1">Nyalakan atau matikan fitur sistem secara global.</p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Toggle Maintenance Mode */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">Maintenance Mode</p>
              <p className="text-xs text-slate-500 mt-1">Hanya Super Admin yang bisa mengakses sistem jika ini menyala.</p>
            </div>
            <button
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`w-11 h-6 rounded-full transition-colors relative ${maintenanceMode ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <hr className="border-slate-100" />

          {/* Toggle Allow Registration */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">Allow Tenant Registration</p>
              <p className="text-xs text-slate-500 mt-1">Buka atau tutup pendaftaran tenant baru.</p>
            </div>
            <button
              onClick={() => setAllowRegistration(!allowRegistration)}
              className={`w-11 h-6 rounded-full transition-colors relative ${allowRegistration ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${allowRegistration ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Catatan:</strong> Fitur pengaturan ini hanya berupa *Mock UI* (menyimpan state di lokal). Implementasi persistensi database (Tabel `SystemSetting` / `FeatureFlag`) akan dilakukan pada tahap selanjutnya sesuai rekomendasi struktur database.
      </div>
    </div>
  )
}
