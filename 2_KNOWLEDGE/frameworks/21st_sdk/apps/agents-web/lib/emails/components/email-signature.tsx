import { Img, Section, Text } from "@react-email/components"
import * as React from "react"
import { colors, spacing, typography } from "../design-tokens"

interface EmailSignatureProps {
  authorName: string
  showHeart?: boolean
  heartUrl?: string
}

export const EmailSignature = ({
  authorName,
  showHeart = false,
  heartUrl,
}: EmailSignatureProps) => {
  const defaultHeartUrl = "https://assets.21st.dev/heart.png"

  return (
    <Section style={signatureSection}>
      <Text style={signatureTextLine1}>With love,</Text>
      <Section style={authorAndHeartContainer}>
        <Text style={signatureTextLine2}>{authorName}</Text>
        {showHeart && (
          <Img 
            src={heartUrl || defaultHeartUrl} 
            width={62} 
            height={50} 
            alt="Heart" 
            style={heart} 
          />
        )}
      </Section>
    </Section>
  )
}

const signatureSection = {
  display: "flex",
  flexDirection: "column" as const,
  gap: spacing.xs,
  marginTop: spacing.xl,
  alignItems: "flex-start" as const,
}

const signatureTextBase = {
  fontSize: typography.body.fontSize,
  fontWeight: typography.body.fontWeight,
  lineHeight: typography.body.lineHeight,
  letterSpacing: typography.body.letterSpacing,
  fontFamily: typography.body.fontFamily,
  color: colors.text.secondary,
  margin: "0",
}

const signatureTextLine1 = {
  ...signatureTextBase,
}

const signatureTextLine2 = {
  ...signatureTextBase,
}

const authorAndHeartContainer = {
  display: "flex",
  flexDirection: "row" as const,
  alignItems: "center" as const,
  gap: "16px",
  margin: "0",
}

const heart = {
  display: "block",
  marginTop: "16px",
}

