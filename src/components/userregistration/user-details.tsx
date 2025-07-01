"use client"

import { useNavigate } from "react-router-dom"
import { HeaderWithApi } from "../homepage/header-with-api"
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"
import type { RootState } from "@/app/store"
import { useState, useEffect } from "react"
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

// Types for API integration
interface UserDetailsData {
  userId: string;
  registrationId: string;
  personalInfo: {
    firstName: string;
    lastName?: string;
  };
  contactInfo: {
    mobileNumber: string;
    whatsappNumber: string;
    email: string;
  };
  levelInfo: {
    selectedLevel: string;
    state: string;
    stateLabel: string;
    division?: string;
    divisionLabel?: string;
    district?: string;
    districtLabel?: string;
    block?: string;
    blockLabel?: string;
    sector?: string;
    sectorLabel?: string;
    organizationTypeId: string;
    organizationTypeLabel: string;
    organizationId: string;
    organizationLabel: string;
    designationId: string;
    designationLabel: string;
  };
  approvalStatus: {
    status: 'pending' | 'approved' | 'rejected';
    requestId: string;
    submittedAt: string;
    message: string;
  };
}

export default function UserDetailsPage() {
  const navigate = useNavigate()
  const [userDetailsData, setUserDetailsData] = useState<UserDetailsData | null>(null)
  const [loading, setLoading] = useState(true)

  // Redux state as fallback
  const { contactInfo, levelInfo, personalInfo } = useSelector((state: RootState) => state.registerForm)
  const geo = useSelector((state: RootState) => state.geoData)

  // RTK Query hooks to fetch geo data for display
  const { data: states = [] } = useGetStatesQuery()
  const { data: divisions = [] } = useGetDivisionsQuery(
    (userDetailsData?.levelInfo.state || levelInfo.state) || '', {
    skip: !(userDetailsData?.levelInfo.state || levelInfo.state)
  })
  const { data: districts = [] } = useGetDistrictsQuery(
    (userDetailsData?.levelInfo.division || levelInfo.division) || '', {
    skip: !(userDetailsData?.levelInfo.division || levelInfo.division)
  })
  const { data: blocks = [] } = useGetBlocksQuery(
    (userDetailsData?.levelInfo.district || levelInfo.district) || '', {
    skip: !(userDetailsData?.levelInfo.district || levelInfo.district)
  })
  const { data: sectors = [] } = useGetSectorsQuery(
    (userDetailsData?.levelInfo.block || levelInfo.block) || '', {
    skip: !(userDetailsData?.levelInfo.block || levelInfo.block)
  })
  const { data: orgTypes = [] } = useGetOrgTypesQuery(
    (userDetailsData?.levelInfo.state || levelInfo.state) || '', {
    skip: !(userDetailsData?.levelInfo.state || levelInfo.state)
  })
  const { data: organizations = [] } = useGetOrganizationsQuery(
    (userDetailsData?.levelInfo.organizationTypeId || levelInfo.organizationTypeId) || '', {
    skip: !(userDetailsData?.levelInfo.organizationTypeId || levelInfo.organizationTypeId)
  })
  const { data: designations = [] } = useGetDesignationsQuery(
    (userDetailsData?.levelInfo.organizationId || levelInfo.organizationId) || '', {
    skip: !(userDetailsData?.levelInfo.organizationId || levelInfo.organizationId)
  })

  // Combined geo data object
  const geoData = {
    states,
    divisions,
    districts,
    blocks,
    sectors,
    orgTypes,
    organizations,
    designations
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getLabelById = (list: any[], id: string | undefined) => {
    if (!id || !list || list.length === 0) return "-"
    return list.find((item) => item.id === id)?.name || "-"
  }

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // TODO: Uncomment when API is ready
        // const response = await fetch(`/auth/user-details/${userId}`, {
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json'
        //   }
        // });
        // const data = await response.json();
        // if (data.success) {
        //   setUserDetailsData(data.data);
        // }

        // MOCK: Fetch from localStorage for now
        const savedData = localStorage.getItem("userRegistrationData")
        if (savedData) {
          const parsedData = JSON.parse(savedData)
          console.log("📋 Loading user details from localStorage:", parsedData)
          console.log("🔍 Geographic IDs found:", {
            state: parsedData.state,
            division: parsedData.division,
            district: parsedData.district,
            block: parsedData.block,
            sector: parsedData.sector
          })
          
          // Transform localStorage data to match API structure
          const mockUserData: UserDetailsData = {
            userId: `user_${Date.now()}`,
            registrationId: `reg_${Date.now()}`,
            personalInfo: {
              firstName: parsedData.firstName || personalInfo.firstName,
              lastName: parsedData.lastName || personalInfo.lastName
            },
            contactInfo: {
              mobileNumber: parsedData.mobileNumber || contactInfo.mobileNumber,
              whatsappNumber: parsedData.whatsappNumber || contactInfo.whatsappNumber,
              email: parsedData.email || contactInfo.email
            },
            levelInfo: {
              selectedLevel: parsedData.selectedLevel || levelInfo.selectedLevel,
              state: parsedData.state || levelInfo.state,
              stateLabel: parsedData.stateLabel || levelInfo.stateLabel || "",
              division: parsedData.division || levelInfo.division,
              divisionLabel: parsedData.divisionLabel || levelInfo.divisionLabel || "",
              district: parsedData.district || levelInfo.district,
              districtLabel: parsedData.districtLabel || levelInfo.districtLabel || "",
              block: parsedData.block || levelInfo.block,
              blockLabel: parsedData.blockLabel || levelInfo.blockLabel || "",
              sector: parsedData.sector || levelInfo.sector,
              sectorLabel: parsedData.sectorLabel || levelInfo.sectorLabel || "",
              organizationTypeId: parsedData.organizationTypeId || levelInfo.organizationTypeId,
              organizationTypeLabel: parsedData.organizationTypeLabel || levelInfo.organizationTypeLabel,
              organizationId: parsedData.organizationId || levelInfo.organizationId,
              organizationLabel: parsedData.organizationLabel || levelInfo.organizationLabel,
              designationId: parsedData.designationId || levelInfo.designationId,
              designationLabel: parsedData.designationLabel || levelInfo.designationLabel
            },
            approvalStatus: {
              status: 'pending',
              requestId: `KB-APP-${Date.now()}`,
              submittedAt: new Date().toISOString(),
              message: "Request for approval has been sent to higher authorities"
            }
          }
          
          setUserDetailsData(mockUserData)
        } else {
          // Fallback to Redux state if no localStorage data
          console.log("⚠️ No localStorage data found, using Redux state")
        }
      } catch (error) {
        console.error("❌ Error fetching user details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserDetails()
  }, [personalInfo, contactInfo, levelInfo])

  const handleBackToLogin = () => navigate("/")

  const renderRow = (label: string, value: string) => (
    <div className="flex">
      <span className="w-1/3 text-gray-500">{label}:</span>
      <span className="w-2/3 font-medium text-primary">{value || "-"}</span>
    </div>
  )

  // Get current data (from API response or fallback to Redux)
  const currentData = userDetailsData || {
    personalInfo: personalInfo,
    contactInfo: contactInfo,
    levelInfo: levelInfo,
    approvalStatus: {
      status: 'pending' as const,
      requestId: `KB-APP-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      message: "Request for approval has been sent to higher authorities"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderWithApi />

      <main className="py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">User Registration Details</h1>

            {/* Personal Info */}
            <div className="mb-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Personal Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                {renderRow("First Name", currentData.personalInfo.firstName)}
                {renderRow("Last Name", currentData.personalInfo.lastName || "-")}
                {renderRow("Mobile Number", currentData.contactInfo.mobileNumber)}
                {renderRow("WhatsApp Number", currentData.contactInfo.whatsappNumber)}
                {renderRow("Email", currentData.contactInfo.email)}
              </div>
            </div>

            {/* User Info */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">User Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                {renderRow("Level", currentData.levelInfo.selectedLevel)}
                {renderRow("State", currentData.levelInfo.stateLabel || getLabelById(geoData.states, currentData.levelInfo.state))}
                {renderRow("Division", currentData.levelInfo.divisionLabel || getLabelById(geoData.divisions, currentData.levelInfo.division))}
                {renderRow("District", currentData.levelInfo.districtLabel || getLabelById(geoData.districts, currentData.levelInfo.district))}
                {renderRow("Block", currentData.levelInfo.blockLabel || getLabelById(geoData.blocks, currentData.levelInfo.block))}
                {renderRow("Sector/PHC", currentData.levelInfo.sectorLabel || getLabelById(geoData.sectors, currentData.levelInfo.sector))}
                {renderRow("Organization Type", currentData.levelInfo.organizationTypeLabel || getLabelById(geoData.orgTypes, currentData.levelInfo.organizationTypeId))}
                {renderRow("Organization", currentData.levelInfo.organizationLabel || getLabelById(geoData.organizations, currentData.levelInfo.organizationId))}
                {renderRow("Designation", currentData.levelInfo.designationLabel || getLabelById(geoData.designations, currentData.levelInfo.designationId))}
              </div>
            </div>

            {/* Approval Section */}
            <div className="bg-red-50 border border-red-100 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold text-red-600 mb-1">Approval pending</h3>
              <p className="text-gray-700 mb-2">
                Request Id: <span className="text-primary font-semibold">#{currentData.approvalStatus.requestId}</span>
              </p>
              <p className="text-gray-600 mb-4">
                {currentData.approvalStatus.message}. Kindly wait for the approval.
                After approval you will be able to log in to your dashboard.
              </p>
              <a href="#" className="text-primary hover:underline font-medium">
                Contact Your Admin
              </a>
              <div className="mt-4">
                <Button className="bg-primary hover:bg-primary/90" onClick={handleBackToLogin}>
                  Back to Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
