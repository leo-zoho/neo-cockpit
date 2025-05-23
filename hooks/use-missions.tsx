"use client"

import { useState, useEffect } from "react"
import type { Mission } from "@/lib/types"

export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchMissions = async () => {
      setLoading(true)

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock missions data
        const mockMissions: Mission[] = [
          {
            id: "mission-1",
            title: "Data Collection Mission",
            description: "Collect and process environmental data from urban areas",
            status: "active",
            progress: 65,
            eta: "2 hours 15 minutes",
            risk: "low",
            createdAt: "2023-05-22T08:30:00Z",
            updatedAt: "2023-05-22T10:15:00Z",
          },
          {
            id: "mission-2",
            title: "Emergency Response",
            description: "Coordinate emergency response for flooding in sector B",
            status: "active",
            progress: 42,
            eta: "45 minutes",
            risk: "high",
            createdAt: "2023-05-22T09:45:00Z",
            updatedAt: "2023-05-22T10:30:00Z",
          },
          {
            id: "mission-3",
            title: "Infrastructure Monitoring",
            description: "Monitor critical infrastructure and report anomalies",
            status: "paused",
            progress: 78,
            eta: "3 hours 30 minutes",
            risk: "medium",
            createdAt: "2023-05-21T14:20:00Z",
            updatedAt: "2023-05-22T09:10:00Z",
          },
        ]

        setMissions(mockMissions)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch missions"))
      } finally {
        setLoading(false)
      }
    }

    fetchMissions()
  }, [])

  return { missions, loading, error }
}
