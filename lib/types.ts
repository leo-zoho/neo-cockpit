// Mission types
export interface Mission {
  id: string
  title: string
  description?: string
  status: "active" | "paused" | "completed" | "failed"
  progress: number
  eta: string
  risk: "low" | "medium" | "high"
  subGoals?: SubGoal[]
  createdAt: string
  updatedAt: string
}

// Sub-goal types
export interface SubGoal {
  id: string
  name: string
  description?: string
  status: "pending" | "in_progress" | "completed" | "failed"
  progress: number
  eta: string
  assignedAgent: string
  dependencies?: string[]
  position: {
    x: number
    y: number
  }
}

// Agent types
export interface Agent {
  id: string
  name: string
  status: "idle" | "active" | "error"
  type: string
  metrics: {
    cpu: number
    memory: number
    errorRate: number
  }
}
