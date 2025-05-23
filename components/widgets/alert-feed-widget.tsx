"use client"

import { useState } from "react"
import { AlertTriangle, ChevronDown, ChevronUp, MoreHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface Alert {
  id: string
  timestamp: string
  level: "info" | "warning" | "error"
  title: string
  description: string
  source: string
}

interface AlertFeedWidgetProps {
  id: string
  title: string
  onRemove: (id: string) => void
}

export function AlertFeedWidget({ id, title, onRemove }: AlertFeedWidgetProps) {
  const [isOpen, setIsOpen] = useState(true)

  // Mock alerts data
  const alerts: Alert[] = [
    {
      id: "alert-1",
      timestamp: "11:42 AM",
      level: "error",
      title: "High CPU Usage",
      description: "Agent Compute Engine (agent-003) is experiencing high CPU usage (92%).",
      source: "System Monitor",
    },
    {
      id: "alert-2",
      timestamp: "11:30 AM",
      level: "warning",
      title: "Network Latency",
      description: "Increased network latency detected in data transmission sub-goal.",
      source: "Network Monitor",
    },
    {
      id: "alert-3",
      timestamp: "11:15 AM",
      level: "info",
      title: "Sub-goal Completed",
      description: "Data preprocessing sub-goal has been completed successfully.",
      source: "Mission Controller",
    },
    {
      id: "alert-4",
      timestamp: "10:58 AM",
      level: "warning",
      title: "Memory Usage",
      description: "Agent Compute Engine (agent-003) memory usage is approaching threshold (80%).",
      source: "System Monitor",
    },
    {
      id: "alert-5",
      timestamp: "10:45 AM",
      level: "info",
      title: "New Agent Deployed",
      description: "Storage Manager agent (agent-004) has been deployed to the swarm.",
      source: "Deployment Service",
    },
  ]

  // Get badge variant based on alert level
  const getBadgeVariant = (level: string) => {
    switch (level) {
      case "error":
        return "destructive"
      case "warning":
        return "warning"
      case "info":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <Card className="row-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Refresh</DropdownMenuItem>
            <DropdownMenuItem>Clear All</DropdownMenuItem>
            <DropdownMenuItem>Configure</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onRemove(id)}>
              <X className="mr-2 h-4 w-4" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Recent Alerts</span>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <ScrollArea className="h-[350px]">
              <div className="space-y-4 pr-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={getBadgeVariant(alert.level)}>
                        {alert.level.charAt(0).toUpperCase() + alert.level.slice(1)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                    </div>
                    <h4 className="mt-2 text-sm font-medium">{alert.title}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">{alert.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Source: {alert.source}</span>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        Dismiss
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
