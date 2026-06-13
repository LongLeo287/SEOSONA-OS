import { Resend } from "resend"
import { GitHubInviteEmail } from "./github-invite-template"
import { buildInviteUrl } from "@/lib/utils/invite"

const isServer = typeof window === "undefined"

let resend: Resend | undefined
if (isServer && process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY)
}

interface SendGitHubInviteEmailParams {
  email: string
  teamName: string
  inviterName?: string
  token: string
}

export async function sendGitHubInviteEmail({
  email,
  teamName,
  inviterName,
  token,
}: SendGitHubInviteEmailParams) {
  if (!isServer) return { success: true, data: null }

  try {
    if (!resend) {
      console.error("Resend not initialized")
      return { success: false, error: "Resend not initialized" }
    }

    // Build invite URL with github flag so invite-accept knows to redirect to GitHub setup
    const baseInviteUrl = buildInviteUrl(token)
    const acceptUrl = `${baseInviteUrl}&github=true`

    const subject = inviterName
      ? `${inviterName} asks you to connect GitHub for ${teamName}`
      : `Connect GitHub for ${teamName} on 21st.dev`

    const data = await resend.emails.send({
      from: "21st.dev <team@hey.21st.dev>",
      to: email,
      replyTo: "support@21st.dev",
      subject,
      react: GitHubInviteEmail({ teamName, inviterName, acceptUrl }),
    })

    console.log(`Sent GitHub invite email to ${email}`)
    return { success: true, data }
  } catch (error) {
    console.error("Failed to send GitHub invite email:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
