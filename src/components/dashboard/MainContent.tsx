import { useApprovalFlow } from "@/hooks/useApprovalFlow"
import { DataTable } from "./DataTable"
import { FilterSection } from "./FilterSection"
import { StatsCards } from "./StatsCards"

interface MainContentProps {
  className?: string
}

// eslint-disable-next-line no-empty-pattern
export function MainContent({ }: MainContentProps) {
  const {
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    paginatedUsers,
    totalPages,
    stats,
    activeCategory,
    setActiveCategory,
    selectedStatCard,
    setSelectedStatCard,
  } = useApprovalFlow()

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleDownload = () => {
    console.log("Downloading data...")
  }

  return (
    <div className="flex flex-col gap-2 flex-1">
      {/* Filters */}
      <FilterSection filters={filters} onFilterChange={handleFilterChange} />

      {/* Stats Cards */}
      <StatsCards
        stats={stats}
        activeCategory={activeCategory}
        selectedStatCard={selectedStatCard}
        onCategoryChange={setActiveCategory}
        onStatCardClick={setSelectedStatCard}
      />

      {/* Data Table */}
      <DataTable
        data={paginatedUsers}
        totalItems={paginatedUsers.length}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
        activeTab={activeTab}
        searchQuery={searchQuery}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
        onTabChange={setActiveTab}
        onSearch={setSearchQuery}
        onDownload={handleDownload}
      />
    </div>
  )
}