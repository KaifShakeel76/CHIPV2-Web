"use client"

import { ArrowLeft, CheckCircle, Lock, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface UserDetailsContentProps {
  userId?: string
}

// eslint-disable-next-line no-empty-pattern
export function UserDetailsContent({ }: UserDetailsContentProps) {
  const navigate = useNavigate()

  const [isApproved, setIsApproved] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [programPermissionsEnabled, setProgramPermissionsEnabled] = useState(false)
  const [adminPermissionsEnabled, setAdminPermissionsEnabled] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)

  const userData = {
    id: "1",
    
    name: "Kane Williamson",
    department: "Medical Officer",
    avatar: "/placeholder.svg?height=80&width=80",
    status: "online",
    mobile: "9785097850",
    whatsapp: "9785097850",
    email: "email@gmail.com",
    stateName: "Rajasthan",
    divisionName: "Jaipur",
    districtName: "Jaipur",
    blockName: "Adarsh Nagar",
    organizationType: "Government",
    organizationName: "NHM",
    designation: "Program Director",
    healthFacilityId: "---",
    hfrId: "---",
    ninId: "---",
    ashaId: "---",
  }

  const programPermissions = [
    {
      id: "dhs",
      title: "DHS",
      permissions: ["Permission 1", "Permission 2", "Permission 3", "Permission 4"],
    },
    {
      id: "family-planning",
      title: "Family Planning",
      permissions: ["Family Planning Permission 1", "Family Planning Permission 2"],
    },
    {
      id: "maternal-health",
      title: "Maternal Health",
      permissions: ["Maternal Health Permission 1", "Maternal Health Permission 2"],
    },
    {
      id: "child-health",
      title: "Child Health",
      permissions: ["Child Health Permission 1", "Child Health Permission 2"],
    },
    {
      id: "immunization",
      title: "Immunization",
      permissions: ["Immunization Permission 1", "Immunization Permission 2"],
    },
  ]

  const adminPermissions = [
    {
      id: "user-permissions",
      title: "User Permissions",
      permissions: ["User Management", "Role Assignment"],
    },
    {
      id: "geography-permissions",
      title: "Geography Permissions",
      permissions: ["State Access", "District Access"],
    },
    {
      id: "health-facility-permissions",
      title: "Health Facility Permissions",
      permissions: ["Facility Management", "Facility Reports"],
    },
    {
      id: "admin-level-permissions",
      title: "Admin Level Permissions",
      permissions: ["System Settings", "User Administration"],
    },
  ]

  const handleBack = () => {
    navigate("/")
  }

  const handleApprove = async () => {
    setIsProcessing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsApproved(true)
    setIsProcessing(false)
  }

  const handleReject = () => {
    setShowRejectionDialog(true)
  }

  const handleConfirmRejection = async () => {
    setShowRejectionDialog(false)
    setIsProcessing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsProcessing(false)
    navigate("/")
  }

  const handleCancelRejection = () => {
    setShowRejectionDialog(false)
  }

  const handleSaveAndApprove = () => {
    setShowConfirmationDialog(true)
  }

  const handleConfirmApproval = async () => {
    setShowConfirmationDialog(false)
    setIsProcessing(true)
    // Simulate API call to save permissions and approve
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsProcessing(false)
    navigate("/")
  }

  const handleCancelApproval = () => {
    setShowConfirmationDialog(false)
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  return (
    <div className="flex flex-col gap-2 flex-1 overflow-x-hidden">
      {/* Back Button */}
      <div className="flex items-center gap-4 p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="flex items-center gap-2 text-[#303030] hover:text-[#182E6F]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-2 flex-1 w-full">
        {/* Left Panel - User Profile */}
        <div className="w-full lg:w-[400px] bg-white rounded-2xl p-4 flex flex-col gap-4">
          {/* Application User Header */}
          <div className="bg-[#EBECEE] p-3 rounded-lg">
            <span className="text-base font-medium text-[#303030] ">Application User</span>
          </div>

          {/* User Profile */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <img
                  src={userData.avatar || "/placeholder.svg?height=80&width=80"}
                  alt={userData.name}
                  className="w-20 h-20 rounded-full border-3 border-[#34A853]"
                />
              </div>
              <Badge variant="outline" className="bg-white border-[#34A853] text-[#303030] px-4 py-1">
                Online
              </Badge>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-medium text-[#303030]  mb-1">{userData.name}</h2>
              <p className="text-base text-[#808080] ">{userData.department}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200" />

          {/* Account Details */}
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-normal text-[#303030] ">Accounts Details</h3>
              <div className="w-15 h-0.5 bg-[#182E6F]" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-1">
                <span className="text-base text-[#808080] ">Mobile No.</span>
                <div className="flex items-center gap-2">
                  <span className="text-base text-[#303030] ">{userData.mobile}</span>
                  <CheckCircle className="w-4 h-4 text-[#34A853]" />
                </div>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-base text-[#808080] ">WhatsApp No.</span>
                <span className="text-base text-[#303030] ">{userData.whatsapp}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-base text-[#808080] ">Primary Email</span>
                <div className="flex items-center gap-2">
                  <span className="text-base text-[#303030]  break-all">{userData.email}</span>
                  <CheckCircle className="w-4 h-4 text-[#34A853] flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-normal text-[#303030] ">Employment Information</h3>
              <div className="w-15 h-0.5 bg-[#182E6F]" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-1">
                <span className="text-base text-[#808080] ">Health Facility ID</span>
                <span className="text-base text-[#303030] ">{userData.healthFacilityId}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-base text-[#808080] ">HFR ID</span>
                <span className="text-base text-[#303030] ">{userData.hfrId}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-base text-[#808080] ">NIN ID</span>
                <span className="text-base text-[#303030] ">{userData.ninId}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-base text-[#808080] ">ASHA ID</span>
                <span className="text-base text-[#303030] ">{userData.ashaId}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons - Only show if not approved */}
          {!isApproved && (
            <div className="flex gap-2 mt-auto pt-4">
              <Button
                onClick={handleReject}
                disabled={isProcessing}
                className="flex-1 bg-[#E42D23] hover:bg-[#C41E1A] text-white h-12 text-lg font-normal disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : "Reject"}
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isProcessing}
                className="flex-1 bg-[#3D8C40] hover:bg-[#2F6B32] text-white h-12 text-lg font-medium disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : "Approve"}
              </Button>
            </div>
          )}
        </div>

        {/* Right Panel - Details */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {/* Top Row - Basic Info */}
          <div className="flex flex-col lg:flex-row gap-2">
            <div className="flex-1 bg-white rounded-2xl p-4 min-w-0">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-medium text-[#303030] ">Heading Title</h3>
                  <div className="w-15 h-0.5 bg-[#182E6F]" />
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between">
                    <span className="text-base text-[#808080]  sm:w-[40%]">State Name</span>
                    <span className="text-base text-[#303030]  sm:w-[60%]">{userData.stateName}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between">
                    <span className="text-base text-[#808080]  sm:w-[40%]">Division Name</span>
                    <span className="text-base text-[#303030]  sm:w-[60%]">
                      {userData.divisionName}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between">
                    <span className="text-base text-[#808080]  sm:w-[40%]">District Name</span>
                    <span className="text-base text-[#303030]  sm:w-[60%]">
                      {userData.districtName}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between">
                    <span className="text-base text-[#808080]  sm:w-[40%]">Block Name</span>
                    <span className="text-base text-[#303030]  sm:w-[60%]">{userData.blockName}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white rounded-2xl p-4 min-w-0">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-medium text-[#303030] ">Heading Title</h3>
                  <div className="w-15 h-0.5 bg-[#182E6F]" />
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between">
                    <span className="text-base text-[#808080]  sm:w-[40%]">Type of Organization</span>
                    <span className="text-base text-[#303030]  sm:w-[60%]">
                      {userData.organizationType}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between">
                    <span className="text-base text-[#808080]  sm:w-[40%]">Name of Organization</span>
                    <span className="text-base text-[#303030]  sm:w-[60%]">
                      {userData.organizationName}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between">
                    <span className="text-base text-[#808080]  sm:w-[40%]">Designation</span>
                    <span className="text-base text-[#303030]  sm:w-[60%]">{userData.designation}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Permissions */}
          <div className="flex flex-col lg:flex-row gap-2 flex-1">
            {/* Program Permissions */}
            <div className="flex-1 bg-white rounded-2xl p-4 min-w-0">
              <div className="flex flex-col gap-4 h-full">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <h3
                      className={`text-lg font-medium  ${isApproved ? "text-[#303030]" : "text-[#808080]"}`}
                    >
                      Program Permissions
                    </h3>
                    <div className="w-15 h-0.5 bg-[#182E6F]" />
                  </div>
                  <Switch
                    disabled={!isApproved}
                    checked={programPermissionsEnabled}
                    onCheckedChange={setProgramPermissionsEnabled}
                    className={`${
                      isApproved
                        ? programPermissionsEnabled
                          ? "data-[state=checked]:bg-[#E2E3FF]"
                          : "data-[state=unchecked]:bg-[#EBECEE]"
                        : "opacity-50 cursor-not-allowed"
                    } w-[36px] h-[16px] h-[12px] w-[12px] bg-[#182E6F]`}
                  />
                </div>

                {!isApproved && (
                  <div className="flex items-center justify-center p-4 bg-[#F6F6F8] rounded-xl">
                    <div className="text-center">
                      <Lock className="w-8 h-8 text-[#808080] mx-auto mb-2" />
                      <p className="text-sm text-[#808080] ">
                        Permissions will be available after approval
                      </p>
                    </div>
                  </div>
                )}

                {isApproved && !programPermissionsEnabled && (
                  <div className="flex items-center justify-center p-4 bg-[#F6F6F8] rounded-xl">
                    <div className="text-center">
                      <p className="text-sm text-[#808080] ">
                        Enable Program Permissions to configure settings
                      </p>
                    </div>
                  </div>
                )}

                {isApproved && programPermissionsEnabled && (
                  <div className="flex-1 min-h-0">
                    <ScrollArea className="h-full max-h-[500px]">
                      <div className="space-y-2 pr-4">
                        {programPermissions.map((section) => (
                          <Collapsible
                            key={section.id}
                            open={expandedSections.includes(section.id)}
                            onOpenChange={() => toggleSection(section.id)}
                          >
                            <CollapsibleTrigger className="w-full">
                              <div
                                className={`flex items-center justify-between p-3 rounded-xl hover:bg-[#EEEEEE] cursor-pointer ${
                                  expandedSections.includes(section.id) ? "bg-[#E2E3FF]" : "bg-[#F6F6F8]"
                                }`}
                              >
                                <span className="text-lg font-medium text-[#303030] ">
                                  {section.title}
                                </span>
                                <ChevronDown
                                  className={`w-4 h-4 text-[#363636] transition-transform ${
                                    expandedSections.includes(section.id) ? "rotate-180" : ""
                                  }`}
                                />
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="mt-2 space-y-2 pl-4">
                                {section.permissions.map((permission, index) => (
                                  <div key={index} className="flex items-center space-x-2 p-2">
                                    <Checkbox id={`${section.id}-${index}`} />
                                    <label
                                      htmlFor={`${section.id}-${index}`}
                                      className="text-base text-[#303030]  cursor-pointer"
                                    >
                                      {permission}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Permissions */}
            <div className="flex-1 bg-white rounded-2xl p-4 min-w-0">
              <div className="flex flex-col gap-4 h-full">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <h3
                      className={`text-lg font-medium  ${isApproved ? "text-[#303030]" : "text-[#808080]"}`}
                    >
                      Admin Permissions
                    </h3>
                    <div className="w-15 h-0.5 bg-[#182E6F]" />
                  </div>
                  <Switch
                    disabled={!isApproved}
                    checked={adminPermissionsEnabled}
                    onCheckedChange={setAdminPermissionsEnabled}
                    className={`${
                      isApproved
                        ? adminPermissionsEnabled
                          ? "data-[state=checked]:bg-[#E2E3FF]"
                          : "data-[state=unchecked]:bg-[#EBECEE]"
                        : "opacity-50 cursor-not-allowed"
                    } w-[36px] h-[16px]`}
                  />
                </div>

                {!isApproved && (
                  <div className="flex items-center justify-center p-4 bg-[#F6F6F8] rounded-xl">
                    <div className="text-center">
                      <Lock className="w-8 h-8 text-[#808080] mx-auto mb-2" />
                      <p className="text-sm text-[#808080] ">
                        Permissions will be available after approval
                      </p>
                    </div>
                  </div>
                )}

                {isApproved && !adminPermissionsEnabled && (
                  <div className="flex items-center justify-center p-4 bg-[#F6F6F8] rounded-xl">
                    <div className="text-center">
                      <p className="text-sm text-[#808080] ">
                        Enable Admin Permissions to configure settings
                      </p>
                    </div>
                  </div>
                )}

                {isApproved && adminPermissionsEnabled && (
                  <div className="flex-1 min-h-0">
                    <ScrollArea className="h-full max-h-[500px]">
                      <div className="space-y-2 pr-4">
                        {adminPermissions.map((section) => (
                          <Collapsible
                            key={section.id}
                            open={expandedSections.includes(section.id)}
                            onOpenChange={() => toggleSection(section.id)}
                          >
                            <CollapsibleTrigger className="w-full">
                              <div
                                className={`flex items-center justify-between p-3 rounded-xl hover:bg-[#EEEEEE] cursor-pointer ${
                                  expandedSections.includes(section.id) ? "bg-[#E2E3FF]" : "bg-[#F6F6F8]"
                                }`}
                              >
                                <span className="text-lg font-medium text-[#303030] ">
                                  {section.title}
                                </span>
                                <ChevronDown
                                  className={`w-4 h-4 text-[#363636] transition-transform ${
                                    expandedSections.includes(section.id) ? "rotate-180" : ""
                                  }`}
                                />
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="mt-2 space-y-2 pl-4">
                                {section.permissions.map((permission, index) => (
                                  <div key={index} className="flex items-center space-x-2 p-2">
                                    <Checkbox id={`${section.id}-${index}`} />
                                    <label
                                      htmlFor={`${section.id}-${index}`}
                                      className="text-base text-[#303030]  cursor-pointer"
                                    >
                                      {permission}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons - Only show when approved */}
      {isApproved && (
        <div className="flex justify-end items-center p-4 gap-2 bg-white rounded-2xl">
          <Button
            onClick={handleReject}
            disabled={isProcessing}
            className="bg-[#E42D23] hover:bg-[#C41E1A] text-white h-12 px-6 text-lg font-normal disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Reject"}
          </Button>
          <Button
            onClick={handleSaveAndApprove}
            disabled={isProcessing}
            className="bg-[#3D8C40] hover:bg-[#2F6B32] text-white h-12 px-6 text-lg font-medium disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Save & Approve"}
          </Button>
        </div>
      )}

      {/* Approval Confirmation Dialog */}
      <Dialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
        <DialogContent className="w-[500px] h-[300px] p-5 gap-5 flex flex-col items-center justify-center">
          {/* Icon Section */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.09067 27.1996C1.07284 30.7438 0.0642171 32.5165 0.214931 33.9706C0.346391 35.239 1.00283 36.3912 2.02029 37.1409C3.18637 38 5.20295 38 9.23586 38H30.7645C34.7974 38 36.8137 38 37.9798 37.1409C38.9972 36.3912 39.654 35.239 39.7854 33.9706C39.9362 32.5165 38.9278 30.7437 36.91 27.1996L26.1495 8.29967C24.1317 4.75552 23.1223 2.98375 21.8051 2.38904C20.6562 1.87032 19.3434 1.87032 18.1945 2.38904C16.8779 2.9835 15.8691 4.75528 13.853 8.29649L3.09067 27.1996ZM20.0002 8.3C20.9943 8.3 21.8002 9.10589 21.8002 10.1V24.5C21.8002 25.4941 20.9943 26.3 20.0002 26.3C19.0061 26.3 18.2002 25.4941 18.2002 24.5V10.1C18.2002 9.10589 19.0061 8.3 20.0002 8.3ZM20.0002 33.5C20.9943 33.5 21.8002 32.6941 21.8002 31.7C21.8002 30.7059 20.9943 29.9 20.0002 29.9C19.0061 29.9 18.2002 30.7059 18.2002 31.7C18.2002 32.6941 19.0061 33.5 20.0002 33.5Z"
                  fill="#FFD20A"
                />
              </svg>
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-[#303030]  text-center">
                Confirmation
              </DialogTitle>
            </DialogHeader>
          </div>

          {/* Text Section */}
          <div className="w-[460px] text-center">
            <p className="text-base font-normal text-[#808080]  leading-6">
              You've submitted your details. If everything looks correct, click 'Approve' to proceed or cancel to make
              changes
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end items-center gap-2 w-[460px]">
            <Button
              onClick={handleCancelApproval}
              className="w-[100px] h-12 bg-[#ECF1FF] hover:bg-[#D6D7F5] text-[#303030] text-lg font-normal  rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmApproval}
              disabled={isProcessing}
              className="w-[100px] h-12 bg-[#3D8C40] hover:bg-[#2F6B32] text-white text-lg font-medium  rounded-lg disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Approve"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rejection Confirmation Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent className="w-[512px] h-[304px] p-9 gap-12 flex flex-col items-center justify-center border border-[#CBD5E1] rounded-3xl">
          {/* Icon and Content Section */}
          <div className="flex flex-col items-center gap-5 w-[464px]">
            {/* Warning Icon */}
            <div className="w-15 h-15 flex items-center justify-center">
              <svg width="60" height="60" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.09067 27.1996C1.07284 30.7438 0.0642171 32.5165 0.214931 33.9706C0.346391 35.239 1.00283 36.3912 2.02029 37.1409C3.18637 38 5.20295 38 9.23586 38H30.7645C34.7974 38 36.8137 38 37.9798 37.1409C38.9972 36.3912 39.654 35.239 39.7854 33.9706C39.9362 32.5165 38.9278 30.7437 36.91 27.1996L26.1495 8.29967C24.1317 4.75552 23.1223 2.98375 21.8051 2.38904C20.6562 1.87032 19.3434 1.87032 18.1945 2.38904C16.8779 2.9835 15.8691 4.75528 13.853 8.29649L3.09067 27.1996ZM20.0002 8.3C20.9943 8.3 21.8002 9.10589 21.8002 10.1V24.5C21.8002 25.4941 20.9943 26.3 20.0002 26.3C19.0061 26.3 18.2002 25.4941 18.2002 24.5V10.1C18.2002 9.10589 19.0061 8.3 20.0002 8.3ZM20.0002 33.5C20.9943 33.5 21.8002 32.6941 21.8002 31.7C21.8002 30.7059 20.9943 29.9 20.0002 29.9C19.0061 29.9 18.2002 30.7059 18.2002 31.7C18.2002 32.6941 19.0061 33.5 20.0002 33.5Z"
                  fill="#EAC400"
                />
              </svg>
            </div>

            {/* Content */}
            <div className="flex flex-col items-center gap-2 w-[464px]">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-[#0F172A]  text-center">
                  Confirmation
                </DialogTitle>
              </DialogHeader>
              <p className="text-sm font-normal text-[#49454F]  leading-5 text-center w-[464px]">
                Please check all the details before rejecting.
              </p>
            </div>
          </div>

          {/* Button Section */}
          <div className="flex justify-end items-center gap-2 w-[464px]">
            <Button
              onClick={handleCancelRejection}
              className="w-[100px] h-12 bg-[#ECF1FF] hover:bg-[#D6D7F5] text-[#303030] text-lg font-medium  rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmRejection}
              disabled={isProcessing}
              className="w-[100px] h-12 bg-[#E42D23] hover:bg-[#C41E1A] text-white text-lg font-medium  rounded-lg disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Reject"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
