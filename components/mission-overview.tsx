"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { NewMissionDialog } from "@/components/new-mission-dialog"
import type { Mission } from "@/lib/types"

interface MissionOverviewProps {
  missions: Mission[]
  loading: boolean
  error: Error | null
  onMissionSelect: (missionId: string) => void
}

export function MissionOverview({ missions, loading, error, onMissionSelect }: MissionOverviewProps) {
  const [showNewMissionDialog, setShowNewMissionDialog] = useState(false)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Mission Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="p-6">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-between">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-destructive">
          <p>Failed to load missions: {error.message}</p>
          <Button variant="outline" className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Mission Overview</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button onClick={() => setShowNewMissionDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Mission
          </Button>
        </div>
      </div>

      {missions.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <Plus className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Active Missions</h3>
          <p className="text-muted-foreground mb-6">Start a new mission to deploy your autonomous agents</p>
          <Button onClick={() => setShowNewMissionDialog(true)}>Start New Mission</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} onSelect={() => onMissionSelect(mission.id)} />
          ))}
        </div>
      )}

      <NewMissionDialog open={showNewMissionDialog} onOpenChange={setShowNewMissionDialog} />
    </div>
  )
}

interface MissionCardProps {
  mission: Mission
  onSelect: () => void
}

function MissionCard({ mission, onSelect }: MissionCardProps) {
  const getRiskColor = (risk: "low" | "medium" | "high") => {
    switch (risk) {
      case "low":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "high":
        return "bg-red-500"
      default:
        return "bg-green-500"
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{mission.title}</CardTitle>
          <div className={`h-3 w-3 rounded-full ${getRiskColor(mission.risk)}`} />
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{mission.progress}%</span>
          </div>
          <Progress value={mission.progress} className="h-2" />
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-4 w-4" />
          <span>ETA: {mission.eta}</span>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between">
        <Button variant={mission.status === "active" ? "outline" : "default"} size="sm">
          {mission.status === "active" ? "Pause" : "Resume"}
        </Button>
        <Button variant="secondary" size="sm" onClick={onSelect}>
          Details
        </Button>
      </CardFooter>
    </Card>
  )
}
