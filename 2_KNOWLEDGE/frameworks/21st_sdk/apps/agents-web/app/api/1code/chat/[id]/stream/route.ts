import { prisma } from "@/lib/prisma"
import { createUIMessageStream, JsonToSseTransformStream } from "ai-latest"
import { getStreamContext, RESPONSE_STREAM_HEADERS } from "../../utils"

export const maxDuration = 300

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: subChatId } = await params

  const subChat = await prisma.agentSubChat.findUnique({
    where: {
      id: subChatId,
    },
    select: {
      stream_id: true,
    },
  })

  const streamId = subChat?.stream_id

  if (!streamId || !subChatId) {
    return new Response(null, {
      status: 204,
    })
  }

  console.log("[agents/stream] Resume stream - streamId:", streamId)

  const emptyDataStream = createUIMessageStream({
    execute: () => {},
  })

  const streamContext = getStreamContext()
  if (!streamContext) {
    return new Response("Failed to create stream context", { status: 500 })
  }

  const stream = await streamContext.resumeExistingStream(streamId)

  console.log("[agents/stream] Resume result:", stream ? "found" : "not found")

  if (!stream) {
    // Stream completed or not found: send empty SSE (graceful)
    return new Response(
      emptyDataStream.pipeThrough(new JsonToSseTransformStream()),
      {
        status: 204,
        headers: RESPONSE_STREAM_HEADERS,
      },
    )
  }

  return new Response(stream, {
    status: 200,
    headers: RESPONSE_STREAM_HEADERS,
  })
}
