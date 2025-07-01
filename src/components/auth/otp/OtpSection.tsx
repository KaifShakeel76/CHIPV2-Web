"use client"

import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { useAppDispatch } from "@/hooks/reduxHooks"
import { setOtpSent } from "@/features/auth/loginTabSlice"

import { CheckCircle } from "lucide-react"
import { useVerifyOtpMutation, useSendOtpMutation, createOtpRequest } from "@/features/auth/authApiSlice"
import EmailInputField from "@/components/shared/EmailInputField"
import PhoneInputField from "@/components/shared/PhoneInputField"

interface OtpSectionProps {
  label: string
  type: "mobile" | "whatsapp" | "email"
  value: string
  verified: boolean
  setVerified: (v: boolean) => void
  showOtpInput: boolean
  setShowOtpInput: (v: boolean) => void
  otp: string[]
  setOtp: (val: string[]) => void
  onVerified?: () => void
  redirectAfterVerify?: string
  mode?: "login" | "default"
  onChange?: (value: string) => void
  sameAsCheckbox?: {
    checked: boolean
    onChange: (checked: boolean) => void
    label: string
  }
}

export function OtpSection({
  label,
  type,
  value,
  verified,
  setVerified,
  showOtpInput,
  setShowOtpInput,
  otp,
  setOtp,
  onVerified,
  redirectAfterVerify,
  mode = "default",
  onChange,
  sameAsCheckbox,
}: OtpSectionProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [resendTrigger, setResendTrigger] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTimer, setBlockTimer] = useState(0)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [rateLimitTimer, setRateLimitTimer] = useState(0)

  // Ref for OTP input focus management
  const otpInputRef = useRef<HTMLInputElement>(null)
  
  // Ref for block timer interval cleanup
  const blockIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Ref for rate limit timer interval cleanup
  const rateLimitIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // RTK Query hooks - ready for API integration  
  const [verifyOtp, { isLoading: isOtpVerifying }] = useVerifyOtpMutation()
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation()

  // Helper function to clear OTP and refocus input
  const clearOtpAndRefocus = () => {
    setOtp(Array(6).fill(""))
    // Focus the first input after clearing
    setTimeout(() => {
      if (otpInputRef.current) {
        otpInputRef.current.focus()
      }
    }, 100)
  }

  const handleSubmitOtp = async () => {
    const fullOtp = otp.join("")
    
    // ✅ Check if user is blocked due to failed attempts
    if (isBlocked) {
      toast.error(`Too many failed attempts. Please try again in ${Math.ceil(blockTimer / 60)} minutes.`)
      return
    }
    
    // ✅ Only validate when we have exactly 6 digits
    if (fullOtp.length === 6 && /^\d{6}$/.test(fullOtp)) {
      setIsVerifying(true)
      
      try {
        // Context-based OTP verification
        const otpId = localStorage.getItem('otpId') || 'stored_otp_id'
        const context = mode === "login" ? "login" : "registration"
        
        // Using RTK Query with Rate Limiting Support
        const verifyRequest = { 
          otpId, 
          otp: fullOtp, 
          type, 
          context: context as 'registration' | 'login' | 'forgot-password'
        }
        
        const response = await verifyOtp(verifyRequest).unwrap()
        
        console.log('✅ OTP verified successfully:', response)
        
        // Handle successful verification
        if (response.token && response.refreshToken && mode === "login") {
          // Handle login authentication
          localStorage.setItem('token', response.token)
          localStorage.setItem('refreshToken', response.refreshToken)
          
          // Check user approval status after login success
          try {
            const userId = response.user?.id
            if (userId) {
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
                  toast.success('Login successful! Please wait for approval.')
                  navigate('/user-details')
                  return
                } else if (userDetails.success && userDetails.data.approvalStatus.status === 'approved') {
                  // User is approved, proceed to dashboard
                  localStorage.setItem('userApprovalStatus', 'approved')
                  localStorage.setItem('userId', userId)
                  toast.success('Login successful!')
                  navigate('/dashboard')
                  return
                }
              }
            }
          } catch (approvalCheckError) {
            console.error('Error checking approval status:', approvalCheckError)
            // Fallback: proceed to dashboard if approval check fails
            toast.success('Login successful!')
            navigate('/dashboard')
            return
          }
        }
        
        toast.success(`${label} verified successfully!`)
        setVerified(true)
        
        // Reset attempt count on success
        setAttemptCount(0)
        
        // Context-specific post-verification actions
        if (mode === "login") {
          dispatch(setOtpSent(false))
          console.log('Login verified - user authenticated')
        } else {
          console.log('Registration verification complete')
        }
        
        onVerified?.()
        
        if (redirectAfterVerify) {
          navigate(redirectAfterVerify)
        }
        
      } catch (error: any) {
        console.error('OTP verification error:', error)
        
        // Comprehensive error handling with Rate Limiting Support
        if (error.status === 401) {
          // Invalid OTP with attempt tracking
          const attemptsRemaining = error.data?.attemptsRemaining ?? 0
          const maxAttempts = error.data?.maxAttempts ?? 3
          
          setAttemptCount(maxAttempts - attemptsRemaining)
          
          if (attemptsRemaining > 0) {
            toast.error(error.data?.message || `Invalid OTP. ${attemptsRemaining} attempts remaining.`)
          } else {
            toast.error('Invalid OTP. No attempts remaining.')
          }
          
          clearOtpAndRefocus()
        } else if (error.status === 423) {
          // Session locked due to too many attempts
          const waitTimeSeconds = error.data?.waitTimeSeconds || 300
          const waitMinutes = Math.ceil(waitTimeSeconds / 60)
          
          setIsBlocked(true)
          setBlockTimer(waitTimeSeconds)
          toast.error(`Too many failed attempts. You are blocked for ${waitMinutes} minutes.`)
          clearOtpAndRefocus()
          
          // Clear any existing block timer
          if (blockIntervalRef.current) {
            clearInterval(blockIntervalRef.current)
          }
          
          // Start countdown timer
          blockIntervalRef.current = setInterval(() => {
            setBlockTimer(prev => {
              if (prev <= 1) {
                if (blockIntervalRef.current) {
                  clearInterval(blockIntervalRef.current)
                  blockIntervalRef.current = null
                }
                setIsBlocked(false)
                setAttemptCount(0)
                setCanResend(true) // Enable resend button after block ends
                return 0
              }
              return prev - 1
            })
          }, 1000)
        } else if (error.status === 429) {
          // Rate limited - too many attempts
          const retryAfter = error.data?.retryAfter || 300
          const waitMinutes = Math.ceil(retryAfter / 60)
          
          setIsBlocked(true)
          setBlockTimer(retryAfter)
          toast.error(`Too many failed attempts. OTP session expired. Please request a new OTP after ${waitMinutes} minutes.`)
          setShowOtpInput(false)
          clearOtpAndRefocus()
        } else if (error.status === 410) {
          // OTP Expired
          toast.error(error.data?.message || 'OTP has expired. Please request a new one.')
          setShowOtpInput(false) // Return to Send OTP view
          clearOtpAndRefocus()
        } else if (error.status === 404) {
          toast.error('OTP session not found. Please request a new OTP.')
          setShowOtpInput(false)
        } else if (error.status === 500) {
          toast.error('Server error. Please try again later.')
        } else if (error.status === 'FETCH_ERROR') {
          toast.error('Network error. Please check your internet connection.')
        } else {
          toast.error(error.data?.message || 'OTP verification failed. Please try again.')
        }
      } finally {
        setIsVerifying(false)
      }
    }
    // ✅ Don't show error for incomplete OTP (less than 6 digits)
  }

  // ✅ Only trigger validation when OTP is complete (6 digits)
  useEffect(() => {
    if (otp.every((digit) => digit !== "") && otp.length === 6) {
      handleSubmitOtp()
    }
  }, [otp])

  useEffect(() => {
    // Don't start resend timer if user is blocked or rate limited
    if (isBlocked || isRateLimited) {
      return
    }
    
    setTimer(60)
    setCanResend(false)
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdown)
          setCanResend(true)
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(countdown)
  }, [resendTrigger, isBlocked, isRateLimited])

  // Check for existing rate limit on component mount
  useEffect(() => {
    const context = mode === "login" ? "login" : "registration"
    const storedLimit = localStorage.getItem(`otpRateLimit_${type}_${context}`)
    
    if (storedLimit) {
      try {
        const { expiryTime } = JSON.parse(storedLimit)
        const remaining = Math.max(0, Math.ceil((expiryTime - Date.now()) / 1000))
        
        if (remaining > 0) {
          setIsRateLimited(true)
          setRateLimitTimer(remaining)
          
          // Start countdown timer
          rateLimitIntervalRef.current = setInterval(() => {
            setRateLimitTimer(prev => {
              if (prev <= 1) {
                if (rateLimitIntervalRef.current) {
                  clearInterval(rateLimitIntervalRef.current)
                  rateLimitIntervalRef.current = null
                }
                setIsRateLimited(false)
                localStorage.removeItem(`otpRateLimit_${type}_${context}`)
                return 0
              }
              return prev - 1
            })
          }, 1000)
        } else {
          localStorage.removeItem(`otpRateLimit_${type}_${context}`)
        }
      } catch (error) {
        localStorage.removeItem(`otpRateLimit_${type}_${context}`)
      }
    }
  }, [type, mode])

  // Cleanup timers on component unmount
  useEffect(() => {
    return () => {
      if (blockIntervalRef.current) {
        clearInterval(blockIntervalRef.current)
        blockIntervalRef.current = null
      }
      if (rateLimitIntervalRef.current) {
        clearInterval(rateLimitIntervalRef.current)
        rateLimitIntervalRef.current = null
      }
    }
  }, [])

  const handleSendOTP = async () => {
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) return toast.error("Please enter a valid email.")
    } else {
      const digits = value.replace(/\D/g, "")
      if (digits.length !== 10 || !/^[6-9]/.test(digits)) {
        return toast.error(`Enter a valid 10-digit ${label.toLowerCase()}`)
      }
    }

    try {
      // ✅ Context-based OTP sending with context included
      const context = mode === "login" ? "login" : "registration"
      
      // TODO: Uncomment when API is ready
      // const otpRequest = createOtpRequest(type, value, context)
      // const response = await sendOtp(otpRequest).unwrap()
      // localStorage.setItem('otpId', response.otpId)
      // console.log('✅ Send OTP Response:', response)

      // MOCK IMPLEMENTATION - Remove when API is ready
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const mockSendOtpResponse = {
        success: true,
        message: `${context.charAt(0).toUpperCase() + context.slice(1)} OTP sent successfully`,
        otpId: `mock_${context}_otp_${Date.now()}_${value}`
      }
      
      // Store mock otpId for verification
      localStorage.setItem('otpId', mockSendOtpResponse.otpId)
      
      console.log(`📤 Mock ${context.charAt(0).toUpperCase() + context.slice(1)} Send OTP Response:`, mockSendOtpResponse)
      
      setShowOtpInput(true)
      setOtp(Array(6).fill(""))
      setResendTrigger((prev) => prev + 1)
      toast.success(mockSendOtpResponse.message)
      
    } catch (error: any) {
      console.error('Send OTP error:', error)
      
      // Context-specific error handling
      const context = mode === "login" ? "login" : "registration"
      
      if (error.status === 400) {
        if (context === 'login' && error.data?.code === 'MOBILE_NOT_REGISTERED') {
          toast.error('Mobile number not registered. Please sign up first.')
        } else if (context === 'registration' && error.data?.code === 'MOBILE_ALREADY_REGISTERED') {
          toast.error('Mobile number already registered. Please login instead.')
        } else {
          toast.error(error.data?.message || `Failed to send ${context} OTP.`)
        }
      } else if (error.status === 429) {
        const retryAfter = error.data?.retryAfter || 300  // seconds
        const retryMinutes = Math.ceil(retryAfter / 60)
        
        // Set rate limit state
        setIsRateLimited(true)
        setRateLimitTimer(retryAfter)
        
        toast.error(`Too many ${context} OTP requests. Please try again in ${retryMinutes} minutes.`)
        
        // Store rate limit in localStorage for persistence
        const expiryTime = Date.now() + (retryAfter * 1000)
        localStorage.setItem(`otpRateLimit_${type}_${context}`, JSON.stringify({
          expiryTime,
          retryAfter
        }))
        
        // Clear any existing rate limit timer
        if (rateLimitIntervalRef.current) {
          clearInterval(rateLimitIntervalRef.current)
        }
        
        // Start countdown timer
        rateLimitIntervalRef.current = setInterval(() => {
          setRateLimitTimer(prev => {
            if (prev <= 1) {
              if (rateLimitIntervalRef.current) {
                clearInterval(rateLimitIntervalRef.current)
                rateLimitIntervalRef.current = null
              }
              setIsRateLimited(false)
              localStorage.removeItem(`otpRateLimit_${type}_${context}`)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        toast.error(error.data?.message || `Failed to send ${context} OTP. Please try again.`)
      }
    }
  }

  const handleChangeClick = () => {
    setShowOtpInput(false)
    setVerified(false)
    setOtp(Array(6).fill(""))
    setTimer(60)
    setCanResend(false)
    setIsVerifying(false)
    setAttemptCount(0) // Reset attempt count when changing number
    setIsBlocked(false) // Remove block when changing number
    setBlockTimer(0)

    if (mode === "login") {
      dispatch(setOtpSent(false))
    }
  }

  const getInputLabel = () => {
    if (type === "mobile") return "Mobile Number"
    if (type === "whatsapp") return "WhatsApp Number"
    return "Email ID"
  }

  const getVerificationTitle = () => {
    if (type === "mobile") return "Mobile Verification"
    if (type === "whatsapp") return "WhatsApp Verification"
    return "Email ID Verification"
  }

  const renderInputField = () => {
    if (type === "email") {
      return (
        <EmailInputField
          value={value}
          onChange={(val) => onChange?.(val)}
          placeholder="Enter your email"
        />
      )

    } else {
      return (
        <PhoneInputField
          value={value}
          onChange={(val) => onChange?.(val)}
          placeholder="Enter your number"
        />
      )
    }
  }

  // ✅ OTP Input UI with better handling
  const renderOtpInput = () => (
    <div className="flex justify-center">
      <InputOTP
        ref={otpInputRef}
        maxLength={6}
        value={otp.join("")}
        onChange={(val) => {
          const sanitized = val.replace(/\D/g, "").slice(0, 6)
          const otpArray = sanitized.split("")
          // ✅ Pad with empty strings to maintain 6-length array
          while (otpArray.length < 6) {
            otpArray.push("")
          }
          setOtp(otpArray)
        }}
        disabled={isVerifying || isOtpVerifying || isBlocked}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  )

  if (mode === "login" && showOtpInput) {
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-2xl font-semibold text-text-heading">
          Login <span className="text-muted-foreground font-normal">with</span>
        </h2>
        <p className="text-sm text-muted-foreground flex justify-center items-center gap-2 flex-wrap">
          We have sent a 6 digit OTP code to <span className="text-primary font-semibold">{value}</span>
          <button
            className="ml-1 text-sm text-accent flex items-center gap-1 hover:underline"
            onClick={handleChangeClick}
            disabled={isVerifying || isOtpVerifying}
          >
            🔄 Change
          </button>
        </p>
        
        {renderOtpInput()}
        
        {/* ✅ Show verification status */}
        {isBlocked && (
          <div className="flex items-center justify-center gap-2 text-sm text-destructive">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-5V7m0 0V5m0 2h2m-2 0H10" />
            </svg>
            Blocked for {Math.ceil(blockTimer / 60)} minutes due to failed attempts
          </div>
        )}
        
        {(isVerifying || isOtpVerifying) && !isBlocked && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Verifying OTP...
          </div>
        )}
        
        <div className="text-sm font-medium">
          {isRateLimited ? (
            <span className="text-muted-foreground">
              {`Try again in ${Math.ceil(rateLimitTimer / 60)}:${(rateLimitTimer % 60).toString().padStart(2, '0')}`}
            </span>
          ) : isBlocked ? (
            <span className="text-muted-foreground">
              {/* Blocked message is shown above, just show disabled state here */}
              Resend temporarily disabled
            </span>
          ) : canResend ? (
            <button 
              onClick={handleSendOTP} 
              className="hover:underline text-accent"
              disabled={isVerifying || isOtpVerifying || isSendingOtp}
            >
              Resend OTP
            </button>
          ) : (
            <span className="text-text-heading">Resend OTP in 00:{timer.toString().padStart(2, "0")}</span>
          )}
        </div>

      </div>
    )
  }

  return (
    <div className="bg-muted p-8 rounded-xl">
      <h3 className="text-xl font-medium text-gray mb-2">{getVerificationTitle()}</h3>
      <hr className="mb-4 border-border" />

      {verified ? (
        <div className="relative">
          <Input value={value} disabled className="bg-background pr-10 py-6 font-semibold" />
          <CheckCircle className="text-success h-5 w-5 absolute top-1/2 right-3 -translate-y-1/2" />
        </div>
      ) : showOtpInput ? (
        <div className="text-center space-y-4">
          <p className="text-sm text-gray flex justify-center items-center gap-2 flex-wrap">
            We have sent a 6-digit OTP code to <span className="text-primary font-semibold">{value}</span>
            <button
              className="ml-1 text-sm text-primary flex items-center gap-1 hover:underline"
              onClick={handleChangeClick}
            >
              🔄 Change
            </button>
          </p>
          {renderOtpInput()}
          <div className="text-sm font-medium">
            {isRateLimited ? (
              <span className="text-muted-foreground">
                {`Try again in ${Math.ceil(rateLimitTimer / 60)}:${(rateLimitTimer % 60).toString().padStart(2, '0')}`}
              </span>
            ) : isBlocked ? (
              <span className="text-muted-foreground">
                Resend temporarily disabled
              </span>
            ) : canResend ? (
              <button 
                onClick={handleSendOTP} 
                disabled={isSendingOtp}
                className="hover:underline text-accent"
              >
                Resend OTP
              </button>
            ) : (
              <span className="text-text-heading">Resend OTP in 00:{timer.toString().padStart(2, "0")}</span>
            )}
          </div>
        </div>
      ) : (
        <>
          <div>
            <label className="block text-muted-foreground ml-1 mb-4">{getInputLabel()}</label>
            <div className="flex items-center gap-4">
              <div className="flex-1">{renderInputField()}</div>
              <button
                onClick={handleSendOTP}
                disabled={isSendingOtp || isRateLimited}
                className={`font-medium rounded-lg h-10 px-6 min-w-[120px] whitespace-nowrap ${
                  (isSendingOtp || isRateLimited) 
                    ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                    : 'bg-primary hover:bg-primary/90 text-background'
                }`}
              >
                {isRateLimited ? (
                  `Try again in ${Math.ceil(rateLimitTimer / 60)}:${(rateLimitTimer % 60).toString().padStart(2, '0')}`
                ) : isSendingOtp ? (
                  "Sending..."
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          </div>

          {/* ✅ Same as above checkbox (only for WhatsApp) */}
          {type === "whatsapp" && sameAsCheckbox && (
            <div className="flex items-center mt-4">
              <label className="inline-flex items-center gap-2 text-heading">
                <input
                  type="checkbox"
                  checked={sameAsCheckbox.checked}
                  onChange={(e) => sameAsCheckbox.onChange(e.target.checked)}
                  className="w-4 h-4 text-accent rounded border-border"
                />
                <span>Same as above</span>
              </label>
            </div>
          )}
        </>
      )}
    </div>
  )
}