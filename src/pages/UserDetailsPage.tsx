

import { UserDetailsContent } from "@/components/dashboard/user_details/UserDetailsContent"
import { DashboardLayout } from "@/components/dashboard/layout/DashboardLayout"
import { useParams } from "react-router-dom"


export function UserDetailsPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <DashboardLayout>
      <UserDetailsContent userId={id} />
    </DashboardLayout>
  )
}
