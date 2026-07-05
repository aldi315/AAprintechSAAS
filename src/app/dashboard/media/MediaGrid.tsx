'use client'

import { useTransition, useState } from 'react'
import Image from 'next/image'
import { deleteMediaAction } from './_actions/media.actions'
import { Copy, Trash2, Check, Image as ImageIcon } from 'lucide-react'
import { EmptyState } from '@/presentation/dashboard/components/ui/EmptyState'
import { useAlert } from '@/presentation/components/ui/AlertProvider'
import { Button } from "@/components/ui/button"

interface MediaItem {
  id: string
  fileUrl: string
  fileType: string
  size: number
  weddingId: string | null
  createdAt: string
}

interface Props {
  initialMedia: MediaItem[]
}

export function MediaGrid({ initialMedia }: Props) {
  const { showAlert } = useAlert()
  const [media, setMedia] = useState(initialMedia)
  const [isPending, startTransition] = useTransition()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  if (media.length === 0) {
    return (
      <div className="border border-border rounded-xl bg-card p-8 shadow-sm">
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
    showAlert(
      'Konfirmasi Hapus',
      'Yakin ingin menghapus media ini?',
      'confirm',
      async () => {
        setDeletingId(id)
        const res = await deleteMediaAction(id)
        if (res.success) {
          setMedia(prev => prev.filter(m => m.id !== id))
        } else {
          showAlert('Gagal', res.error || 'Gagal menghapus media', 'error')
        }
        setDeletingId(null)
      }
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {media.map((item) => (
        <div key={item.id} className="group relative bg-card border border-border rounded-lg overflow-hidden flex flex-col shadow-sm">
          <div className="relative aspect-square bg-muted flex-shrink-0">
            <Image
              src={item.fileUrl}
              alt="Media"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            {/* Overlay actions on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button 
                variant="secondary"
                size="icon"
                onClick={() => handleCopy(item.id, item.fileUrl)}
                title="Copy URL"
              >
                {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button 
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(item.id)}
                disabled={isPending}
                title="Hapus"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="p-2 text-xs border-t border-border flex justify-between text-muted-foreground bg-muted/30">
            <span className="truncate max-w-[60%]">{item.weddingId ? `Wedding ID: ${item.weddingId.slice(0, 5)}...` : 'Global'}</span>
            <span>{(item.size / 1024).toFixed(0)} KB</span>
          </div>
        </div>
      ))}
    </div>
  )
}
