"use client"

import { useState, useEffect } from "react"
import { Sparkles, Loader2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { AISearchResult } from "@/app/api/search/ai/route"

interface AISearchBarProps {
  onSearch: (result: AISearchResult) => void
  placeholder?: string
  className?: string
}

export function AISearchBar({ onSearch, placeholder, className }: AISearchBarProps) {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [lastResult, setLastResult] = useState<AISearchResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!query.trim()) {
      setLastResult(null)
      onSearch({
        query: "",
        important: false,
        topics: [],
        searchTerms: "",
        explanation: "",
      })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/search/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })

      if (!res.ok) {
        throw new Error("Failed to process search")
      }

      const result = (await res.json()) as AISearchResult
      setLastResult(result)
      onSearch(result)
    } catch (err: any) {
      setError(err?.message || "Failed to process search")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleClear = () => {
    setQuery("")
    setLastResult(null)
    setError(null)
    onSearch({
      query: "",
      important: false,
      topics: [],
      searchTerms: "",
      explanation: "",
    })
  }

  return (
    <div className={className}>
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Sparkles className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
          <Input
            type="text"
            placeholder={placeholder || "Ask anything... 'Show me urgent healthcare emails'"}
            className="pl-12 pr-4 h-12 text-base focus-visible:outline-ring focus-visible:ring-2 focus-visible:ring-primary"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            aria-label="AI Search"
          />
        </div>
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-20 top-1/2 -translate-y-1/2 h-8 text-muted-foreground hover:text-foreground"
          >
            Clear
          </Button>
        )}
        <Button
          onClick={handleSearch}
          disabled={isLoading || !query.trim()}
          className="h-12 px-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Thinking...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="mt-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {lastResult && lastResult.explanation && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground/90">
              {lastResult.explanation}
            </p>
            {(lastResult.important || lastResult.topics?.length || lastResult.searchTerms) && (
              <div className="mt-2 flex flex-wrap gap-2">
                {lastResult.important && (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    Important
                  </span>
                )}
                {lastResult.topics?.map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                  >
                    {topic}
                  </span>
                ))}
                {lastResult.searchTerms && (
                  <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    "{lastResult.searchTerms}"
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
