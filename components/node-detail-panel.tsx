"use client"

import { useState } from "react"
import { AlertTriangle, Clock, Cpu, RefreshCw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReassignAgentDialog } from "@/components/reassign-agent-dialog"
import type { SubGoal } from "@/lib/types"

interface NodeDetailPanelProps {
  node: SubGoal
  onClose: () => void
}

export function NodeDetailPanel({ node, onClose }: NodeDetailPanelProps) {
  const [showReassignDialog, setShowReassignDialog] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in_progress":
        return "bg-blue-500"
      case "pending":
        return "bg-gray-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <>
      <Card className="w-96 ml-4 overflow-hidden flex flex-col">
        <CardHeader className="px-6 py-4 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-xl">{node.name}</CardTitle>
            <CardDescription>Sub-goal details</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <Tabs defaultValue="details" className="flex-1 flex flex-col">
          <TabsList className="mx-6 mb-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="flex-1 flex flex-col">
            <CardContent className="px-6 py-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant="outline" className="font-normal">
                    <div className={`mr-1.5 h-2 w-2 rounded-full ${getStatusColor(node.status)}`} />
                    {node.status
                      .split("_")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{node.progress}%</span>
                  </div>
                  <Progress value={node.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Assigned Agent</span>
                  <Badge variant="secondary" className="font-normal">
                    {node.assignedAgent}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">ETA</span>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                    <span>{node.eta}</span>
                  </div>
                </div>

                {node.dependencies && node.dependencies.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Dependencies</span>
                    <div className="flex flex-wrap gap-2">
                      {node.dependencies.map((depId) => (
                        <Badge key={depId} variant="outline">
                          {depId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <span className="text-sm font-medium">Description</span>
                  <p className="text-sm text-muted-foreground">{node.description || "No description available."}</p>
                </div>
              </div>
            </CardContent>

            <div className="mt-auto">
              <Separator />
              <CardFooter className="px-6 py-4">
                <div className="flex items-center justify-between w-full">
                  <Button variant="outline" size="sm" onClick={() => setShowReassignDialog(true)}>
                    <RefreshCw className="mr-2 h-3.5 w-3.5" />
                    Reassign
                  </Button>

                  {node.status !== "completed" && (
                    <Button variant={node.status === "in_progress" ? "outline" : "default"} size="sm">
                      {node.status === "in_progress" ? "Pause" : "Start"}
                    </Button>
                  )}
                </div>
              </CardFooter>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="flex-1 flex flex-col">
            <CardContent className="px-6 py-2 flex-1">
              <ScrollArea className="h-[400px] rounded-md border p-4">
                <div className="space-y-3 font-mono text-sm">
                  <div className="space-y-1">
                    <div className="flex">
                      <span className="text-muted-foreground mr-2">[10:42:15]</span>
                      <span>Starting sub-goal execution</span>
                    </div>
                    <div className="flex">
                      <span className="text-muted-foreground mr-2">[10:42:18]</span>
                      <span>Initializing resources</span>
                    </div>
                    <div className="flex">
                      <span className="text-muted-foreground mr-2">[10:43:05]</span>
                      <span>Processing data batch 1/10</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex">
                      <span className="text-muted-foreground mr-2">[10:45:22]</span>
                      <span>Processing data batch 2/10</span>
                    </div>
                    <div className="flex text-amber-500">
                      <span className="text-muted-foreground mr-2">[10:46:15]</span>
                      <span className="flex items-center">
                        <AlertTriangle className="mr-1 h-3.5 w-3.5" />
                        Warning: High latency detected
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-muted-foreground mr-2">[10:47:30]</span>
                      <span>Adjusting processing parameters</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex">
                      <span className="text-muted-foreground mr-2">[10:48:12]</span>
                      <span>Processing data batch 3/10</span>
                    </div>
                    <div className="flex">
                      <span className="text-muted-foreground mr-2">[10:50:05]</span>
                      <span>Processing data batch 4/10</span>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </TabsContent>

          <TabsContent value="metrics" className="flex-1 flex flex-col">
            <CardContent className="px-6 py-2">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <Cpu className="mr-1.5 h-4 w-4 text-muted-foreground" />
                      CPU Utilization
                    </span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Memory Usage</span>
                    <span className="font-medium">1.2 GB / 2 GB</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Network Throughput</span>
                    <span className="font-medium">42 MB/s</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Error Rate</span>
                    <span className="font-medium">0.5%</span>
                  </div>
                  <Progress value={0.5} className="h-2" />
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="text-sm font-medium mb-2">Performance Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg. Response Time</span>
                      <span>120ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Throughput</span>
                      <span>250 req/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Success Rate</span>
                      <span>99.5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>

      <ReassignAgentDialog open={showReassignDialog} onOpenChange={setShowReassignDialog} subGoal={node} />
    </>
  )
}
