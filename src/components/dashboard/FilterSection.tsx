"use client"

import { Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FilterOption } from "@/types"

interface FilterSectionProps {
  filters: Record<string, string>
  onFilterChange: (key: string, value: string) => void
  className?: string
}

const filterOptions: Record<string, FilterOption[]> = {
  userType: [
    { label: "All", value: "all" },
    { label: "Health Care Provider", value: "healthcare" },
    { label: "Administrator", value: "admin" },
  ],
  userLevel: [
    { label: "All Level", value: "all" },
    { label: "State", value: "state" },
    { label: "District", value: "district" },
  ],
  state: [
    { label: "All", value: "all" },
    { label: "Rajasthan", value: "rajasthan" },
    { label: "Gujarat", value: "gujarat" },
  ],
  district: [
    { label: "All", value: "all" },
    { label: "Jaipur", value: "jaipur" },
    { label: "Udaipur", value: "udaipur" },
  ],
  blockTaluka: [
    { label: "All", value: "all" },
    { label: "Block 1", value: "block1" },
    { label: "Block 2", value: "block2" },
  ],
}

export function FilterSection({ filters, onFilterChange }: FilterSectionProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      {/* Left Filter Group - Type and Level */}
      <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white rounded-xl">
        <div className="flex flex-col gap-4 min-w-0">
          <label className="text-base text-[#808080] truncate">Type of Users</label>
          <div className="relative">
            <Select value={filters.userType} onValueChange={(value) => onFilterChange("userType", value)}>
              <SelectTrigger className="w-full sm:w-56 h-12 bg-[#F6F6F8] border-0 text-base">
                <SelectValue placeholder="UserName@mail.com" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.userType.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#363636] pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col gap-4 min-w-0">
          <label className="text-base text-[#808080] truncate">Level of Users</label>
          <div className="relative">
            <Select value={filters.userLevel} onValueChange={(value) => onFilterChange("userLevel", value)}>
              <SelectTrigger className="w-full sm:w-56 h-12 bg-[#F6F6F8] border-0 text-base">
                <SelectValue placeholder="UserName@mail.com" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.userLevel.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#363636] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Right Filter Group - Geography Filters */}
      <div className="flex-1 p-2 bg-white rounded-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(filterOptions)
            .slice(2)
            .map(([key, options]) => (
              <div key={key} className="flex flex-col gap-4 min-w-0">
                <label className="text-base text-[#808080] capitalize truncate">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <div className="relative">
                  <Select value={filters[key]} onValueChange={(value) => onFilterChange(key, value)}>
                    <SelectTrigger className="w-full h-12 bg-[#F6F6F8] border-0 text-base">
                      <SelectValue placeholder="sufiyan.saifi@khushibaby.org" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#363636] pointer-events-none" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}