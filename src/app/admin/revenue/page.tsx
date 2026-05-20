import { getAllPayments } from '@/application/queries/admin.queries'

export default async function AdminRevenuePage() {
  const payments = await getAllPayments()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Revenue Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Pantau seluruh transaksi dan pendapatan sistem.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-800">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Transaction ID</th>
                <th className="px-6 py-4 font-medium">Tenant</th>
                <th className="px-6 py-4 font-medium">Provider</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((payment: any) => (
                <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{payment.externalId}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-slate-900 font-medium">{payment.tenant.businessName}</span>
                      <span className="text-xs text-slate-500">{payment.tenant.owner.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize">{payment.provider}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {formatCurrency(Number(payment.amount))}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {formatDate(payment.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase ${
                      payment.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                      payment.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Belum ada transaksi pembayaran.
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
