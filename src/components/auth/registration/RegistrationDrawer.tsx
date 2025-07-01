"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import React, { Suspense, useMemo, useRef, useState } from "react"
import { useEffect } from "react"
import { populateFromLocalStorage } from "@/features/registerForm/registerFormSlice"
import { toast } from "sonner"
import PasswordSecurity from "@/components/auth/utils/passwordSecurity"

// Production-grade lazy loading without artificial delays
const Step1Verification = React.lazy(() => import("./steps/VerificationStep"))
const Step2UserDetails = React.lazy(() => import("./steps/UserDetailsStep")) 
const Step3PersonalInfo = React.lazy(() => import("./steps/PersonalInfoStep"))
const Step4Approval = React.lazy(() => import("./steps/ApprovalStep"))

import { StepProgress } from "@/components/auth/registration/RegistrationProgress"
import { ApprovalDialog } from "@/components/auth/dialogs/ApprovalDialog"
import RegistrationSkeleton from "./RegistrationSkeleton"

import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/app/store"
import { setStep, resetForm } from "@/features/registerForm/registerFormSlice"
import { 
  selectRegistrationStep, 
  selectContactVerification, 
  selectLevelInfo, 
  selectPersonalInfo,
  selectReviewInfo,
  selectCanProceedStep1,
  selectCanProceedStep2,
  selectCanProceedStep3
} from "./selectors"

interface RegisterDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onVerified?: () => void
}

// ✅ Component ref interfaces for validation
interface StepValidationRef {
  validateStep: () => Promise<boolean>
  isValid: () => boolean
}

