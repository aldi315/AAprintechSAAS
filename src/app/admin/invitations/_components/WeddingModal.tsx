'use client'

import { useState, useEffect } from 'react'
import { createWedding, updateWedding } from '@/application/actions/wedding.actions'
import { useAlert } from '@/presentation/components/ui/AlertProvider'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"
import { Check } from "lucide-react"

interface WeddingModalProps {
  isOpen: boolean
  onClose: () => void
  wedding?: any
  resellers: any[]
  templates: any[]
}

export function WeddingModal({ isOpen, onClose, wedding, resellers, templates }: WeddingModalProps) {
  const { showAlert } = useAlert()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [invitationType, setInvitationType] = useState('Wedding')

  // Sort: admin tenant first, then the rest
  const sortedTenants = [...resellers].sort((a, b) => {
    if (a.owner?.role === 'SUPER_ADMIN') return -1
    if (b.owner?.role === 'SUPER_ADMIN') return 1
    return 0
  })

  const adminReseller = sortedTenants.find(t => t.owner?.role === 'SUPER_ADMIN')

  const [formData, setFormData] = useState({
    resellerId: '',
    templateId: '',
    slug: '',
    brideName: '',
    groomName: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  })

  useEffect(() => {
    if (isOpen) {
      setStep(1)
      if (!wedding) {
        setInvitationType('Wedding')
      }
    }

    if (wedding) {
      if (wedding.slug.startsWith('khitanan-')) {
        setInvitationType('Khitanan')
      } else if (wedding.slug.startsWith('event-')) {
        setInvitationType('Event')
      } else {
        setInvitationType('Wedding')
      }

      setFormData({
        resellerId: wedding.resellerId,
        templateId: wedding.templateId,
        slug: wedding.slug,
        brideName: wedding.brideName,
        groomName: wedding.groomName,
        status: wedding.status,
      })
    } else {
      // Find the tenant owned by SUPER_ADMIN
      const defaultTenantId = adminReseller ? adminReseller.id : (sortedTenants[0]?.id || '')
      
      setFormData({
        resellerId: defaultTenantId,
        templateId: templates[0]?.id || '',
        slug: '',
        brideName: '',
        groomName: '',
        status: 'DRAFT'
      })
    }
  }, [wedding, resellers, templates, isOpen])

  // Auto-generate slug when names or type change (only for new creations or if not yet saved)
  useEffect(() => {
    if (wedding) return // Don't auto-overwrite if editing an existing wedding

    const g = formData.groomName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const b = formData.brideName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const type = invitationType.toLowerCase()

    let generatedSlug = ''
    if (type === 'wedding') {
      generatedSlug = `wedding-${g}${b ? `-${b}` : ''}`
    } else if (type === 'khitanan') {
      generatedSlug = `khitanan-${g}${b ? `-${b}` : ''}`
    } else if (type === 'event') {
      generatedSlug = `event-${g}`
    }
    
    // Clean up hyphens
    generatedSlug = generatedSlug.replace(/^-+|-+$/g, '')

    // Only update if we have at least typed something, or to reset
    if (generatedSlug !== 'wedding' && generatedSlug !== 'khitanan' && generatedSlug !== 'event') {
      setFormData(prev => ({ ...prev, slug: generatedSlug }))
    } else {
      setFormData(prev => ({ ...prev, slug: '' }))
    }
  }, [formData.groomName, formData.brideName, invitationType, wedding])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      setStep(2)
      return
    }

    if (!formData.templateId) {
      showAlert('Gagal', 'Pilih template terlebih dahulu', 'error')
      return
    }

    setIsLoading(true)

    try {
      if (wedding) {
        const res = await updateWedding(wedding.id, formData)
        if (!res.success) throw new Error(res.error)
        showAlert('Berhasil', 'Wedding updated successfully', 'success')
      } else {
        const res = await createWedding(formData)
        if (!res.success) throw new Error(res.error)
        showAlert('Berhasil', 'Wedding created successfully', 'success')
      }
      onClose()
    } catch (error: any) {
      showAlert('Gagal', error.message || 'Terjadi kesalahan', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 pb-2 border-b border-border">
          <DialogTitle>
            {wedding ? 'Edit Undangan' : 'Buat Undangan Baru'}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 overflow-y-auto flex-1">
          {/* Stepper Header */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors ${step === 1 ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' : 'bg-primary/20 text-primary'}`}>1</div>
              <span className={`text-sm font-medium ${step === 1 ? 'text-foreground' : 'text-muted-foreground'}`}>Formulir</span>
              
              <div className={`w-8 h-0.5 rounded-full transition-colors ${step === 2 ? 'bg-primary' : 'bg-border'}`}></div>
              
              <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors ${step === 2 ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' : 'bg-muted text-muted-foreground'}`}>2</div>
              <span className={`text-sm font-medium ${step === 2 ? 'text-foreground' : 'text-muted-foreground'}`}>Template</span>
            </div>
          </div>

          <form id="wedding-form" onSubmit={handleSubmit} className="space-y-5">
            
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-300">
                {/* FORM FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Owner (Pemilik)</label>
                  <Select
                    required
                    value={formData.resellerId}
                    onValueChange={value => setFormData({ ...formData, resellerId: value ?? '' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Owner" />
                    </SelectTrigger>
                    <SelectContent>
                      {adminReseller && (
                        <SelectGroup>
                          <SelectLabel>— Admin —</SelectLabel>
                          <SelectItem value={adminReseller.id}>
                            ★ {adminReseller.businessName}
                          </SelectItem>
                        </SelectGroup>
                      )}
                      {sortedTenants.filter(t => t.owner?.role !== 'SUPER_ADMIN').length > 0 && (
                        <SelectGroup>
                          <SelectLabel>— Reseller Klien —</SelectLabel>
                          {sortedTenants
                            .filter(t => t.owner?.role !== 'SUPER_ADMIN')
                            .map(t => (
                              <SelectItem key={t.id} value={t.id}>{t.businessName}</SelectItem>
                            ))
                          }
                        </SelectGroup>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipe Undangan</label>
                  <Select
                    value={invitationType}
                    onValueChange={value => setInvitationType(value ?? 'Wedding')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipe Undangan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Wedding">Wedding</SelectItem>
                      <SelectItem value="Khitanan">Khitanan</SelectItem>
                      <SelectItem value="Event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {invitationType === 'Wedding' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nama Panggilan Pria</label>
                      <Input
                        type="text"
                        required
                        value={formData.groomName}
                        onChange={e => setFormData({ ...formData, groomName: e.target.value })}
                        placeholder="Romeo"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nama Panggilan Wanita</label>
                      <Input
                        type="text"
                        required
                        value={formData.brideName}
                        onChange={e => setFormData({ ...formData, brideName: e.target.value })}
                        placeholder="Juliet"
                      />
                    </div>
                  </>
                )}
                {invitationType === 'Khitanan' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nama Depan</label>
                      <Input
                        type="text"
                        required
                        value={formData.groomName}
                        onChange={e => setFormData({ ...formData, groomName: e.target.value })}
                        placeholder="Fulan"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nama Belakang (Opsional)</label>
                      <Input
                        type="text"
                        value={formData.brideName === '-' ? '' : formData.brideName}
                        onChange={e => setFormData({ ...formData, brideName: e.target.value })}
                        placeholder="Bin Fulan"
                      />
                    </div>
                  </>
                )}
                {invitationType === 'Event' && (
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <label className="text-sm font-medium">Judul Event</label>
                    <Input
                      type="text"
                      required
                      value={formData.groomName}
                      onChange={e => {
                        setFormData({ ...formData, groomName: e.target.value, brideName: '-' })
                      }}
                      placeholder="Tech Conference 2026"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL Slug</label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 bg-muted border border-r-0 border-input rounded-l-md text-muted-foreground text-sm flex items-center justify-center h-9">
                      domain.com/invitation/
                    </span>
                    <Input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      placeholder={invitationType === 'Wedding' ? 'wedding-romeo-juliet' : invitationType === 'Khitanan' ? 'khitanan-fulan' : 'event-judul'}
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={formData.status}
                    onValueChange={value => setFormData({ ...formData, status: (value as any) ?? 'DRAFT' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">DRAFT</SelectItem>
                      <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
                      <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* TEMPLATE CATALOG */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">Pilih Template Katalog</label>
                    {!formData.templateId && <span className="text-xs text-rose-500 font-medium">* Template harus dipilih</span>}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-200">
                    {templates.map(t => (
                      <div
                        key={t.id}
                        onClick={() => setFormData({ ...formData, templateId: t.id })}
                        className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 overflow-hidden group ${
                          formData.templateId === t.id
                            ? 'border-primary shadow-sm'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="aspect-[1/1.4] bg-muted relative">
                          {t.previewImage ? (
                            <img src={t.previewImage} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2 bg-muted/50">
                              <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>No Preview</span>
                            </div>
                          )}
                          {t.premium && (
                            <div className="absolute top-2 right-2 px-2 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-md shadow-sm">
                              PREMIUM
                            </div>
                          )}
                          {formData.templateId === t.id && (
                            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                              <div className="bg-primary text-primary-foreground p-2 rounded-full shadow-lg transform scale-100 animate-in zoom-in duration-200">
                                <Check className="w-5 h-5" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-3 bg-card border-t border-border">
                          <p className={`font-medium text-sm text-center truncate ${
                            formData.templateId === t.id ? 'text-primary' : 'text-foreground'
                          }`}>
                            {t.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </form>
        </div>

        <DialogFooter className="p-6 border-t border-border bg-muted/30 flex justify-between items-center sm:justify-between">
          <div>
            {step === 2 && (
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Kembali
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              Batal
            </Button>
            <Button
              type="submit"
              form="wedding-form"
              disabled={isLoading}
            >
              {step === 1 ? 'Selanjutnya' : (isLoading ? 'Menyimpan...' : 'Simpan')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
