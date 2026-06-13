import { NextResponse } from "next/server"

export const revalidate = 3600 // Cache for 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const repo = searchParams.get("repo") || "21st-dev/1Code"

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  }

  if (process.env.ROADMAP_GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.ROADMAP_GITHUB_TOKEN}`
  }

  const res = await fetch(`https://api.github.com/repos/${repo}`, {
    headers,
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    return NextResponse.json({ stars: null, error: "Failed to fetch" }, { status: 500 })
  }

  const data = await res.json()
  return NextResponse.json({ stars: data.stargazers_count })
}
