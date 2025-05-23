"use client"

import type React from "react"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface CommentsData {
  id: string
  user: {
    name: string
    avatar?: string
    initials: string
  }
  timestamp: string
  content: string
  nodeId?: string
}

// Mock comments data
const mockComments: CommentsData[] = [
  {
    id: "comment-1",
    user: {
      name: "Alex Johnson",
      initials: "AJ",
    },
    timestamp: "10:30 AM",
    content: "We need to increase the throughput on this mission.",
    nodeId: "data_processing",
  },
  {
    id: "comment-2",
    user: {
      name: "Sam Taylor",
      initials: "ST",
    },
    timestamp: "10:35 AM",
    content: "I've noticed some latency issues with the network transmission node.",
    nodeId: "network_transmission",
  },
  {
    id: "comment-3",
    user: {
      name: "Jamie Lee",
      initials: "JL",
    },
    timestamp: "10:42 AM",
    content: "The data processing sub-goal is taking longer than expected. Should we allocate more resources?",
    nodeId: "data_processing",
  },
  {
    id: "comment-4",
    user: {
      name: "Morgan Chen",
      initials: "MC",
    },
    timestamp: "11:15 AM",
    content: "All systems are running smoothly now. Great job team!",
  },
]

interface CommentsPanelProps {
  missionId: string
  selectedNodeId?: string
}

export function CommentsPanel({ missionId, selectedNodeId }: CommentsPanelProps) {
  const [newComment, setNewComment] = useState("")

  // Filter comments based on selected node
  const filteredComments = selectedNodeId
    ? mockComments.filter((comment) => !comment.nodeId || comment.nodeId === selectedNodeId)
    : mockComments

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim()) return

    // In a real app, you would send this to your API
    console.log("New comment:", {
      content: newComment,
      missionId,
      nodeId: selectedNodeId,
    })

    // Reset input
    setNewComment("")
  }

  return (
    <Card className="w-80 ml-4 flex flex-col">
      <CardHeader className="px-4 py-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">{selectedNodeId ? "Node Comments" : "Mission Comments"}</CardTitle>
      </CardHeader>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 py-2">
          {filteredComments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.user.avatar || "/placeholder.svg"} />
                <AvatarFallback>{comment.user.initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{comment.user.name}</span>
                  <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Separator />

      <CardContent className="p-4 pt-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="h-9"
          />
          <Button type="submit" size="icon" className="h-9 w-9" disabled={!newComment.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
