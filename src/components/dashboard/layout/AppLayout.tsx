"use client"

import type React from "react"
import { useEffect, useState } from "react"


import { useLayout } from "@/hooks/useLayout"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

interface AppLayoutProps {
  children?: React.ReactNode
  className?: string
}

export function AppLayout({ children }: AppLayoutProps) {
  const { sidebarCollapsed, toggleSidebar } = useLayout()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <div className="min-h
    -screen bg-gray-50 p-2 flex gap-2.5 relative">
      {isMobile && !sidebarCollapsed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleSidebar} />
      )}
      <div
        className={`
        ${isMobile ? "fixed left- top-2 z-50" : "relative"}
        ${isMobile && sidebarCollapsed ? "transform -translate-x-full" : ""}
        transition-transform duration-300
      `}
      >
        <Sidebar collapsed={isMobile ? false : sidebarCollapsed} onToggle={toggleSidebar} />
      </div>

      <div
        className={`
        flex-1 flex flex-col gap-2 transition-all duration-300
        ${isMobile ? "w-full" : ""}
        ${isMobile && !sidebarCollapsed ? "opacity-50" : ""}
      `}
      >
        {/* Header */}
        <Header
          title="Application Users"
          breadcrumbs={[{ label: "Platform Users" }, { label: "Application Users" }]}
          userName="Kane"
        />

        {/* Page Content */}
        {children}
      </div>
    </div>
  )
}
