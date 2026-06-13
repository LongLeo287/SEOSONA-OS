import { Section } from "@react-email/components"
import * as React from "react"
import { borderRadius, colors, layout } from "../design-tokens"

interface EmailCardProps {
  children: React.ReactNode
}

export const EmailCard = ({ children }: EmailCardProps) => {
  return <Section style={card} className="card">{children}</Section>
}

const card = {
  backgroundColor: colors.white,
  borderRadius: borderRadius.card,
  padding: layout.cardPadding,
  width: "100%",
}

