import { Bell, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function DashboardHeader() {
  return (
    <header className="bg-primary text-white py-2 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <SidebarTrigger className="mr-2 text-white" />
        <div className="flex items-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
            alt="Government of India Emblem"
            className="h-8 w-auto mr-2 sm:h-10 sm:mr-3"
          />
          <div>
            <h1 className="text-base sm:text-lg font-semibold">Dashboard</h1>
            <div className="text-xs opacity-80">Dashboard / Path</div>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <div className="hidden md:block mr-6 text-center">
          <div className="text-sm">Community Health Integrated Platform - CHIP 2</div>
        </div>

        <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-primary/80">
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-primary/80">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="John Wick" />
                <AvatarFallback>JW</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline">John Wick</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
