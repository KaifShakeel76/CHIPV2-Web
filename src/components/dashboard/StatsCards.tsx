"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import type { StatsCard } from "@/types"

interface StatsCardsProps {
  stats: {
    expected: number
    approved: number
    pending: number
    inactive: number
  }
  activeCategory: string
  selectedStatCard: string | null
  onCategoryChange: (category: string) => void
  onStatCardClick: (cardType: string | null) => void
  className?: string
}

export function StatsCards({
  stats,
  activeCategory,
  selectedStatCard,
  onCategoryChange,
  onStatCardClick,
}: StatsCardsProps) {
  const cards: (StatsCard & { type: string })[] = [
    {
      title: "Expected",
      value: stats.expected,
      color: "#303030",
      type: "expected",
    },
    {
      title: "Registered/Approved Users",
      value: stats.approved,
      color: "#3D8C40",
      type: "approved",
    },
    {
      title: "Approval Pending",
      value: stats.pending,
      color: "#DCB117",
      type: "pending",
    },
    {
      title: "Inactive",
      value: stats.inactive,
      color: "#808080",
      type: "inactive",
    },
  ]

  const categoryTabs = [
    "All Users",
    "Medical Officer",
    "Staff Nurse",
    "Lab Technician",
    "Pharmacist",
    "CHO",
    "ANM",
    "ASHA",
  ]

  const handleStatCardClick = (cardType: string) => {
    // Toggle selection - if already selected, deselect
    if (selectedStatCard === cardType) {
      onStatCardClick(null)
    } else {
      onStatCardClick(cardType)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-2">
      {/* Category Tabs */}
      <div className="mb-4">
        <ScrollArea className="w-full">
          <div className="flex gap-1 p-1 bg-[#F6F6F8] rounded-xl min-w-max">
            {categoryTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onCategoryChange(tab)}
                className={`px-3 py-2 rounded-lg whitespace-nowrap transition-all duration-200 hover:bg-[#d6d7f5] ${
                  activeCategory === tab ? "bg-[#B8C0FF] shadow-sm" : "hover:bg-gray-100"
                }`}
              >
                <span className="text-sm sm:text-base text-[#303030]">{tab}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {cards.map((card, index) => (
          <button
            key={index}
            onClick={() => handleStatCardClick(card.type)}
            className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl gap-2 min-h-[80px] sm:min-h-[100px] transition-all duration-200 hover:shadow-md hover:scale-105 ${
              selectedStatCard === card.type
                ? "bg-[#E2E3FF] shadow-lg ring-2 ring-[#B8C0FF]"
                : "bg-[#F6F6F8] hover:bg-[#EEEEEE]"
            }`}
          >
            <span className="text-xs sm:text-base font-medium text-[#303030] text-center leading-tight">
              {card.title}
            </span>
            <span
              className="text-2xl sm:text-4xl font-normal text-center"
              style={{ color: card.color }}
            >
              {card.value}
            </span>
            {selectedStatCard === card.type && <div className="w-2 h-2 bg-[#FF6E32] rounded-full animate-pulse"></div>}
          </button>
        ))}
      </div>

      {/* Active Filter Indicator */}
      {selectedStatCard && (
        <div className="mt-4 flex items-center justify-center gap-2 p-2 bg-[#E2E3FF] rounded-lg">
          <span className="text-sm text-[#303030]">
            Filtering by: <strong>{cards.find((c) => c.type === selectedStatCard)?.title}</strong>
          </span>
          <button
            onClick={() => onStatCardClick(null)}
            className="text-xs text-[#FF6E32] hover:text-[#E55A2B] font-medium"
          >
            Clear Filter
          </button>
        </div>
      )}
    </div>
  )
}
