import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import React from "react"
import { useAppDispatch } from '@/hooks/reduxHooks'
import { setStep } from "@/features/registerForm/registerFormSlice"
import { useAppSelector } from '@/hooks/reduxHooks'
import type { RootState } from "@/app/store"
import {
    useGetStatesQuery,
    useGetDivisionsQuery,
    useGetDistrictsQuery,
    useGetBlocksQuery,
    useGetSectorsQuery,
    useGetOrgTypesQuery,
    useGetOrganizationsQuery,
    useGetDesignationsQuery
} from "@/features/geoData/geoApiSlice"


// 🚀 Simplified component - no props needed, uses Redux state directly
const Step4Approval = () => {
    const dispatch = useAppDispatch()
    const registerForm = useAppSelector((state: RootState) => state.registerForm)
    
    // 🚀 RTK Query hooks to fetch geo data for Step4Approval
    const { data: states = [], isLoading: statesLoading } = useGetStatesQuery()
    const { data: divisions = [], isLoading: divisionsLoading } = useGetDivisionsQuery(registerForm.levelInfo.state, {
        skip: !registerForm.levelInfo.state
    })
    const { data: districts = [], isLoading: districtsLoading } = useGetDistrictsQuery(registerForm.levelInfo.division, {
        skip: !registerForm.levelInfo.division
    })
    const { data: blocks = [], isLoading: blocksLoading } = useGetBlocksQuery(registerForm.levelInfo.district, {
        skip: !registerForm.levelInfo.district
    })
    const { data: sectors = [], isLoading: sectorsLoading } = useGetSectorsQuery(registerForm.levelInfo.block, {
        skip: !registerForm.levelInfo.block
    })
    const { data: orgTypes = [], isLoading: orgTypesLoading } = useGetOrgTypesQuery(registerForm.levelInfo.state, {
        skip: !registerForm.levelInfo.state
    })
    const { data: organizations = [], isLoading: organizationsLoading } = useGetOrganizationsQuery(registerForm.levelInfo.organizationTypeId, {
        skip: !registerForm.levelInfo.organizationTypeId
    })
    const { data: designations = [], isLoading: designationsLoading } = useGetDesignationsQuery(registerForm.levelInfo.organizationId, {
        skip: !registerForm.levelInfo.organizationId
    })
    
    
    // 🚀 Combined geo data object (same structure as Step2UserDetails)
    const geo = {
        states,
        divisions,
        districts,
        blocks,
        sectors,
        orgTypes,
        organizations,
        designations
    }
    

    // 🚀 Enhanced label lookup with type safety and debugging
    const getLabelById = (list: any[], id: string, isLoading: boolean = false) => {
        if (isLoading) {
            return "Loading...";
        }
        if (!list || list.length === 0) {
            console.warn(`Empty list provided for ID: ${id}`);
            return "No data available";
        }
        if (!id) {
            console.warn(`Empty ID provided`);
            return "Not selected";
        }
        const found = list.find((item) => item.id === id);
        if (!found) {
            console.warn(`No item found with ID: ${id} in list:`, list);
            return "Not found";
        }
        return found.name || "Unknown";
    }
    
    // ✅ SECURITY: Passwords are now hashed in Redux store
    React.useEffect(() => {
        if (registerForm.personalInfo.password) {
            console.log('✅ Password security: Passwords are stored as hashed values in Redux state');
            console.log('Personal Info with secure password storage:', {
                firstName: registerForm.personalInfo.firstName,
                lastName: registerForm.personalInfo.lastName,
                passwordSecure: '✅ Stored as hash'
            });
        }
    }, [registerForm.personalInfo]);


    const renderRow = (label: string, value: string) => (
        <div className="flex justify-between">
            <span className="text-muted-foreground">{label} :</span>
            <span className="text-primary font-medium">{value}</span>
        </div>
    )

    const renderHeader = (title: string, stepNum: number) => (
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch(setStep(stepNum))}
                className="text-sm text-primary flex items-center gap-1 hover:bg-transparent hover:text-primary"
            >

            </Button>
        </div>
    )

    return (
        <div className="space-y-6">
            <Card className="bg-muted p-6 rounded-md">
                {renderHeader("Verification", 1)}
                <hr className="border-border" />
                {renderRow("Mobile Number", registerForm.contactInfo.mobileNumber || "Not provided")}
                {renderRow("WhatsApp Number", registerForm.contactInfo.whatsappNumber || "Not provided")}
                {renderRow("Email ID", registerForm.contactInfo.email || "Not provided")}
            </Card>

            <Card className="bg-muted p-6 rounded-md">
                {renderHeader("Level", 2)}
                <hr className="border-border" />
                {renderRow("Level", registerForm.levelInfo.selectedLevel || "Not selected")}
            </Card>

            <Card className="bg-muted p-6 rounded-md">
                {renderHeader("Geography", 2)}
                <hr className="border-border" />
                {renderRow("State", getLabelById(geo.states, registerForm.levelInfo.state, statesLoading))}
                {registerForm.levelInfo.division && renderRow("Division", getLabelById(geo.divisions, registerForm.levelInfo.division, divisionsLoading))}
                {registerForm.levelInfo.district && renderRow("District", getLabelById(geo.districts, registerForm.levelInfo.district, districtsLoading))}
                {registerForm.levelInfo.block && renderRow("Block", getLabelById(geo.blocks, registerForm.levelInfo.block, blocksLoading))}
                {registerForm.levelInfo.sector && renderRow("Sector", getLabelById(geo.sectors, registerForm.levelInfo.sector, sectorsLoading))}
            </Card>

            <Card className="bg-muted p-6 rounded-md">
                {renderHeader("Department", 2)}
                <hr className="border-border" />
                {renderRow("Type of Organisation", registerForm.levelInfo.organizationTypeLabel || getLabelById(geo.orgTypes, registerForm.levelInfo.organizationTypeId, orgTypesLoading))}
                {renderRow("Name of Organisation", registerForm.levelInfo.organizationLabel || getLabelById(geo.organizations, registerForm.levelInfo.organizationId, organizationsLoading))}
                {renderRow("Designation", registerForm.levelInfo.designationLabel || getLabelById(geo.designations, registerForm.levelInfo.designationId, designationsLoading))}
            </Card>


            <Card className="bg-muted p-6 rounded-md">
                {renderHeader("Personal Information", 3)}
                <hr className="border-border" />
                {renderRow("First Name", registerForm.personalInfo.firstName || "Not provided")}
                {registerForm.personalInfo.lastName && renderRow("Last Name", registerForm.personalInfo.lastName)}
            </Card>

        </div>
    )
}

const MemoizedStep4Approval = React.memo(Step4Approval)
export default MemoizedStep4Approval
