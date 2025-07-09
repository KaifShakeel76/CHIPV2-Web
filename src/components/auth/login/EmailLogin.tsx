"use client"

import { memo, useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

import { useLoginFormValidation } from "@/components/auth/hooks/useFormValidation"
import { emailLoginSchema, type EmailLoginForm } from "@/components/auth/schemas/validationSchemas"
import { handleApiError } from "@/lib/errorHandling"
import EmailInputField from "@/components/shared/EmailInputField"
import PasswordInputField from "@/components/shared/PasswordInputField"
import { useLoginWithEmailMutation } from "@/features/auth/authApiSlice"

interface EmailLoginProps {
  onForgotPassword: () => void
}

const EmailLogin = memo(function EmailLogin({ onForgotPassword }: EmailLoginProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loginWithEmail] = useLoginWithEmailMutation()
  
  // Use optimized form validation hook
  const {
    watch,
    handleFieldChange,
    handleValidatedSubmit,
    getFieldError,
    isFieldValid,
    
    isSubmitting,
  } = useLoginFormValidation<EmailLoginForm>(emailLoginSchema, {
    email: "",
    password: ""
  })

  // Memoized form values
  const { email: emailValue, password: passwordValue } = watch()


  // Optimized submission handler
  const onSubmit = useCallback(async (data: EmailLoginForm) => {
    try {
      setIsLoading(true)
      
      const response = await loginWithEmail({
        email: data.email,
        password: data.password,
      }).unwrap()

      // RTK Query automatically handles Redux state via authSlice matchers
      
      // Check user approval status after email login success
      try {
        const userId = response.user?.id
        if (userId && response.token) {
          const userDetailsResponse = await fetch(`/auth/user-details/${userId}`, {
            headers: {
              'Authorization': `Bearer ${response.token}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (userDetailsResponse.ok) {
            const userDetails = await userDetailsResponse.json()
            
            if (userDetails.success && userDetails.data.approvalStatus.status === 'pending') {
              // Store user details and redirect to approval page
              localStorage.setItem('userApprovalStatus', 'pending')
              localStorage.setItem('userId', userId)
              navigate('/user-details')
              return
            } else if (userDetails.success && userDetails.data.approvalStatus.status === 'approved') {
              // User is approved, proceed to dashboard
              localStorage.setItem('userApprovalStatus', 'approved')
              localStorage.setItem('userId', userId)
              navigate('/dashboard')
              return
            }
          }
        }
      } catch (approvalCheckError) {
        console.error('Error checking approval status:', approvalCheckError)
        // Fallback: proceed to dashboard if approval check fails
        navigate("/dashboard")
        return
      }
      
      // Fallback: Navigate to dashboard if no approval check
      navigate("/dashboard")
      
    } catch (error) {
      handleApiError(error, 'login')
    } finally {
      setIsLoading(false)
    }
  }, [loginWithEmail, navigate])

  // Memoized field change handlers
  const handleEmailChange = useCallback(
    handleFieldChange("email"),
    [handleFieldChange]
  )

  const handlePasswordChange = useCallback(
    handleFieldChange("password"),
    [handleFieldChange]
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-md text-muted-foreground mb-2">
          Email <span className="text-destructive">*</span>
        </label>
        
        <EmailInputField
          value={emailValue}
          onChange={handleEmailChange}
          className={!isFieldValid("email") ? "border-destructive focus:ring-destructive" : ""}
          placeholder="Enter your email address"
          aria-invalid={!isFieldValid("email")}
          aria-describedby={getFieldError("email") ? "email-error" : undefined}
        />
        
        {getFieldError("email") && (
          <p id="email-error" className="text-xs text-destructive mt-1 ml-1" role="alert">
            {getFieldError("email")}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-md text-muted-foreground">
          Password <span className="text-destructive">*</span>
        </label>
        
        <PasswordInputField
          value={passwordValue}
          onChange={handlePasswordChange}
          className={!isFieldValid("password") ? "border-destructive focus:ring-destructive" : ""}
          placeholder="Enter your password"
          aria-invalid={!isFieldValid("password")}
          aria-describedby={getFieldError("password") ? "password-error" : undefined}
        />
        
        {getFieldError("password") && (
          <p id="password-error" className="text-xs text-destructive mt-1 ml-1" role="alert">
            {getFieldError("password")}
          </p>
        )}
      </div>

      <div className="text-right">
        <p className="text-right text-sm mt-2">
          <button
            type="button"
            className="text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded"
            onClick={onForgotPassword}
            tabIndex={0}
          >
            Forgot Password?
          </button>
        </p>
      </div>
      
      <Button 
        className="w-full py-5 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium rounded-xl" 
        type="button"
        onClick={handleValidatedSubmit(onSubmit)}
        disabled={isSubmitting || isLoading}
        aria-describedby="login-button-description"
      >
        {(isSubmitting || isLoading) ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Signing in...
          </span>
        ) : (
          "Login"
        )}
      </Button>
      
      <div id="login-button-description" className="sr-only">
        Click to login. Form will validate and show specific error messages if needed.
      </div>
    </div>
  )
})

export default EmailLogin

