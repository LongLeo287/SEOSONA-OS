import { Img, Link, Section, Text, Row, Column } from "@react-email/components"
import * as React from "react"
import { colors, layout, typography } from "../design-tokens"

interface SocialLink {
  name: string
  url: string
}

interface EmailFooterProps {
  links?: SocialLink[]
  companyName?: string
  unsubscribeUrl?: string
  preferencesUrl?: string
}

const defaultLinks: SocialLink[] = [
  { name: "Twitter", url: "https://twitter.com/21st_dev" },
]

export const EmailFooter = ({
  links = defaultLinks,
  companyName = "21st Labs Inc.",
  unsubscribeUrl,
  preferencesUrl,
}: EmailFooterProps) => {
  const logoUrl = "https://assets.21st.dev/logo-white.png"
  const defaultUnsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://21st.dev"}/unsubscribe`

  return (
    <Section style={footer} className="footer">
      <Row className="footer-row">
        <Column style={leftColumn} className="footer-left">
          <Link href={links[0]?.url} style={linkStyle}>
            {links[0]?.name}
          </Link>
          {preferencesUrl && (
            <>
              <Text style={linkSeparator}>&nbsp;&nbsp;&nbsp;</Text>
              <Link href={preferencesUrl} style={linkStyle}>
                Manage
              </Link>
            </>
          )}
          <Text style={linkSeparator}>&nbsp;&nbsp;&nbsp;</Text>
          <Link href={unsubscribeUrl || defaultUnsubscribeUrl} style={linkStyle}>
            Unsubscribe
          </Link>
        </Column>
        <Column style={rightColumn} className="footer-right">
          <Img src={logoUrl} width={59} height={16} alt="21st.dev" style={logo} />
        </Column>
      </Row>
    </Section>
  )
}

const footer = {
  paddingTop: "32px",
  paddingBottom: layout.footerPadding,
  paddingLeft: layout.footerPadding,
  paddingRight: layout.footerPadding,
  width: "100%",
}

const leftColumn = {
  width: "auto",
  textAlign: "left" as const,
  verticalAlign: "middle",
}

const rightColumn = {
  width: "auto",
  textAlign: "right" as const,
  verticalAlign: "middle",
}

const linkSeparator = {
  fontSize: typography.footer.fontSize,
  fontWeight: typography.footer.fontWeight,
  lineHeight: typography.footer.lineHeight,
  letterSpacing: typography.footer.letterSpacing,
  fontFamily: typography.footer.fontFamily,
  color: colors.footer.textMuted,
  margin: "0",
  display: "inline",
}

const logo = {
  display: "inline-block",
  verticalAlign: "middle",
  opacity: 0.8,
  border: "none",
  outline: "none",
}

const linkStyle = {
  fontSize: typography.footer.fontSize,
  fontWeight: typography.footer.fontWeight,
  lineHeight: typography.footer.lineHeight,
  letterSpacing: typography.footer.letterSpacing,
  fontFamily: typography.footer.fontFamily,
  color: colors.footer.textMuted,
  textDecoration: "none",
  margin: "0",
}

