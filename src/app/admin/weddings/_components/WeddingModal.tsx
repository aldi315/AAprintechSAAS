'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { createWedding, updateWedding } from '@/application/actions/wedding.actions'
import { useAlert } from '@/presentation/components/ui/AlertProvider'

interface WeddingModalProps {
  isOpen: boolean
  onClose: () => void
  wedding?: any
  tenants: any[]
  templates: any[]
}

export function WeddingModal({ isOpen, onClose, wedding, tenants, templates }: WeddingModalProps) {
  const { showAlert } = useAlert()
  const [isLoading, setIsLoading] = useState(false)

  // Sort: admin tenant first, then the rest
  const sortedTenants = [...tenants].sort((a, b) => {
    if (a.owner?.role === 'SUPER_ADMIN') return -1
    if (b.owner?.role === 'SUPER_ADMIN') return 1
    return 0
  })

  const adminTenant = sortedTenants.find(t => t.owner?.role === 'SUPER_ADMIN')

  const [formData, setFormData] = useState({
    tenantId: '',
    templateId: '',
    slug: '',
    brideName: '',
    groomName: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  })

  useEffect(() => {
    if (wedding) {
      setFormData({
        tenantId: wedding.tenantId,
        templateId: wedding.templateId,
        slug: wedding.slug,
        brideName: wedding.brideName,
        groomName: wedding.groomName,
        status: wedding.status,
      })
    } else {
      // Find the tenant owned by SUPER_ADMIN
      const defaultTenantId = adminTenant ? adminTenant.id : (sortedTenants[0]?.id || '')
      
      setFormData({
        tenantId: defaultTenantId,
        templateId: templates[0]?.id || '',
        slug: '',
        brideName: '',
        groomName: '',
        status: 'DRAFT'
      })
    }
  }, [wedding, tenants, templates, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (wedding) {
        const res = await updateWedding(wedding.id, formData)
        if (!res.success) throw new Error(res.error)
        showAlert('Berhasil', 'Wedding updated successfully', 'success')
      } else {
        const res = await createWedding(formData)
        if (!res.success) throw new Error(res.error)
        showAlert('Berhasil', 'Wedding created successfully', 'success')
      }
      onClose()
    } catch (error: any) {
      showAlert('Gagal', error.message || 'Terjadi kesalahan', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-800">
            {wedding ? 'Edit Undangan' : 'Buat Undangan Baru'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="wedding-form" onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Owner (Pemilik)</label>
                <select
                  required
                  value={formData.tenantId}
                  onChange={e => setFormData({ ...formData, tenantId: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="">Pilih Owner</option>
                  {adminTenant && (
                    <optgroup label="— Admin —">
                      <option value={adminTenant.id}>
                        ★ {adminTenant.businessName}
                      </option>
                    </optgroup>
                  )}
                  {sortedTenants.filter(t => t.owner?.role !== 'SUPER_ADMIN').length > 0 && (
                    <optgroup label="— Tenant Klien —">
                      {sortedTenants
                        .filter(t => t.owner?.role !== 'SUPER_ADMIN')
                        .map(t => (
                          <option key={t.id} value={t.id}>{t.businessName}</option>
                        ))
                      }
                    </optgroup>
                  )}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Template</label>
                <select
                  required
                  value={formData.templateId}
                  onChange={e => setFormData({ ...formData, templateId: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="">Pilih Template</option>
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">URL Slug</label>
              <div className="flex items-center">
                <span className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg text-slate-500 text-sm">
                  domain.com/
                </span>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="romeo-juliet"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Nama Panggilan Pria</label>
                <input
                  type="text"
                  required
                  value={formData.groomName}
                  onChange={e => setFormData({ ...formData, groomName: e.target.value })}
                  placeholder="Romeo"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Nama Panggilan Wanita</label>
                <input
                  type="text"
                  required
                  value={formData.brideName}
                  onChange={e => setFormData({ ...formData, brideName: e.target.value })}
                  placeholder="Juliet"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            form="wedding-form"
            disabled={isLoading}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  )
}
