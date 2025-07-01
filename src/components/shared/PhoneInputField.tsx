// src/components/shared/PhoneInputField.tsx
"use client"

import { Smartphone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { forwardRef } from "react"

interface PhoneInputFieldProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  'aria-invalid'?: boolean
  'aria-describedby'?: string
}

const PhoneInputField = forwardRef<HTMLInputElement, PhoneInputFieldProps>(
  ({
    value,
    onChange,
    placeholder = "Enter your mobile number",
    disabled = false,
    className = "",
    ...props
  }, ref) => {

    // ✅ Smart input handler - only allows valid Indian mobile numbers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      
      // Remove all non-digits
      const digitsOnly = inputValue.replace(/\D/g, "")
      
      // If empty, allow it
      if (digitsOnly === "") {
        onChange("")
        return
      }
      
      // Check first digit - only allow 6, 7, 8, 9
      const firstDigit = digitsOnly[0]
      if (firstDigit && !['6', '7', '8', '9'].includes(firstDigit)) {
        // Don't update if first digit is not 6-9
        return
      }
      
      // Limit to 10 digits maximum
      const limitedDigits = digitsOnly.slice(0, 10)
      
      onChange(limitedDigits)
    }

    return (
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Smartphone className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          ref={ref}
          type="tel"
          inputMode="numeric"
          pattern="[6-9][0-9]{9}"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full h-10 pl-12 pr-4 bg-input text-sm border border-border rounded-md ${className}`}
          autoComplete="tel"
          {...props}
        />
      </div>
    )
  }
)

PhoneInputField.displayName = "PhoneInputField"

export default PhoneInputField
