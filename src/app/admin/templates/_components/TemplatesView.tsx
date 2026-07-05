'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Layers, Tag } from 'lucide-react'
import { TemplateCard } from './TemplateCard'
import { TemplateModal } from './TemplateModal'
import { CategoryModal } from '../categories/_components/CategoryModal'
import { createTemplate, updateTemplate, deleteTemplate } from '@/application/actions/template.actions'
import { createCategory, updateCategory, deleteCategory } from '@/application/actions/category.actions'
import { useAlert } from '@/presentation/components/ui/AlertProvider'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TemplatesViewProps {
  templates: any[]
  categories: any[]
}

export function TemplatesView({ templates, categories: initialCategories }: TemplatesViewProps) {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any | null>(null)
  const { showAlert } = useAlert()

  // ---- Template Handlers ----
  const handleOpenCreateTemplate = () => {
    setEditingTemplate(null)
    setIsTemplateModalOpen(true)
  }

  const handleOpenEditTemplate = (template: any) => {
    setEditingTemplate(template)
    setIsTemplateModalOpen(true)
  }

  const handleDeleteTemplate = (id: string, name: string) => {
    showAlert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus template "${name}"?`,
      'confirm',
      async () => {
        const result = await deleteTemplate(id)
        if (!result.success) {
          showAlert('Gagal', result.error || 'Terjadi kesalahan.', 'error')
        }
      }
    )
  }

  const handleSaveTemplate = async (data: any) => {
    if (editingTemplate) {
      const result = await updateTemplate(editingTemplate.id, data)
      if (!result.success) {
        showAlert('Gagal', result.error || 'Gagal mengubah template', 'error')
        throw new Error(result.error)
      }
    } else {
      const result = await createTemplate(data)
      if (!result.success) {
        showAlert('Gagal', result.error || 'Gagal membuat template', 'error')
        throw new Error(result.error)
      }
    }
  }

  // ---- Category Handlers ----
  const handleOpenCreateCategory = () => {
    setEditingCategory(null)
    setIsCategoryModalOpen(true)
  }

  const handleOpenEditCategory = (cat: any) => {
    setEditingCategory(cat)
    setIsCategoryModalOpen(true)
  }

  const handleDeleteCategory = (id: string, name: string) => {
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

  const handleSaveCategory = async (data: any) => {
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
      <div>
        <h1 className="text-2xl font-bold text-foreground">Template Monitoring</h1>
        <p className="text-sm text-muted-foreground mt-1">Kelola master template dan kategori sistem undangan.</p>
      </div>

      <Tabs defaultValue="templates">
        <TabsList className="mb-2">
          <TabsTrigger value="templates" className="gap-2">
            <Layers className="w-4 h-4" />
            Template
            <Badge variant="secondary" className="ml-1 text-xs">{templates.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <Tag className="w-4 h-4" />
            Kategori
            <Badge variant="secondary" className="ml-1 text-xs">{initialCategories.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* ---- TEMPLATES TAB ---- */}
        <TabsContent value="templates">
          <div className="flex flex-col gap-6">
            <div className="flex justify-end">
              <Button onClick={handleOpenCreateTemplate}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Template
              </Button>
            </div>

            {templates.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
                <Layers className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                <p className="text-muted-foreground">Belum ada template. Silakan tambahkan template baru.</p>
                <Button onClick={handleOpenCreateTemplate} variant="outline" className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Template
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {templates.map((tpl) => (
                  <TemplateCard
                    key={tpl.id}
                    template={tpl}
                    onEdit={() => handleOpenEditTemplate(tpl)}
                    onDelete={() => handleDeleteTemplate(tpl.id, tpl.name)}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* ---- CATEGORIES TAB ---- */}
        <TabsContent value="categories">
          <div className="flex flex-col gap-6">
            <div className="flex justify-end">
              <Button onClick={handleOpenCreateCategory}>
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
                  {initialCategories.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell className="font-medium">{cat.name}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm">{cat.slug}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">
                          {cat._count?.templates || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEditCategory(cat)}
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {initialCategories.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        Belum ada kategori template.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSave={handleSaveTemplate}
        initialData={editingTemplate}
        categories={initialCategories}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        initialData={editingCategory}
      />
    </div>
  )
}
