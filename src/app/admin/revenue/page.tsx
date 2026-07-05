import { getAllPayments } from '@/application/queries/admin.queries'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Revenue Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Pantau seluruh transaksi dan pendapatan sistem.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Transaction ID</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment: any) => (
                <TableRow key={payment.id}>
                  <TableCell className="pl-6 font-mono text-xs text-muted-foreground">{payment.externalId}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{payment.tenant.businessName}</span>
                      <span className="text-xs text-muted-foreground">{payment.tenant.owner.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{payment.provider}</span>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(Number(payment.amount))}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(payment.createdAt)}
                  </TableCell>
                  <TableCell className="pr-6">
                    <Badge variant={
                      payment.status === 'PAID' ? 'default' :
                      payment.status === 'PENDING' ? 'secondary' :
                      'destructive'
                    }>
                      {payment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {payments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Belum ada transaksi pembayaran.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
