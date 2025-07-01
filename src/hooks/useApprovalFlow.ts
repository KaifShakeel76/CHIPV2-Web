import { User } from "@/types"
import { useState, useMemo } from "react"


export function useApprovalFlow() {
  const [activeTab, setActiveTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(15)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    userType: "all",
    userLevel: "all",
    state: "all",
    district: "all",
    blockTaluka: "all",
    phcChc: "all",
    subHealthCenter: "all",
  })

  const [activeCategory, setActiveCategory] = useState("All Users")
  const [selectedStatCard, setSelectedStatCard] = useState<string | null>(null)

  // Enhanced mock data with categories
  const mockUsersByCategory = {
    "All Users": [
      // Combine all users from all categories
      ...Array.from({ length: 45 }, (_, i) => ({
        id: i + 1,
        name: `Dr. ${["John", "Sarah", "Michael", "Emily", "David", "Lisa"][i % 6]} ${["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia"][i % 6]}`,
        department: "Medical Officer",
        geography: ["Jaipur, Rajasthan", "Udaipur, Rajasthan", "Jodhpur, Rajasthan", "Kota, Rajasthan"][i % 4],
        status: ["pending", "active", "rejected", "inactive"][i % 4] as User["status"],
      })),
      ...Array.from({ length: 32 }, (_, i) => ({
        id: i + 100,
        name: `Nurse ${["Priya", "Anita", "Sunita", "Kavita", "Meera", "Pooja"][i % 6]} ${["Sharma", "Verma", "Gupta", "Singh", "Kumar", "Patel"][i % 6]}`,
        department: "Staff Nurse",
        geography: ["Jaipur, Rajasthan", "Udaipur, Rajasthan", "Jodhpur, Rajasthan", "Kota, Rajasthan"][i % 4],
        status: ["pending", "active", "rejected", "inactive"][i % 4] as User["status"],
      })),
      ...Array.from({ length: 28 }, (_, i) => ({
        id: i + 200,
        name: `Tech ${["Raj", "Amit", "Sunil", "Anil", "Vinod", "Manoj"][i % 6]} ${["Agarwal", "Jain", "Bansal", "Mittal", "Goel", "Saxena"][i % 6]}`,
        department: "Lab Technician",
        geography: ["Jaipur, Rajasthan", "Udaipur, Rajasthan", "Jodhpur, Rajasthan", "Kota, Rajasthan"][i % 4],
        status: ["pending", "active", "rejected", "inactive"][i % 4] as User["status"],
      })),
      ...Array.from({ length: 22 }, (_, i) => ({
        id: i + 300,
        name: `Pharma ${["Ravi", "Sanjay", "Ajay", "Vijay", "Deepak", "Ashok"][i % 6]} ${["Joshi", "Pandey", "Tiwari", "Dubey", "Mishra", "Yadav"][i % 6]}`,
        department: "Pharmacist",
        geography: ["Jaipur, Rajasthan", "Udaipur, Rajasthan", "Jodhpur, Rajasthan", "Kota, Rajasthan"][i % 4],
        status: ["pending", "active", "rejected", "inactive"][i % 4] as User["status"],
      })),
      ...Array.from({ length: 18 }, (_, i) => ({
        id: i + 400,
        name: `CHO ${["Ramesh", "Suresh", "Mahesh", "Naresh", "Dinesh", "Hitesh"][i % 6]} ${["Choudhary", "Rathore", "Shekhawat", "Bishnoi", "Jangir", "Soni"][i % 6]}`,
        department: "CHO",
        geography: ["Jaipur, Rajasthan", "Udaipur, Rajasthan", "Jodhpur, Rajasthan", "Kota, Rajasthan"][i % 4],
        status: ["pending", "active", "rejected", "inactive"][i % 4] as User["status"],
      })),
      ...Array.from({ length: 35 }, (_, i) => ({
        id: i + 500,
        name: `ANM ${["Sita", "Gita", "Rita", "Nita", "Lata", "Kanta"][i % 6]} ${["Devi", "Kumari", "Bai", "Mata", "Ben", "Begum"][i % 6]}`,
        department: "ANM",
        geography: ["Jaipur, Rajasthan", "Udaipur, Rajasthan", "Jodhpur, Rajasthan", "Kota, Rajasthan"][i % 4],
        status: ["pending", "active", "rejected", "inactive"][i % 4] as User["status"],
      })),
      ...Array.from({ length: 42 }, (_, i) => ({
        id: i + 600,
        name: `ASHA ${["Kamla", "Shanti", "Pushpa", "Usha", "Asha", "Rekha"][i % 6]} ${["Devi", "Kumari", "Bai", "Mata", "Ben", "Begum"][i % 6]}`,
        department: "ASHA",
        geography: ["Jaipur, Rajasthan", "Udaipur, Rajasthan", "Jodhpur, Rajasthan", "Kota, Rajasthan"][i % 4],
        status: ["pending", "active", "rejected", "inactive"][i % 4] as User["status"],
      })),
    ],
    "Medical Officer": Array.from({ length: 45 }, (_, i) => ({
      id: i + 1,
      name: `Dr. ${["John", "Sarah", "Michael", "Emily", "David", "Lisa"][i % 6]} ${["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia"][i % 6]}`,
      department: "Medical Officer",
      geography: ["Jaipur, Rajasthan", "Udaipur, Rajasthan", "Jodhpur, Rajasthan", "Kota, Rajasthan"][i % 4],
      status: ["pending", "active", "rejected", "inactive"][i % 4] as User["status"],
    })),
    "Staff Nurse": Array.from({ length: 32 }, (_, i) => ({
      id: i + 100,
      name: `Nurse ${["Priya", "Anita", "Sunita", "Kavita", "Meera", "Pooja"][i % 6]} ${["Sharma", "Verma", "Gupta", "Singh", "Kumar", "Patel"][i % 6]}`,
      department: "Staff Nurse",
      geography: ["Jaipur, Rajasthan", "Udaipur, Rajasthan", "Jodhpur, Rajasthan", "Kota, Rajasthan"][i % 4],
      status: ["pending", "active", "rejected", "inactive"][i % 4] as User["status"],
    })),
    "Lab Technician": Array.from({ length: 28 }, (_, i) => ({
      id: i + 200,
      name: `Tech ${["Raj", "Amit", "Sunil", "Anil", "Vinod", "Manoj"][i % 6]} ${["Agarwal", "Jain", "Bansal", "Mittal", "Goel", "Saxena"][i % 6]}`,
      department: "Lab Technician",
      geography: ["Jaipur, Rajasthan", "Udaipur, Rajasthan", "Jodhpur, Rajasthan", "Kota, Rajasthan"][i % 4],
      status: ["pending", "active", "rejected", "inactive"][i % 4] as User["status"],
    })),
    Pharmacist: Array.from({ length: 22 }, (_, i) => ({
      id: i + 300,
      name: `Pharma ${["Ravi", "Sanjay", "Ajay", "Vijay", "Deepak", "Ashok"][i % 6]} ${["Joshi", "Pandey", "Tiwari", "Dubey", "Mishra", "Yadav"][i % 6]}`,
      department: "Pharmacist",
      geography: ["Jaipur, Rajasthan", "Udaipur, Rajasthan", "Jodhpur, Rajasthan", "Kota, Rajasthan"][i % 4],
      status: ["pending", "active", "rejected", "inactive"][i % 4] as User["status"],
    })),
    CHO: Array.from({ length: 18 }, (_, i) => ({
      id: i + 400,
      name: `CHO ${["Ramesh", "Suresh", "Mahesh", "Naresh", "Dinesh", "Hitesh"][i % 6]} ${["Choudhary", "Rathore", "Shekhawat", "Bishnoi", "Jangir", "Soni"][i % 6]}`,
      department: "CHO",
      geography: ["Jaipur, Rajasthan", "Udaipur, Rajasthan", "Jodhpur, Rajasthan", "Kota, Rajasthan"][i % 4],
      status: ["pending", "active", "rejected", "inactive"][i % 4] as User["status"],
    })),
    ANM: Array.from({ length: 35 }, (_, i) => ({
      id: i + 500,
      name: `ANM ${["Sita", "Gita", "Rita", "Nita", "Lata", "Kanta"][i % 6]} ${["Devi", "Kumari", "Bai", "Mata", "Ben", "Begum"][i % 6]}`,
      department: "ANM",
      geography: ["Jaipur, Rajasthan", "Udaipur, Rajasthan", "Jodhpur, Rajasthan", "Kota, Rajasthan"][i % 4],
      status: ["pending", "active", "rejected", "inactive"][i % 4] as User["status"],
    })),
    ASHA: Array.from({ length: 42 }, (_, i) => ({
      id: i + 600,
      name: `ASHA ${["Kamla", "Shanti", "Pushpa", "Usha", "Asha", "Rekha"][i % 6]} ${["Devi", "Kumari", "Bai", "Mata", "Ben", "Begum"][i % 6]}`,
      department: "ASHA",
      geography: ["Jaipur, Rajasthan", "Udaipur, Rajasthan", "Jodhpur, Rajasthan", "Kota, Rajasthan"][i % 4],
      status: ["pending", "active", "rejected", "inactive"][i % 4] as User["status"],
    })),
  }

  // Get current category users
  const currentCategoryUsers = mockUsersByCategory[activeCategory as keyof typeof mockUsersByCategory] || []

  const filteredUsers = useMemo(() => {
    let users = currentCategoryUsers

    // Apply stat card filter if selected
    if (selectedStatCard) {
      switch (selectedStatCard) {
        case "pending":
          users = users.filter((user) => user.status === "pending")
          break
        case "approved":
          users = users.filter((user) => user.status === "active")
          break
        case "inactive":
          users = users.filter((user) => user.status === "inactive")
          break
        default:
          break
      }
    }

    return users.filter((user) => {
      if (activeTab !== "all") {
        const statusMap = {
          "approval-pending": "pending",
          "registered-approved": "active",
          inactive: "inactive",
        }
        if (user.status !== statusMap[activeTab as keyof typeof statusMap]) {
          return false
        }
      }

      if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      return true
    })
  }, [currentCategoryUsers, activeTab, searchQuery, filters, selectedStatCard])

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredUsers, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const stats = useMemo(() => {
    if (activeCategory === "All Users") {
      // Calculate totals across all categories
      const allExpected = 50 + 35 + 30 + 25 + 20 + 40 + 45 // Sum of all expected values
      const allUsers = Object.values(mockUsersByCategory)
        .flat()
        .filter((user) => user.department !== "All Users")
      const approved = allUsers.filter((u) => u.status === "active").length
      const pending = allUsers.filter((u) => u.status === "pending").length
      const inactive = allUsers.filter((u) => u.status === "inactive").length

      return { expected: allExpected, approved, pending, inactive }
    } else {
      const expected =
        {
          "Medical Officer": 50,
          "Staff Nurse": 35,
          "Lab Technician": 30,
          Pharmacist: 25,
          CHO: 20,
          ANM: 40,
          ASHA: 45,
        }[activeCategory] || 20

      const approved = currentCategoryUsers.filter((u) => u.status === "active").length
      const pending = currentCategoryUsers.filter((u) => u.status === "pending").length
      const inactive = currentCategoryUsers.filter((u) => u.status === "inactive").length

      return { expected, approved, pending, inactive }
    }
  }, [currentCategoryUsers, activeCategory])

  return {
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
    filteredUsers,
    paginatedUsers,
    totalPages,
    stats,
    activeCategory,
    setActiveCategory,
    selectedStatCard,
    setSelectedStatCard,
  }
}
