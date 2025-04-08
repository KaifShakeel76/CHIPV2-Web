import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Step3PersonalInfoProps {
  fullName: string;
  setFullName: (val: string) => void;
  gender: string;
  setGender: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
}

export const Step3PersonalInfo = ({
  fullName,
  setFullName,
  gender,
  setGender,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
}: Step3PersonalInfoProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#f8f9fc] p-6 rounded-md">
        <h3 className="text-lg font-medium mb-4">Personal information</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Full Name</label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Select Your Gender</label>
            <div className="flex gap-2 mt-1">
              {["Male", "Female", "Other"].map((option) => (
                <Button
                  key={option}
                  variant={gender === option ? "default" : "outline"}
                  className={gender === option ? "bg-[#183966]" : ""}
                  onClick={() => setGender(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#f8f9fc] p-6 rounded-md">
        <h3 className="text-lg font-medium mb-2">Password</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Enter Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Re-enter Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
