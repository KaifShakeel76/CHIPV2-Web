import { useState } from "react";
import { Shield, User, ThumbsUp } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Step1Verification } from "./Step1Verification";
import { Step2UserDetails } from "./Step2UserDetails";
import { Step3PersonalInfo } from "./Step3PersonalInfo";
import { Step4Approval } from "./Step4Approval";


import { ApprovalDialog } from "./ApprovalDialog";


interface RegisterDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onVerified?: () => void;
}

export function RegisterDrawer({ open, onOpenChange }: RegisterDrawerProps) {
    const [step, setStep] = useState(1);


    const [mobileNumber, setMobileNumber] = useState("");
    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [email, setEmail] = useState("");

    const [mobileOtp, setMobileOtp] = useState(Array(6).fill(""));
    const [whatsappOtp, setWhatsappOtp] = useState(Array(6).fill(""));
    const [emailOtp, setEmailOtp] = useState(Array(6).fill(""));

    const [showMobileOtp, setShowMobileOtp] = useState(false);
    const [showWhatsappOtp, setShowWhatsappOtp] = useState(false);
    const [showEmailOtp, setShowEmailOtp] = useState(false);

    const [mobileVerified, setMobileVerified] = useState(false);
    const [whatsappVerified, setWhatsappVerified] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);

    const [selectedLevel, setSelectedLevel] = useState("state");
    const [state, setState] = useState("Rajasthan");
    const [division, setDivision] = useState("Jaipur");
    const [district, setDistrict] = useState("Jaipur");
    const [block, setBlock] = useState("Bassi");
    const [sector, setSector] = useState("Malviya Nagar");
    const [organizationType, setOrganizationType] = useState("Director - MH");
    const [designation, setDesignation] = useState("Project Director - MH");


    const [fullName, setFullName] = useState("");
    const [gender, setGender] = useState("Male");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");




    const handleNext = () => {
        if (step < 4) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };
    const handleApprovalSubmit = () => {
        resetForm();
        onOpenChange(false);
    };

    const resetForm = () => {
        setStep(1);
        setMobileNumber("");
        setWhatsappNumber("");
        setEmail("");
        setMobileOtp(Array(6).fill(""));
        setWhatsappOtp(Array(6).fill(""));
        setEmailOtp(Array(6).fill(""));
        setShowMobileOtp(false);
        setShowWhatsappOtp(false);
        setShowEmailOtp(false);
        setMobileVerified(false);
        setWhatsappVerified(false);
        setEmailVerified(false);
        setSelectedLevel("State");
        setState("Rajasthan");
        setDivision("Jaipur");
        setDistrict("Jaipur");
        setBlock("Bassi");
        setSector("Malviya Nagar");
        setOrganizationType("Director - MH");
        setDesignation("Project Director - MH");
        setFullName("");
        setGender("Male");
        setPassword("");
        setConfirmPassword("");
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                className="sm:max-w-md md:max-w-lg lg:max-w-2xl overflow-y-auto px-6 pt-4 pb-8"
                side="right"
            >
                <SheetHeader className="mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <SheetTitle className="text-2xl font-bold">
                                User Registration
                            </SheetTitle>
                        </div>
                        <SheetClose className="rounded-full p-1 hover:bg-gray-100"></SheetClose>
                    </div>
                </SheetHeader>

                <div className="flex items-center justify-between mb-8 px-2 sm:px-4 lg:px-6">
                    {[
                        { step: 1, label: "Verification", icon: <Shield className="w-5 h-5" /> },
                        { step: 2, label: "User Details", icon: <User className="w-5 h-5" /> },
                        { step: 3, label: "Personal Information", icon: <User className="w-5 h-5" /> },
                        { step: 4, label: "Approval", icon: <ThumbsUp className="w-5 h-5" /> },
                    ].map((item, index, arr) => {
                        const isCompleted = step > item.step;
                        const isCurrent = step === item.step;

                        const isLast = index === arr.length - 1;


                        return (
                            <div key={item.step} className="flex flex-col items-center flex-1 relative">
                                {/* Line to next step */}
                                {!isLast && (
                                    <div className="absolute top-[20px] left-1/2 w-full z-0">
                                        <div className="h-0.5 w-full bg-[#D2D8F3] overflow-hidden relative">
                                            <div
                                                className={`h-full absolute top-0 left-0 transition-all duration-500 ${step > item.step ? "w-full bg-gradient-to-r from-[#183966] to-[#183966]" : "w-0"
                                                    }`}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Step Icon */}
                                <div className="z-10">
                                    {isCompleted ? (
                                        <div className="bg-[#3D8C40] w-10 h-10 rounded-full flex items-center justify-center text-white">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    ) : isCurrent ? (
                                        <div className="bg-[#183966] w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md">
                                            {item.icon}
                                        </div>
                                    ) : (
                                        <div className="border-2 border-[#5A7AF1] text-[#5A7AF1] w-10 h-10 rounded-full flex items-center justify-center bg-white">
                                            {item.icon}
                                        </div>
                                    )}
                                </div>

                                {/* Label */}
                                <span className={`mt-2 text-sm font-medium ${isCurrent ? "text-[#183966]" : "text-gray-500"}`}>
                                    {item.label}
                                </span>
                            </div>
                        );
                    })}
                </div>


                {step === 1 && (
                    <Step1Verification
                        mobileNumber={mobileNumber}
                        setMobileNumber={setMobileNumber}
                        whatsappNumber={whatsappNumber}
                        setWhatsappNumber={setWhatsappNumber}
                        email={email}
                        setEmail={setEmail}
                        mobileVerified={mobileVerified}
                        setMobileVerified={setMobileVerified}
                        whatsappVerified={whatsappVerified}
                        setWhatsappVerified={setWhatsappVerified}
                        emailVerified={emailVerified}
                        setEmailVerified={setEmailVerified}
                        showMobileOtp={showMobileOtp}
                        setShowMobileOtp={setShowMobileOtp}
                        showWhatsappOtp={showWhatsappOtp}
                        setShowWhatsappOtp={setShowWhatsappOtp}
                        showEmailOtp={showEmailOtp}
                        setShowEmailOtp={setShowEmailOtp}
                        mobileOtp={mobileOtp}
                        setMobileOtp={setMobileOtp}
                        whatsappOtp={whatsappOtp}
                        setWhatsappOtp={setWhatsappOtp}
                        emailOtp={emailOtp}
                        setEmailOtp={setEmailOtp}
                    />
                )}

                {step === 2 && (
                    <Step2UserDetails
                        selectedLevel={selectedLevel}
                        setSelectedLevel={setSelectedLevel}
                        state={state}
                        setState={setState}
                        division={division}
                        setDivision={setDivision}
                        district={district}
                        setDistrict={setDistrict}
                        block={block}
                        setBlock={setBlock}
                        sector={sector}
                        setSector={setSector}
                        organizationType={organizationType}
                        setOrganizationType={setOrganizationType}
                        designation={designation}
                        setDesignation={setDesignation}
                    />
                )}

                {step === 3 && (
                    <Step3PersonalInfo
                        fullName={fullName}
                        setFullName={setFullName}
                        gender={gender}
                        setGender={setGender}
                        password={password}
                        setPassword={setPassword}
                        confirmPassword={confirmPassword}
                        setConfirmPassword={setConfirmPassword}
                    />
                )}

                {step === 4 && (
                    <Step4Approval
                        mobileNumber={mobileNumber}
                        whatsappNumber={whatsappNumber}
                        email={email}
                        selectedLevel={selectedLevel}
                        state={state}
                        division={division}
                        district={district}
                        block={block}
                        sector={sector}
                        organizationType={organizationType}
                        designation={designation}
                        fullName={fullName}
                        gender={gender}
                        password={password}
                    />
                )}


                {/* Navigation Buttons */}
                <div className="flex justify-end gap-4 mt-8">
                    <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                        Back
                    </Button>
                    {step < 4 ? (
                        <Button
                            className="bg-[#183966] hover:bg-[#122c4f]"
                            onClick={handleNext}
                            disabled={
                                step === 1 &&
                                (!mobileVerified || !whatsappVerified || !emailVerified)
                            }
                        >
                            Next
                        </Button>
                    ) : (
                        <ApprovalDialog onSubmit={handleApprovalSubmit} />
                    )}


                </div>

            </SheetContent>
        </Sheet>
    );
}
