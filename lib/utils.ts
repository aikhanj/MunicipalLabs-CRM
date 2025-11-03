import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getConfidenceTone(confidence: number) {
  if (confidence >= 0.9) return "ok"
  if (confidence >= 0.75) return "warn"
  return "danger"
}

export function formatDate(isoString: string) {
  const date = new Date(isoString)
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
  return formatter.format(date)
}
