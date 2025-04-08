import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Step4ApprovalProps {
    mobileNumber: string;
    whatsappNumber: string;
    email: string;
    selectedLevel: string;
    state: string;
    division: string;
    district: string;
    block: string;
    sector: string;
    organizationType: string;
    designation: string;
    fullName: string;
    gender: string;
    password: string;
}

export const Step4Approval = ({
    mobileNumber,
    whatsappNumber,
    email,
    selectedLevel,
    state,
    division,
    district,
    block,
    sector,
    organizationType,
    designation,
    fullName,
    gender,
    password,
}: Step4ApprovalProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const renderRow = (label: string, value: string) => (
        <div className="flex justify-between">
            <span className="text-gray-600">{label} :</span>
            <span className="text-[#183966] font-medium">{value}</span>
        </div>
    );

    return (
        <div className="space-y-6">
            <Card className="bg-[#f8f9fc] p-6 rounded-md">
                <h3 className="text-lg font-semibold ">Verification</h3>
                <hr className=" border-gray-300" />
                {renderRow("Mobile Number", mobileNumber)}
                {renderRow("WhatsApp Number", whatsappNumber)}
                {renderRow("Email ID", email)}
            </Card>

            <Card className="bg-[#f8f9fc] p-6 rounded-md">
                <h3 className="text-lg font-semibold ">Level</h3>
                <hr className=" border-gray-300" />
                {renderRow("Level", selectedLevel)}
            </Card>

            <Card className="bg-[#f8f9fc] p-6 rounded-md">
                <h3 className="text-lg font-semibold ">Geography</h3>
                <hr className=" border-gray-300" />
                {renderRow("State", state)}
                {renderRow("Division", division)}
                {renderRow("District", district)}
                {renderRow("Block", block)}
                {renderRow("Sector", sector)}
            </Card>

            <Card className="bg-[#f8f9fc] p-6 rounded-md">
                <h3 className="text-lg font-semibold ">Department</h3>
                <hr className=" border-gray-300" />
                {renderRow("Type of Organisation", organizationType)}
                {renderRow("Designation", designation)}
            </Card>
            <Card className="bg-[#f8f9fc] p-6 rounded-md">

                <h3 className="text-lg font-semibold ">Personal Information</h3>
                <hr className=" border-gray-300" />
                {renderRow("Full Name", fullName)}
                {renderRow("Gender", gender)}
            </Card>
            <Card className="bg-[#f8f9fc] p-6 rounded-md">
                <div className="flex justify-between items-center ">
                    <h3 className="text-lg font-semibold">Password</h3>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="text-sm text-[#183966] flex items-center gap-1"
                    >
                        {showPassword ? (
                            <>
                                <EyeOff className="w-4 h-4" />
                                Hide
                            </>
                        ) : (
                            <>
                                <Eye className="w-4 h-4" />
                                Show
                            </>
                        )}
                    </Button>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between items-center">
                    <Label className="text-sm text-gray-600">Password</Label>
                    <span className="text-[#183966] font-medium text-sm">
                        {showPassword ? password : "********"}
                    </span>
                </div>

            </Card>
        </div>
    );
};







