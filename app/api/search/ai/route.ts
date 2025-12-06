import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface AISearchResult {
  query: string
  important?: boolean
  topics?: string[]
  searchTerms?: string
  explanation: string
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that helps parse natural language email search queries into structured filters.

Available topics: Healthcare, Immigration, Education, Veterans Affairs, Housing, Transportation, Environment, Economy, Social Security, Other

Parse the user's query and respond with a JSON object containing:
- important: boolean (true if query mentions "urgent", "important", "priority", or similar)
- topics: array of relevant topic strings from the list above
- searchTerms: string containing keywords to search (sender names, subjects, etc.)
- explanation: a brief human-readable explanation of how you interpreted the query

Examples:
Query: "Show me all urgent emails"
Response: {"important": true, "topics": [], "searchTerms": "", "explanation": "Filtering for urgent/important emails only"}

Query: "emails about healthcare from John"
Response: {"important": false, "topics": ["Healthcare"], "searchTerms": "John", "explanation": "Searching for healthcare-related emails from John"}

Query: "important immigration emails"
Response: {"important": true, "topics": ["Immigration"], "searchTerms": "", "explanation": "Filtering for important immigration-related emails"}

Always respond with valid JSON only.`,
        },
        {
          role: "user",
          content: query,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    })

    const result = completion.choices[0]?.message?.content
    if (!result) {
      throw new Error("No response from AI")
    }

    const parsed = JSON.parse(result) as AISearchResult
    parsed.query = query

    return NextResponse.json(parsed)
  } catch (error: any) {
    console.error("AI search error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to process search query" },
      { status: 500 }
    )
  }
}
