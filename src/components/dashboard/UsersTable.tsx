import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useNavigate } from "react-router-dom"

interface User {
  id: number
  name: string
  organization: string
  designation: string
  status: string
  lastUpdate: string
  updatedBy: string
}

interface UsersTableProps {
  users: User[]
}

export function UsersTable({ users }: UsersTableProps) {
  const navigate = useNavigate()

  // Handle view details navigation
  const handleViewDetails = (userId: number) => {
    navigate(`/user-details/${userId}`)
  }

  // Status badge color mapping
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-green-600"
      case "pending":
        return "text-yellow-600"
      case "rejected":
        return "text-red-600"
      case "inactive":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="bg-white rounded-md shadow">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Sr. No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Organisation</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Current Status</TableHead>
              <TableHead>Last Update</TableHead>
              <TableHead>Updated By</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.organization}</TableCell>
                <TableCell>{user.designation}</TableCell>
                <TableCell className={getStatusColor(user.status)}>{user.status}</TableCell>
                <TableCell>{user.lastUpdate}</TableCell>
                <TableCell>{user.updatedBy}</TableCell>
                <TableCell className="text-right">
                  {user.status.toLowerCase() === "pending" ? (
                    <Button 
                      variant="link" 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleViewDetails(user.id)}
                    >
                      Approval/Reject
                    </Button>
                  ) : (
                    <Button 
                      variant="link" 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleViewDetails(user.id)}
                    >
                      View Details
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="py-4 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">4</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">5</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
