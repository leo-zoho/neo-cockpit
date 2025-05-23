"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AgentHealthWidget } from "@/components/widgets/agent-health-widget"
import { ResourceUtilizationWidget } from "@/components/widgets/resource-utilization-widget"
import { AlertFeedWidget } from "@/components/widgets/alert-feed-widget"
import { AddWidgetDialog } from "@/components/add-widget-dialog"

// Available widget types
type WidgetType = "agent-health" | "resource-utilization" | "alert-feed" | "mission-status"

// Widget configuration
interface WidgetConfig {
  id: string
  type: WidgetType
  title: string
  size: "1x1" | "1x2" | "2x1" | "2x2"
}

export function ControlPanel() {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([
    { id: "widget-1", type: "agent-health", title: "Agent Health", size: "1x1" },
    { id: "widget-2", type: "resource-utilization", title: "Resource Utilization", size: "2x1" },
    { id: "widget-3", type: "alert-feed", title: "Alert Feed", size: "1x2" },
  ])

  const [showAddWidgetDialog, setShowAddWidgetDialog] = useState(false)

  const addWidget = (widget: Omit<WidgetConfig, "id">) => {
    const newWidget = {
      ...widget,
      id: `widget-${Date.now()}`,
    }

    setWidgets([...widgets, newWidget])
  }

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter((widget) => widget.id !== id))
  }

  // Render widget based on type
  const renderWidget = (widget: WidgetConfig) => {
    switch (widget.type) {
      case "agent-health":
        return <AgentHealthWidget key={widget.id} id={widget.id} title={widget.title} onRemove={removeWidget} />
      case "resource-utilization":
        return <ResourceUtilizationWidget key={widget.id} id={widget.id} title={widget.title} onRemove={removeWidget} />
      case "alert-feed":
        return <AlertFeedWidget key={widget.id} id={widget.id} title={widget.title} onRemove={removeWidget} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Control Panel</h2>
        <Button onClick={() => setShowAddWidgetDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Widget
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{widgets.map(renderWidget)}</div>

      <AddWidgetDialog open={showAddWidgetDialog} onOpenChange={setShowAddWidgetDialog} onAddWidget={addWidget} />
    </div>
  )
}
