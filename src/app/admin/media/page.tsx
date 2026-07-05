import { getAllMedia, getAllResellers, getLocalUploadsAsMedia } from '@/application/queries/admin.queries'
import { AdminMediaView } from './_components/AdminMediaView'

export default async function AdminMediaPage() {
  const [mediaFiles, resellers, localMedia] = await Promise.all([
    getAllMedia(),
    getAllResellers(),
    getLocalUploadsAsMedia()
  ])

  const combinedMedia = [...mediaFiles, ...localMedia].sort((a: any, b: any) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return <AdminMediaView initialMedia={combinedMedia} resellers={resellers} />
}
