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

interface BaseEmailTemplateProps {
  preview: string
  title: string
  content: string | React.ReactNode
  buttonText?: string
  buttonUrl?: string
  authorName?: string
  showSignatureHeart?: boolean
  signatureHeartUrl?: string
}

export const BaseEmailTemplate = ({
  preview,
  title,
  content,
  buttonText,
  buttonUrl,
  authorName = "Serafim",
  showSignatureHeart = false,
  signatureHeartUrl,
}: BaseEmailTemplateProps) => {
  return (
    <EmailLayout preview={preview}>
      <EmailHeader />
      <EmailCard>
        <EmailSection>
          <Heading style={h1}>{title}</Heading>

          {typeof content === "string" ? (
            <Text style={bodyText}>{content}</Text>
          ) : (
            content
          )}

          {buttonText && buttonUrl && (
            <EmailButton variant="primary" href={buttonUrl}>
              {buttonText}
            </EmailButton>
          )}

          <EmailSignature
            authorName={authorName}
            showHeart={showSignatureHeart}
            heartUrl={signatureHeartUrl}
          />
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

const bodyText = {
  fontSize: typography.body.fontSize,
  fontWeight: typography.body.fontWeight,
  lineHeight: typography.body.lineHeight,
  letterSpacing: typography.body.letterSpacing,
  fontFamily: typography.body.fontFamily,
  color: colors.text.secondary,
  margin: `0 0 ${spacing.sm} 0`,
}

export default BaseEmailTemplate

