"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, LayoutGrid, Mail, Settings, BookOpen } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === "undefined") return false
    try {
      return window.localStorage.getItem("sidebar_collapsed") === "true"
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem("sidebar_collapsed", String(isCollapsed))
    } catch {
      // ignore persistence errors
    }
    try {
      const width = isCollapsed ? "80px" : "256px"
      document.documentElement.style.setProperty("--app-sidebar-width", width)
    } catch {
      // ignore
    }
  }, [isCollapsed])

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

  const menuItems = [
    { href: "/threads", label: "Threads", icon: Mail },
    { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  ]

  const adminItems = [
    { href: "/admin/topics", label: "Topics", icon: BookOpen },
    { href: "/admin/templates", label: "Templates", icon: Settings },
  ]

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r border-border bg-background transition-all duration-300 overflow-y-auto overflow-x-hidden",
          isCollapsed ? "w-20" : "w-64",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo and toggle */}
          <div className="border-b border-border px-6 py-5 flex items-center justify-between flex-shrink-0">
            {!isCollapsed && <h1 className="text-lg font-semibold text-ink-900">Legaside</h1>}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 hover:bg-subtle rounded transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-ink-600" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-ink-600" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-6">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded px-4 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive(item.href)
                        ? "bg-gradient-to-br from-brand-500/30 to-brand-500/20 text-brand-600 backdrop-blur-md border border-brand-500/40 shadow-lg"
                        : "text-ink-600 hover:bg-subtle hover:text-ink-900",
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                )
              })}
            </div>

            {/* Admin section */}
            <div className="mt-8">
              {!isCollapsed && <p className="px-4 py-2 text-xs font-semibold uppercase text-ink-400">Admin</p>}
              <div className="space-y-1">
                {adminItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded px-4 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive(item.href)
                          ? "bg-gradient-to-br from-brand-500/30 to-brand-500/20 text-brand-600 backdrop-blur-md border border-brand-500/40 shadow-lg"
                          : "text-ink-600 hover:bg-subtle hover:text-ink-900",
                      )}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  )
                })}
              </div>
            </div>
          </nav>
        </div>
      </aside>

      <div className="fixed inset-0 pointer-events-none" style={{ marginLeft: isCollapsed ? "80px" : "256px" }} />
    </>
  )
}
