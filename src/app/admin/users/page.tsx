import { getAllUsers } from '@/application/queries/admin.queries'
import { UsersView } from './_components/UsersView'

export default async function AdminUsersPage() {
  const users = await getAllUsers()

  return <UsersView users={users} />
}
