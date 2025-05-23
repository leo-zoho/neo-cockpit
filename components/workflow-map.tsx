"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { MessageSquare, Share2, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { NodeDetailPanel } from "@/components/node-detail-panel"
import { CommentsPanel } from "@/components/comments-panel"
import { useMissionDetails } from "@/hooks/use-mission-details"
import type { SubGoal } from "@/lib/types"

interface WorkflowMapProps {
  missionId: string
  showComments: boolean
  onToggleComments: () => void
  onShareView: () => string
}

export function WorkflowMap({ missionId, showComments, onToggleComments, onShareView }: WorkflowMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [selectedNode, setSelectedNode] = useState<SubGoal | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const { mission, loading, error } = useMissionDetails(missionId)

  // Initialize canvas and draw workflow map
  useEffect(() => {
    if (!canvasRef.current || !mission || loading) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const container = containerRef.current
    if (container) {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply scaling and translation
    ctx.save()
    ctx.translate(offset.x, offset.y)
    ctx.scale(scale, scale)

    // Draw nodes and edges
    if (mission.subGoals) {
      // Draw edges first
      mission.subGoals.forEach((subGoal) => {
        if (subGoal.dependencies) {
          subGoal.dependencies.forEach((depId) => {
            const dependency = mission.subGoals.find((sg) => sg.id === depId)
            if (dependency) {
              drawEdge(ctx, dependency, subGoal)
            }
          })
        }
      })

      // Then draw nodes
      mission.subGoals.forEach((subGoal) => {
        drawNode(ctx, subGoal)
      })
    }

    ctx.restore()
  }, [mission, loading, scale, offset])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return

      canvasRef.current.width = containerRef.current.clientWidth
      canvasRef.current.height = containerRef.current.clientHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Draw a node on the canvas
  const drawNode = (ctx: CanvasRenderingContext2D, subGoal: SubGoal) => {
    const { x, y } = subGoal.position
    const width = 150
    const height = 80

    // Draw node background
    ctx.fillStyle = getStatusColor(subGoal.status)
    ctx.beginPath()
    ctx.roundRect(x - width / 2, y - height / 2, width, height, 10)
    ctx.fill()

    // Draw node border
    ctx.strokeStyle = selectedNode?.id === subGoal.id ? "#000" : "rgba(0,0,0,0.2)"
    ctx.lineWidth = selectedNode?.id === subGoal.id ? 3 : 1
    ctx.stroke()

    // Draw node text
    ctx.fillStyle = "#fff"
    ctx.font = "14px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(subGoal.name, x, y - 10)

    // Draw status text
    ctx.font = "12px sans-serif"
    ctx.fillText(subGoal.status, x, y + 10)

    // Draw progress indicator
    const progressWidth = width * 0.8
    const progressHeight = 6

    // Progress background
    ctx.fillStyle = "rgba(255,255,255,0.3)"
    ctx.beginPath()
    ctx.roundRect(x - progressWidth / 2, y + 20, progressWidth, progressHeight, 3)
    ctx.fill()

    // Progress fill
    ctx.fillStyle = "#fff"
    ctx.beginPath()
    ctx.roundRect(x - progressWidth / 2, y + 20, progressWidth * (subGoal.progress / 100), progressHeight, 3)
    ctx.fill()
  }

  // Draw an edge between two nodes
  const drawEdge = (ctx: CanvasRenderingContext2D, from: SubGoal, to: SubGoal) => {
    const { x: x1, y: y1 } = from.position
    const { x: x2, y: y2 } = to.position

    // Draw arrow
    ctx.beginPath()
    ctx.moveTo(x1, y1)

    // Calculate control points for curve
    const dx = x2 - x1
    const dy = y2 - y1
    const midX = (x1 + x2) / 2
    const midY = (y1 + y2) / 2

    // Draw curved line
    ctx.bezierCurveTo(midX, y1, midX, y2, x2, y2)

    ctx.strokeStyle = "rgba(0,0,0,0.4)"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw arrow head
    const angle = Math.atan2(y2 - midY, x2 - midX)
    const arrowSize = 10

    ctx.beginPath()
    ctx.moveTo(x2, y2)
    ctx.lineTo(x2 - arrowSize * Math.cos(angle - Math.PI / 6), y2 - arrowSize * Math.sin(angle - Math.PI / 6))
    ctx.lineTo(x2 - arrowSize * Math.cos(angle + Math.PI / 6), y2 - arrowSize * Math.sin(angle + Math.PI / 6))
    ctx.closePath()
    ctx.fillStyle = "rgba(0,0,0,0.4)"
    ctx.fill()
  }

  // Get color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10b981"
      case "in_progress":
        return "#3b82f6"
      case "pending":
        return "#6b7280"
      case "failed":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  // Handle mouse down on canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !mission) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left - offset.x) / scale
    const y = (e.clientY - rect.top - offset.y) / scale

    // Check if clicked on a node
    const clickedNode = mission.subGoals.find((subGoal) => {
      const { x: nodeX, y: nodeY } = subGoal.position
      return x >= nodeX - 75 && x <= nodeX + 75 && y >= nodeY - 40 && y <= nodeY + 40
    })

    if (clickedNode) {
      setSelectedNode(clickedNode)
    } else {
      // Start dragging the canvas
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  // Handle mouse move on canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return

    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y

    setOffset((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }))

    setDragStart({ x: e.clientX, y: e.clientY })
  }

  // Handle mouse up on canvas
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Handle zoom in
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2))
  }

  // Handle zoom out
  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5))
  }

  // Handle share view
  const handleShareView = () => {
    const link = onShareView()
    navigator.clipboard.writeText(link)
    toast({
      title: "Link copied to clipboard",
      description: "Share this link to show the current view.",
    })
  }

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold tracking-tight">
            <Skeleton className="h-9 w-64" />
          </h2>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </div>
        <Card className="flex-1 relative">
          <Skeleton className="h-full w-full rounded-lg" />
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-destructive">
          <p>Failed to load mission details: {error.message}</p>
          <Button variant="outline" className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold tracking-tight">{mission?.title} Workflow</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onToggleComments} className={showComments ? "bg-muted" : ""}>
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleShareView}>
            <Share2 className="h-5 w-5" />
          </Button>
          <div className="flex items-center rounded-md border">
            <Button variant="ghost" size="icon" onClick={handleZoomOut} className="rounded-r-none border-r">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <div className="px-2 text-sm">{Math.round(scale * 100)}%</div>
            <Button variant="ghost" size="icon" onClick={handleZoomIn} className="rounded-l-none border-l">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="relative flex flex-1">
        <Card ref={containerRef} className="flex-1 overflow-hidden relative">
          <canvas
            ref={canvasRef}
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </Card>

        {selectedNode && <NodeDetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />}

        {showComments && <CommentsPanel missionId={missionId} selectedNodeId={selectedNode?.id} />}
      </div>
    </div>
  )
}
