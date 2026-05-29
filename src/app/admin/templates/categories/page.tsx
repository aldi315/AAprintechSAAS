import { getAllCategories } from '@/application/queries/admin.queries'
import { CategoryView } from './_components/CategoryView'

export default async function AdminTemplateCategoriesPage() {
  const categories = await getAllCategories()

  return <CategoryView categories={categories} />
}
