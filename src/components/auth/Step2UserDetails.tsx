import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

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

const levelOrder = ["State", "Division", "District", "Block", "Sector/PHC"];

const mockOptions = {
    states: ["Rajasthan", "Delhi", "Maharashtra"],
    divisions: ["Jaipur", "Jodhpur", "Udaipur"],
    districts: ["Jaipur", "Alwar", "Sikar"],
    blocks: ["Bassi", "Chaksu", "Sanganer"],
    sectors: ["Malviya Nagar", "Jagatpura", "Mansarovar"],
    orgTypes: ["Director - MH", "Director - CH", "Director - FW"],
    designations: [
        "Project Director - MH",
        "Deputy Director - MH",
        "Assistant Director - MH",
    ],
};

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
    const geoFields = [
        { key: "State", value: state, setter: setState, options: mockOptions.states },
        { key: "Division", value: division, setter: setDivision, options: mockOptions.divisions },
        { key: "District", value: district, setter: setDistrict, options: mockOptions.districts },
        { key: "Block", value: block, setter: setBlock, options: mockOptions.blocks },
        { key: "Sector/PHC", value: sector, setter: setSector, options: mockOptions.sectors },
    ];

    return (
        <div className="space-y-6">
            <Card className="p-6 rounded-md bg-[#f8f9fc]">
                <h3 className="text-lg font-medium ">Level</h3>
                <hr className=" border-gray-300" />
                <p className="text-sm text-gray-600 ">Select Your Level</p>
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
            </Card>


            <Card className="p-6 rounded-md bg-[#f8f9fc]">
                <h3 className="text-lg font-medium ">Geography</h3>
                <hr className=" border-gray-300" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {geoFields
                        .filter(({ key }) => levelOrder.indexOf(key) <= levelOrder.indexOf(selectedLevel))
                        .map(({ key, value, setter, options }) => (
                            <div key={key}>
                                <Label className="text-sm text-gray-600 mb-2 block">{`Select ${key}`}</Label>
                                <Select value={value} onValueChange={setter}>
                                    <SelectTrigger className="w-full h-12 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-[#1F2937] font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#183966]">
                                        <SelectValue placeholder={`Select ${key}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.map((opt) => (
                                            <SelectItem key={opt} value={opt}>
                                                {opt}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ))}
                </div>
            </Card>

            <Card className="p-6 rounded-md bg-[#f8f9fc]">
                <h3 className="text-lg font-medium ">Department</h3>
                <hr className=" border-gray-300" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label className="text-sm text-gray-600 mb-2 block">Type of Organisation</Label>
                        <Select value={organizationType} onValueChange={setOrganizationType}>
                            <SelectTrigger className="w-full h-12 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-[#1F2937] font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#183966]">

                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockOptions.orgTypes.map((opt) => (
                                    <SelectItem key={opt} value={opt}>
                                        {opt}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="text-sm text-gray-600 mb-2 block">Designation</Label>
                        <Select value={designation} onValueChange={setDesignation}>
                            <SelectTrigger className="w-full h-12 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-[#1F2937] font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#183966]">

                                <SelectValue placeholder="Select Designation" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockOptions.designations.map((opt) => (
                                    <SelectItem key={opt} value={opt}>
                                        {opt}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>
        </div>
    );
};
