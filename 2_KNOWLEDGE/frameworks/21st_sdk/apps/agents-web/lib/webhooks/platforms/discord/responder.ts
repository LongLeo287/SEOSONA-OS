import { DISCORD_OAUTH } from "@/lib/discord"

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN

/**
 * Send a message to a Discord channel
 */
export async function sendDiscordMessage(
  channelId: string,
  content: string
): Promise<void> {
  if (!DISCORD_BOT_TOKEN) {
    throw new Error("DISCORD_BOT_TOKEN not configured")
  }

  const response = await fetch(
    `${DISCORD_OAUTH.apiUrl}/channels/${channelId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
      body: JSON.stringify({ content }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    console.error("[Discord] Failed to send message:", error)
    throw new Error(`Failed to send Discord message: ${response.statusText}`)
  }
}

/**
 * Send a follow-up message to a Discord interaction
 * Used after deferring the initial response
 */
export async function sendDiscordFollowup(
  applicationId: string,
  interactionToken: string,
  content: string
): Promise<void> {
  const response = await fetch(
    `${DISCORD_OAUTH.apiUrl}/webhooks/${applicationId}/${interactionToken}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    console.error("[Discord] Failed to send followup:", error)
    throw new Error(`Failed to send Discord followup: ${response.statusText}`)
  }
}

/**
 * Edit the original deferred response
 */
export async function editDiscordResponse(
  applicationId: string,
  interactionToken: string,
  content: string
): Promise<void> {
  const response = await fetch(
    `${DISCORD_OAUTH.apiUrl}/webhooks/${applicationId}/${interactionToken}/messages/@original`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    console.error("[Discord] Failed to edit response:", error)
    throw new Error(`Failed to edit Discord response: ${response.statusText}`)
  }
}
