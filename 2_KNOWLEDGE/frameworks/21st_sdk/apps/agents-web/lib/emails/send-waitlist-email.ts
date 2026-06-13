import { Resend } from "resend"
import { WaitlistEmail } from "./waitlist-template"

const isServer = typeof window === "undefined"

let resend: Resend | undefined
if (isServer) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY environment variable is not set")
  } else {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
}

interface SendWaitlistEmailParams {
  email: string
  userName?: string
}

export async function sendWaitlistEmail({
  email,
  userName,
}: SendWaitlistEmailParams) {
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
      replyTo: "21st Support <support@21st.dev>",
      subject: "Thank you for joining our waitlist!",
      react: WaitlistEmail({
        userName,
      }),
    })

    console.log(`✅ Sent waitlist email to ${email}`)

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Failed to send waitlist email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

