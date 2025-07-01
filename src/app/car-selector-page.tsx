"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import MultiSelectCars from "@/components/auth/vehicle/MultiSelectCars"

export default function CarSelectorPage() {
  const [selectedCars, setSelectedCars] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`You selected: ${selectedCars.join(", ")}`)
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Car Selection</CardTitle>
          <CardDescription>Select multiple cars from different categories using the dropdown below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="car-select" className="text-sm font-medium">
                Choose cars:
              </label>
              <MultiSelectCars onSelectionChange={setSelectedCars} />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
              >
                Submit Selection
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
