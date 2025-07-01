// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSeparator,
//   InputOTPSlot,
// } from "@/components/ui/input-otp";


// interface OTPVerificationProps {
//   mobile: string;
//   onChangeMobile?: () => void;
// }

// export default function OTPVerification({ mobile, onChangeMobile }: OTPVerificationProps) {
//   const [otp, setOtp] = useState(Array(6).fill(""));
//   const [timer, setTimer] = useState(30);
//   const [canResend, setCanResend] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (timer === 0) {
//       setCanResend(true);
//       return; 
//     }
  
//     const countdown = setInterval(() => {
//       setTimer((prev) => prev - 1);
//     }, 1000);
  
//     return () => clearInterval(countdown);
//   }, [timer]);
  
//   const handleResend = () => {
//     if (!canResend) return;
//     toast.success("OTP resent successfully!");
//     setCanResend(false);
//     setTimer(30); 
//   };

//   const handleSubmitOtp = () => {
//     const fullOtp = otp.join("");
//     if (fullOtp.length === 6 && /^\d{6}$/.test(fullOtp)) {
//       toast.success(`OTP Verified: ${fullOtp}`);
//       navigate("/dashboard"); 
//       // Api call 
//     }
//   };

//   useEffect(() => {
//     if (otp.every((digit) => digit !== "")) {
//       handleSubmitOtp();
//     }
//   }, [otp]);
  
  
//   return (
//     <div className="space-y-6 text-center">
//       <h2 className="text-2xl font-semibold text-text-heading">
//         Login <span className="font-normal text-gray-500">with</span>
//       </h2>

//       <p className="text-sm text-text-gray flex justify-center items-center gap-2 flex-wrap">
//         We have sent a 6 digit OTP code to{" "}
//         <span className="text-accent font-semibold">{mobile}</span>
//         {onChangeMobile && (
//           <Button
//             type="button"
//             variant="ghost"
//             className="px-2 py-1 text-sm text-accent hover:underline"
//             onClick={onChangeMobile}
//           >
//             🔄 Change
//           </Button>
//         )}
//       </p>

//       <div className="flex justify-center">
//         <InputOTP
//           maxLength={6}
//           value={otp.join("")}
//           onChange={(val) => {
//             const sanitized = val.replace(/\D/g, "").slice(0, 6);
//             setOtp(sanitized.split(""));
//           }}
//         >
//           <InputOTPGroup>
//             <InputOTPSlot index={0} />
//             <InputOTPSlot index={1} />
//             <InputOTPSlot index={2} />
//           </InputOTPGroup>
//           <InputOTPSeparator />
//           <InputOTPGroup>
//             <InputOTPSlot index={3} />
//             <InputOTPSlot index={4} />
//             <InputOTPSlot index={5} />
//           </InputOTPGroup>
//         </InputOTP>
//       </div>


//       <div className="text-sm text-primary font-medium mt-1">
//         {canResend ? (
//           <button onClick={handleResend} className="hover:underline text-accent">
//             Resend OTP
//           </button>
//         ) : (
//           <span className="text-text-heading">Resend OTP in 00:{timer.toString().padStart(2, "0")}</span>
//         )}
//       </div>
//     </div>
//   );
// }
