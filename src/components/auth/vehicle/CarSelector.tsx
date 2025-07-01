"use client"

import { useState, type FormEvent } from "react"

export default function CarSelector() {
  const [selectedCar, setSelectedCar] = useState("")

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert(`You selected: ${selectedCar}`)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">The optgroup element</h1>
      <p className="mb-4">The optgroup tag is used to group related options in a drop-down list:</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cars" className="block mb-2">
            Choose a car:
          </label>
          <select
            name="cars"
            id="cars"
            value={selectedCar}
            onChange={(e) => setSelectedCar(e.target.value)}
            className="w-full max-w-xs p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a car</option>
            <optgroup label="Swedish Cars">
              <option value="volvo">Volvo</option>
              <option value="saab">Saab</option>
            </optgroup>
            <optgroup label="German Cars">
              <option value="mercedes">Mercedes</option>
              <option value="audi">Audi</option>
            </optgroup>
          </select>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-[var(--white)] rounded-md hover:bg-blue-700">
          Submit
        </button>
      </form>

      {selectedCar && (
        <p className="mt-4">
          You selected: <strong>{selectedCar}</strong>
        </p>
      )}
    </div>
  )
}
