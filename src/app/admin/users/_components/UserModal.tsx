'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { createUser, updateUser } from '@/application/actions/user.actions'
import { useAlert } from '@/presentation/components/ui/AlertProvider'

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  user?: any
}

export function UserModal({ isOpen, onClose, user }: UserModalProps) {
  const { showAlert } = useAlert()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'TENANT' as 'SUPER_ADMIN' | 'TENANT'
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
      })
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'TENANT'
      })
    }
  }, [user, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (user) {
        const res = await updateUser(user.id, formData)
        if (!res.success) throw new Error(res.error)
        showAlert('Berhasil', 'Pengguna berhasil diperbarui', 'success')
      } else {
        const res = await createUser(formData)
        if (!res.success) throw new Error(res.error)
        showAlert('Berhasil', 'Pengguna berhasil dibuat', 'success')
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
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-800">
            {user ? 'Edit Pengguna' : 'Tambah Pengguna'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Nama Lengkap</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Peran (Role)</label>
              <select
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="TENANT">Tenant</option>
                <option value="SUPER_ADMIN">Super Admin</option>
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
            form="user-form"
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
