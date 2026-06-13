import { checkIsAdmin } from "@/lib/api/server/users"
import { generatePresignedUrl } from "@/lib/r2"
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Check admin access
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const isAdmin = await checkIsAdmin(userId)
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      )
    }

    const { appId, fileName, contentType } = await request.json()

    if (!appId || !fileName || !contentType) {
      return NextResponse.json(
        { error: "appId, fileName, and contentType are required" },
        { status: 400 },
      )
    }

    // Validate file type (only images)
    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 },
      )
    }

    const bucketName = "assets"
    const timestamp = Date.now()
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_")
    const fileKey = `inspiration/${appId}/meta/app-icon-${timestamp}.${sanitizedFileName.split(".").pop()}`

    // Generate presigned URL for upload
    const uploadUrl = await generatePresignedUrl({
      fileKey,
      bucketName,
      contentType,
      expiresIn: 300, // 5 minutes
    })

    // The final URL where the file will be accessible
    const finalUrl = `https://assets.21st.dev/${fileKey}`

    return NextResponse.json({
      uploadUrl,
      finalUrl,
      fileKey,
    })
  } catch (error) {
    console.error("❌ Error generating app icon upload URL:", error)
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 },
    )
  }
}
