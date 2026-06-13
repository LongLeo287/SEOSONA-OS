import { AnClient } from "@21st-sdk/node"
import { NextResponse } from "next/server"

const DEFAULT_AGENT_SLUG = "an-docs-agent"

export async function POST(req: Request) {
  if (!process.env.AN_API_KEY) {
    return NextResponse.json(
      { error: "AN_API_KEY is not configured" },
      { status: 500 },
    )
  }

  try {
    let agentSlug = DEFAULT_AGENT_SLUG
    try {
      const body = await req.json()
      if (body?.agent && typeof body.agent === "string") agentSlug = body.agent
    } catch {}

    const an = new AnClient({ apiKey: process.env.AN_API_KEY })
    const sandbox = await an.sandboxes.create({ agent: agentSlug })
    const thread = await an.threads.create({ sandboxId: sandbox.id })

    return NextResponse.json({
      sandboxId: sandbox.id,
      threadId: thread.id,
    })
  } catch (error) {
    console.error("[docs-agent] failed to create sandbox/thread", error)
    return NextResponse.json(
      { error: "Failed to create docs session" },
      { status: 500 },
    )
  }
}
