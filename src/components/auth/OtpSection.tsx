import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OtpSectionProps {
  label: string;
  type: "mobile" | "whatsapp" | "email";
  value: string;
  onChange: (val: string) => void;
  verified: boolean;
  setVerified: (v: boolean) => void;
  showOtpInput: boolean;
  setShowOtpInput: (v: boolean) => void;
  otp: string[];
  setOtp: (val: string[]) => void;
  onVerified?: () => void;
  disableEditing?: boolean;
  hideChangeButton?: boolean;
  showSameAsMobile?: boolean;
  sameAsMobile?: boolean;
  setSameAsMobile?: (val: boolean) => void;
}

export function OtpSection({
  label,
  type,
  value,
  onChange,
  verified,
  setVerified,
  showOtpInput,
  setShowOtpInput,
  otp,
  setOtp,
  onVerified,
}: OtpSectionProps) {
  const handleSendOTP = () => {
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        toast.error("Please enter a valid email");
        return;
      }
    } else {
      const digits = value.replace(/\D/g, "");
      if (digits.length !== 10) {
        toast.error(`Please enter a valid 10-digit ${label.toLowerCase()}`);
        return;
      }
    }

    setShowOtpInput(true);
    toast.success("OTP sent successfully!");
  };

  const handleSubmitOtp = () => {
    const fullOtp = otp.join("");
    if (fullOtp.length === 6) {
      toast.success(`OTP Verified: ${fullOtp}`);
      onVerified?.();
    }
  };
  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      handleSubmitOtp();
    }
  }, [otp]);

  useEffect(() => {
    const fullOtp = otp.join("");
    if (fullOtp.length === 6 && /^\d{6}$/.test(fullOtp)) {
      setVerified(true);
      toast.success(`${label} verified successfully!`);
      onVerified?.();
    }
  }, [otp]);

  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(30);

  const handleResend = () => {
    if (!canResend) return;
    toast.success("OTP resent successfully!");
    setCanResend(false);
    setTimer(30);
  };

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  return (
    <div className="bg-[#f8f9fc] p-6 rounded-xl">
<h3 className="text-lg font-medium mb-6">{label} Verification</h3>
<hr className="mb-5 border-gray-300" />


      {verified ? (
        <div className="relative">
          <Input
            value={value}
            disabled
            className="bg-white pr-10 font-semibold"
          />
          <CheckCircle className="text-green-600 h-5 w-5 absolute top-1/2 right-3 -translate-y-1/2" />
        </div>
      ) : showOtpInput ? (
        <div className="text-center space-y-4">
          <p className="text-sm text-[#4B5563] flex justify-center items-center gap-2 flex-wrap">
            We have sent a 6-digit OTP code to{" "}
            <span className="text-[#156f85] font-semibold">{value}</span>
            <button
              className="ml-1 text-sm text-[#156f85] flex items-center gap-1 hover:underline"
              onClick={() => {
                setShowOtpInput(false);
                setVerified(false);
                setOtp(Array(6).fill(""));
              }}
            >
              🔄 Change
            </button>
          </p>

          <div className="flex justify-center">
            <InputOTP
              value={otp.join("")}
              onChange={(val) => {
                const sanitized = val.replace(/\D/g, "").slice(0, 6);
                setOtp(sanitized.split(""));
              }}
              maxLength={6}
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

          <div className="text-sm text-[#183966] font-medium">
            {canResend ? (
              <button
                onClick={handleResend}
                className="hover:underline text-[#156f85]"
              >
                Resend OTP
              </button>
            ) : (
              <span className="text-[#1F2937]">
                Resend OTP in 00:{timer.toString().padStart(2, "0")}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">{label}</label>
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="bg-white font-semibold"
            />
          </div>
          <Button
            className="bg-[#183966] hover:bg-[#122c4f] h-10 w-[140px]"
            onClick={handleSendOTP}
          >
            Send OTP
          </Button>
        </div>
      )}
    </div>
  );
}
