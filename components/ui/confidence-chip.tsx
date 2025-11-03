"use client"

import { getConfidenceTone } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface ConfidenceChipProps {
  confidence: number
  className?: string
}

export function ConfidenceChip({ confidence, className }: ConfidenceChipProps) {
  const tone = getConfidenceTone(confidence)
  const percentage = Math.round(confidence * 100)

  const toneStyles = {
    ok: "bg-ok/10 text-ok border border-ok/30",
    warn: "bg-warn/10 text-warn border border-warn/30",
    danger: "bg-danger/10 text-danger border border-danger/30",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        toneStyles[tone],
        className,
      )}
    >
      {percentage}%
    </div>
  )
}
