import { getGlobalActivityLogs } from '@/application/queries/admin.queries'

export default async function AdminActivityPage() {
  const logs = await getGlobalActivityLogs()

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Activity Logs</h1>
        <p className="text-sm text-slate-500 mt-1">Audit trail seluruh aktivitas sistem dari semua tenant.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">Tenant</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log: any) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono">{formatDate(log.createdAt)}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{log.tenant.businessName}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[10px] font-mono tracking-wider">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <pre className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded max-w-xs overflow-x-auto">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    Belum ada log aktivitas.
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
