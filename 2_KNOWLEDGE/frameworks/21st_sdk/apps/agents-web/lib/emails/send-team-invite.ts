import { Resend } from "resend"
import { TeamInviteEmail } from "./team-invite-template"
import { buildInviteUrl } from "@/lib/utils/invite"

const isServer = typeof window === "undefined"

let resend: Resend | undefined
if (isServer && process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY)
}

interface SendTeamInviteEmailParams {
  email: string
  teamName: string
  inviterName?: string
  token: string
  source?: "canvas" | "agents"
}

export async function sendTeamInviteEmail({
  email,
  teamName,
  inviterName,
  token,
  source,
}: SendTeamInviteEmailParams) {
  if (!isServer) return { success: true, data: null }

  try {
    if (!resend) {
      console.error("Resend not initialized")
      return { success: false, error: "Resend not initialized" }
    }

    const acceptUrl = buildInviteUrl(token, undefined, false, source)

    const data = await resend.emails.send({
      from: "21st.dev <team@hey.21st.dev>",
      to: email,
      replyTo: "support@21st.dev",
      subject: `You've been invited to join ${teamName} on 21st.dev`,
      react: TeamInviteEmail({ teamName, inviterName, acceptUrl }),
    })

    console.log(`Sent team invite email to ${email}`)
    return { success: true, data }
  } catch (error) {
    console.error("Failed to send team invite email:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
