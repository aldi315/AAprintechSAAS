import { getAllWeddings, getAllResellers, getAllTemplates } from '@/application/queries/admin.queries'
import { WeddingsView } from './_components/WeddingsView'

export default async function AdminWeddingsPage() {
  const weddings = await getAllWeddings()
  const resellers = await getAllResellers()
  const templates = await getAllTemplates()

  return <WeddingsView weddings={weddings} resellers={resellers} templates={templates} />
}
