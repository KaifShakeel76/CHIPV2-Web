"use client";

import { useState } from "react";

import { OtpSection } from "@/components/auth/OtpSection";

interface Step1VerificationProps {
  mobileNumber: string;
  setMobileNumber: (val: string) => void;
  whatsappNumber: string;
  setWhatsappNumber: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  mobileVerified: boolean;
  setMobileVerified: (val: boolean) => void;
  whatsappVerified: boolean;
  setWhatsappVerified: (val: boolean) => void;
  emailVerified: boolean;
  setEmailVerified: (val: boolean) => void;
  showMobileOtp: boolean;
  setShowMobileOtp: (val: boolean) => void;
  showWhatsappOtp: boolean;
  setShowWhatsappOtp: (val: boolean) => void;
  showEmailOtp: boolean;
  setShowEmailOtp: (val: boolean) => void;
  mobileOtp: string[];
  setMobileOtp: (otp: string[]) => void;
  whatsappOtp: string[];
  setWhatsappOtp: (otp: string[]) => void;
  emailOtp: string[];
  setEmailOtp: (otp: string[]) => void;
}

export const Step1Verification = ({
  mobileNumber,
  setMobileNumber,
  whatsappNumber,
  setWhatsappNumber,
  email,
  setEmail,
  mobileVerified,
  setMobileVerified,
  whatsappVerified,
  setWhatsappVerified,
  emailVerified,
  setEmailVerified,
  showMobileOtp,
  setShowMobileOtp,
  showWhatsappOtp,
  setShowWhatsappOtp,
  showEmailOtp,
  setShowEmailOtp,
  mobileOtp,
  setMobileOtp,
  whatsappOtp,
  setWhatsappOtp,
  emailOtp,
  setEmailOtp,
}: Step1VerificationProps) => {
  const [sameAsMobile, setSameAsMobile] = useState(false);

  return (
    <div className="space-y-6">
    

      {/* ✅ Mobile Verification Card */}
      
        <OtpSection
          label="Mobile Number"
          type="mobile"
          value={mobileNumber}
          onChange={(val) => {
            setMobileNumber(val);
            if (sameAsMobile) {
              setWhatsappNumber(val);
            }
          }}
          verified={mobileVerified}
          setVerified={setMobileVerified}
          showOtpInput={showMobileOtp}
          setShowOtpInput={setShowMobileOtp}
          otp={mobileOtp}
          setOtp={setMobileOtp}
        />

      {/* ✅ WhatsApp Verification Card */}
     
        <OtpSection
          label="WhatsApp Number"
          type="whatsapp"
          value={whatsappNumber}
          onChange={setWhatsappNumber}
          verified={whatsappVerified}
          setVerified={setWhatsappVerified}
          showOtpInput={showWhatsappOtp}
          setShowOtpInput={setShowWhatsappOtp}
          otp={whatsappOtp}
          setOtp={setWhatsappOtp}
          
        />
    

      {/* ✅ Email Verification Card */}
      
        <OtpSection
          label="Email ID"
          type="email"
          value={email}
          onChange={setEmail}
          verified={emailVerified}
          setVerified={setEmailVerified}
          showOtpInput={showEmailOtp}
          setShowOtpInput={setShowEmailOtp}
          otp={emailOtp}
          setOtp={setEmailOtp}
        />
    </div>
  );
};
