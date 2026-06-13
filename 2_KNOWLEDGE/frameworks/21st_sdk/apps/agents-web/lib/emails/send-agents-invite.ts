import { Resend } from "resend"
import { AgentsInviteEmail } from "./agents-invite-template"

const isServer = typeof window === "undefined"

let resend: Resend | undefined
if (isServer && process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY)
}

interface SendAgentsInviteEmailParams {
  email: string
  inviteCode: string
}

export async function sendAgentsInviteEmail({
  email,
  inviteCode,
}: SendAgentsInviteEmailParams) {
  if (!isServer) return { success: true, data: null }

  try {
    if (!resend) {
      console.error("Resend not initialized")
      return { success: false, error: "Resend not initialized" }
    }

    // Build invite URL (short URL for better sharing)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://21st.dev"
    const inviteUrl = `${baseUrl}/invite/${inviteCode}`

    const fromEmail =
      process.env.AGENTS_INVITE_FROM_EMAIL ||
      "Serafim from 21st <serafim@hey.21st.dev>"
    const replyToEmail =
      process.env.AGENTS_INVITE_REPLY_TO_EMAIL || "Serafim <serafim@21st.dev>"

    const data = await resend.emails.send({
      from: fromEmail,
      to: email,
      replyTo: replyToEmail,
      subject: "You're invited to 1Code by 21st",
      react: AgentsInviteEmail({ inviteUrl }),
    })

    console.log(`✅ Sent agents invite email to ${email}`)
    return { success: true, data }
  } catch (error) {
    console.error("Failed to send agents invite email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
