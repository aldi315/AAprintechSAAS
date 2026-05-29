import { getWeddingGuests, getWeddingRSVPs, getWeddingDetails } from '@/application/queries/admin.queries'
import { GuestRSVPView } from './_components/GuestRSVPView'
import { notFound } from 'next/navigation'

export default async function GuestRSVPPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const [details, guests, rsvps] = await Promise.all([
    getWeddingDetails(id),
    getWeddingGuests(id),
    getWeddingRSVPs(id)
  ])

  if (!details) notFound()

  return <GuestRSVPView details={details} guests={guests} rsvps={rsvps} />
}
