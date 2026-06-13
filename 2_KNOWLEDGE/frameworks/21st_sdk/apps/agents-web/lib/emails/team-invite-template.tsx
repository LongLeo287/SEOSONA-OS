import { Heading, Section, Text } from "@react-email/components"
import * as React from "react"
import { EmailButton } from "./components/email-button"
import { EmailCard } from "./components/email-card"
import { EmailHeader } from "./components/email-header"
import { EmailLayout } from "./components/email-layout"
import { EmailSection } from "./components/email-section"
import { colors, layout, spacing, typography } from "./design-tokens"

interface TeamInviteEmailProps {
  teamName: string
  inviterName?: string
  acceptUrl: string
}

export const TeamInviteEmail = ({
  teamName,
  inviterName,
  acceptUrl,
}: TeamInviteEmailProps) => {
  const previewText = inviterName
    ? `${inviterName} invited you to join ${teamName} on 21st`
    : `You've been invited to join ${teamName} on 21st`

  return (
    <EmailLayout preview={previewText}>
      <EmailHeader />
      <EmailCard>
        <EmailSection>
          <Heading style={h1}>
            {inviterName ? `${inviterName} invites you!` : "You're invited!"}
          </Heading>

          <Text style={bodyText}>
            Join <strong style={highlight}>{teamName}</strong> on <strong style={highlight}>21st</strong>.
          </Text>

          <Text style={bodyText}>
            As a team member, you'll have access to all team projects and can
            collaborate with other team members.
          </Text>

          <EmailButton variant="primary" href={acceptUrl}>
            Accept Invitation
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

export default TeamInviteEmail
