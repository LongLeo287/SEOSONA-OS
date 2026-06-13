import { Html, Head, Preview, Body, Text } from "@react-email/components"
import * as React from "react"

interface IntegrationHelpEmailProps {
  userName?: string
  teamName?: string
}

export const IntegrationHelpEmail = ({
  userName,
  teamName,
}: IntegrationHelpEmailProps) => {
  const greeting = userName ? `Hi ${userName},` : "Hi,"
  const projectRef = teamName ? ` ${teamName}` : ""

  return (
    <Html>
      <Head />
      <Preview>Need help finishing your Canvas integration?</Preview>
      <Body style={main}>
        <Text style={text}>{greeting}</Text>
        <Text style={text}>
          I noticed you started connecting your project{projectRef} to Canvas
          but didn't finish the setup.
        </Text>
        <Text style={text}>
          Is there anything blocking you or can I help with something? We're
          here to make sure you get the most out of Canvas.
        </Text>
        <Text style={text}>
          If you have any questions or run into issues, feel free to reply to
          this email or join our Discord community where our team and other
          developers can help: https://discord.gg/Qx4rFunHfm
        </Text>
        <Text style={text}>Looking forward to seeing what you build!</Text>
        <Text style={text}>
          Best,{"\n"}
          Serafim
        </Text>
      </Body>
    </Html>
  )
}

const main = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
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

export default IntegrationHelpEmail
