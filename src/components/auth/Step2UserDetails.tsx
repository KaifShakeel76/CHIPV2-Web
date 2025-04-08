import { Button } from "@/components/ui/button";

interface Step2UserDetailsProps {
  selectedLevel: string;
  setSelectedLevel: (val: string) => void;
  state: string;
  setState: (val: string) => void;
  division: string;
  setDivision: (val: string) => void;
  district: string;
  setDistrict: (val: string) => void;
  block: string;
  setBlock: (val: string) => void;
  sector: string;
  setSector: (val: string) => void;
  organizationType: string;
  setOrganizationType: (val: string) => void;
  designation: string;
  setDesignation: (val: string) => void;
}

export const Step2UserDetails = ({
  selectedLevel,
  setSelectedLevel,
  state,
  setState,
  division,
  setDivision,
  district,
  setDistrict,
  block,
  setBlock,
  sector,
  setSector,
  organizationType,
  setOrganizationType,
  designation,
  setDesignation,
}: Step2UserDetailsProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#f8f9fc] p-6 rounded-md">
        <h3 className="text-lg font-medium mb-4">Level</h3>
        <p className="text-sm text-gray-600 mb-3">Select Your Level</p>
        <div className="flex flex-wrap gap-2">
          {["State", "Division", "District", "Block", "Sector/PHC"].map((level) => (
            <Button
              key={level}
              variant={selectedLevel === level ? "default" : "outline"}
              className={selectedLevel === level ? "bg-[#183966]" : ""}
              onClick={() => setSelectedLevel(level)}
            >
              {level}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-[#f8f9fc] p-6 rounded-md">
        <h3 className="text-lg font-medium mb-4">Geography</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "State", value: state, setter: setState, options: ["Rajasthan", "Delhi", "Maharashtra"] },
            { label: "Division", value: division, setter: setDivision, options: ["Jaipur", "Jodhpur", "Udaipur"] },
            { label: "District", value: district, setter: setDistrict, options: ["Jaipur", "Alwar", "Sikar"] },
            { label: "Block", value: block, setter: setBlock, options: ["Bassi", "Chaksu", "Sanganer"] },
            { label: "Sector", value: sector, setter: setSector, options: ["Malviya Nagar", "Jagatpura", "Mansarovar"] },
          ].map(({ label, value, setter, options }) => (
            <div key={label}>
              <label className="block text-sm text-gray-600 mb-2">{`Select ${label} Name`}</label>
              <select value={value} onChange={(e) => setter(e.target.value)} className="w-full p-2 rounded-md border border-gray-300">
                {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#f8f9fc] p-6 rounded-md">
        <h3 className="text-lg font-medium mb-4">Department</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Type of organisation</label>
            <select
              value={organizationType}
              onChange={(e) => setOrganizationType(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300"
            >
              <option>Director - MH</option>
              <option>Director - CH</option>
              <option>Director - FW</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Select Designation</label>
            <select
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300"
            >
              <option>Project Director - MH</option>
              <option>Deputy Director - MH</option>
              <option>Assistant Director - MH</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
