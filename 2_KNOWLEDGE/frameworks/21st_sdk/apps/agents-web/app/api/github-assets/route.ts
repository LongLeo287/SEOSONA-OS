import { NextRequest, NextResponse } from "next/server"

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Range, Content-Range, Authorization",
    },
  })
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const url = searchParams.get("url")

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 },
      )
    }

    // Validate that it's a GitHub asset URL
    if (!url.includes("github.com/user-attachments/assets/")) {
      return NextResponse.json(
        { error: "Invalid GitHub asset URL" },
        { status: 400 },
      )
    }

    const githubToken = process.env.GITHUB_TOKEN
    if (!githubToken) {
      console.error("GITHUB_TOKEN is not configured")
      return NextResponse.json(
        { error: "GitHub token not configured" },
        { status: 500 },
      )
    }

    // Fetch the asset from GitHub with authentication
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3.raw",
        "User-Agent": "21st-dev-changelog",
      },
    })

    if (!response.ok) {
      console.error(
        `Failed to fetch GitHub asset: ${response.status} ${response.statusText}`,
      )
      return NextResponse.json(
        { error: `Failed to fetch asset: ${response.statusText}` },
        { status: response.status },
      )
    }

    // Get the content type from the response
    const contentType =
      response.headers.get("content-type") || "application/octet-stream"

    // For video files, ensure proper content type
    let finalContentType = contentType
    if (url.match(/\.(mp4|webm|mov|avi)$/i)) {
      if (url.endsWith(".mp4")) finalContentType = "video/mp4"
      else if (url.endsWith(".webm")) finalContentType = "video/webm"
      else if (url.endsWith(".mov")) finalContentType = "video/quicktime"
    }

    // Stream the response body
    const buffer = await response.arrayBuffer()
    const contentLength = buffer.byteLength

    // Safari-specific headers for video streaming
    const headers = new Headers({
      "Content-Type": finalContentType,
      "Content-Length": contentLength.toString(),
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Range, Content-Range",
    })

    // Handle range requests for Safari video streaming
    const range = request.headers.get("range")
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : contentLength - 1
      const chunksize = end - start + 1

      const chunk = buffer.slice(start, end + 1)

      headers.set("Content-Range", `bytes ${start}-${end}/${contentLength}`)
      headers.set("Content-Length", chunksize.toString())

      return new NextResponse(chunk, {
        status: 206, // Partial Content
        headers,
      })
    }

    // Return the asset with appropriate headers
    return new NextResponse(buffer, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error("Error proxying GitHub asset:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
