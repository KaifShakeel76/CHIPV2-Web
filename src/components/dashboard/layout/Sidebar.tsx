"use client"

import { useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, LayoutDashboard, Database, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { NavigationItem } from "@/types"


interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
  className?: string
}

const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: "dashboard",
    isExpanded: true,
    subItems: [
      { id: "overview", title: "Overview" },
      { id: "application-users", title: "Application Users", isActive: true },
      { id: "dashboard-users", title: "Dashboard Users" },
    ],
  },
  {
    id: "master-data",
    title: "Master Data",
    icon: "database",
    isExpanded: true,
    subItems: [
      { id: "overview-md", title: "Overview" },
      { id: "geography", title: "Geography" },
      { id: "facilities", title: "Facilities" },
    ],
  },
  {
    id: "administration",
    title: "Administration Panel",
    icon: "admin",
    isExpanded: true,
    subItems: [
      { id: "admin", title: "Admin" },
      { id: "super-admin", title: "Super Admin", hasNotification: true, notificationCount: 2 },
    ],
  },
]

export function Sidebar({ collapsed = false, onToggle, className }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(["dashboard", "master-data", "administration"])

  const toggleExpanded = (itemId: string) => {
    if (!collapsed) {
      setExpandedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
    }
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "dashboard":
        return <LayoutDashboard className="w-6 h-6" />
      case "database":
        return <Database className="w-6 h-6" />
      case "admin":
        return <Shield className="w-6 h-6" />
      default:
        return <LayoutDashboard className="w-6 h-6" />
    }
  }

  return (
    <div
      className={cn(
        "relative flex flex-col bg-white rounded-2xl transition-all duration-300 h-[calc(100vh-1rem)] overflow-y-auto pl-4",
        collapsed ? "w-24" : "w-96",
        className,
      )}
    >
      {/* Logo Section */}
      <div className={cn("flex flex-col items-center gap-1 transition-all duration-300", collapsed ? "p-3" : "p-5")}>
        {collapsed ? (
          <h1 className="text-2xl font-semibold text-[#182E6F]">CHIP</h1>
        ) : (
          <>
            <h1 className="text-4xl font-semibold text-[#182E6F] leading-[47px]">CHIP</h1>
            <p className="text-xl font-semibold text-[#182E6F] leading-[26px]">Dashboard</p>
          </>
        )}
      </div>

      {/* Divider */}
      <div className="mx-2 h-px bg-gray-200" />

      {/* Main Menu */}
      <div className="flex-1 p-0 min-h-0">
        {/* Main Menu Label */}
        <div className={cn("px-5 py-2 flex items-center", collapsed && "justify-center px-2")}>
          <span className={cn("text-xs text-gray-400", collapsed && "hidden")}>MAIN MENU</span>
          {collapsed && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">MAIN MENU</span>
            </div>
          )}
        </div>

        <div className="mx-2 h-px bg-gray-200" />

        <div className={cn("p-0 space-y-3 mt-2", collapsed && "px-2")}>
          {navigationItems.map((item) => (
            <div key={item.id} className="mx-0">
              {/* Main Menu Item */}
              <button
                onClick={() => toggleExpanded(item.id)}
                className={cn(
                  "w-full flex items-center justify-between rounded-lg hover:bg-gray-50 transition-colors",
                  collapsed ? "p-3 mx-0 justify-center" : "p-3 mx-3",
                )}
              >
                <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
                  <div className="text-[#182E6F]">{getIcon(item.icon)}</div>
                  {!collapsed && (
                    <span className="text-lg font-medium text-[#182E6F]">{item.title}</span>
                  )}
                </div>
                {!collapsed && (
                  <ChevronDown
                    className={cn(
                      "w-8 h-8  text-[#182E6F] transition-transform",
                      expandedItems.includes(item.id) ? "rotate-180" : "",
                    )}
                  />
                )}
              </button>

              {/* Sub Menu Items - Hidden when collapsed */}
              {!collapsed && expandedItems.includes(item.id) && item.subItems && (
                <div className="mt-2 space-y-2 px-2">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      className={cn(
                        "w-full flex items-center justify-between p-3 ml-6 rounded-xl transition-colors text-left",
                        subItem.isActive ? "bg-[#182E6F] text-white" : "bg-white hover:bg-gray-50 text-[#303030]",
                      )}
                    >
                      <span className="text-base font-normal">{subItem.title}</span>
                      {subItem.hasNotification && subItem.notificationCount && (
                        <div className="bg-[#FF6E32] text-white text-sm px-3 py-1 rounded-full min-w-[34px] h-7 flex items-center justify-center">
                          {subItem.notificationCount}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Collapse Button - Different arrows for desktop vs mobile */}
      <button
        onClick={onToggle}
        className="absolute flex flex-row justify-center items-center p-0 gap-2.5 w-[36px] h-[36px] bg-[#F6F6F8] rounded-full transition-all duration-300 hover:shadow-md z-[5]"
        style={{
          left: collapsed ? "76px" : "305px",
          top: "131px",
        }}
      >
        {/* Desktop View - Left/Right arrows */}
        <ChevronLeft
          className={cn(
            "hidden md:block w-7 h-7 text-[#FF6E32] transition-transform duration-300",
            collapsed && "rotate-180",
          )}
        />

        {/* Mobile View - Right arrow when collapsed, Left arrow when expanded */}
        <div className="block md:hidden">
          {collapsed ? (
            <ChevronRight className="w-7 h-7 text-[#FF6E32]" />
          ) : (
            <ChevronLeft className="w-7 h-7 text-[#FF6E32]" />
          )}
        </div>
      </button>
    </div>
  )
}
