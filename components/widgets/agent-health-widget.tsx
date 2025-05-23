"use client"

import { MoreHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AgentHealthWidgetProps {
  id: string
  title: string
  onRemove: (id: string) => void
}

export function AgentHealthWidget({ id, title, onRemove }: AgentHealthWidgetProps) {
  // Mock agent health data
  const agents = [
    { id: "agent-001", name: "Data Processor", cpu: 78, memory: 65, errorRate: 0.2 },
    { id: "agent-002", name: "Network Agent", cpu: 45, memory: 30, errorRate: 0 },
    { id: "agent-003", name: "Compute Engine", cpu: 92, memory: 80, errorRate: 1.5 },
    { id: "agent-004", name: "Storage Manager", cpu: 25, memory: 40, errorRate: 0 },
  ]

  // Get color based on usage percentage
  const getUsageColor = (value: number) => {
    if (value < 50) return "bg-green-500"
    if (value < 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  // Get color based on error rate
  const getErrorColor = (value: number) => {
    if (value === 0) return "bg-green-500"
    if (value < 1) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card>
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
        <div className="space-y-4">
          {agents.map((agent) => (
            <div key={agent.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{agent.name}</span>
                <div className="flex items-center space-x-1">
                  <div className={`h-2 w-2 rounded-full ${getUsageColor(agent.cpu)}`} />
                  <div className={`h-2 w-2 rounded-full ${getUsageColor(agent.memory)}`} />
                  <div className={`h-2 w-2 rounded-full ${getErrorColor(agent.errorRate)}`} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1 text-xs">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">CPU</span>
                  <span>{agent.cpu}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Memory</span>
                  <span>{agent.memory}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Error Rate</span>
                  <span>{agent.errorRate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
