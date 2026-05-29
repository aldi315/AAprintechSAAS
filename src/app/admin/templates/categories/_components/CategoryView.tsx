'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { CategoryModal } from './CategoryModal'
import { createCategory, updateCategory, deleteCategory } from '@/application/actions/category.actions'
import { useAlert } from '@/presentation/components/ui/AlertProvider'

interface CategoryViewProps {
  categories: any[]
}

export function CategoryView({ categories }: CategoryViewProps) {
  const { showAlert } = useAlert()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any | null>(null)

  const handleOpenCreate = () => {
    setEditingCategory(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (cat: any) => {
    setEditingCategory(cat)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string, name: string) => {
    showAlert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus kategori "${name}"? Kategori yang memiliki template tidak dapat dihapus.`,
      'confirm',
      async () => {
        const result = await deleteCategory(id)
        if (!result.success) {
          showAlert('Gagal', result.error || 'Terjadi kesalahan', 'error')
        }
      }
    )
  }

  const handleSave = async (data: any) => {
    if (editingCategory) {
      const result = await updateCategory(editingCategory.id, data.name)
      if (!result.success) {
        showAlert('Gagal', result.error || 'Terjadi kesalahan', 'error')
        throw new Error(result.error)
      }
    } else {
      const result = await createCategory(data.name)
      if (!result.success) {
        showAlert('Gagal', result.error || 'Terjadi kesalahan', 'error')
        throw new Error(result.error)
      }
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kategori Template</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola daftar kategori yang dapat digunakan oleh template.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Kategori
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Nama Kategori</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium text-center">Jumlah Template</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{cat.name}</td>
                  <td className="px-6 py-4">{cat.slug}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                      {cat._count?.templates || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenEdit(cat)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    Belum ada kategori template.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingCategory}
      />
    </div>
  )
}
