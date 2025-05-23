"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { SubGoal } from "@/lib/types"

// Mock available agents
const availableAgents = [
  { id: "agent-001", name: "Data Processor", specialization: "Data Processing" },
  { id: "agent-002", name: "Network Agent", specialization: "Network Operations" },
  { id: "agent-003", name: "Compute Engine", specialization: "Computation" },
  { id: "agent-004", name: "Storage Manager", specialization: "Data Storage" },
  { id: "agent-005", name: "Security Monitor", specialization: "Security" },
]

interface ReassignAgentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subGoal: SubGoal
}

export function ReassignAgentDialog({ open, onOpenChange, subGoal }: ReassignAgentDialogProps) {
  const [selectedAgent, setSelectedAgent] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleReassign = async () => {
    if (!selectedAgent) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log(`Reassigning ${subGoal.name} to ${selectedAgent}`)

      // Close dialog and reset state
      onOpenChange(false)
      setSelectedAgent("")
    } catch (error) {
      console.error("Failed to reassign agent:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reassign Agent</DialogTitle>
          <DialogDescription>Select a new agent to handle the "{subGoal.name}" sub-goal.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Current Agent</h4>
              <div className="rounded-md border px-3 py-2 text-sm">{subGoal.assignedAgent}</div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">New Agent</h4>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn("w-full justify-between", !selectedAgent && "text-muted-foreground")}
                  >
                    {selectedAgent ? availableAgents.find((agent) => agent.id === selectedAgent)?.name : "Select agent"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Search agents..." />
                    <CommandList>
                      <CommandEmpty>No agent found.</CommandEmpty>
                      <CommandGroup>
                        {availableAgents.map((agent) => (
                          <CommandItem
                            key={agent.id}
                            value={agent.id}
                            onSelect={() => {
                              setSelectedAgent(agent.id)
                            }}
                          >
                            <Check
                              className={cn("mr-2 h-4 w-4", selectedAgent === agent.id ? "opacity-100" : "opacity-0")}
                            />
                            <div className="flex flex-col">
                              <span>{agent.name}</span>
                              <span className="text-xs text-muted-foreground">{agent.specialization}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleReassign} disabled={!selectedAgent || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Reassigning...
              </>
            ) : (
              "Reassign Agent"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
