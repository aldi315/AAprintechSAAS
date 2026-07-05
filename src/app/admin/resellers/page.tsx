import { getAllResellers } from '@/application/queries/admin.queries'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
export default async function AdminResellersPage() {
  const allResellers = await getAllResellers()
  // Filter out the platform's own "house account" — only show reseller/client resellers
  const resellers = allResellers.filter((t: any) => t.owner?.role !== 'SUPER_ADMIN')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reseller Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelola seluruh pelanggan SaaS Anda.</p>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Domain/Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Weddings</TableHead>
              <TableHead className="text-center">Media Files</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resellers.map((reseller: any) => (
              <TableRow key={reseller.id}>
                <TableCell className="font-medium">{reseller.businessName}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{reseller.owner.name}</span>
                    <span className="text-xs text-muted-foreground">{reseller.owner.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                    {reseller.customDomain || reseller.slug}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    reseller.subscriptionStatus === 'ACTIVE' ? 'default' :
                    reseller.subscriptionStatus === 'INACTIVE' ? 'secondary' :
                    'destructive'
                  }>
                    {reseller.subscriptionStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">{reseller._count.weddings}</TableCell>
                <TableCell className="text-center">{reseller._count.media}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {resellers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Belum ada reseller terdaftar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
