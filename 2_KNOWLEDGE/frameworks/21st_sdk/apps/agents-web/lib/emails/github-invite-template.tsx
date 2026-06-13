import { Heading, Section, Text } from "@react-email/components"
import * as React from "react"
import { EmailButton } from "./components/email-button"
import { EmailCard } from "./components/email-card"
import { EmailHeader } from "./components/email-header"
import { EmailLayout } from "./components/email-layout"
import { EmailSection } from "./components/email-section"
import { colors, layout, spacing, typography } from "./design-tokens"

interface GitHubInviteEmailProps {
  teamName: string
  inviterName?: string
  acceptUrl: string
}

export const GitHubInviteEmail = ({
  teamName,
  inviterName,
  acceptUrl,
}: GitHubInviteEmailProps) => {
  const previewText = inviterName
    ? `${inviterName} asked you to connect GitHub for ${teamName}`
    : `You've been asked to connect GitHub for ${teamName}`

  return (
    <EmailLayout preview={previewText}>
      <EmailHeader />
      <EmailCard>
        <EmailSection>
          <Heading style={h1}>Connect GitHub</Heading>

          <Text style={bodyText}>
            {inviterName ? (
              <>
                <strong style={highlight}>{inviterName}</strong> asked you to
                integrate GitHub for{" "}
                <strong style={highlight}>{teamName}</strong>.
              </>
            ) : (
              <>
                You've been asked to integrate GitHub for{" "}
                <strong style={highlight}>{teamName}</strong>.
              </>
            )}
          </Text>

          <Text style={bodyText}>
            21st needs access to your repository to analyze your codebase and
            create ready-to-use prototypes directly in your code.
          </Text>

          {/* Security Section */}
          <Section style={securitySection}>
            <Text style={securityHeading}>Your code is safe with us</Text>

            <Section style={securityItem}>
              <Text style={securityItemTitle}>
                SOC 2 Type II compliant sandboxes
              </Text>
              <Text style={securityItemText}>
                Your code runs in CodeSandbox sandboxes with enterprise-grade
                security.
              </Text>
            </Section>

            <Section style={securityItem}>
              <Text style={securityItemTitle}>No destructive changes</Text>
              <Text style={securityItemText}>
                We never run migrations or make irreversible changes. We can
                only open PRs — no direct commits to your repository.
              </Text>
            </Section>

            <Section style={securityItem}>
              <Text style={securityItemTitle}>You're always in control</Text>
              <Text style={securityItemText}>
                Review and approve every change before it's applied to your
                codebase.
              </Text>
            </Section>
          </Section>

          <EmailButton variant="primary" href={acceptUrl}>
            Connect GitHub
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

const securitySection = {
  backgroundColor: "#f8f9fa",
  borderRadius: "16px",
  padding: "24px",
  margin: `${spacing.md} 0`,
}

const securityHeading = {
  fontSize: "17px",
  fontWeight: "600",
  lineHeight: "24px",
  fontFamily: typography.body.fontFamily,
  color: colors.text.primary,
  margin: "0 0 16px 0",
}

const securityItem = {
  marginBottom: "16px",
}

const securityItemTitle = {
  fontSize: "15px",
  fontWeight: "600",
  lineHeight: "20px",
  fontFamily: typography.body.fontFamily,
  color: colors.text.primary,
  margin: "0 0 4px 0",
}

const securityItemText = {
  fontSize: "14px",
  fontWeight: "400",
  lineHeight: "20px",
  fontFamily: typography.body.fontFamily,
  color: colors.text.tertiary,
  margin: "0",
}

const bottomSpacer = {
  height: layout.footerPadding,
}

export default GitHubInviteEmail
