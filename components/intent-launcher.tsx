"use client"

import type React from "react"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IntentConfirmationDialog } from "@/components/intent-confirmation-dialog"

export function IntentLauncher() {
  const [intent, setIntent] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [parsedIntent, setParsedIntent] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!intent.trim()) return

    setIsProcessing(true)

    try {
      // Simulate API call to parse intent
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock parsed intent result
      const result = {
        type: "increase_throughput",
        parameters: {
          percentage: 20,
          affectedSubGoals: ["data_processing", "network_transmission"],
          estimatedImpact: {
            resourceDelta: "+15% CPU utilization",
            etaChange: "-10 minutes",
            riskChange: "medium → high",
          },
        },
      }

      setParsedIntent(result)
      setShowConfirmation(true)
    } catch (error) {
      console.error("Failed to parse intent:", error)
      // Handle error
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirm = async () => {
    // Simulate API call to apply intent
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Reset state
    setIntent("")
    setShowConfirmation(false)
    setParsedIntent(null)
  }

  return (
    <>
      <div className="sticky top-0 z-10 mb-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Type your intent… (e.g. increase throughput by 20%)"
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            className="h-12 text-base"
            disabled={isProcessing}
          />
          <Button type="submit" size="icon" className="h-12 w-12" disabled={!intent.trim() || isProcessing}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>

      {parsedIntent && (
        <IntentConfirmationDialog
          open={showConfirmation}
          onOpenChange={setShowConfirmation}
          parsedIntent={parsedIntent}
          originalIntent={intent}
          onConfirm={handleConfirm}
        />
      )}
    </>
  )
}
