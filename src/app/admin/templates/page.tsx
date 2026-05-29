import { getAllTemplates, getAllCategories } from '@/application/queries/admin.queries'
import { TemplatesView } from './_components/TemplatesView'

export default async function AdminTemplatesPage() {
  const templates = await getAllTemplates()
  const categories = await getAllCategories()

  return <TemplatesView templates={templates} categories={categories} />
}
