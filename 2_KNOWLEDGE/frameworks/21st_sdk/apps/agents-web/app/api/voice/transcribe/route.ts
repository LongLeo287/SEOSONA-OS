import { NextRequest, NextResponse } from "next/server"
import { verifyDesktopAuth } from "@/lib/desktop-auth-middleware"
import { hasAgentsAccess } from "@/lib/agents-access"
import OpenAI from "openai"

// Max audio size: 25MB (Whisper API limit)
const MAX_AUDIO_SIZE = 25 * 1024 * 1024

// API request timeout: 30 seconds
const API_TIMEOUT_MS = 30000

/**
 * Clean up transcribed text
 */
function cleanTranscribedText(text: string): string {
  return (
    text
      // Remove zero-width and invisible characters
      .replace(/[\u200B-\u200D\u2060\uFEFF\u00AD]/g, "")
      // Normalize unicode whitespace to regular space
      .replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, " ")
      // Replace all types of newlines and line breaks with space
      .replace(/[\r\n\u2028\u2029]+/g, " ")
      // Replace tabs with space
      .replace(/\t+/g, " ")
      // Collapse multiple spaces into one
      .replace(/ +/g, " ")
      // Trim leading/trailing whitespace
      .trim()
  )
}

/**
 * POST /api/voice/transcribe
 *
 * Transcribes audio using OpenAI Whisper API.
 * Requires desktop authentication via X-Desktop-Token header.
 *
 * Body: FormData with:
 *   - file: audio file (webm, wav, mp3, m4a, ogg)
 *   - language?: ISO 639-1 language code (optional)
 *
 * Returns: { text: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Verify desktop authentication
    const userId = await verifyDesktopAuth(request)
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Desktop authentication required." },
        { status: 401 }
      )
    }

    // Check if user has agents access (paid plan)
    const hasAccess = await hasAgentsAccess(userId)
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Voice input requires an active OneCode subscription." },
        { status: 403 }
      )
    }

    // Get OpenAI API key from environment
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      console.error("[Voice] OPENAI_API_KEY not configured on server")
      return NextResponse.json(
        { error: "Voice transcription service not configured" },
        { status: 503 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get("file") as Blob | null
    const language = formData.get("language") as string | null

    if (!file) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      )
    }

    // Check file size
    if (file.size > MAX_AUDIO_SIZE) {
      return NextResponse.json(
        {
          error: `Audio too large (${Math.round(file.size / 1024 / 1024)}MB). Maximum is 25MB.`,
        },
        { status: 400 }
      )
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: openaiApiKey,
      timeout: API_TIMEOUT_MS,
    })

    // Convert Blob to File for OpenAI SDK
    const audioFile = new File([file], "audio.webm", { type: file.type })

    // Call Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      response_format: "text",
      ...(language && { language }),
    })

    const text = cleanTranscribedText(
      typeof transcription === "string" ? transcription : ""
    )

    console.log(
      `[Voice] Transcribed ${file.size} bytes for user ${userId}: "${text.slice(0, 50)}..."`
    )

    return NextResponse.json({ text })
  } catch (error) {
    console.error("[Voice] Transcription failed:", error)

    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: "Invalid API key configuration" },
          { status: 500 }
        )
      }
      if (error.status === 429) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again later." },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 500 }
    )
  }
}
