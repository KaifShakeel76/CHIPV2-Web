"use client"

import type React from "react"

// src/components/ui/PhoneInput.tsx

import { Input } from "@/components/ui/input"

interface PhoneInputProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function PhoneInput({
  value,
  onChange,
  placeholder = "Enter your mobile number",
  disabled = false,
}: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "") // remove non-digits

    // ✅ Starts with 6-9 and up to 10 digits
    if (val === "" || (/^[6-9]/.test(val) && val.length <= 10)) {
      onChange(val)
    }
  }

  return (
    <Input
      type="tel"
      inputMode="numeric"
      pattern="[6-9]{1}[0-9]{9}"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className="bg-input pr-10"
      disabled={disabled}
    />
  )
}
