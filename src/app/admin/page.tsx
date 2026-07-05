import { getAdminSystemStats } from '@/application/queries/admin.queries'
import { AdminStatCard } from '@/presentation/admin/components/AdminStatCard'
import { Building2, Heart, ClipboardCheck, CreditCard, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminHomePage() {
  const stats = await getAdminSystemStats()

  // Format currency
  const formattedRevenue = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(stats.totalRevenue)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <AdminStatCard 
          title="Total Resellers" 
          value={stats.resellerCount} 
          icon={Building2} 
          trend={{ value: 12, isPositive: true }}
          description="dari bulan lalu"
        />
        <AdminStatCard 
          title="Total Revenue" 
          value={formattedRevenue} 
          icon={CreditCard} 
          trend={{ value: 8, isPositive: true }}
          description="dari bulan lalu"
        />
        <AdminStatCard 
          title="Active Subs" 
          value={stats.activeSubscriptions} 
          icon={Activity} 
        />
        <AdminStatCard 
          title="Total Weddings" 
          value={stats.weddingCount} 
          icon={Heart} 
        />
        <AdminStatCard 
          title="Total RSVPs" 
          value={stats.rsvpCount} 
          icon={ClipboardCheck} 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Grafik Revenue</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Segera Hadir</p>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Pendaftaran Reseller</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Segera Hadir</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
