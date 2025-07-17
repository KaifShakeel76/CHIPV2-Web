"use client"

import { AppLayout } from "@/components/dashboard/layout/AppLayout"
import { MainContent } from "@/components/dashboard/MainContent"

export default function DashboardPage() {
  return (
    // <AppLayout>
    //   <MainContent />
    // </AppLayout>

      <>
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <img 
              src="/coming_soon.jpg" 
              alt="Coming Soon" 
              className="max-w-md w-full h-auto rounded-lg shadow-lg"
            />
            <h1 className="mt-6 text-2xl font-semibold text-gray-800">Dashboard Coming Soon</h1>
            <p className="mt-2 text-gray-600">We're working hard to bring you an amazing dashboard experience.</p>
          </div>
      </>
  )
}
