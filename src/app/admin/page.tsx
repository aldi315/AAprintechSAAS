import { getAdminSystemStats } from '@/application/queries/admin.queries'
import { AdminStatCard } from '@/presentation/admin/components/AdminStatCard'
import { Building2, Heart, ClipboardCheck, CreditCard, Activity } from 'lucide-react'

export default async function AdminHomePage() {
  const stats = await getAdminSystemStats()

  // Format currency
  const formattedRevenue = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(stats.totalRevenue)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Monitoring kesehatan ekosistem SaaS secara global.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <AdminStatCard 
          title="Total Tenants" 
          value={stats.tenantCount} 
          icon={Building2} 
          trend={{ value: 12, isPositive: true }}
        />
        <AdminStatCard 
          title="Total Revenue" 
          value={formattedRevenue} 
          icon={CreditCard} 
          trend={{ value: 8, isPositive: true }}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[300px] flex items-center justify-center">
          <p className="text-slate-400 text-sm">Grafik Revenue (Segera Hadir)</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[300px] flex items-center justify-center">
          <p className="text-slate-400 text-sm">Grafik Pendaftaran Tenant (Segera Hadir)</p>
        </div>
      </div>
    </div>
  )
}
