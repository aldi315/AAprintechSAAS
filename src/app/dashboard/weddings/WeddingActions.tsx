'use client'
/**
 * WeddingActions — client component for action buttons (publish, edit, preview, delete)
 */
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { togglePublishAction, deleteWeddingAction } from './_actions/wedding.actions'
import { Eye, Pencil, ExternalLink, Trash2, Globe, GlobeLock } from 'lucide-react'
import Link from 'next/link'

interface Props {
  weddingId: string
  slug: string
  status: string
}

export function WeddingActions({ weddingId, slug, status }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleTogglePublish = () => {
    startTransition(async () => {
      await togglePublishAction(weddingId)
      router.refresh()
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      await deleteWeddingAction(weddingId)
      setShowConfirm(false)
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-1 justify-end">
      {/* Preview */}
      <a
        href={`/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        title="Preview"
      >
        <ExternalLink className="w-4 h-4" />
      </a>

      {/* Edit */}
      <Link
        href={`/dashboard/weddings/${weddingId}`}
        className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        title="Edit"
      >
        <Pencil className="w-4 h-4" />
      </Link>

      {/* Publish / Unpublish */}
      <button
        onClick={handleTogglePublish}
        disabled={isPending}
        className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
        title={status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
      >
        {status === 'PUBLISHED' ? <GlobeLock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
      </button>

      {/* Delete */}
      {showConfirm ? (
        <div className="flex items-center gap-1">
          <button onClick={handleDelete} disabled={isPending} className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50">
            Hapus
          </button>
          <button onClick={() => setShowConfirm(false)} className="px-2 py-1 text-xs text-slate-500 rounded hover:bg-slate-100">
            Batal
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
          title="Hapus"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
