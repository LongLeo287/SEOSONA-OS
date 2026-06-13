import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(
    { error: "gone", message: "Projects have been removed. Agents are now managed directly. See /v1/agents/deploy." },
    { status: 410 },
  )
}
