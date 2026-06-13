import { Heading, Section, Text } from "@react-email/components"
import * as React from "react"
import { EmailButton } from "./components/email-button"
import { EmailCard } from "./components/email-card"
import { EmailHeader } from "./components/email-header"
import { EmailLayout } from "./components/email-layout"
import { EmailSection } from "./components/email-section"
import { colors, layout, spacing, typography } from "./design-tokens"

interface AgentsInviteEmailProps {
  inviteUrl: string
}

export const AgentsInviteEmail = ({ inviteUrl }: AgentsInviteEmailProps) => {
  const previewText = "You've been granted access to 1Code by 21st"

  return (
    <EmailLayout preview={previewText}>
      <EmailHeader />
      <EmailCard>
        <EmailSection>
          <Heading style={h1}>Welcome to 1Code by 21st</Heading>

          <Text style={bodyText}>
            You've been granted early access to{" "}
            <strong style={highlight}>1Code by 21st</strong> — the most
            productive interface for Claude Code.
          </Text>

          <Text style={bodyText}>
            Built for builders who ship fast. Run agents in parallel, preview
            everything live, and manage multiple repos from one interface.
          </Text>

          <EmailButton variant="primary" href={inviteUrl}>
            Get Started with Agents
          </EmailButton>
        </EmailSection>
      </EmailCard>
      <Section style={bottomSpacer} />
    </EmailLayout>
  )
}

const h1 = {
  fontSize: typography.h1.fontSize,
  fontWeight: typography.h1.fontWeight,
  lineHeight: typography.h1.lineHeight,
  letterSpacing: typography.h1.letterSpacing,
  fontFamily: typography.h1.fontFamily,
  color: colors.text.primary,
  margin: "0 0 16px 0",
  textAlign: "center" as const,
}

const bodyText = {
  fontSize: typography.body.fontSize,
  fontWeight: typography.body.fontWeight,
  lineHeight: typography.body.lineHeight,
  letterSpacing: typography.body.letterSpacing,
  fontFamily: typography.body.fontFamily,
  color: colors.text.secondary,
  margin: `0 0 ${spacing.sm} 0`,
}

const highlight = {
  color: colors.highlight,
  fontWeight: "600",
}

const bottomSpacer = {
  height: layout.footerPadding,
}

export default AgentsInviteEmail

