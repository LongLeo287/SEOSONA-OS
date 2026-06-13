import { Html, Head, Preview, Body, Text } from "@react-email/components"
import * as React from "react"

interface MissingEnvEmailProps {
  userName?: string
  teamName?: string
  repository?: string
}

export const MissingEnvEmail = ({
  userName,
  teamName,
  repository,
}: MissingEnvEmailProps) => {
  const greeting = userName ? `Hi ${userName},` : "Hi,"
  const projectRef = teamName ? ` ${teamName}` : repository ? ` ${repository}` : ""

  return (
    <Html>
      <Head />
      <Preview>Your Canvas project needs environment variables</Preview>
      <Body style={main}>
        <Text style={text}>{greeting}</Text>
        <Text style={text}>
          I noticed you connected your project{projectRef} to Canvas, but it looks like it's missing some environment variables to work properly.
        </Text>
        <Text style={text}>
          To get everything running, just go to your team settings → Git Integration and add your env variables there. It's just key-value pairs like you'd have in your .env file.
        </Text>
        <Text style={text}>
          If you need any help setting things up, just reply to this email or join our Discord: https://discord.gg/Qx4rFunHfm
        </Text>
        <Text style={text}>We're excited to see your project come to life!</Text>
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

export default MissingEnvEmail
