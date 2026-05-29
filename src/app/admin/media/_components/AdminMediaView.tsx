'use client'

import { useState } from 'react'
import { Trash2, Image as ImageIcon, ExternalLink, Loader2, Upload, X } from 'lucide-react'
import { deleteMediaGlobal, uploadGlobalMediaAction } from '@/application/actions/admin.actions'
import { useAlert } from '@/presentation/components/ui/AlertProvider'

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function AdminMediaView({ initialMedia, tenants }: { initialMedia: any[], tenants: any[] }) {
  const { showAlert } = useAlert()
  const [mediaFiles, setMediaFiles] = useState(initialMedia)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  // Upload State
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadData, setUploadData] = useState({
    tenantId: tenants.find(t => t.owner?.role === 'SUPER_ADMIN')?.id || tenants[0]?.id || '',
    file: null as File | null
  })

  const totalSize = mediaFiles.reduce((acc: number, m: any) => acc + m.size, 0)

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
    formData.append('tenantId', uploadData.tenantId)

    try {
      const res = await uploadGlobalMediaAction(formData)
      if (res.success) {
        showAlert('Berhasil', 'Media berhasil diunggah', 'success')
        setIsUploadOpen(false)
        setUploadData(prev => ({ ...prev, file: null }))
        // For simplicity, we trigger a page reload since we don't have the new full object 
        // to manually prepend to mediaFiles. In a real app we could fetch it.
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Media Monitoring</h1>
          <p className="text-sm text-slate-500 mt-1">Pantau penggunaan storage secara global di seluruh tenant.</p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Media</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between max-w-sm">
        <div>
          <p className="text-sm text-slate-500 font-medium">Total Storage Used</p>
          <p className="text-3xl font-bold text-indigo-600 mt-1">{formatBytes(totalSize)}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
          <ImageIcon className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Preview</th>
                <th className="px-6 py-4 font-medium">Tenant</th>
                <th className="px-6 py-4 font-medium">File Info</th>
                <th className="px-6 py-4 font-medium">Size</th>
                <th className="px-6 py-4 font-medium">Provider</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mediaFiles.map((media: any) => (
                <tr key={media.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    {media.fileType.startsWith('image/') ? (
                      <div className="w-12 h-12 rounded bg-slate-100 overflow-hidden relative border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={media.fileUrl} alt="Media" className="object-cover w-full h-full" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{media.tenant?.businessName || 'Global'}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-mono text-slate-500 truncate max-w-xs">{media.fileUrl.split('/').pop()}</span>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">{media.fileType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{formatBytes(media.size)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold tracking-wider uppercase">
                      {media.provider}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a 
                        href={media.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                        title="Lihat URL"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button 
                        onClick={() => handleDelete(media.id)}
                        disabled={deletingId === media.id}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Hapus Media"
                      >
                        {deletingId === media.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {mediaFiles.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Belum ada media diunggah.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-semibold text-slate-800">Upload Media Global</h2>
              <button onClick={() => setIsUploadOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <form id="upload-form" onSubmit={handleUploadSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Tujuan Tenant</label>
                  <select
                    required
                    value={uploadData.tenantId}
                    onChange={e => setUploadData({ ...uploadData, tenantId: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    {tenants.map(t => (
                      <option key={t.id} value={t.id}>{t.businessName}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">File Media (Max 5MB)</label>
                  <input
                    type="file"
                    required
                    accept="image/jpeg,image/png,image/webp"
                    onChange={e => setUploadData({ ...uploadData, file: e.target.files?.[0] || null })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                form="upload-form"
                disabled={isUploading || !uploadData.file}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isUploading ? 'Mengunggah...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
