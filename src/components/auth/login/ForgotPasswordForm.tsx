import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { forgotPasswordSchema, type ForgotPasswordData } from "@/lib/validations"
import { useForgotPasswordMutation } from "@/features/auth/authApiSlice"
import EmailInputField from "@/components/shared/EmailInputField"

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export default function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // RTK Query hook - ready for API integration
  const [forgotPassword, { isLoading: isForgotPasswordLoading }] = useForgotPasswordMutation()

  // ✅ React Hook Form with Zod validation
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    trigger,
    getValues
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange", // Validate on change for real-time feedback
    defaultValues: {
      email: ""
    }
  })

  // Watch email value for custom input component
  const emailValue = watch("email")

  // ✅ Handle form submission with proper validation
  const onSubmit = async (data: ForgotPasswordData) => {
    setIsLoading(true)
    
    try {
      console.log("✅ Validated forgot password data:", data)
      
      // TODO: Uncomment when API is ready - Using RTK Query
      // try {
      //   const response = await forgotPassword({ email: data.email }).unwrap()
      //   
      //   console.log('✅ Password reset sent:', response)
      //   setIsSubmitted(true)
      //   toast.success(response.message || "Password reset link sent to your email.")
      //   return
      // } catch (error: any) {
      //   console.error('Forgot password error:', error)
      //   
      //   // Handle specific error responses
      //   if (error.status === 404) {
      //     toast.error('Email address not found. Please check and try again.')
      //   } else if (error.status === 429) {
      //     const retryAfter = error.data?.retryAfter || 300
      //     toast.error(`Too many reset requests. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`)
      //   } else if (error.status === 400) {
      //     toast.error(error.data?.message || 'Invalid email address format.')
      //   } else if (error.status === 500) {
      //     toast.error('Server error. Please try again later.')
      //   } else if (error.status === 'FETCH_ERROR') {
      //     toast.error('Network error. Please check your internet connection.')
      //   } else {
      //     toast.error(error.data?.message || 'Failed to send reset link. Please try again.')
      //   }
      //   return
      // }

      // MOCK IMPLEMENTATION - Remove when API is ready
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // Mock forgot password response
      const mockForgotPasswordResponse = {
        success: true,
        message: "Password reset link sent to your email"
      }
      
      console.log('📧 Mock Forgot Password Response:', mockForgotPasswordResponse)
      
      setIsSubmitted(true)
      toast.success(mockForgotPasswordResponse.message)
      
    } catch (error: any) {
      console.error("Forgot password error:", error)
      
      // Mock error handling (simulate different error scenarios for testing)
      const mockErrorType = Math.random()
      
      if (mockErrorType < 0.2) {
        // Simulate email not found error
        toast.error('Email address not found. Please check and try again.')
      } else if (mockErrorType < 0.3) {
        // Simulate rate limiting error
        toast.error('Too many reset requests. Please try again in 5 minutes.')
      } else if (mockErrorType < 0.4) {
        // Simulate server error
        toast.error('Server error. Please try again later.')
      } else {
        // Default error
        toast.error("Failed to send reset link. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Handle button click - validate and provide feedback
  const handleResetPasswordClick = async () => {
    const currentValues = getValues()
    
    // Check if email is empty
    if (!currentValues.email) {
      toast.error("Please enter your email address")
      // Focus on email field if possible
      document.querySelector('input[type="email"]')?.focus()
      return
    }
    
    // Trigger validation
    const isValid = await trigger()
    
    if (!isValid) {
      // Get specific error message
      const emailError = errors.email?.message
      
      if (emailError) {
        toast.error(`Email: ${emailError}`)
        return
      }
      
      toast.error("Please enter a valid email address")
      return
    }
    
    // If validation passes, submit the form
    handleSubmit(onSubmit)()
  }

  // ✅ Handle real-time validation for custom component
  const handleEmailChange = async (value: string) => {
    setValue("email", value, { shouldValidate: true })
    await trigger("email")
  }

  const handleBackToLogin = () => onBack()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-md text-muted-foreground mb-3">
          Email Address <span className="text-destructive">*</span>
        </label>
        
        {/* ✅ Custom EmailInputField with validation */}
        <EmailInputField
          value={emailValue}
          onChange={handleEmailChange}
          className={errors.email ? "border-destructive focus:ring-destructive" : ""}
          placeholder="Enter your registered email address"
          disabled={isSubmitted}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        
        {/* ✅ Email validation error */}
        {errors.email && (
          <p id="email-error" className="text-xs text-destructive mt-1 ml-1" role="alert">
            {errors.email.message}
          </p>
        )}
        
      </div>

      {/* ✅ Success message */}
      {isSubmitted && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-start gap-3">

            <div>
              <div className="text-green-600">
              We have sent the password reset link to your registered email address. Please check your inbox.
            </div>
              <p className="text-xs text-muted-foreground mt-2">
                Don't see the email? Check your spam folder or try again with a different email address.
              </p>
            </div>
          </div>
        </div>
      )}


      {/* ✅ Submit/Back Button */}
      {!isSubmitted ? (
        <Button
          type="button"
          onClick={handleResetPasswordClick}
          disabled={isLoading || isSubmitting || isForgotPasswordLoading}
          className="w-full py-5 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium rounded-xl"
          aria-describedby="reset-button-description"
        >
          {(isLoading || isSubmitting || isForgotPasswordLoading) ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Sending reset link...
            </span>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={handleBackToLogin}
          className="w-full py-5 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium rounded-xl"
        >
          Back to Login
        </Button>
      )}
      
      <div id="reset-button-description" className="sr-only">
        {Object.keys(errors).length > 0 && "Please fix the errors above before submitting"}
      </div>

      {/* ✅ Back to login link */}
      {!isSubmitted && (
        <div className="text-center text-muted-foreground text-sm mt-6">
         Already have an account?{" "}
          <button
            type="button"
            onClick={handleBackToLogin}
            className="text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded"
          >
            Back to Login
          </button>
        </div>
      )}

      {/* ✅ Additional help for submitted state */}
      {isSubmitted && (
        <div className="text-center space-y-4">
          <div className="text-sm text-muted-foreground">
            Didn't receive the email?
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false)
                setValue("email", "")
              }}
              className="text-sm text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded"
            >
              Try different email
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
