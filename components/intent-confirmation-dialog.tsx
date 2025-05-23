"use client"

import { useState } from "react"
import { AlertTriangle, ArrowRight, Check, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface IntentConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parsedIntent: any
  originalIntent: string
  onConfirm: () => Promise<void>
}

export function IntentConfirmationDialog({
  open,
  onOpenChange,
  parsedIntent,
  originalIntent,
  onConfirm,
}: IntentConfirmationDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false)

  const handleConfirm = async () => {
    setIsConfirming(true)

    try {
      await onConfirm()
    } catch (error) {
      console.error("Failed to apply intent:", error)
    } finally {
      setIsConfirming(false)
      onOpenChange(false)
    }
  }

  const formatIntentType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Confirm Intent</DialogTitle>
          <DialogDescription>Review the interpreted intent before applying changes.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border bg-muted/50 p-3">
            <p className="text-sm font-medium">Original Intent:</p>
            <p className="mt-1 text-sm">{originalIntent}</p>
          </div>

          <div className="flex items-center justify-center">
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="rounded-lg border bg-muted/50 p-3">
            <p className="text-sm font-medium">Interpreted Intent:</p>
            <p className="mt-1 text-sm font-semibold">{formatIntentType(parsedIntent.type)}</p>

            <div className="mt-3 space-y-2">
              {Object.entries(parsedIntent.parameters).map(([key, value]: [string, any]) => {
                if (key === "estimatedImpact") return null

                return (
                  <div key={key} className="flex items-start justify-between text-sm">
                    <span className="text-muted-foreground">
                      {key
                        .split("_")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                      :
                    </span>
                    <span className="font-medium">{Array.isArray(value) ? value.join(", ") : value.toString()}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {parsedIntent.parameters.estimatedImpact && (
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Estimated Impact</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-1 text-sm">
                  {Object.entries(parsedIntent.parameters.estimatedImpact).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex items-start justify-between">
                      <span className="text-muted-foreground">
                        {key
                          .split("_")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                        :
                      </span>
                      <span className="font-medium">{value.toString()}</span>
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isConfirming}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isConfirming}>
            {isConfirming ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
            Apply Intent
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
