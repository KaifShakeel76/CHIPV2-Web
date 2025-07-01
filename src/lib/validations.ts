// src/lib/validations.ts
import * as z from "zod"

// ✅ Common validation patterns
const phoneRegex = /^[6-9]\d{9}$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
const nameRegex = /^[a-zA-Z\s]+$/

// ✅ Base schemas for reuse
export const phoneSchema = z.string()
  .min(10, "Mobile number must be 10 digits")
  .max(10, "Mobile number must be 10 digits")
  .regex(phoneRegex, "Enter a valid mobile number starting with 6-9")

export const emailSchema = z.string()
  .email("Please enter a valid email address")
  .min(1, "Email is required")

export const passwordSchema = z.string()
  .min(6, "Password must be at least 6 characters")
  .regex(passwordRegex, "Password must contain at least one uppercase letter, one lowercase letter, and one number")

export const nameSchema = z.string()
  .min(1, "Name is required")
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")
  .regex(nameRegex, "Name can only contain letters and spaces")

export const otpSchema = z.string()
  .length(6, "OTP must be 6 digits")
  .regex(/^\d{6}$/, "OTP must contain only numbers")

// ✅ Login schemas
export const emailLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
})

export const emailLoginSimpleSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required")
})

export const mobileLoginSchema = z.object({
  mobile: phoneSchema
})


export const otpVerificationSchema = z.object({
  otp: otpSchema,
  identifier: z.string().min(1, "Phone number or email is required")
})


export const forgotPasswordSchema = z.object({
  email: emailSchema
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
})

// ✅ Registration step schemas
export const step1Schema = z.object({
  mobileNumber: phoneSchema,
  whatsappNumber: phoneSchema,
  email: emailSchema,
})

export const step2Schema = z.object({
  selectedLevel: z.enum(["State", "Division", "District", "Block", "PHC"]),
  state: z.string().min(1, "State is required"),
  division: z.string().optional(),
  district: z.string().optional(),
  block: z.string().optional(),
  sector: z.string().optional(),
  organizationTypeId: z.string().min(1, "Organization type is required"),
  organizationId: z.string().min(1, "Organization is required"),
  designationId: z.string().min(1, "Designation is required"),
})

export const step3Schema = z.object({
  firstName: nameSchema,
  lastName: nameSchema.optional().or(z.literal("")),
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
})

// ✅ Complete registration form schema
export const registrationSchema = z.object({
  // Step 1: Contact Information
  mobileNumber: phoneSchema,
  whatsappNumber: phoneSchema,
  email: emailSchema,
  
  // Step 2: Geographic & Organizational Data
  selectedLevel: z.enum(["State", "Division", "District", "Block", "PHC"], {
    required_error: "Please select your administrative level"
  }),
  state: z.string().min(1, "State is required"),
  division: z.string().optional(),
  district: z.string().optional(),
  block: z.string().optional(),
  sector: z.string().optional(),
  organizationTypeId: z.string().min(1, "Organization type is required"),
  organizationId: z.string().min(1, "Organization is required"),
  designationId: z.string().min(1, "Designation is required"),
  
  // Step 3: Personal Information
  firstName: nameSchema,
  lastName: nameSchema.optional().or(z.literal("")),
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
}).refine((data) => {
  // ✅ Custom validation based on selected level
  const levelIndex = ["State", "Division", "District", "Block", "PHC"].indexOf(data.selectedLevel)
  
  if (levelIndex >= 1 && !data.division) return false
  if (levelIndex >= 2 && !data.district) return false
  if (levelIndex >= 3 && !data.block) return false
  if (levelIndex >= 4 && !data.sector) return false
  
  return true
}, {
  message: "Please fill all required geographic fields for your selected level",
  path: ["selectedLevel"]
})

// ✅ Type exports
export type EmailLoginData = z.infer<typeof emailLoginSchema>
export type EmailLoginSimpleData = z.infer<typeof emailLoginSimpleSchema>
export type MobileLoginData = z.infer<typeof mobileLoginSchema>
export type OtpVerificationData = z.infer<typeof otpVerificationSchema>
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>
export type Step1FormData = z.infer<typeof step1Schema>
export type Step2FormData = z.infer<typeof step2Schema>
export type Step3FormData = z.infer<typeof step3Schema>
export type RegistrationFormData = z.infer<typeof registrationSchema>

// ✅ Utility functions
export const validateField = <T>(schema: z.ZodType<T>, data: unknown): {
  success: boolean
  data?: T
  error?: string
} => {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || "Validation error" }
    }
    return { success: false, error: "Unknown validation error" }
  }
}

export const validateStep = (step: number, data: unknown): {
  success: boolean
  errors?: Record<string, string>
} => {
  let schema: z.ZodType<any>
  
  switch (step) {
    case 1:
      schema = step1Schema
      break
    case 2:
      schema = step2Schema
      break
    case 3:
      schema = step3Schema
      break
    default:
      return { success: false, errors: { general: "Invalid step" } }
  }
  
  try {
    schema.parse(data)
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0] as string] = err.message
        }
      })
      return { success: false, errors }
    }
    return { success: false, errors: { general: "Validation failed" } }
  }
}

// ✅ Password strength checker
export const checkPasswordStrength = (password: string): {
  score: number
  feedback: string[]
  isStrong: boolean
} => {
  const feedback: string[] = []
  let score = 0
  
  if (password.length >= 6) score += 1
  else feedback.push("At least 6 characters")
  
  if (/[a-z]/.test(password)) score += 1
  else feedback.push("One lowercase letter")
  
  if (/[A-Z]/.test(password)) score += 1
  else feedback.push("One uppercase letter")
  
  if (/\d/.test(password)) score += 1
  else feedback.push("One number")
  
  if (/[^a-zA-Z\d]/.test(password)) score += 1
  else feedback.push("One special character (optional)")
  
  return {
    score,
    feedback,
    isStrong: score >= 4
  }
}

// ✅ Phone number formatter
export const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "")
  return digits.slice(0, 10)
}

// ✅ Email validator (additional check)
export const isValidEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success
}

// ✅ Phone validator (additional check)
export const isValidPhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, "")
  return phoneSchema.safeParse(digits).success
}

// ✅ Safe validation function that doesn't throw
export const safeValidate = <T>(schema: z.ZodType<T>, data: unknown): {
  success: boolean
  data?: T
  errors?: z.ZodIssue[]
  firstError?: string
} => {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  return {
    success: false,
    errors: result.error.issues,
    firstError: result.error.issues[0]?.message
  }
}
