"use client"

import { useEffect, useRef } from "react"
import { MoreHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ResourceUtilizationWidgetProps {
  id: string
  title: string
  onRemove: (id: string) => void
}

export function ResourceUtilizationWidget({ id, title, onRemove }: ResourceUtilizationWidgetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Mock resource utilization data (time series)
  const cpuData = [25, 36, 45, 32, 38, 55, 68, 72, 63, 45, 55, 60, 58, 65, 70, 80, 75, 65, 60, 55]
  const memoryData = [40, 42, 45, 48, 50, 53, 55, 58, 60, 58, 55, 60, 62, 65, 68, 70, 72, 75, 78, 80]
  const networkData = [10, 15, 20, 18, 25, 30, 35, 32, 28, 35, 40, 38, 42, 45, 50, 48, 52, 55, 58, 60]

  // Draw chart
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.clientWidth * window.devicePixelRatio
    canvas.height = canvas.clientHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)

    // Chart dimensions
    const padding = 20
    const chartWidth = canvas.clientWidth - padding * 2
    const chartHeight = canvas.clientHeight - padding * 2

    // Draw grid
    ctx.strokeStyle = "rgba(0,0,0,0.1)"
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()
    }

    // Draw data lines
    const drawLine = (data: number[], color: string) => {
      const maxValue = 100 // Assuming percentage values
      const xStep = chartWidth / (data.length - 1)

      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()

      data.forEach((value, index) => {
        const x = padding + index * xStep
        const y = padding + chartHeight - (value / maxValue) * chartHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()
    }

    // Draw CPU line
    drawLine(cpuData, "rgba(59, 130, 246, 0.8)")

    // Draw Memory line
    drawLine(memoryData, "rgba(16, 185, 129, 0.8)")

    // Draw Network line
    drawLine(networkData, "rgba(249, 115, 22, 0.8)")

    // Draw legend
    const legendY = padding / 2

    // CPU legend
    ctx.fillStyle = "rgba(59, 130, 246, 0.8)"
    ctx.fillRect(padding, legendY, 10, 10)
    ctx.fillStyle = "#000"
    ctx.font = "10px sans-serif"
    ctx.fillText("CPU", padding + 15, legendY + 8)

    // Memory legend
    ctx.fillStyle = "rgba(16, 185, 129, 0.8)"
    ctx.fillRect(padding + 60, legendY, 10, 10)
    ctx.fillStyle = "#000"
    ctx.fillText("Memory", padding + 75, legendY + 8)

    // Network legend
    ctx.fillStyle = "rgba(249, 115, 22, 0.8)"
    ctx.fillRect(padding + 140, legendY, 10, 10)
    ctx.fillStyle = "#000"
    ctx.fillText("Network", padding + 155, legendY + 8)
  }, [])

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Refresh</DropdownMenuItem>
            <DropdownMenuItem>Configure</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onRemove(id)}>
              <X className="mr-2 h-4 w-4" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <canvas ref={canvasRef} className="h-full w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
