'use client'

import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, ExternalLink, Users, Palette } from 'lucide-react'
import { WeddingModal } from './WeddingModal'
import { deleteWedding } from '@/application/actions/wedding.actions'
import Link from 'next/link'
import { useAlert } from '@/presentation/components/ui/AlertProvider'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function WeddingsView({ weddings, resellers, templates }: { weddings: any[], resellers: any[], templates: any[] }) {
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Undangan (Weddings)</h1>
          <p className="text-muted-foreground mt-1 text-sm">Kelola data undangan pernikahan dari semua tenant</p>
        </div>
        <Button
          onClick={() => {
            setEditingWedding(null)
            setIsModalOpen(true)
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Buat Undangan
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Cari nama atau slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mempelai</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWeddings.map((wedding) => (
                <TableRow key={wedding.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{wedding.brideName} & {wedding.groomName}</span>
                      <Link href={`/invitation/${wedding.slug}`} target="_blank" className="text-sm text-primary hover:underline flex items-center gap-1 mt-0.5">
                        /invitation/{wedding.slug} <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {wedding.reseller?.businessName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {wedding.template?.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      wedding.status === 'PUBLISHED' ? 'default' :
                      wedding.status === 'DRAFT' ? 'secondary' : 'outline'
                    }>
                      {wedding.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild title="Lihat Tamu & RSVP">
                        <Link href={`/admin/invitations/${wedding.id}/guests`}>
                          <Users className="w-4 h-4 text-muted-foreground" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild title="Desain Undangan">
                        <Link href={`/admin/invitations/${wedding.id}/design`}>
                          <Palette className="w-4 h-4 text-muted-foreground" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(wedding)}>
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(wedding.id)}
                        disabled={deletingId === wedding.id}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredWeddings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Tidak ada data undangan yang ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <WeddingModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingWedding(null)
        }}
        wedding={editingWedding}
        resellers={resellers}
        templates={templates}
      />
    </div>
  )
}
