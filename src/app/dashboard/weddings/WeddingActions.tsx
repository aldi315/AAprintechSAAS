'use client'
/**
 * WeddingActions — client component for action buttons (publish, edit, preview, delete)
 */
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { togglePublishAction, deleteWeddingAction } from './_actions/wedding.actions'
import { Eye, Pencil, ExternalLink, Trash2, Globe, GlobeLock, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

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
      <Button variant="ghost" size="icon" asChild title="Preview">
        <a
          href={`/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </Button>

      {/* Edit */}
      <Button variant="ghost" size="icon" asChild title="Edit">
        <Link href={`/dashboard/weddings/${weddingId}`}>
          <Pencil className="w-4 h-4" />
        </Link>
      </Button>

      {/* Publish / Unpublish */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleTogglePublish}
        disabled={isPending}
        title={status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : status === 'PUBLISHED' ? <GlobeLock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
      </Button>

      {/* Delete */}
      {showConfirm ? (
        <div className="flex items-center gap-2">
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isPending}>
            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Hapus
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowConfirm(false)}>
            Batal
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowConfirm(true)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          title="Hapus"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
