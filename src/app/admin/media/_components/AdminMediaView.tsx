'use client'

import { useState, useMemo } from 'react'
import { Trash2, Image as ImageIcon, ExternalLink, Loader2, Upload, Search, LayoutGrid, Film, FileText, X, Copy, Check, Eye } from 'lucide-react'
import { deleteMediaGlobal, uploadGlobalMediaAction } from '@/application/actions/admin.actions'
import { useAlert } from '@/presentation/components/ui/AlertProvider'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getFileIcon(fileType: string) {
  if (fileType.startsWith('image/')) return <ImageIcon className="w-8 h-8" />
  if (fileType.startsWith('video/')) return <Film className="w-8 h-8" />
  return <FileText className="w-8 h-8" />
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export function AdminMediaView({ initialMedia, resellers }: { initialMedia: any[]; resellers: any[] }) {
  const { showAlert } = useAlert()
  const [mediaFiles, setMediaFiles] = useState(initialMedia)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterReseller, setFilterReseller] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [lightboxMedia, setLightboxMedia] = useState<any | null>(null)
  const [copied, setCopied] = useState(false)

  // Upload State
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadData, setUploadData] = useState({
    resellerId: resellers.find(t => t.owner?.role === 'SUPER_ADMIN')?.id || resellers[0]?.id || '',
    file: null as File | null,
  })

  const totalSize = mediaFiles.reduce((acc: number, m: any) => acc + m.size, 0)
  const imageCount = mediaFiles.filter((m: any) => m.fileType.startsWith('image/')).length
  const videoCount = mediaFiles.filter((m: any) => m.fileType.startsWith('video/')).length

  const filteredMedia = useMemo(() => {
    return mediaFiles.filter((m: any) => {
      const matchSearch = !searchQuery || m.fileUrl.toLowerCase().includes(searchQuery.toLowerCase())
      const matchReseller = filterReseller === 'all' || (m.reseller?.id === filterReseller)
      const matchType =
        filterType === 'all' ||
        (filterType === 'image' && m.fileType.startsWith('image/')) ||
        (filterType === 'video' && m.fileType.startsWith('video/')) ||
        (filterType === 'other' && !m.fileType.startsWith('image/') && !m.fileType.startsWith('video/'))
      return matchSearch && matchReseller && matchType
    })
  }, [mediaFiles, searchQuery, filterReseller, filterType])

  const handleDelete = (id: string) => {
    showAlert(
      'Konfirmasi Hapus',
      'Yakin ingin menghapus media ini secara permanen dari server?',
      'confirm',
      async () => {
        setDeletingId(id)
        const res = await deleteMediaGlobal(id)
        if (res.success) {
          setMediaFiles(prev => prev.filter(m => m.id !== id))
          showAlert('Berhasil', 'Media berhasil dihapus.', 'success')
        } else {
          showAlert('Gagal', res.error || 'Gagal menghapus media', 'error')
        }
        setDeletingId(null)
      }
    )
  }

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadData.file) return showAlert('Error', 'Pilih file terlebih dahulu', 'error')

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', uploadData.file)
    formData.append('resellerId', uploadData.resellerId)

    try {
      const res = await uploadGlobalMediaAction(formData)
      if (res.success) {
        showAlert('Berhasil', 'Media berhasil diunggah', 'success')
        setIsUploadOpen(false)
        setUploadData(prev => ({ ...prev, file: null }))
        window.location.reload()
      } else {
        showAlert('Gagal', res.error || 'Terjadi kesalahan saat mengunggah.', 'error')
      }
    } catch (err: any) {
      showAlert('Gagal', err.message || 'Error', 'error')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Media Gallery</h1>
          <p className="text-sm text-muted-foreground mt-1">Pantau dan kelola seluruh media yang diunggah reseller.</p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Media
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Storage" value={formatBytes(totalSize)} icon={<ImageIcon className="w-5 h-5" />} />
        <StatCard label="Total Files" value={String(mediaFiles.length)} icon={<LayoutGrid className="w-5 h-5" />} />
        <StatCard label="Images / Videos" value={`${imageCount} / ${videoCount}`} icon={<Film className="w-5 h-5" />} />
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari berdasarkan nama file..."
            className="pl-9"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={filterReseller} onValueChange={setFilterReseller}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Semua Reseller" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Reseller</SelectItem>
            {resellers.map(r => (
              <SelectItem key={r.id} value={r.id}>{r.businessName}</SelectItem>
            ))}
          </SelectContent>
        </Select>

      </div>

      {/* Result count */}
      <p className="text-sm text-muted-foreground -mt-3">
        Menampilkan <span className="font-semibold text-foreground">{filteredMedia.length}</span> dari {mediaFiles.length} file
      </p>

      {filteredMedia.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-16 text-center">
          <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground opacity-30 mb-3" />
          <p className="text-muted-foreground">Tidak ada media ditemukan.</p>
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-3 space-y-3">
          {filteredMedia.map((media: any) => (
            <div
              key={media.id}
              onClick={() => media.fileType.startsWith('image/') && setLightboxMedia(media)}
              className={`group relative break-inside-avoid bg-muted rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all hover:shadow-md ${media.fileType.startsWith('image/') ? 'cursor-zoom-in' : ''}`}
            >
              {media.fileType.startsWith('image/') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={media.fileUrl}
                  alt="Media"
                  className="w-full h-auto block transition-transform duration-300 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="w-full aspect-square flex flex-col items-center justify-center text-muted-foreground gap-2">
                  {getFileIcon(media.fileType)}
                  <span className="text-[10px] uppercase tracking-wider">{media.fileType.split('/')[1]}</span>
                </div>
              )}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5 gap-2">
                <p className="text-white text-[10px] font-mono leading-tight line-clamp-2 break-all">
                  {media.fileUrl.split('/').pop()}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <Badge variant="secondary" className="text-[9px] py-0 h-4 w-fit">
                      {media.reseller?.businessName || 'Global'}
                    </Badge>
                    <span className="text-white/60 text-[9px]">{formatBytes(media.size)}</span>
                  </div>
                  <div className="flex gap-1">
                    {media.fileType.startsWith('image/') && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setLightboxMedia(media) }}
                        className="w-6 h-6 flex items-center justify-center bg-white/20 hover:bg-white/40 rounded-md transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-3 h-3 text-white" />
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(media.id) }}
                      disabled={deletingId === media.id}
                      className="w-6 h-6 flex items-center justify-center bg-red-500/80 hover:bg-red-600 rounded-md transition-colors"
                      title="Hapus"
                    >
                      {deletingId === media.id
                        ? <Loader2 className="w-3 h-3 text-white animate-spin" />
                        : <Trash2 className="w-3 h-3 text-white" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Media Global</DialogTitle>
          </DialogHeader>

          <form id="upload-form" onSubmit={handleUploadSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tujuan Reseller</label>
              <Select
                required
                value={uploadData.resellerId}
                onValueChange={value => setUploadData({ ...uploadData, resellerId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Reseller" />
                </SelectTrigger>
                <SelectContent>
                  {resellers.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.businessName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">File Media (Max 5MB)</label>
              <Input
                type="file"
                required
                accept="image/jpeg,image/png,image/webp"
                onChange={e => setUploadData({ ...uploadData, file: e.target.files?.[0] || null })}
              />
            </div>
          </form>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)}>
              Batal
            </Button>
            <Button
              type="submit"
              form="upload-form"
              disabled={isUploading || !uploadData.file}
            >
              {isUploading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {isUploading ? 'Mengunggah...' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lightbox Modal */}
      {lightboxMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setLightboxMedia(null)}
        >
          <div
            className="relative max-w-5xl w-full mx-4 flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Image */}
            <div className="bg-black flex-1 flex items-center justify-center min-h-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightboxMedia.fileUrl}
                alt="Preview"
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>

            {/* Info Panel */}
            <div className="bg-card w-full md:w-72 shrink-0 p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Info File</h3>
                <button
                  onClick={() => setLightboxMedia(null)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 flex-1">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Nama File</p>
                  <p className="text-xs font-mono text-foreground break-all leading-relaxed">
                    {lightboxMedia.fileUrl.split('/').pop()}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Ukuran</p>
                    <p className="text-sm font-semibold text-foreground">{formatBytes(lightboxMedia.size)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Tipe</p>
                    <p className="text-sm font-semibold text-foreground">{lightboxMedia.fileType.split('/')[1]?.toUpperCase()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Reseller</p>
                  <p className="text-sm text-foreground">{lightboxMedia.reseller?.businessName || 'Global'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Provider</p>
                  <Badge variant="secondary" className="text-xs">{lightboxMedia.provider}</Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-3 border-t border-border">
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(lightboxMedia.fileUrl)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/70 text-sm text-foreground transition-colors w-full"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'URL Disalin!' : 'Salin URL'}
                </button>
                <button
                  onClick={() => {
                    handleDelete(lightboxMedia.id)
                    setLightboxMedia(null)
                  }}
                  disabled={deletingId === lightboxMedia.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-sm text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
