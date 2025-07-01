"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import React, { Suspense, useMemo, useState, memo, useCallback } from "react"
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

// Memoized loading fallback
const StepLoadingFallback = memo(() => (
  <div className="flex justify-center items-center min-h-[200px] text-center p-4">
    <div className="space-y-3">
      <div className="w-8 h-8 bg-primary/20 rounded-full animate-pulse mx-auto"></div>
      <div className="text-sm text-muted-foreground">Loading step...</div>
    </div>
  </div>
))

function OptimizedRegistrationDrawer({ open, onOpenChange }: RegisterDrawerProps) {
  const dispatch = useDispatch()
  const [isContentReady, setIsContentReady] = useState(false)
  
  // Use optimized selectors to prevent unnecessary re-renders
  const step = useSelector(selectRegistrationStep)
  const contactInfo = useSelector(selectContactVerification)
  const levelInfo = useSelector(selectLevelInfo)
  const personalInfo = useSelector(selectPersonalInfo)
  const reviewInfoMemoized = useSelector(selectReviewInfo)
  
  // Memoized validation results
  const canProceedStep1 = useSelector(selectCanProceedStep1)
  const canProceedStep2 = useSelector(selectCanProceedStep2)
  const canProceedStep3 = useSelector(selectCanProceedStep3)

  // Fast initialization when drawer opens
  useEffect(() => {
    if (open) {
      // Use RAF for optimal timing
      requestAnimationFrame(() => {
        setIsContentReady(true)
        // Load saved data after content is ready
        const savedData = localStorage.getItem("userRegistrationData")
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData)
            dispatch(populateFromLocalStorage(parsed))
          } catch (e) {
            console.warn('Failed to parse saved registration data')
          }
        }
      })
    } else {
      setIsContentReady(false)
    }
  }, [open, dispatch])

  // Optimized validation using selectors
  const validateCurrentStep = useCallback(() => {
    switch (step) {
      case 1:
        if (!canProceedStep1) {
          toast.error("Please complete all verification steps")
          return false
        }
        return true
      case 2:
        if (!canProceedStep2) {
          toast.error("Please complete all required fields")
          return false
        }
        return true
      case 3:
        if (!canProceedStep3) {
          toast.error("Please complete all required fields and ensure passwords match")
          return false
        }
        return true
      default:
        return true
    }
  }, [step, canProceedStep1, canProceedStep2, canProceedStep3])

  // Optimized handlers
  const handleNext = useCallback(async () => {
    if (step >= 4) return
    
    if (validateCurrentStep()) {
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
      toast.success(`Step ${step} completed successfully!`)
    }
  }, [step, validateCurrentStep, contactInfo, levelInfo, personalInfo, dispatch])

  const handleBack = useCallback(() => {
    if (step > 1) dispatch(setStep(step - 1))
  }, [step, dispatch])

  const handleApprovalSubmit = useCallback(() => {
    const secureReviewInfo = {
      ...reviewInfoMemoized,
      password: reviewInfoMemoized.password ? PasswordSecurity.hashPassword(reviewInfoMemoized.password) : reviewInfoMemoized.password,
      // Don't hash confirmPassword - it's not sent to server
    }
    
    console.log("✅ Submitting registration:", secureReviewInfo)
    localStorage.setItem("userRegistrationData", JSON.stringify(secureReviewInfo))

    setTimeout(() => {
      dispatch(resetForm())
      localStorage.removeItem("userRegistrationData")
      onOpenChange(false)
    }, 300)
  }, [reviewInfoMemoized, dispatch, onOpenChange])

  // Memoized step components to prevent unnecessary re-renders
  const stepComponents = useMemo(() => ({
    1: <Step1Verification key="step1" />,
    2: <Step2UserDetails key="step2" />,
    3: <Step3PersonalInfo key="step3" />,
    4: <Step4Approval key="step4" />
  }), [])

  const currentStepComponent = stepComponents[step as keyof typeof stepComponents]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full sm:max-w-md md:max-w-lg lg:max-w-2xl overflow-y-auto px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 pb-6 sm:pb-8"
        side="right"
      >
        <SheetHeader>
          <div className="flex justify-between items-center">
            <div>
              <SheetTitle className="text-xl text-primary sm:text-2xl font-bold">User Registration</SheetTitle>
            </div>
            <SheetClose className="rounded-full hover:bg-secondary" />
          </div>
        </SheetHeader>

        {!isContentReady ? (
          <RegistrationSkeleton />
        ) : (
          <>
            <div>
              <StepProgress currentStep={step} />
            </div>

            <div>
              <Suspense fallback={<StepLoadingFallback />}>
                {currentStepComponent}
              </Suspense>
            </div>

            {/* Navigation Buttons */}
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
                >
                  Next
                </Button>
              ) : (
                <div className="w-full sm:w-auto order-1 sm:order-2">
                  <ApprovalDialog
                    reviewInfo={Object.fromEntries(
                      Object.entries(reviewInfoMemoized).map(([k, v]) => [k, String(v)])
                    )}
                    onSubmit={handleApprovalSubmit}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default memo(OptimizedRegistrationDrawer)