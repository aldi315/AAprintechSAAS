'use client'

import { Edit, Palette, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface TemplateCardProps {
  template: {
    id: string
    name: string
    categoryId: string
    category?: { name: string }
    previewImage: string | null
    premium: boolean
    active: boolean
  }
  onEdit: () => void
  onDelete: () => void
}

export function TemplateCard({ template, onEdit, onDelete }: TemplateCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
      {/* Image Preview */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {template.previewImage ? (
          <img 
            src={template.previewImage} 
            alt={template.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <span className="text-sm">No Image</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm ${
            template.premium 
              ? 'bg-amber-100 text-amber-700 border border-amber-200' 
              : 'bg-white text-slate-700 border border-slate-200'
          }`}>
            {template.premium ? 'Premium' : 'Free'}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm ${
            template.active 
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {template.active ? 'Active' : 'Disabled'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1">{template.name}</h3>
        <p className="text-sm text-slate-500 capitalize mb-6">{template.category?.name || 'Uncategorized'}</p>
        
        <div className="mt-auto grid grid-cols-3 gap-2">
          <button 
            onClick={onEdit}
            className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            title="Edit Details"
          >
            <Edit className="w-4 h-4" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Edit</span>
          </button>
          
          <Link 
            href={`/admin/templates/${template.id}/design`}
            className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl bg-slate-50 text-slate-600 hover:bg-[#C8A882]/10 hover:text-[#C8A882] transition-colors"
            title="Design Editor"
          >
            <Palette className="w-4 h-4" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Design</span>
          </Link>
          
          <button 
            onClick={onDelete}
            className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            title="Delete Template"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Delete</span>
          </button>
        </div>
      </div>
    </div>
  )
}
