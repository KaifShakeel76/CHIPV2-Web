"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface StatusTabsProps {
  selectedStatus: string
  onStatusChange: (status: string) => void
}

export function StatusTabs({ selectedStatus, onStatusChange }: StatusTabsProps) {
  const statuses = ["All", "Approved", "Pending", "Inactive"]

  return (
    <Tabs value={selectedStatus} onValueChange={onStatusChange}>
      <TabsList className="bg-white">
        {statuses.map((status) => (
          <TabsTrigger
            key={status}
            value={status}
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            {status}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
