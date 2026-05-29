import { getAllMedia, getAllTenants, getLocalUploadsAsMedia } from '@/application/queries/admin.queries'
import { AdminMediaView } from './_components/AdminMediaView'

export default async function AdminMediaPage() {
  const [mediaFiles, tenants, localMedia] = await Promise.all([
    getAllMedia(),
    getAllTenants(),
    getLocalUploadsAsMedia()
  ])

  const combinedMedia = [...mediaFiles, ...localMedia].sort((a: any, b: any) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return <AdminMediaView initialMedia={combinedMedia} tenants={tenants} />
}
