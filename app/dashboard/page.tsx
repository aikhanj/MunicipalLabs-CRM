"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { DashboardKPIs } from "@/components/dashboard/kpis"
import { TopicsChart } from "@/components/dashboard/topics-chart"
import { StanceTrendChart } from "@/components/dashboard/stance-trend-chart"

// Sample data
const dashboardData = {
  total: 1247,
  caseworkPct: 62,
  avgTimeToFirstReply: 4.2,
  topTopics: [
    { topic: "Healthcare", count: 245 },
    { topic: "Immigration", count: 198 },
    { topic: "Infrastructure", count: 156 },
    { topic: "Education", count: 142 },
    { topic: "Environment", count: 118 },
  ],
  stanceTrend: [
    { date: "Oct 1", support: 45, oppose: 32, neutral: 23 },
    { date: "Oct 5", support: 52, oppose: 28, neutral: 20 },
    { date: "Oct 10", support: 48, oppose: 35, neutral: 17 },
    { date: "Oct 15", support: 58, oppose: 26, neutral: 16 },
    { date: "Oct 20", support: 54, oppose: 31, neutral: 15 },
    { date: "Oct 25", support: 61, oppose: 24, neutral: 15 },
    { date: "Oct 31", support: 67, oppose: 22, neutral: 11 },
  ],
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col">
        <Header />
        <main className="mt-16 flex-1 overflow-auto">
          <div className="px-6 py-6 space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-ink-900">Dashboard</h1>
            </div>

            {/* KPI Tiles */}
            <DashboardKPIs
              total={dashboardData.total}
              caseworkPct={dashboardData.caseworkPct}
              avgTimeToFirstReply={dashboardData.avgTimeToFirstReply}
            />

            {/* Charts */}
            <div className="grid grid-cols-2 gap-6">
              <TopicsChart topics={dashboardData.topTopics} />
              <StanceTrendChart trend={dashboardData.stanceTrend} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
