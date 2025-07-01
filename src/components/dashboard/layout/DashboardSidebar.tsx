"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Map, Building2, Users, ChevronDown, ChevronRight } from "lucide-react"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

export function DashboardSidebar() {
  const location = useLocation()
  useSidebar()
  const [openGroups, setOpenGroups] = useState({
    geographies: true,
    healthFacilities: true,
    healthWorkers: true,
  })

  
  const isActive = (path: string) => location.pathname === path

  const toggleGroup = (group: keyof typeof openGroups) => {
    setOpenGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }))
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-gray-200 py-4">
        <div className="flex flex-col px-4">
          <div className="font-bold text-xl text-text-gray">CHIP</div>
          <div className="text-accent text-sm">Dashboard</div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <div className="py-2 text-xs font-medium text-gray-500 px-4">MAIN MENU</div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard")} className="gap-4">
              <Link to="/dashboard" className="flex items-center">
                <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Geographies */}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => toggleGroup("geographies")} className="justify-between gap-4">
              <div className="flex items-center gap-4">
                <Map className="h-5 w-5 flex-shrink-0" />
                <span>Geographies</span>
              </div>
              {openGroups.geographies ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </SidebarMenuButton>

            {openGroups.geographies && (
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={isActive("/state")}>
                    <Link to="/state">State</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={isActive("/district")}>
                    <Link to="/district" className="flex justify-between">
                      <span>District</span>
                      <span className="ml-auto bg-accent text-white text-xs rounded-full px-1.5 py-0.5">3</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={isActive("/block")}>
                    <Link to="/block">Block</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={isActive("/panchayat")}>
                    <Link to="/panchayat">Panchayat</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={isActive("/village")}>
                    <Link to="/village">Village</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>

          {/* Health Facilities */}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => toggleGroup("healthFacilities")} className="justify-between gap-4">
              <div className="flex items-center gap-4">
                <Building2 className="h-5 w-5 flex-shrink-0" />
                <span>Health Facilities</span>
              </div>
              {openGroups.healthFacilities ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </SidebarMenuButton>

            {openGroups.healthFacilities && (
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={isActive("/district-hospital")}>
                    <Link to="/district-hospital">District Hospital</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={isActive("/sub-district-hospital")}>
                    <Link to="/sub-district-hospital" className="flex justify-between">
                      <span>Sub-District Hospital</span>
                      <span className="ml-auto bg-accent text-white text-xs rounded-full px-1.5 py-0.5">2</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={isActive("/chc-uchc")}>
                    <Link to="/chc-uchc">CHC/UCHC</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={isActive("/phc-uphc")}>
                    <Link to="/phc-uphc">PHC/UPHC</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={isActive("/sub-health-center")}>
                    <Link to="/sub-health-center">Sub-Health Center</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>

          {/* Health Workers */}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => toggleGroup("healthWorkers")} className="justify-between gap-4">
              <div className="flex items-center gap-4">
                <Users className="h-5 w-5 flex-shrink-0" />
                <span>Health Workers</span>
              </div>
              {openGroups.healthWorkers ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </SidebarMenuButton>

            {openGroups.healthWorkers && (
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={isActive("/application-users")}>
                    <Link to="/application-users">Application Users</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={isActive("/dashboard-users")}>
                    <Link to="/dashboard-users" className="flex justify-between">
                      <span>Dashboard Users</span>
                      <span className="ml-auto bg-accent text-white text-xs rounded-full px-1.5 py-0.5">200</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
