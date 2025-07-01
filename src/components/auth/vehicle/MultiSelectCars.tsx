"use client"

import { useState } from "react"
import { ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

// Define car data structure with groups
interface CarGroup {
  label: string
  cars: Car[]
}
interface Car {
  value: string
  label: string
}
// Car data
const carGroups: CarGroup[] = [
  {
    label: "Swedish Cars",
    cars: [
      { value: "volvo", label: "Volvo" },
      { value: "saab", label: "Saab" },
      { value: "koenigsegg", label: "Koenigsegg" },
    ],
  },
  {
    label: "German Cars",
    cars: [
      { value: "mercedes", label: "Mercedes" },
      { value: "audi", label: "Audi" },
      { value: "bmw", label: "BMW" },
      { value: "porsche", label: "Porsche" },
    ],
  },
  {
    label: "Italian Cars",
    cars: [
      { value: "ferrari", label: "Ferrari" },
      { value: "lamborghini", label: "Lamborghini" },
      { value: "maserati", label: "Maserati" },
    ],
  },
]

// Flatten car data for easier lookup
const allCars = carGroups.flatMap((group) => group.cars)

interface MultiSelectCarsProps {
  onSelectionChange?: (selectedValues: string[]) => void
}

export default function MultiSelectCars({ onSelectionChange }: MultiSelectCarsProps) {
  const [open, setOpen] = useState(false)
  const [selectedValues, setSelectedValues] = useState<string[]>([])

  const handleSelect = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value]

    setSelectedValues(newSelectedValues)
    onSelectionChange?.(newSelectedValues)
  }

  const handleSelectGroup = (groupCars: Car[]) => {
    const groupValues = groupCars.map((car) => car.value)
    const allSelected = groupValues.every((value) => selectedValues.includes(value))

    let newSelectedValues: string[]

    if (allSelected) {
      // If all are selected, unselect all from this group
      newSelectedValues = selectedValues.filter((value) => !groupValues.includes(value))
    } else {
      // Otherwise, select all from this group that aren't already selected
      const valuesToAdd = groupValues.filter((value) => !selectedValues.includes(value))
      newSelectedValues = [...selectedValues, ...valuesToAdd]
    }

    setSelectedValues(newSelectedValues)
    onSelectionChange?.(newSelectedValues)
  }

  const handleRemove = (value: string) => {
    const newSelectedValues = selectedValues.filter((item) => item !== value)
    setSelectedValues(newSelectedValues)
    onSelectionChange?.(newSelectedValues)
  }

  const handleClearAll = () => {
    setSelectedValues([])
    onSelectionChange?.([])
  }

  const selectedCars = selectedValues
    .map((value) => allCars.find((car) => car.value === value))
    .filter(Boolean) as Car[]

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-10"
          >
            <div className="flex flex-wrap gap-1 py-1">
              {selectedCars.length > 0 ? (
                selectedCars.map((car) => (
                  <Badge key={car.value} variant="secondary" className="mr-1 mb-1">
                    {car.label}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRemove(car.value)
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onClick={() => handleRemove(car.value)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {car.label}</span>
                    </button>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">Select cars...</span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search cars..." className="h-9" />
            <CommandList>
              <CommandEmpty>No car found.</CommandEmpty>
              <div className="max-h-[300px] overflow-auto">
                {carGroups.map((group) => (
                  <CommandGroup key={group.label} heading={group.label}>
                    <CommandItem
                      onSelect={() => handleSelectGroup(group.cars)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={group.cars.every((car) => selectedValues.includes(car.value))}
                        className="data-[state=checked]:bg-primary"
                        aria-label={`Select all ${group.label}`}
                      />
                      <span className="font-medium">Select All {group.label}</span>
                    </CommandItem>
                    {group.cars.map((car) => (
                      <CommandItem
                        key={car.value}
                        onSelect={() => handleSelect(car.value)}
                        className="pl-8 flex items-center gap-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedValues.includes(car.value)}
                          className="data-[state=checked]:bg-primary"
                          aria-label={`Select ${car.label}`}
                        />
                        <span>{car.label}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
              </div>
            </CommandList>
            {selectedValues.length > 0 && (
              <div className="border-t p-2">
                <Button variant="ghost" size="sm" className="w-full justify-center text-xs" onClick={handleClearAll}>
                  Clear all selections
                </Button>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>

      {selectedValues.length > 0 && (
        <div className="text-sm">
          <p>Selected cars ({selectedValues.length}):</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {selectedCars.map((car) => (
              <Badge key={car.value} variant="outline">
                {car.label}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
