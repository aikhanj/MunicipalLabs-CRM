"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface TopicsChartProps {
  topics: Array<{ topic: string; count: number }>
}

export function TopicsChart({ topics }: TopicsChartProps) {
  return (
    <div className="border border-border rounded-lg bg-surface p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-ink-900 mb-4">Top topics</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topics} margin={{ left: -20, right: 10, top: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--ink-100)" />
          <XAxis
            dataKey="topic"
            tick={{ fontSize: 12, fill: "var(--ink-600)" }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 12, fill: "var(--ink-600)" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--ink-100)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            cursor={{ fill: "rgba(0,0,0,0.05)" }}
          />
          <Bar dataKey="count" fill="var(--brand-500)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
