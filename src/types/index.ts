export interface User {
    id: number
    name: string
    department: string
    geography: string
    status: "pending" | "active" | "rejected" | "inactive"
    email?: string
  }
  
  export interface NavigationItem {
    id: string
    title: string
    icon: string
    isActive?: boolean
    hasNotification?: boolean
    notificationCount?: number
    subItems?: NavigationSubItem[]
    isExpanded?: boolean
  }
  
  export interface NavigationSubItem {
    id: string
    title: string
    isActive?: boolean
    hasNotification?: boolean
    notificationCount?: number
  }
  
  export interface FilterOption {
    label: string
    value: string
  }
  
  export interface StatsCard {
    title: string
    value: number
    color?: string
  }
  
  export interface TableColumn {
    key: string
    title: string
    sortable?: boolean
  }
  