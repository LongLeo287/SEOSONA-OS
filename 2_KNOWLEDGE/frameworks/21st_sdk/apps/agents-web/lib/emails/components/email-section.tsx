import { Section } from "@react-email/components"
import * as React from "react"
import { spacing } from "../design-tokens"

interface EmailSectionProps {
  children: React.ReactNode
  gap?: string
}

export const EmailSection = ({ children, gap }: EmailSectionProps) => {
  const sectionStyle = {
    ...section,
    ...(gap && { gap }),
  }

  return <Section style={sectionStyle}>{children}</Section>
}

const section = {
  display: "flex",
  flexDirection: "column" as const,
  gap: spacing.section,
  width: "100%",
}

