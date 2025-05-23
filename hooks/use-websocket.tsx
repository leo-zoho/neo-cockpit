"use client"

import { useState, useEffect } from "react"

export function useWebSocket() {
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("connecting")
  const [lastEvent, setLastEvent] = useState<any>(null)

  useEffect(() => {
    // Simulate WebSocket connection
    const connectWebSocket = () => {
      setStatus("connecting")

      // Simulate connection delay
      const connectionTimeout = setTimeout(() => {
        setStatus("connected")

        // Simulate receiving events
        const eventInterval = setInterval(() => {
          const eventTypes = ["swarmStatus", "performanceLogs", "alerts"]
          const randomEvent = {
            type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
            timestamp: new Date().toISOString(),
            data: {
              message: `Event at ${new Date().toLocaleTimeString()}`,
            },
          }

          setLastEvent(randomEvent)
        }, 10000) // Every 10 seconds

        return () => clearInterval(eventInterval)
      }, 1500)

      return () => clearTimeout(connectionTimeout)
    }

    const cleanup = connectWebSocket()

    // Reconnect on window focus
    const handleFocus = () => {
      if (status === "disconnected") {
        cleanup()
        connectWebSocket()
      }
    }

    window.addEventListener("focus", handleFocus)

    return () => {
      cleanup()
      window.removeEventListener("focus", handleFocus)
      setStatus("disconnected")
    }
  }, [])

  return { status, lastEvent }
}
