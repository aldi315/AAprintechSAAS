'use client'

import { useTransition } from 'react'
import Image from 'next/image'
import { deleteMediaAction } from './_actions/media.actions'
import { Copy, Trash2, Check } from 'lucide-react'
import { useState } from 'react'
import { EmptyState } from '@/presentation/dashboard/components/ui/EmptyState'
import { Image as ImageIcon } from 'lucide-react'

interface MediaItem {
  id: string
  fileUrl: string
  fileType: string
  size: number
  weddingId: string | null
  createdAt: string
}

interface Props {
  media: MediaItem[]
}

export function MediaGrid({ media }: Props) {
  const [isPending, startTransition] = useTransition()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  if (media.length === 0) {
    return (
      <div className="border border-slate-200 rounded-xl bg-white p-8">
        <EmptyState 
          icon={ImageIcon} 
          title="Belum ada media" 
          description="Upload foto atau gallery untuk undangan Anda."
        />
      </div>
    )
  }

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus media ini?')) {
      startTransition(async () => {
        await deleteMediaAction(id)
      })
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {media.map((item) => (
        <div key={item.id} className="group relative bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col">
          <div className="relative aspect-square bg-slate-100 flex-shrink-0">
            <Image
              src={item.fileUrl}
              alt="Media"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            {/* Overlay actions on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button 
                onClick={() => handleCopy(item.id, item.fileUrl)}
                className="p-2 bg-white rounded-full text-slate-700 hover:text-[#C8A882] transition-colors"
                title="Copy URL"
              >
                {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => handleDelete(item.id)}
                disabled={isPending}
                className="p-2 bg-white rounded-full text-slate-700 hover:text-red-500 transition-colors disabled:opacity-50"
                title="Hapus"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-2 text-xs border-t border-slate-100 flex justify-between text-slate-500">
            <span className="truncate max-w-[60%]">{item.weddingId ? `Wedding ID: ${item.weddingId.slice(0, 5)}...` : 'Global'}</span>
            <span>{(item.size / 1024).toFixed(0)} KB</span>
          </div>
        </div>
      ))}
    </div>
  )
}
