import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get("url")

    if (!url) {
        return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
    }

    try {
        // Validate URL
        const parsedUrl = new URL(url)

        // Only allow HTTP/HTTPS protocols
        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            return NextResponse.json({ error: "Invalid protocol" }, { status: 400 })
        }

        // Fetch the resource
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; SnapdomProxy/1.0)",
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Cache-Control": "no-cache",
            },
            // Add timeout to prevent hanging requests
            signal: AbortSignal.timeout(30000), // 30 seconds
        })

        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch resource: ${response.status} ${response.statusText}` },
                { status: response.status }
            )
        }

        // Get the content type from the response
        const contentType = response.headers.get("content-type") || "application/octet-stream"

        // Get the response body
        const arrayBuffer = await response.arrayBuffer()

        // For images, we can return base64 if requested
        const format = searchParams.get("format")
        if (format === "base64") {
            const base64 = Buffer.from(arrayBuffer).toString("base64")
            return NextResponse.json({
                data: base64,
                contentType,
                size: arrayBuffer.byteLength,
            })
        }

        // Otherwise, return the raw content with appropriate headers
        return new NextResponse(arrayBuffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Length": arrayBuffer.byteLength.toString(),
                "Cache-Control": "public, max-age=3600", // Cache for 1 hour
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        })
    } catch (error) {
        console.error("Snapdom proxy error:", error)

        if (error instanceof TypeError && error.message.includes("Invalid URL")) {
            return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
        }

        if (error instanceof Error && error.name === "AbortError") {
            return NextResponse.json({ error: "Request timeout" }, { status: 408 })
        }

        return NextResponse.json(
            { error: "Failed to proxy request" },
            { status: 500 }
        )
    }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    })
}