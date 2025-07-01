"use client"

import { OtpSection } from "@/components/auth/otp/OtpSection"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/app/store"
import {
  updateContactInfo,
  setMobileVerified,
  setWhatsappVerified,
  setEmailVerified,
  setShowMobileOtp,
  setShowWhatsappOtp,
  setShowEmailOtp,
  setMobileOtp,
  setWhatsappOtp,
  setEmailOtp,
} from "@/features/registerForm/registerFormSlice"

const Step1VerificationComponent = () => {
  const dispatch = useDispatch()
  const {
    mobileNumber,
    whatsappNumber,
    email,
    mobileVerified,
    whatsappVerified,
    emailVerified,
    showMobileOtp,
    showWhatsappOtp,
    showEmailOtp,
    mobileOtp,
    whatsappOtp,
    emailOtp,
  } = useSelector((state: RootState) => state.registerForm.contactInfo)


  return (
    <div className="space-y-4">
      <OtpSection
        label="Mobile Number"
        type="mobile"
        value={mobileNumber}
        onChange={(val) => dispatch(updateContactInfo({ mobileNumber: val.replace(/\D/g, "") }))}
        verified={mobileVerified}
        setVerified={(v) => dispatch(setMobileVerified(v))}
        showOtpInput={showMobileOtp}
        setShowOtpInput={(v) => dispatch(setShowMobileOtp(v))}
        otp={mobileOtp}
        setOtp={(otp) => dispatch(setMobileOtp(otp))}
      />

      <OtpSection
        label="WhatsApp Number"
        type="whatsapp"
        value={whatsappNumber}
        onChange={(val) => dispatch(updateContactInfo({ whatsappNumber: val.replace(/\D/g, "") }))}
        verified={whatsappVerified}
        setVerified={(v) => dispatch(setWhatsappVerified(v))}
        showOtpInput={showWhatsappOtp}
        setShowOtpInput={(v) => dispatch(setShowWhatsappOtp(v))}
        otp={whatsappOtp}
        setOtp={(otp) => dispatch(setWhatsappOtp(otp))}
        sameAsCheckbox={{
          checked: whatsappNumber === mobileNumber,
          onChange: (checked) =>
            dispatch(updateContactInfo({ whatsappNumber: checked ? mobileNumber : "" })),
          label: "Same as above",
        }}
        
      />
      <OtpSection
        label="Email ID"
        type="email"
        value={email}
        onChange={(val) => dispatch(updateContactInfo({ email: val }))}
        verified={emailVerified}
        setVerified={(v) => dispatch(setEmailVerified(v))}
        showOtpInput={showEmailOtp}
        setShowOtpInput={(v) => dispatch(setShowEmailOtp(v))}
        otp={emailOtp}
        setOtp={(otp) => dispatch(setEmailOtp(otp))}
      />
    </div>
  )
}

const Step1Verification = React.memo(Step1VerificationComponent)
export default Step1Verification
