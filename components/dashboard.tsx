"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { MissionOverview } from "@/components/mission-overview"
import { WorkflowMap } from "@/components/workflow-map"
import { ControlPanel } from "@/components/control-panel"
import { IntentLauncher } from "@/components/intent-launcher"
import { useWebSocket } from "@/hooks/use-websocket"
import { useMissions } from "@/hooks/use-missions"

export function Dashboard() {
  const [activeView, setActiveView] = useState<"overview" | "workflow" | "control">("overview")
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null)
  const [showComments, setShowComments] = useState(false)

  // Initialize WebSocket connection for real-time updates
  const { status: wsStatus, lastEvent } = useWebSocket()

  // Fetch missions data
  const { missions, loading, error } = useMissions()

  // Handle mission selection
  const handleMissionSelect = (missionId: string) => {
    setSelectedMissionId(missionId)
    setActiveView("workflow")
  }

  // Toggle comments visibility
  const toggleComments = () => {
    setShowComments(!showComments)
  }

  // Generate shareable link
  const generateShareableLink = () => {
    const baseUrl = window.location.origin
    const params = new URLSearchParams()

    if (selectedMissionId) {
      params.append("mission", selectedMissionId)
    }

    params.append("view", activeView)

    return `${baseUrl}?${params.toString()}`
  }

  return (
    <DashboardShell activeView={activeView} onViewChange={setActiveView} wsStatus={wsStatus}>
      <IntentLauncher />

      {activeView === "overview" && (
        <MissionOverview missions={missions} loading={loading} error={error} onMissionSelect={handleMissionSelect} />
      )}

      {activeView === "workflow" && selectedMissionId && (
        <WorkflowMap
          missionId={selectedMissionId}
          showComments={showComments}
          onToggleComments={toggleComments}
          onShareView={generateShareableLink}
        />
      )}

      {activeView === "control" && <ControlPanel />}
    </DashboardShell>
  )
}
