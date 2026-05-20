'use client'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function GuestCopyUrl({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors hover:bg-slate-100"
      title={url}
    >
      {copied ? (
        <><Check className="w-3.5 h-3.5 text-emerald-500" /><span className="text-emerald-600">Copied!</span></>
      ) : (
        <><Copy className="w-3.5 h-3.5 text-slate-400" /><span className="text-slate-500">Copy URL</span></>
      )}
    </button>
  )
}
