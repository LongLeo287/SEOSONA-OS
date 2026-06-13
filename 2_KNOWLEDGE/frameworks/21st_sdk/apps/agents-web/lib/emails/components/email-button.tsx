import { Button } from "@react-email/components"
import * as React from "react"
import { borderRadius, button as buttonTokens, colors, typography } from "../design-tokens"

interface EmailButtonProps {
  children: React.ReactNode
  href: string
  variant?: "primary" | "secondary" | "inverse"
}

export const EmailButton = ({
  children,
  href,
  variant = "primary",
}: EmailButtonProps) => {
  const buttonStyle = {
    ...baseButton,
    ...(variant === "primary" && primaryButton),
    ...(variant === "secondary" && secondaryButton),
    ...(variant === "inverse" && inverseButton),
  }

  return (
    <Button style={buttonStyle} href={href} className="button">
      {children}
    </Button>
  )
}

const baseButton = {
  display: "block",
  paddingTop: buttonTokens.padding.vertical,
  paddingBottom: buttonTokens.padding.vertical,
  paddingLeft: buttonTokens.padding.horizontal,
  paddingRight: buttonTokens.padding.horizontal,
  borderRadius: borderRadius.button,
  fontSize: typography.button.fontSize,
  fontWeight: typography.button.fontWeight,
  lineHeight: typography.button.lineHeight,
  letterSpacing: typography.button.letterSpacing,
  fontFamily: typography.button.fontFamily,
  textTransform: typography.button.textTransform,
  textDecoration: "none",
  textAlign: "center" as const,
  cursor: "pointer",
  border: "none",
  margin: "0 auto",
  maxWidth: "fit-content",
}

const primaryButton = {
  backgroundColor: colors.primary,
  color: colors.white,
}

const secondaryButton = {
  backgroundColor: "transparent",
  color: colors.primary,
  border: `1px solid ${colors.primary}`,
}

const inverseButton = {
  backgroundColor: colors.white,
  color: colors.primary,
  border: `1px solid ${colors.primary}`,
}

