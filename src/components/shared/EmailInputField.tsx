// src/components/shared/EmailInputField.tsx
"use client"

import { Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { forwardRef } from "react"

interface EmailInputFieldProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  'aria-invalid'?: boolean
  'aria-describedby'?: string
}

const EmailInputField = forwardRef<HTMLInputElement, EmailInputFieldProps>(
  ({
    value,
    onChange,
    placeholder = "Enter your email",
    disabled = false,
    className = "",
    ...props
  }, ref) => {
    return (
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Mail className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          ref={ref}
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full h-10 pl-12 pr-4 bg-input text-sm border border-border rounded-md ${className}`}
          autoComplete="email"
          {...props}
        />
      </div>
    )
  }
)

EmailInputField.displayName = "EmailInputField"

export default EmailInputField
