// src/config/auth.config.ts
export const AUTH_CONFIG = {
  // Routes
  ROUTES: {
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password'
  },

  // OTP Configuration
  OTP: {
    LENGTH: 6,
    RESEND_TIMER: 60,
    MAX_ATTEMPTS: 3,
    BLOCK_DURATION: 300, // 5 minutes in seconds
    WHATSAPP_RESEND_TIMER: 30,
    EMAIL_RESEND_TIMER: 60
  },

  // Validation Rules
  VALIDATION: {
    PHONE: {
      LENGTH: 10,
      PATTERN: /^[6-9]/,
      FULL_PATTERN: /^[6-9]\d{9}$/
    },
    EMAIL: {
      PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    PASSWORD: {
      MIN_LENGTH: 8,
      PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
    }
  },

  // UI Messages
  MESSAGES: {
    WELCOME: "Welcome Back to CHIP Dashboard.",
    LOGIN_WITH: "Login with",
    OTP_SENT: "We have sent a 6 digit OTP code to",
    OTP_RESEND: "Resend OTP",
    OTP_RESEND_TIMER: "Resend OTP in 00:",
    CHANGE: "🔄 Change",
    VERIFYING: "Verifying OTP...",
    SENDING_OTP: "Sending OTP...",
    BLOCKED: "Too many failed attempts. You are blocked for {minutes} minutes.",
    INVALID_OTP: "Invalid OTP code. {attempts} attempts remaining.",
    OTP_EXPIRED: "OTP has expired. Please request a new one.",
    VERIFICATION_SUCCESS: "{field} verified successfully!",
    FORM_ERRORS: {
      REQUIRED_FIELD: "This field is required",
      INVALID_EMAIL: "Please enter a valid email address",
      INVALID_PHONE: "Enter a valid 10-digit mobile number",
      PHONE_START_DIGIT: "Mobile number must start with 6, 7, 8, or 9",
      PASSWORD_MISMATCH: "Passwords do not match",
      FILL_ALL_FIELDS: "Please fill in all required fields"
    }
  },

  // Registration Steps
  REGISTRATION_STEPS: [
    { step: 1, label: "Verification", iconType: "verification" },
    { step: 2, label: "User Details", iconType: "geo" },
    { step: 3, label: "Personal Info", iconType: "pi" },
    { step: 4, label: "Approval", iconType: "approval" }
  ],

  // Token Management
  TOKEN: {
    REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes in milliseconds
    STORAGE_KEY: 'auth_tokens',
    EXPIRY_BUFFER: 30 * 1000 // 30 seconds buffer
  },

  // UI Styling (to be replaced with design system later)
  STYLES: {
    BUTTONS: {
      PRIMARY: "w-full py-5 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium rounded-xl",
      SECONDARY: "bg-background hover:bg-secondary text-foreground border border-border",
      OTP_SEND: "bg-primary hover:bg-primary/90 text-background font-medium rounded-lg h-10 px-6 min-w-[120px] whitespace-nowrap"
    },
    INPUTS: {
      DEFAULT: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
      ERROR: "border-destructive focus:ring-destructive",
      DISABLED: "bg-background pr-10 py-6 font-semibold"
    }
  }
} as const

// Helper function to format messages with placeholders
export const formatMessage = (message: string, params: Record<string, string | number>): string => {
  return Object.entries(params).reduce(
    (msg, [key, value]) => msg.replace(new RegExp(`{${key}}`, 'g'), String(value)),
    message
  )
}

// Validation helpers
export const validatePhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '')
  return digits.length === AUTH_CONFIG.VALIDATION.PHONE.LENGTH && 
         AUTH_CONFIG.VALIDATION.PHONE.PATTERN.test(digits)
}

export const validateEmail = (email: string): boolean => {
  return AUTH_CONFIG.VALIDATION.EMAIL.PATTERN.test(email)
}

export const formatPhoneDisplay = (phone: string): string => {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  return phone
}
