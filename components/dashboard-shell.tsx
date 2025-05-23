"use client"

import type React from "react"

import { useState } from "react"
import { Command, Grid3X3, LayoutDashboard, LogOut, Map, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DashboardShellProps {
  children: React.ReactNode
  activeView: "overview" | "workflow" | "control"
  onViewChange: (view: "overview" | "workflow" | "control") => void
  wsStatus: "connecting" | "connected" | "disconnected"
}

export function DashboardShell({ children, activeView, onViewChange, wsStatus }: DashboardShellProps) {
  const [open, setOpen] = useState(true)

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full overflow-hidden bg-muted/20">
        <Sidebar variant="inset">
          <SidebarHeader className="flex flex-col items-start px-4 py-2">
            <div className="flex items-center">
              <Command className="mr-2 h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Neo</h1>
            </div>
            <p className="text-xs text-muted-foreground">Drone1 Control Center</p>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeView === "overview"}
                  onClick={() => onViewChange("overview")}
                  tooltip="Mission Overview"
                >
                  <LayoutDashboard />
                  <span>Mission Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeView === "workflow"}
                  onClick={() => onViewChange("workflow")}
                  tooltip="Workflow Map"
                >
                  <Map />
                  <span>Workflow Map</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeView === "control"}
                  onClick={() => onViewChange("control")}
                  tooltip="Control Panel"
                >
                  <Grid3X3 />
                  <span>Control Panel</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant={wsStatus === "connected" ? "success" : wsStatus === "connecting" ? "warning" : "destructive"}
                  className="h-2 w-2 rounded-full p-0"
                />
                <span className="text-xs text-muted-foreground">
                  {wsStatus === "connected"
                    ? "Connected"
                    : wsStatus === "connecting"
                      ? "Connecting..."
                      : "Disconnected"}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>OP</AvatarFallback>
                    </Avatar>
                    <span>Operations Lead</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col">
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
