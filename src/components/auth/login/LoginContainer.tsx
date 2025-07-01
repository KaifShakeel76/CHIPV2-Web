"use client"

import { useDispatch, useSelector } from "react-redux"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { RootState } from "@/app/store"
import { switchToEmail, switchToMobile, setOtpSent } from "@/features/auth/loginTabSlice"
import EmailLogin from "./EmailLogin"
import MobileLogin from "./MobileLogin"
import { useCallback, useState, useEffect, useMemo, memo } from "react"
import OptimizedRegistrationDrawer from "@/components/auth/registration/OptimizedRegistrationDrawer"

// Use the production-optimized registration drawer
const PreloadedRegisterDrawer = OptimizedRegistrationDrawer
import { OtpSection } from "@/components/auth/otp/OtpSection"
import ForgotPasswordForm from "./ForgotPasswordForm"
import ComponentPreloader from "../utils/ComponentPreloader"

function LoginContainer() {
  const dispatch = useDispatch()
  const { method, otpSent } = useSelector((state: RootState) => state.loginTab)
  
  const [formState, setFormState] = useState({
    mobile: "",
    registerDrawerOpen: false,
    showForgotPassword: false
  })
  const [otp, setOtp] = useState<string[]>(() => Array(6).fill(""))

  const handleSwitch = useCallback(
    (value: "email" | "mobile") => {
      dispatch(value === "email" ? switchToEmail() : switchToMobile())
    },
    [dispatch]
  )

  const updateFormState = useCallback((updates: Partial<typeof formState>) => {
    setFormState(prev => ({ ...prev, ...updates }))
  }, [])

  const handleMobileChange = useCallback((mobile: string) => {
    updateFormState({ mobile })
    dispatch(setOtpSent(false))
  }, [updateFormState, dispatch])

  // Reset OTP state when switching methods
  useEffect(() => {
    setOtp(Array(6).fill(""))
    updateFormState({ mobile: "" })
  }, [method, updateFormState])

  // Clean up OTP state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(setOtpSent(false))
    }
  }, [dispatch])

  const otpSectionProps = useMemo(() => ({
    label: "Mobile Number",
    type: "mobile" as const,
    value: formState.mobile,
    onChange: handleMobileChange,
    verified: false,
    setVerified: () => {},
    showOtpInput: true,
    setShowOtpInput: () => {},
    mode: "login" as const,
    redirectAfterVerify: "/dashboard",
    otp,
    setOtp
  }), [formState.mobile, handleMobileChange, otp])

  if (method === "mobile" && otpSent) {
    return (
      <div className="bg-background w-full max-w-md rounded-xl p-6 sm:p-8 mx-auto">
        <OtpSection {...otpSectionProps} />
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto max-w-md px-4 py-8">
        <div className="space-y-6 w-full max-w-2xl p-6 bg-background md:p-6 shadow-xl rounded-xl">
          <div className="space-y-2">
            <h2 className="text-md text-muted-foreground font-medium">Welcome Back to CHIP Dashboard.</h2>
            <h1 className="text-2xl font-bold text-text-heading">
              {formState.showForgotPassword ? "Forgot Password" : "Login with"}
            </h1>
          </div>

          {!formState.showForgotPassword && (
            <Tabs value={method} className="w-full">
              <TabsList className="flex w-full rounded-xl overflow-hidden border p-0 h-auto bg-muted">
                <TabsTrigger
                  value="email"
                  onClick={() => handleSwitch("email")}
                  className="flex-1 py-3 px-6 text-center font-medium rounded-none data-[state=active]:bg-primary text-foreground-muted data-[state=active]:text-background"
                >
                  Email
                </TabsTrigger>
                <TabsTrigger
                  value="mobile"
                  onClick={() => handleSwitch("mobile")}
                  className="flex-1 py-3 px-6 text-center font-medium rounded-none data-[state=active]:bg-primary text-foreground-muted data-[state=active]:text-background"
                >
                  Mobile
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          {formState.showForgotPassword ? (
            <ForgotPasswordForm onBack={() => updateFormState({ showForgotPassword: false })} />
          ) : (
            <>
              {method === "email" && (
                <EmailLogin onForgotPassword={() => updateFormState({ showForgotPassword: true })} />
              )}
              {method === "mobile" && !otpSent && (
                <MobileLogin 
                  setMobile={(mobile) => updateFormState({ mobile })} 
                  onOtpSent={() => dispatch(setOtpSent(true))} 
                />
              )}
            </>
          )}
          {!formState.showForgotPassword && (
            <div className="text-center text-muted-foreground text-sm mt-6">
              Don't have an account?{" "}
              <button
                className="text-accent hover:underline"
                onClick={() => updateFormState({ registerDrawerOpen: true })}
              >
                Register here
              </button>
            </div>
          )}
        </div>
      </div>
      <PreloadedRegisterDrawer 
        open={formState.registerDrawerOpen} 
        onOpenChange={(open) => updateFormState({ registerDrawerOpen: open })} 
      />
      <ComponentPreloader />
    </>
  )
}

export default memo(LoginContainer)
