'use client'

import { useState, useEffect } from 'react'
import { createUser, updateUser } from '@/application/actions/user.actions'
import { useAlert } from '@/presentation/components/ui/AlertProvider'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
    role: 'RESELLER' as 'SUPER_ADMIN' | 'RESELLER'
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
        role: 'RESELLER'
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit Pengguna' : 'Tambah Pengguna'}</DialogTitle>
        </DialogHeader>

        <form id="user-form" onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Lengkap</label>
            <Input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Peran (Role)</label>
            <Select 
              value={formData.role} 
              onValueChange={(value: any) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Peran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RESELLER">Reseller</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" form="user-form" disabled={isLoading}>
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
