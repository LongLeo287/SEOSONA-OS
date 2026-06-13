import { Resend } from "resend"
import {
  IntegrationHelpEmail,
  MissingEnvEmail,
  ScheduleCallEmail,
  ProjectFixedEmail,
} from "./canvas-outreach"

const isServer = typeof window === "undefined"

let resend: Resend | undefined
if (isServer) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY environment variable is not set")
  } else {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
}

export type CanvasOutreachEmailType =
  | "integration_help"
  | "missing_env"
  | "schedule_call"
  | "project_fixed"

export type UserRole = "designer" | "engineer" | "product" | "marketer" | "growth" | "sales" | "other"

interface SendCanvasOutreachEmailParams {
  email: string
  emailType: CanvasOutreachEmailType
  userName?: string
  teamName?: string
  repository?: string
  userRole?: UserRole
}

const EMAIL_SUBJECTS: Record<CanvasOutreachEmailType, string> = {
  integration_help: "Need help finishing your Canvas setup?",
  missing_env: "Your Canvas project needs environment variables",
  schedule_call: "Quick chat about Canvas?",
  project_fixed: "Your project is ready on Canvas!",
}

export async function sendCanvasOutreachEmail({
  email,
  emailType,
  userName,
  teamName,
  repository,
  userRole,
}: SendCanvasOutreachEmailParams) {
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

    // All emails reply to Serafim for now
    const replyTo = "Serafim <serafim@21st.dev>"

    let reactComponent: React.ReactElement

    switch (emailType) {
      case "integration_help":
        reactComponent = IntegrationHelpEmail({ userName, teamName })
        break
      case "missing_env":
        reactComponent = MissingEnvEmail({ userName, teamName, repository })
        break
      case "schedule_call":
        reactComponent = ScheduleCallEmail({ userName, teamName, userRole })
        break
      case "project_fixed":
        reactComponent = ProjectFixedEmail({
          userName,
          teamName,
          repository,
        })
        break
      default:
        return {
          success: false,
          error: `Unknown email type: ${emailType}`,
        }
    }

    const data = await resend.emails.send({
      from: "Serafim from 21st <serafim@hey.21st.dev>",
      to: email,
      replyTo,
      subject: EMAIL_SUBJECTS[emailType],
      react: reactComponent,
    })

    console.log(
      `✅ Sent canvas outreach email (${emailType}) to ${email}`,
    )

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error(`Failed to send canvas outreach email (${emailType}):`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Helper function to get email type label for UI
export function getEmailTypeLabel(emailType: CanvasOutreachEmailType): string {
  switch (emailType) {
    case "integration_help":
      return "Integration Help"
    case "missing_env":
      return "Missing Env Files"
    case "schedule_call":
      return "Schedule a Call"
    case "project_fixed":
      return "Project Fixed"
    default:
      return emailType
  }
}

// Helper function to get email type description for UI
export function getEmailTypeDescription(
  emailType: CanvasOutreachEmailType,
): string {
  switch (emailType) {
    case "integration_help":
      return "Ask why they didn't finish integration and offer help via Discord"
    case "missing_env":
      return "Notify that their project needs environment variables to work"
    case "schedule_call":
      return "Request a 30-min call to discuss their needs (YC W26 mention)"
    case "project_fixed":
      return "Inform that we manually fixed their project and it's ready to use"
    default:
      return ""
  }
}

