"use client"

import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  title?: string
  breadcrumbs?: Array<{ label: string; href?: string }>
  userName?: string
  userAvatar?: string
  onSearch?: (query: string) => void
  onDownload?: () => void
  className?: string
}

export function Header({
  title = "Application Users",
  breadcrumbs = [{ label: "Platform Users" }, { label: "Application Users" }],
  userName = "Kane",
  userAvatar = "/images/user-avatar.png",
}: HeaderProps) {
  return (
    <div className="flex items-center justify-between w-full h-[76px] bg-[#182E6F] px-6 py-3 rounded-xl">
      {/* Left Section - Title and Breadcrumbs */}
      <div className="flex flex-col">
        {/* Main Title */}
        <h1 className="text-white text-lg py-2 font-medium leading-tight">{title}</h1>

        {/* Breadcrumb */}
        <div className="flex items-center text-white/80 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <span key={index}>
              {index > 0 && <span className="mx-1">/</span>}
              {crumb.label}
            </span>
          ))}
        </div>
      </div>

      {/* Right Section - User Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors">
            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img
                src={userAvatar || "/placeholder.svg?height=32&width=32"}
                alt={userName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Name */}
            <span className="text-gray-700 text-sm font-medium">Hi, {userName}</span>

            {/* Dropdown Arrow */}
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile Settings</DropdownMenuItem>
          <DropdownMenuItem>Account Preferences</DropdownMenuItem>
          <DropdownMenuItem>Notifications</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Help & Support</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Sign Out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
