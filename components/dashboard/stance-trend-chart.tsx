"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface StanceTrendChartProps {
  trend: Array<{ date: string; support: number; oppose: number; neutral: number }>
}

export function StanceTrendChart({ trend }: StanceTrendChartProps) {
  return (
    <div className="border border-border rounded-lg bg-surface p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-ink-900 mb-4">Support vs. oppose 30d</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trend} margin={{ left: -20, right: 10, top: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--ink-100)" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: "var(--ink-600)" }} />
          <YAxis tick={{ fontSize: 12, fill: "var(--ink-600)" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--ink-100)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Line type="monotone" dataKey="support" stroke="var(--ok)" strokeWidth={2} isAnimationActive={false} />
          <Line type="monotone" dataKey="oppose" stroke="var(--danger)" strokeWidth={2} isAnimationActive={false} />
          <Line type="monotone" dataKey="neutral" stroke="var(--ink-400)" strokeWidth={2} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
