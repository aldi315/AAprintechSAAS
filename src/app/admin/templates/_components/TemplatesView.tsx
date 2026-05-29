'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { TemplateCard } from './TemplateCard'
import { TemplateModal } from './TemplateModal'
import { createTemplate, updateTemplate, deleteTemplate } from '@/application/actions/template.actions'
import { useAlert } from '@/presentation/components/ui/AlertProvider'

interface TemplatesViewProps {
  templates: any[]
  categories: any[]
}

export function TemplatesView({ templates, categories }: TemplatesViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null)
  const { showAlert } = useAlert()

  const handleOpenCreate = () => {
    setEditingTemplate(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (template: any) => {
    setEditingTemplate(template)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string, name: string) => {
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

  const handleSave = async (data: any) => {
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Template Monitoring</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola master template sistem undangan.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Template
        </button>
      </div>

      {templates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <p className="text-slate-500">Belum ada template. Silakan tambahkan template baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              template={tpl}
              onEdit={() => handleOpenEdit(tpl)}
              onDelete={() => handleDelete(tpl.id, tpl.name)}
            />
          ))}
        </div>
      )}

      <TemplateModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingTemplate}
        categories={categories}
      />
    </div>
  )
}
