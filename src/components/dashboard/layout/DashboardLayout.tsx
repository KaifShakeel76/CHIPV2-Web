"use client"

import { type ReactNode, useState } from "react"
import { DashboardSidebar } from "./DashboardSidebar"
import { DashboardHeader } from "./DashboardHeader"
import { SidebarProvider } from "@/components/ui/sidebar"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <SidebarProvider defaultOpen open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex h-screen w-full bg-background text-foreground">
       
        <DashboardSidebar />

       
        <div className="flex flex-col flex-1 overflow-hidden">
     
          <DashboardHeader />

         
          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
