import { NextRequest, NextResponse } from "next/server"

// Default voice: Rachel (calm, clear)
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"

// ElevenLabs API endpoint with streaming
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech"

// CORS headers for desktop app
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400, headers: CORS_HEADERS },
      )
    }

    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "ElevenLabs API key not configured" },
        { status: 500, headers: CORS_HEADERS },
      )
    }

    // Limit text length to prevent abuse (ElevenLabs has its own limits too)
    const maxLength = 5000
    const truncatedText = text.slice(0, maxLength)

    // Use streaming endpoint for faster time-to-first-byte
    const response = await fetch(
      `${ELEVENLABS_API_URL}/${DEFAULT_VOICE_ID}/stream`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: truncatedText,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[TTS] ElevenLabs API error:", response.status, errorText)
      return NextResponse.json(
        { error: "Failed to generate speech" },
        { status: response.status, headers: CORS_HEADERS },
      )
    }

    // Stream the audio response directly to the client
    if (!response.body) {
      return NextResponse.json(
        { error: "No response body from ElevenLabs" },
        { status: 500, headers: CORS_HEADERS },
      )
    }

    // Return streaming response
    return new NextResponse(response.body, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
        ...CORS_HEADERS,
      },
    })
  } catch (error) {
    console.error("[TTS] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: CORS_HEADERS },
    )
  }
}
