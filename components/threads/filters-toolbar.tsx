"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"

interface FiltersToolbarProps {
  onFiltersChange: (filters: {
    type: string
    topics: string[]
    stance: string
    confidence: number
  }) => void
}

const topics = ["Healthcare", "Immigration", "Education", "Infrastructure", "Environment", "Defense", "Economy"]

export function FiltersToolbar({ onFiltersChange }: FiltersToolbarProps) {
  const [type, setType] = useState("both")
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [stance, setStance] = useState("all")
  const [confidence, setConfidence] = useState(0.5)

  const handleTopicToggle = (topic: string) => {
    const updated = selectedTopics.includes(topic)
      ? selectedTopics.filter((t) => t !== topic)
      : [...selectedTopics, topic]
    setSelectedTopics(updated)
    onFiltersChange({ type, topics: updated, stance, confidence })
  }

  const handleReset = () => {
    setType("both")
    setSelectedTopics([])
    setStance("all")
    setConfidence(0.5)
    onFiltersChange({ type: "both", topics: [], stance: "all", confidence: 0.5 })
  }

  return (
    <div className="sticky top-16 border-b border-border bg-background px-6 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink-900">Filters</h3>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {/* Type filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-ink-600">Type</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="both">Both</SelectItem>
              <SelectItem value="casework">Casework</SelectItem>
              <SelectItem value="correspondence">Correspondence</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Topic filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-ink-600">Topic</label>
          <div className="border border-border rounded-lg p-3 bg-surface max-h-48 overflow-y-auto space-y-2">
            {topics.map((topic) => (
              <label key={topic} className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={selectedTopics.includes(topic)} onCheckedChange={() => handleTopicToggle(topic)} />
                <span className="text-xs">{topic}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Stance filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-ink-600">Stance</label>
          <Select value={stance} onValueChange={setStance}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="oppose">Oppose</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Confidence filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-ink-600">Confidence ≥</label>
          <div className="pt-2">
            <Slider
              min={0.5}
              max={0.95}
              step={0.05}
              value={[confidence]}
              onValueChange={(val) => {
                setConfidence(val[0])
                onFiltersChange({ type, topics: selectedTopics, stance, confidence: val[0] })
              }}
              className="w-full"
            />
            <div className="text-xs text-ink-500 mt-1 text-center">{Math.round(confidence * 100)}%</div>
          </div>
        </div>
      </div>
    </div>
  )
}
