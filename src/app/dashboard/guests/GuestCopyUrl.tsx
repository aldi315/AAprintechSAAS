'use client'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function GuestCopyUrl({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      title={url}
    >
      {copied ? (
        <><Check className="w-3.5 h-3.5 text-emerald-500 mr-2" /><span className="text-emerald-600">Copied!</span></>
      ) : (
        <><Copy className="w-3.5 h-3.5 text-muted-foreground mr-2" /><span className="text-muted-foreground">Copy URL</span></>
      )}
    </Button>
  )
}
