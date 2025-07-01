"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RoleTabsProps {
  selectedRole: string
  onRoleChange: (role: string) => void
}

export function RoleTabs({ selectedRole, onRoleChange }: RoleTabsProps) {
  const roles = ["Medical Officer", "Pharmacist", "Lab Technician", "Staff Nurse", "CHO", "ANM", "MPHW", "ASHA", "AWW"]

  return (
    <div className="overflow-x-auto">
      <Tabs value={selectedRole} onValueChange={onRoleChange} className="w-full">
        <TabsList className="bg-white p-0 h-auto flex flex-nowrap">
          {roles.map((role) => (
            <TabsTrigger
              key={role}
              value={role}
              className="px-4 py-2 rounded-none data-[state=active]:bg-primary data-[state=active]:text-white whitespace-nowrap"
            >
              {role}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
