import { generatePresignedUrl } from "@/lib/r2"
import { NextRequest, NextResponse } from "next/server"

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { contentType = "image/png" } = await request.json()

    const bucketName = "temp"
    const expiresIn = 1200 // 20 minutes expiration

    // Generate unique key
    const timestamp = Date.now()
    const key = Math.random().toString(36).substring(2, 8)
    const fileKey = `${timestamp}-${key}`

    // Generate presigned URL for upload
    const uploadUrl = await generatePresignedUrl({
      fileKey,
      bucketName,
      contentType,
      expiresIn,
    })

    // Generate the download URL (actual object URL)
    const downloadUrl = `https://temp.21st.dev/${fileKey}`

    return NextResponse.json(
      {
        uploadUrl,
        downloadUrl,
      },
      {
        headers: corsHeaders,
      },
    )
  } catch (error) {
    console.error("❌ Error generating presigned URLs:", error)

    return NextResponse.json(
      {
        error: "Failed to generate presigned URLs",
      },
      {
        status: 500,
        headers: corsHeaders,
      },
    )
  }
}
