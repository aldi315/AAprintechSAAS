'use client'

import { Edit2, Palette, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface TemplateCardProps {
  template: {
    id: string
    name: string
    categoryId: string
    category?: { name: string }
    previewImage: string | null
    price: number
    active: boolean
  }
  onEdit: () => void
  onDelete: () => void
}

export function TemplateCard({ template, onEdit, onDelete }: TemplateCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
      {/* Image Preview */}
      <div className="relative aspect-[1/1] bg-muted overflow-hidden -mt-4 -mx-0 rounded-t-xl">
        {template.previewImage ? (
          <img
            src={template.previewImage}
            alt={template.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <span className="text-sm">No Image</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge variant={template.price > 0 ? "secondary" : "default"} className="shadow-sm">
            {template.price > 0 ? `Rp ${template.price.toLocaleString('id-ID')}` : 'Free'}
          </Badge>
          <Badge variant={template.active ? "default" : "destructive"} className="shadow-sm">
            {template.active ? 'Active' : 'Disabled'}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1">{template.name}</h3>
        <p className="text-sm text-muted-foreground capitalize mb-6">{template.category?.name || 'Uncategorized'}</p>

        <div className="mt-auto grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            onClick={onEdit}
            className="flex flex-col items-center justify-center gap-1 h-auto py-2"
            title="Edit Details"
          >
            <Edit2 className="w-4 h-4" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Edit</span>
          </Button>

          <Button
            asChild
            variant="outline"
            className="flex flex-col items-center justify-center gap-1 h-auto py-2 hover:text-amber-600 hover:border-amber-600"
            title="Design Editor"
          >
            <Link href={`/admin/templates/${template.id}/design`}>
              <Palette className="w-4 h-4" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">Design</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            onClick={onDelete}
            className="flex flex-col items-center justify-center gap-1 h-auto py-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
            title="Delete Template"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Delete</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
