'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { CategoryModal } from './CategoryModal'
import { createCategory, updateCategory, deleteCategory } from '@/application/actions/category.actions'
import { useAlert } from '@/presentation/components/ui/AlertProvider'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kategori Template</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelola daftar kategori yang dapat digunakan oleh template.</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Kategori
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Kategori</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-center">Jumlah Template</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">
                    {cat._count?.templates || 0}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleOpenEdit(cat)}
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(cat.id, cat.name)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Belum ada kategori template.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
