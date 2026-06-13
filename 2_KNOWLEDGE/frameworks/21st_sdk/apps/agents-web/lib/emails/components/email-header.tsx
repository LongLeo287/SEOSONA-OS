import { Img, Section } from "@react-email/components"
import * as React from "react"
import { layout } from "../design-tokens"

interface EmailHeaderProps {
  logoUrl?: string
}

export const EmailHeader = ({ logoUrl }: EmailHeaderProps) => {
  const defaultLogoUrl = "https://assets.21st.dev/logo-white.png"

  return (
    <Section style={header} className="header">
      <Img
        src={logoUrl || defaultLogoUrl}
        width={119}
        height={32}
        alt="21st.dev"
        style={logo}
      />
    </Section>
  )
}

const header = {
  paddingTop: layout.headerPadding,
  paddingBottom: layout.headerPadding,
  paddingLeft: layout.headerPadding,
  paddingRight: layout.headerPadding,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

const logo = {
  display: "block",
  margin: "0 auto",
}