export function RegisterDrawer({ open, onOpenChange }: RegisterDrawerProps) {
  const dispatch = useDispatch()
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Use optimized selectors to prevent unnecessary re-renders
  const step = useSelector(selectRegistrationStep)
  const contactInfo = useSelector(selectContactVerification)
  const levelInfo = useSelector(selectLevelInfo)
  const personalInfo = useSelector(selectPersonalInfo)
  const reviewInfo = useSelector(selectReviewInfo)
  
  // Memoized validation results
  const canProceedStep1 = useSelector(selectCanProceedStep1)
  const canProceedStep2 = useSelector(selectCanProceedStep2)
  const canProceedStep3 = useSelector(selectCanProceedStep3)

  // ✅ Refs for step components to call validation methods
  const step1Ref = useRef<StepValidationRef>(null)
  const step2Ref = useRef<StepValidationRef>(null)
  const step3Ref = useRef<StepValidationRef>(null)

  // Initialize drawer content after opening
  useEffect(() => {
    if (open && !isInitialized) {
      // Small delay to let sheet animation start
      const timer = setTimeout(() => {
        setIsInitialized(true)
        // Load saved data from localStorage if available
        const savedData = localStorage.getItem("userRegistrationData")
        if (savedData) {
          const parsed = JSON.parse(savedData)
          dispatch(populateFromLocalStorage(parsed))
        }
      }, 50)
      return () => clearTimeout(timer)
    } else if (!open) {
      setIsInitialized(false)
    }
  }, [open, isInitialized, dispatch])

  // Memoized validation functions
  const validateStep1 = useMemo(() => (): boolean => {
    const { mobileVerified, whatsappVerified, emailVerified, mobileNumber, whatsappNumber, email } = contactInfo
    
    // Check if all fields have values
    if (!mobileNumber || !whatsappNumber || !email) {
      toast.error("Please fill in all contact details (Mobile, WhatsApp, Email)")
      return false
    }
    
    // Check if all fields are verified
    if (!mobileVerified || !whatsappVerified || !emailVerified) {
      const unverifiedFields = []
      if (!mobileVerified) unverifiedFields.push("Mobile number")
      if (!whatsappVerified) unverifiedFields.push("WhatsApp number") 
      if (!emailVerified) unverifiedFields.push("Email")
      
      toast.error(`Please verify: ${unverifiedFields.join(", ")}`)
      return false
    }
    
    return true
  }, [contactInfo])

  const validateStep2 = useMemo(() => (): boolean => {
    const { selectedLevel, state, division, district, block, sector, organizationTypeId, organizationId, designationId } = levelInfo
    
    // Check if level is selected
    if (!selectedLevel) {
      toast.error("Please select your administrative level")
      return false
    }
    
    // Check if state is selected
    if (!state) {
      toast.error("Please select your state")
      return false
    }
    
    // Check geographic fields based on selected level
    const levelIndex = ["State", "Division", "District", "Block", "PHC/CHC"].indexOf(selectedLevel)
    const missingGeoFields = []
    
    if (levelIndex >= 1 && !division) missingGeoFields.push("Division")
    if (levelIndex >= 2 && !district) missingGeoFields.push("District") 
    if (levelIndex >= 3 && !block) missingGeoFields.push("Block")
    if (levelIndex >= 4 && !sector) missingGeoFields.push("PHC/CHC")
    
    if (missingGeoFields.length > 0) {
      toast.error(`Please select: ${missingGeoFields.join(", ")}`)
      return false
    }
    
    // Check organizational fields
    const missingOrgFields = []
    if (!organizationTypeId) missingOrgFields.push("Organization Type")
    if (!organizationId) missingOrgFields.push("Organization")
    if (!designationId) missingOrgFields.push("Designation")
    
    if (missingOrgFields.length > 0) {
      toast.error(`Please select: ${missingOrgFields.join(", ")}`)
      return false
    }
    
    return true
  }, [levelInfo])

  const validateStep3 = useMemo(() => (): boolean => {
    const { firstName, password, confirmPassword } = personalInfo
    
    const missingFields = []
    if (!firstName) missingFields.push("First name")
    if (!password) missingFields.push("Password")
    if (!confirmPassword) missingFields.push("Confirm password")
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(", ")}`)
      return false
    }
    
    // Note: Both passwords are hashed in Redux, so they should match if same plain text was entered
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return false
    }
    
    return true
  }, [personalInfo])

  const handleNext = async () => {
    if (step >= 4) return
    
    let isValid = false
    
    // Validate current step
    switch (step) {
      case 1:
        isValid = validateStep1()
        break
      case 2:
        isValid = validateStep2()
        break
      case 3:
        isValid = validateStep3()
        break
      default:
        isValid = true
    }
    
    // Only proceed if validation passes
    if (isValid) {
      const reviewInfo = {
        ...contactInfo,
        ...levelInfo,
        ...personalInfo,
        organizationType: levelInfo.organizationTypeId || "",
        organization: levelInfo.organizationId || "",
        designation: levelInfo.designationId || "",
        organizationTypeLabel: levelInfo.organizationTypeLabel || "",
        organizationLabel: levelInfo.organizationLabel || "",
        designationLabel: levelInfo.designationLabel || "",
      }
  
      localStorage.setItem("userRegistrationData", JSON.stringify(reviewInfo))
      dispatch(setStep(step + 1))
      
      // Success feedback
      toast.success(`Step ${step} completed successfully!`)
    }
  }

  const handleBack = () => {
    if (step > 1) dispatch(setStep(step - 1))
  }

  const handleApprovalSubmit = () => {
    // Hash passwords before submission
    const secureReviewInfo = {
      ...reviewInfo,
      password: reviewInfo.password ? PasswordSecurity.hashPassword(reviewInfo.password) : reviewInfo.password,
      confirmPassword: reviewInfo.confirmPassword ? PasswordSecurity.hashPassword(reviewInfo.confirmPassword) : reviewInfo.confirmPassword
    }
    
    console.log("✅ Submitting registration:", secureReviewInfo)
    localStorage.setItem("userRegistrationData", JSON.stringify(secureReviewInfo))

    setTimeout(() => {
      dispatch(resetForm())
      localStorage.removeItem("userRegistrationData")
      console.log("🧼 Form reset completed. LocalStorage cleared.")
      onOpenChange(false)
    }, 300)
  }

  // Remove duplicate useEffect since we're handling this in the initialization above

  const reviewInfo = useMemo(() => ({
    ...contactInfo,
    ...levelInfo,
    ...personalInfo,
    organizationType: levelInfo.organizationTypeId || "",
    organization: levelInfo.organizationId || "",
    designation: levelInfo.designationId || "",
  }), [contactInfo, levelInfo, personalInfo])

  // ✅ Check if current step can proceed
  const canProceedFromCurrentStep = (): boolean => {
    switch (step) {
      case 1:
        return contactInfo.mobileVerified && contactInfo.whatsappVerified && contactInfo.emailVerified &&
               contactInfo.mobileNumber && contactInfo.whatsappNumber && contactInfo.email
      case 2:
        const { selectedLevel, state, organizationTypeId, organizationId, designationId } = levelInfo
        const levelIndex = ["State", "Division", "District", "Block", "PHC"].indexOf(selectedLevel)
        
        let hasRequiredGeoFields = !!state
        if (levelIndex >= 1) hasRequiredGeoFields = hasRequiredGeoFields && !!levelInfo.division
        if (levelIndex >= 2) hasRequiredGeoFields = hasRequiredGeoFields && !!levelInfo.district  
        if (levelIndex >= 3) hasRequiredGeoFields = hasRequiredGeoFields && !!levelInfo.block
        if (levelIndex >= 4) hasRequiredGeoFields = hasRequiredGeoFields && !!levelInfo.sector
        
        return !!selectedLevel && hasRequiredGeoFields && !!organizationTypeId && !!organizationId && !!designationId
      case 3:
        return !!personalInfo.firstName && !!personalInfo.password && !!personalInfo.confirmPassword &&
               personalInfo.password === personalInfo.confirmPassword
      default:
        return true
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full sm:max-w-md md:max-w-lg lg:max-w-2xl overflow-y-auto px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 pb-6 sm:pb-8"
        side="right"
      >
        <SheetHeader className="">
          <div className="flex justify-between items-center">
            <div>
              <SheetTitle className="text-xl text-primary sm:text-2xl font-bold">User Registration</SheetTitle>
            </div>
            <SheetClose className="rounded-full hover:bg-secondary"></SheetClose>
          </div>
        </SheetHeader>

        {!isInitialized ? (
          <RegistrationSkeleton />
        ) : (
          <>
            <div className="">
              <StepProgress currentStep={step} />
            </div>

            {/* ✅ Development step validation status */}
            <div className="">
              <Suspense
                fallback={
                  <div className="flex justify-center items-center min-h-[200px] text-center p-4">
                    <div className="space-y-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full animate-pulse mx-auto"></div>
                      <div className="text-sm text-muted-foreground">Loading step...</div>
                    </div>
                  </div>
                }
              >
                {step === 1 && <Step1Verification ref={step1Ref} />}
                {step === 2 && <Step2UserDetails ref={step2Ref} />}
                {step === 3 && <Step3PersonalInfo ref={step3Ref} />}
                {step === 4 && (
                  <Step4Approval />
                )}
              </Suspense>
            </div>
          </>
        )}

        {/* Navigation Buttons - Only show when initialized */}
        {isInitialized && (
          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-4 mt-6 sm:mt-8">
            <Button
              className="bg-background hover:bg-secondary text-foreground border border-border w-full sm:w-auto order-2 sm:order-1"
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              Back
            </Button>
            {step < 4 ? (
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto order-1 sm:order-2"
                onClick={handleNext}
              // ✅ Button is always enabled but validates on click
            >
              Next
            </Button>
          ) : (
            <div className="w-full sm:w-auto order-1 sm:order-2">
              <ApprovalDialog
                reviewInfo={Object.fromEntries(
                  Object.entries(reviewInfo).map(([k, v]) => [k, String(v)])
                )}
                onSubmit={handleApprovalSubmit}
              />
            </div>
          )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
