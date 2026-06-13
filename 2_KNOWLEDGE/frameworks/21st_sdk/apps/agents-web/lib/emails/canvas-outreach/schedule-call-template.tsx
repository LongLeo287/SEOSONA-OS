import { Html, Head, Preview, Body, Text } from "@react-email/components"
import * as React from "react"

type UserRole = "designer" | "engineer" | "product" | "marketer" | "growth" | "sales" | "other"

interface ScheduleCallEmailProps {
  userName?: string
  teamName?: string
  userRole?: UserRole
}

// Get role label for the email
function getRoleLabel(role?: UserRole): string {
  switch (role) {
    case "designer":
      return "designers"
    case "engineer":
      return "engineers"
    case "product":
      return "product people"
    case "marketer":
      return "marketers"
    case "growth":
      return "growth teams"
    case "sales":
      return "sales teams"
    default:
      return "teams"
  }
}

export const ScheduleCallEmail = ({
  userName,
  teamName,
  userRole,
}: ScheduleCallEmailProps) => {
  const greeting = userName ? `Hi ${userName},` : "Hi,"
  const projectRef = teamName ? ` ${teamName}` : ""
  const roleLabel = getRoleLabel(userRole)

  return (
    <Html>
      <Head />
      <Preview>Quick chat about your project?</Preview>
      <Body style={main}>
        <Text style={text}>{greeting}</Text>
        <Text style={text}>
          This is Serafim from 21st.dev — we're building a visual development tool called Canvas that lets you edit your React apps in real-time with AI assistance.
        </Text>
        <Text style={text}>
          I noticed you connected your project{projectRef} and wanted to reach out personally.
        </Text>
        <Text style={text}>
          We recently got accepted into Y Combinator (W26 batch), and this product is incredibly important to us. We're building Canvas to solve real problems for {roleLabel} like you, and your feedback would be invaluable.
        </Text>
        <Text style={text}>
          Would you be open to a 30-minute call to discuss how we can help you get the most out of Canvas and understand your workflow better?
        </Text>
        <Text style={text}>
          If you're interested, just reply to this email with a few times that work for you, or feel free to book directly: https://cal.com/team/21st/getting-started
        </Text>
        <Text style={text}>
          Either way, thank you for trying Canvas. We're committed to making it an amazing tool for your workflow.
        </Text>
        <Text style={text}>
          Best,{"\n"}
          Serafim{"\n"}
          Co-founder, 21st.dev
        </Text>
      </Body>
    </Html>
  )
}

const main = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
  fontSize: "14px",
  lineHeight: "1.5",
  color: "#000",
  backgroundColor: "#fff",
  padding: "20px",
}

const text = {
  margin: "0 0 16px 0",
  whiteSpace: "pre-wrap" as const,
}

export default ScheduleCallEmail
