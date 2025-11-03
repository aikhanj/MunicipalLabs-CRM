"use client"

import { useState } from "react"
import type { ThreadRow } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ConfidenceChip } from "@/components/ui/confidence-chip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"

interface ThreadsTableProps {
  threads: ThreadRow[]
  onThreadClick: (thread: ThreadRow) => void
}

export function ThreadsTable({ threads, onThreadClick }: ThreadsTableProps) {
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null)

  if (threads.length === 0) {
    return <div className="flex items-center justify-center h-96 text-ink-500">No threads match your filters.</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow hoverable={false}>
          <TableHead>Type</TableHead>
          <TableHead>Topic</TableHead>
          <TableHead>Stance</TableHead>
          <TableHead className="max-w-xs">Summary</TableHead>
          <TableHead>Received</TableHead>
          <TableHead>Confidence</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {threads.map((thread) => (
          <TableRow
            key={thread.id}
            onMouseEnter={() => setHoveredRowId(thread.id)}
            onMouseLeave={() => setHoveredRowId(null)}
            onClick={() => onThreadClick(thread)}
            className="cursor-pointer"
          >
            <TableCell>
              <Badge variant="solid" className="bg-ink-100 text-ink-900">
                {thread.type === "CASEWORK" ? "Casework" : "Correspondence"}
              </Badge>
            </TableCell>
            <TableCell>{thread.topic}</TableCell>
            <TableCell>
              {thread.stance && (
                <Badge variant="outline">
                  {thread.stance === "SUPPORT" ? "Support" : thread.stance === "OPPOSE" ? "Oppose" : "Neutral"}
                </Badge>
              )}
            </TableCell>
            <TableCell className="max-w-xs truncate text-ink-600" title={thread.summary}>
              {thread.summary}
            </TableCell>
            <TableCell className="text-xs text-ink-500">{formatDate(thread.receivedAt)}</TableCell>
            <TableCell>
              <ConfidenceChip confidence={thread.confidence} />
            </TableCell>
            <TableCell>
              {hoveredRowId === thread.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onThreadClick(thread)
                  }}
                >
                  Suggest reply
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
