import { Resend } from "resend"
import { getFirstAgentWelcomeText } from "./first-agent-welcome-template"

const isServer = typeof window === "undefined"

let resend: Resend | undefined
if (isServer) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY environment variable is not set")
  } else {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
}

interface SendFirstAgentWelcomeEmailParams {
  email: string
  userName?: string
}

export async function sendFirstAgentWelcomeEmail({
  email,
  userName,
}: SendFirstAgentWelcomeEmailParams) {
  if (!isServer) {
    console.warn("Email sending is only available on the server side")
    return { success: true, data: null }
  }

  try {
    if (!resend) {
      console.error("Resend is not initialized, cannot send email")
      return {
        success: false,
        error: "Resend API client is not initialized",
      }
    }

    const data = await resend.emails.send({
      from: "Serafim from 21st <serafim@hey.21st.dev>",
      to: email,
      replyTo: ["serafim@21st.dev", "sergey@21st.dev", "daniel@21st.dev"],
      subject: "thanks for deploying your first agent",
      text: getFirstAgentWelcomeText({ userName }),
    })

    console.log(`✅ Sent first agent welcome email to ${email}`)

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Failed to send first agent welcome email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
