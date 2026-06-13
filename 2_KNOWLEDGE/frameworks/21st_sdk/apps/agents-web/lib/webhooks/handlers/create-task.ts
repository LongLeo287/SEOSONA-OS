import { prisma } from "@/lib/prisma"
import type { NormalizedEvent } from "../types"
import { addLinearComment } from "../platforms/linear/responder"
import { getChatUrl } from "../utils/urls"

export async function handleCreateTask(event: NormalizedEvent): Promise<void> {
  // 1. Create AgentChat
  const chat = await prisma.agentChat.create({
    data: {
      user_id: event.triggeredBy.id,
      team_id: event.teamId,
      name: event.title,
      meta: {
        source: event.platform,
        externalId: event.externalId,
        externalUrl: event.externalUrl,
        triggeredBy: event.triggeredBy,
        repository: event.repository,
        // Discord-specific data for completion notification
        discord: event.discord,
      },
    },
  })

  // 2. Create IntegrationTask to track
  await prisma.integrationTask.create({
    data: {
      chat_id: chat.id,
      team_id: event.teamId,
      platform: event.platform,
      external_id: event.externalId,
      external_url: event.externalUrl,
      external_title: event.title,
      metadata: {
        description: event.description,
        triggeredBy: event.triggeredBy,
        repository: event.repository,
      },
      status: "pending",
    },
  })

  // 3. Comment back to Linear
  if (event.platform === "linear") {
    await addLinearComment(
      event.teamId,
      event.externalId,
      `🤖 **1Code** is picking up this issue.\n\n[View progress](${getChatUrl(chat.id)})`
    )
  }

  console.log(
    `[Webhook] Created AgentChat ${chat.id} from ${event.platform} issue ${event.externalId}`
  )
}
