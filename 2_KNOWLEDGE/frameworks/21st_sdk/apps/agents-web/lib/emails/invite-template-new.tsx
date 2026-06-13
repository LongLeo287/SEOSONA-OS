import { Heading, Text } from "@react-email/components"
import * as React from "react"
import { EmailButton } from "./components/email-button"
import { EmailCard } from "./components/email-card"
import { EmailFooter } from "./components/email-footer"
import { EmailHeader } from "./components/email-header"
import { EmailLayout } from "./components/email-layout"
import { EmailSection } from "./components/email-section"
import { EmailSignature } from "./components/email-signature"
import { colors, spacing, typography } from "./design-tokens"

interface InviteEmailProps {
  inviteUrl: string
  userName?: string
}

export const InviteEmail = ({ inviteUrl, userName }: InviteEmailProps) => {
  const displayName = userName ? `, ${userName}` : ""
  
  return (
    <EmailLayout preview={`Thank you for joining our waitlist${displayName}! Welcome to 21st.`}>
      <EmailHeader />
      <EmailCard>
        <EmailSection>
          <Heading style={h1}>Thank you for joining our waitlist{displayName}!</Heading>

          <Text style={bodyText}>
            You’re in. 21st is a design tool for <span style={highlight}>vibe crafting</span>: discover references, iterate visually, and ship work that feels like you.
          </Text>

          <Text style={bodyText}>
            While we roll out access, the community library is live. Explore components, save favorites, and start shaping your taste.
          </Text>

          <Text style={bodyText}>
            Stay connected with us on{" "}
            <a href="https://twitter.com/21st_dev" style={twitterLink}>
              Twitter
            </a>{" "}
            for the latest updates and community highlights.
          </Text>

          <EmailButton variant="primary" href="https://21st.dev/community">
            Explore Community
          </EmailButton>
          <div style={buttonSpacer} />

          <Text style={bodyText}>
            <strong>First invites go out October 30th.</strong> We'll be in touch soon with your early access to the full vibe crafting experience.
          </Text>

          <EmailSignature authorName="21st Team" showHeart={true} />
        </EmailSection>
      </EmailCard>
      <EmailFooter />
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
}

const h2 = {
  fontSize: typography.h2.fontSize,
  fontWeight: typography.h2.fontWeight,
  lineHeight: typography.h2.lineHeight,
  letterSpacing: typography.h2.letterSpacing,
  fontFamily: typography.h2.fontFamily,
  color: colors.text.primary,
  margin: "0 0 16px 0",
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
  fontWeight: typography.body.fontWeight,
}

const twitterLink = {
  color: colors.highlight,
  textDecoration: "none",
  fontWeight: "500",
}

const buttonSpacer = {
  height: spacing.lg,
}

export default InviteEmail

