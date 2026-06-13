import { Html, Head, Preview, Body, Text } from "@react-email/components"
import * as React from "react"

interface ProjectFixedEmailProps {
  userName?: string
  teamName?: string
  repository?: string
}

export const ProjectFixedEmail = ({
  userName,
  teamName,
  repository,
}: ProjectFixedEmailProps) => {
  const greeting = userName ? `Hi ${userName},` : "Hi,"
  const repoName = repository || teamName || "your project"

  return (
    <Html>
      <Head />
      <Preview>Your project is ready on Canvas!</Preview>
      <Body style={main}>
        <Text style={text}>{greeting}</Text>
        <Text style={text}>
          Great news! We noticed that {repoName} needed some manual configuration to work on our remote sandboxes, so we went ahead and fixed everything for you.
        </Text>
        <Text style={text}>
          Your project is now fully set up and ready to use. You can start working on it right away and accelerate your development!
        </Text>
        <Text style={text}>
          If you have any questions or need help, just reply to this email or join our Discord: https://discord.gg/Qx4rFunHfm
        </Text>
        <Text style={text}>
          Best,{"\n"}
          Serafim
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

export default ProjectFixedEmail
