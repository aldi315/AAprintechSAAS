'use client'

import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, ExternalLink, Users } from 'lucide-react'
import { WeddingModal } from './WeddingModal'
import { deleteWedding } from '@/application/actions/wedding.actions'
import Link from 'next/link'
import { useAlert } from '@/presentation/components/ui/AlertProvider'

export function WeddingsView({ weddings, tenants, templates }: { weddings: any[], tenants: any[], templates: any[] }) {
  const { showAlert } = useAlert()
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingWedding, setEditingWedding] = useState<any>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filteredWeddings = weddings.filter(w =>
    w.brideName.toLowerCase().includes(search.toLowerCase()) ||
    w.groomName.toLowerCase().includes(search.toLowerCase()) ||
    w.slug.toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (wedding: any) => {
    setEditingWedding(wedding)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    showAlert(
      'Konfirmasi Hapus',
      'Apakah Anda yakin ingin menghapus undangan ini?',
      'confirm',
      async () => {
        setDeletingId(id)
        const res = await deleteWedding(id)
        if (res.success) {
          showAlert('Berhasil', 'Undangan dihapus', 'success')
        } else {
          showAlert('Gagal', res.error, 'error')
        }
        setDeletingId(null)
      }
    )
  }

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Undangan (Weddings)</h1>
          <p className="text-slate-500 mt-1">Kelola data undangan pernikahan dari semua tenant</p>
        </div>
        <button
          onClick={() => {
            setEditingWedding(null)
            setIsModalOpen(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Undangan</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama atau slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Mempelai</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tenant</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Template</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredWeddings.map((wedding) => (
                <tr key={wedding.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-slate-900">{wedding.brideName} & {wedding.groomName}</p>
                        <Link href={`/${wedding.slug}`} target="_blank" className="text-sm text-indigo-600 hover:underline flex items-center gap-1 mt-0.5">
                          /{wedding.slug} <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {wedding.tenant?.businessName}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {wedding.template?.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      wedding.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                      wedding.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {wedding.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/weddings/${wedding.id}/guests`}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                        title="Lihat Tamu & RSVP"
                      >
                        <Users className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleEdit(wedding)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(wedding.id)}
                        disabled={deletingId === wedding.id}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredWeddings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Tidak ada data undangan yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <WeddingModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingWedding(null)
        }}
        wedding={editingWedding}
        tenants={tenants}
        templates={templates}
      />
    </div>
  )
}
