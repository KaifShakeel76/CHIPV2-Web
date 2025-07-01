// src/layout/MainLayout.tsx
import { ReactNode } from "react"
import { DashboardHeader } from "./DashboardHeader"

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader/>
      <main className="flex-1 bg-gray-50 p-4">{children}</main>
    </div>
  )
}

export default MainLayout
