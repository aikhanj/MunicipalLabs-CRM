"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function Header() {
  return (
    <header className="fixed right-0 top-0 left-64 z-30 border-b border-border bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex-1">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <Input type="text" placeholder="Search subject, sender, text" className="pl-10" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm text-ink-600 hover:text-ink-900">User menu</button>
        </div>
      </div>
    </header>
  )
}
