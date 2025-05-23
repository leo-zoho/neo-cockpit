"use client"

import { useState, useEffect } from "react"
import type { Mission, SubGoal } from "@/lib/types"

export function useMissionDetails(missionId: string) {
  const [mission, setMission] = useState<Mission | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchMissionDetails = async () => {
      setLoading(true)

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Mock sub-goals
        const mockSubGoals: SubGoal[] = [
          {
            id: "data_collection",
            name: "Data Collection",
            description: "Collect raw data from sensors",
            status: "completed",
            progress: 100,
            eta: "0 minutes",
            assignedAgent: "Collection Agent",
            position: { x: 150, y: 100 },
          },
          {
            id: "data_processing",
            name: "Data Processing",
            description: "Process and clean collected data",
            status: "in_progress",
            progress: 65,
            eta: "45 minutes",
            assignedAgent: "Processing Agent",
            dependencies: ["data_collection"],
            position: { x: 350, y: 100 },
          },
          {
            id: "data_analysis",
            name: "Data Analysis",
            description: "Analyze processed data for insights",
            status: "pending",
            progress: 0,
            eta: "1 hour 30 minutes",
            assignedAgent: "Analysis Agent",
            dependencies: ["data_processing"],
            position: { x: 550, y: 100 },
          },
          {
            id: "network_transmission",
            name: "Network Transmission",
            description: "Transmit data to central servers",
            status: "in_progress",
            progress: 40,
            eta: "30 minutes",
            assignedAgent: "Network Agent",
            dependencies: ["data_processing"],
            position: { x: 350, y: 250 },
          },
          {
            id: "report_generation",
            name: "Report Generation",
            description: "Generate final reports",
            status: "pending",
            progress: 0,
            eta: "2 hours",
            assignedAgent: "Reporting Agent",
            dependencies: ["data_analysis", "network_transmission"],
            position: { x: 550, y: 250 },
          },
        ]

        // Mock mission with sub-goals
        const mockMission: Mission = {
          id: missionId,
          title: "Data Collection Mission",
          description: "Collect and process environmental data from urban areas",
          status: "active",
          progress: 65,
          eta: "2 hours 15 minutes",
          risk: "low",
          subGoals: mockSubGoals,
          createdAt: "2023-05-22T08:30:00Z",
          updatedAt: "2023-05-22T10:15:00Z",
        }

        setMission(mockMission)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch mission details"))
      } finally {
        setLoading(false)
      }
    }

    fetchMissionDetails()
  }, [missionId])

  return { mission, loading, error }
}
