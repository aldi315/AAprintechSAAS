import { getAllWeddings, getAllTenants, getAllTemplates } from '@/application/queries/admin.queries'
import { WeddingsView } from './_components/WeddingsView'

export default async function AdminWeddingsPage() {
  const weddings = await getAllWeddings()
  const tenants = await getAllTenants()
  const templates = await getAllTemplates()

  return <WeddingsView weddings={weddings} tenants={tenants} templates={templates} />
}
