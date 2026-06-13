import { fulfillModel } from "@/lib/server/ai"
import { LANGFUSE_PATHS, withTelemetry } from "@/lib/server/ai/telemetry"
import { getCorsHeadersAllowLocalhost } from "@/lib/utils/cors"
import { generateText } from "ai"
import { NextRequest, NextResponse } from "next/server"

// Handle preflight OPTIONS request
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeadersAllowLocalhost(request),
  })
}

export async function POST(request: NextRequest) {
  const corsHeaders = getCorsHeadersAllowLocalhost(request)
  const sessionId = request.headers.get("x-session-id") || undefined

  try {
    // Check if request was aborted
    if (request.signal?.aborted) {
      return NextResponse.json(
        { error: "Request was aborted" },
        {
          status: 499, // Client Closed Request
          headers: corsHeaders,
        },
      )
    }

    // Get text from request body
    const body = await request.json()
    const { text } = body

    // Validate required field
    if (!text || typeof text !== "string" || text.trim() === "") {
      return NextResponse.json(
        { error: "Text field is required and must be a non-empty string" },
        {
          status: 400,
          headers: corsHeaders,
        },
      )
    }

    // Use AI to understand what components user might need and create search queries
    const prompt = `Extract a UI component search query from the user request.

RULES:
1. If the request is about ADDING/CREATING/REPLACING UI components → return a short search query
2. If the request is about FIXING BUGS/DELETING/REMOVING → return empty (no output)
3. NEVER explain, NEVER add quotes, NEVER think aloud

EXAMPLES:
Input: "modern gradient button" → Output: modern gradient button
Input: "replace card with modern design" → Output: modern card  
Input: "add beautiful form" → Output: form
Input: "fix bug here" → Output: (empty)
Input: "remove this button" → Output: (empty)
Input: "delete text" → Output: (empty)

USER REQUEST: "${text.trim()}"

OUTPUT:`

    let result: string = ""
    let retryCount = 0
    const maxRetries = 3
    let lastError: Error | null = null

    while (retryCount <= maxRetries) {
      try {
        const { model } = fulfillModel("llama-4-scout")

        const response = await generateText({
          model,
          prompt: prompt,
          temperature: 0.6,
          abortSignal: request.signal, // Pass abort signal to AI request
          headers: {
            // Allow OpenRouter to fallback to different providers if one fails
            "HTTP-Referer":
              process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
            "X-Title": "21st.dev",
          },
          ...withTelemetry({
            operation: LANGFUSE_PATHS.magic.searchQueries,
            sessionId,
          }),
        })

        result = response.text

        // Handle the case when model returns "(empty)" for non-component requests
        if (result.trim() === "(empty)") {
          result = ""
        }

        break // Success, exit retry loop
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        console.log(
          `❌ Error on attempt ${retryCount + 1}:`,
          error instanceof Error ? error.message : String(error),
        )

        // Retry on ANY error for the first few attempts (OpenRouter instability)
        if (retryCount < maxRetries) {
          console.log(`🔄 Retrying... (${retryCount + 1}/${maxRetries + 1})`)
          retryCount++
          // Progressive delay: 500ms, 1s, 1.5s
          await new Promise((resolve) =>
            setTimeout(resolve, 500 + retryCount * 500),
          )
          continue
        }
        // Re-throw if not the specific error or max retries reached
        throw error
      }
    }

    // If we exhausted all retries without success, throw the last error
    if (!result && lastError) {
      throw lastError
    }

    // Return the search query result
    return NextResponse.json(
      {
        searchQuery: result.trim(),
        originalText: text.trim(),
      },
      {
        status: 200,
        headers: corsHeaders,
      },
    )
  } catch (error) {
    // Handle aborted requests
    if (error instanceof Error && error.name === "AbortError") {
      console.log("Request was aborted")
      return NextResponse.json(
        { error: "Request was aborted" },
        {
          status: 499, // Client Closed Request
          headers: corsHeaders,
        },
      )
    }

    console.error("Error extracting intent:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
        headers: corsHeaders,
      },
    )
  }
}
