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
  }: Step4ApprovalProps) => {
    const renderRow = (label: string, value: string) => (
      <div className="flex justify-between">
        <span className="text-gray-600">{label} :</span>
        <span className="text-[#183966] font-medium">{value}</span>
      </div>
    );
  
    return (
      <div className="space-y-6">
        <div className="bg-[#f8f9fc] p-6 rounded-md">
          <h3 className="text-lg font-medium mb-4">Verification</h3>
          {renderRow("Mobile Number", mobileNumber)}
          {renderRow("WhatsApp Number", whatsappNumber)}
          {renderRow("Email ID", email)}
        </div>
        <div className="bg-[#f8f9fc] p-6 rounded-md">
          <h3 className="text-lg font-medium mb-4">Level</h3>
          {renderRow("Level", selectedLevel)}
        </div>
        <div className="bg-[#f8f9fc] p-6 rounded-md">
          <h3 className="text-lg font-medium mb-4">Geography</h3>
          {renderRow("State", state)}
          {renderRow("Division", division)}
          {renderRow("District", district)}
          {renderRow("Block", block)}
          {renderRow("Sector", sector)}
        </div>
        <div className="bg-[#f8f9fc] p-6 rounded-md">
          <h3 className="text-lg font-medium mb-4">Department</h3>
          {renderRow("Type of Organisation", organizationType)}
          {renderRow("Designation", designation)}
        </div>
        <div className="bg-[#f8f9fc] p-6 rounded-md">
          <h3 className="text-lg font-medium mb-4">Personal Information</h3>
          {renderRow("Full Name", fullName)}
          {renderRow("Gender", gender)}
        </div>
      </div>
    );
  };
  