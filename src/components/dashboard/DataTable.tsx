"use client"

import { Download, Search, ChevronLeft, ChevronRight, MoreHorizontal, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import type { User, TableColumn } from "@/types"

interface DataTableProps {
  data: User[]
  totalItems: number
  currentPage: number
  itemsPerPage: number
  totalPages: number
  activeTab: string
  searchQuery: string
  onPageChange: (page: number) => void
  onItemsPerPageChange: (items: number) => void
  onTabChange: (tab: string) => void
  onSearch: (query: string) => void
  onDownload?: () => void
  className?: string
}

type SortDirection = "asc" | "desc" | null

interface SortState {
  column: string | null
  direction: SortDirection
}

const columns: TableColumn[] = [
  { key: "srNo", title: "Sr. No" },
  { key: "name", title: "Name", sortable: true },
  { key: "department", title: "Department", sortable: true },
  { key: "geography", title: "Geography", sortable: true },
  { key: "status", title: "Status", sortable: true },
  { key: "action", title: "Action", sortable: true },
]

const tabs = [
  { id: "all", label: "All", count: null },
  { id: "approval-pending", label: "Approval Pending", count: null },
  { id: "registered-approved", label: "Registered/Approved", count: null },
  { id: "inactive", label: "Inactive", count: null },
]

export function DataTable({
  data,
  currentPage,
  itemsPerPage,
  totalPages,
  activeTab,
  searchQuery,
  onPageChange,
  onItemsPerPageChange,
  onTabChange,
  onSearch,
  onDownload,
}: DataTableProps) {
  const navigate = useNavigate()
  const [sortState, setSortState] = useState<SortState>({ column: null, direction: null })

  const handleSort = (columnKey: string) => {
    if (!columns.find((col) => col.key === columnKey)?.sortable) return

    setSortState((prev) => {
      if (prev.column === columnKey) {
        // Cycle through: null -> asc -> desc -> null
        const newDirection: SortDirection = prev.direction === null ? "asc" : prev.direction === "asc" ? "desc" : null
        return { column: newDirection ? columnKey : null, direction: newDirection }
      } else {
        return { column: columnKey, direction: "asc" }
      }
    })
  }

  const handleViewDetails = (userId: string) => {
    navigate(`/user-details/${userId}`)
  }

  const getSortIcon = (columnKey: string) => {
    if (!columns.find((col) => col.key === columnKey)?.sortable) return null

    if (sortState.column === columnKey) {
      if (sortState.direction === "asc") {
        return (
          <div className="flex items-center justify-center ml-2">
            <ChevronUp className="w-4 h-4 text-[#FF6E32]" />
          </div>
        )
      }
      if (sortState.direction === "desc") {
        return (
          <div className="flex items-center justify-center ml-2">
            <ChevronDown className="w-4 h-4 text-[#FF6E32]" />
          </div>
        )
      }
    }

    // Default state - both arrows visible but muted
    return (
      <div className="flex flex-col items-center justify-center ml-2">
        <ChevronUp className="w-4 h-4 text-gray-400" />
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "active":
        return "Active"
      case "rejected":
        return "Rejected"
      case "inactive":
        return "Inactive"
      default:
        return status
    }
  }

  return (
    <div className="bg-white rounded-2xl p-2">
      {/* Tabs and Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        {/* Tabs */}
        <ScrollArea className="w-full lg:w-auto">
          <div className="flex gap-1 p-1 bg-[#F6F6F8] rounded-xl min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-2 rounded-lg text-sm sm:text-base  transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? "bg-[#B8C0FF] text-[#303030]" : "text-[#303030] hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </ScrollArea>

        {/* Search and Download */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Search */}
          <div className="relative flex items-center bg-[#F6F6F8] rounded-lg">
            <Search className="w-5 h-5 text-[#808080] ml-2" />
            <Input
              placeholder="Search by Name, Mobile No..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="border-0 bg-transparent text-sm text-[#303030] placeholder:text-gray-400 focus-visible:ring-0 w-full sm:w-72"
            />
          </div>

          {/* Download Button */}
          <Button onClick={onDownload} className="bg-[#303030] hover:bg-[#404040] text-white px-3 py-2 h-12 rounded-md">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {data.map((user, index) => (
          <Card key={user.id} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500">#{(currentPage - 1) * itemsPerPage + index + 1}</span>
                    <Badge variant="outline" className={getStatusColor(user.status)}>
                      {getStatusText(user.status)}
                    </Badge>
                  </div>
                  <h3 className="font-medium text-[#363636] ">{user.name}</h3>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(user.id.toString())}>
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Department: </span>
                  <span className="text-[#363636] ">{user.department}</span>
                </div>
                <div>
                  <span className="text-gray-500">Geography: </span>
                  <span className="text-[#363636] ">{user.geography}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <ScrollArea className="w-full">
          <div className="min-w-[800px]">
            {/* Table Header - Exact CSS Specifications */}
            <div className="flex flex-row items-start p-0 w-full h-12 bg-[#E2E3FF] rounded-t-xl">
              {columns.map((column, index) => (
                <div
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  className={`
                    flex flex-row items-center justify-between py-2 px-3 h-12 border-white cursor-pointer
                    ${index === 0 ? "w-16 justify-center bg-[#E2E3FF]" : "flex-1 bg-[#E2E3FF] border-l-[0.5px]"}
                    ${column.sortable ? "hover:bg-[#d6d7f5]" : ""}
                  `}
                >
                  <span className=" font-medium text-base leading-[19px] flex items-center text-[#363636]">
                    {column.title}
                  </span>
                  {getSortIcon(column.key)}
                </div>
              ))}
            </div>

            {/* Table Body */}
            <div>
              {data.map((user, index) => (
                <div key={user.id} className="flex border-b border-gray-200">
                  <div className="w-16 flex items-center justify-center p-3">
                    <span className="text-base text-[#363636] ">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </span>
                  </div>
                  <div className="flex-1 flex items-center p-3 border-l border-gray-200">
                    <span className="text-base text-[#363636] ">{user.name}</span>
                  </div>
                  <div className="flex-1 flex items-center p-3 border-l border-gray-200">
                    <span className="text-base text-[#363636] ">{user.department}</span>
                  </div>
                  <div className="flex-1 flex items-center p-3 border-l border-gray-200">
                    <span className="text-base text-[#363636] ">{user.geography}</span>
                  </div>
                  <div className="flex-1 flex items-center p-3 border-l border-gray-200">
                    <Badge variant="outline" className={getStatusColor(user.status)}>
                      {getStatusText(user.status)}
                    </Badge>
                  </div>
                  <div className="flex-1 flex items-center p-3 border-l border-gray-200">
                    <button
                      onClick={() => handleViewDetails(user.id.toString())}
                      className="text-base text-[#3639F2] underline  hover:text-[#2028D2]"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        {/* Items per page */}
        <div className="flex items-center gap-2">
          <Select value={itemsPerPage.toString()} onValueChange={(value) => onItemsPerPageChange(Number(value))}>
            <SelectTrigger className="w-18 h-9 bg-[#F6F6F8] border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm sm:text-base text-[#303030] ">Items per page</span>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-7 h-7 p-1"
          >
            <ChevronLeft className="w-5 h-5 text-[#182E6F]" />
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "ghost"}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className={`w-7 h-7 p-1 text-sm ${
                  currentPage === pageNum ? "bg-white shadow-md text-[#303030]" : "text-[#303030]"
                }`}
              >
                {pageNum}
              </Button>
            )
          })}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-7 h-7 p-1"
          >
            <ChevronRight className="w-5 h-5 text-[#182E6F]" />
          </Button>
        </div>
      </div>
    </div>
  )
}
