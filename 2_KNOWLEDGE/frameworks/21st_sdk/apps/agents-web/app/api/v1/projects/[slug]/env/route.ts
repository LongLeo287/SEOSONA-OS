import { NextResponse } from "next/server"

const gone = NextResponse.json(
  { error: "gone", message: "Project env vars have been removed. Use /v1/agents/{slug}/env instead." },
  { status: 410 },
)

export async function GET() { return gone }
export async function PUT() { return gone }
