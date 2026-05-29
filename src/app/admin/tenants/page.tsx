import { getAllTenants } from '@/application/queries/admin.queries'

export default async function AdminTenantsPage() {
  const allTenants = await getAllTenants()
  // Filter out the platform's own "house account" — only show reseller/client tenants
  const tenants = allTenants.filter((t: any) => t.owner?.role !== 'SUPER_ADMIN')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tenant Management</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola seluruh pelanggan SaaS Anda.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Business Name</th>
                <th className="px-6 py-4 font-medium">Owner</th>
                <th className="px-6 py-4 font-medium">Domain/Slug</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-center">Weddings</th>
                <th className="px-6 py-4 font-medium text-center">Media Files</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenants.map((tenant: any) => (
                <tr key={tenant.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{tenant.businessName}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-slate-900">{tenant.owner.name}</span>
                      <span className="text-xs text-slate-500">{tenant.owner.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                      {tenant.customDomain || tenant.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2 items-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase ${
                      tenant.subscriptionStatus === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                      tenant.subscriptionStatus === 'INACTIVE' ? 'bg-slate-100 text-slate-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {tenant.subscriptionStatus}
                    </span>
                    {/* Mock Suspended State (Future Step) */}
                    {false && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-red-100 text-red-700">
                        Suspended
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">{tenant._count.weddings}</td>
                  <td className="px-6 py-4 text-center">{tenant._count.media}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
              {tenants.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    Belum ada tenant terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
