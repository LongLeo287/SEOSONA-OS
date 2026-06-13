import { Body, Container, Head, Html, Preview } from "@react-email/components"
import * as React from "react"
import { colors, layout } from "../design-tokens"

interface EmailLayoutProps {
  children: React.ReactNode
  preview: string
}

export const EmailLayout = ({ children, preview }: EmailLayoutProps) => {
  return (
    <Html>
      <Head>
        <style>{`
          @media only screen and (max-width: 600px) {
            .container {
              width: 100% !important;
              padding: 0 !important;
            }
            .card {
              padding: 24px !important;
              border-radius: 0 !important;
            }
            .header {
              padding: 24px !important;
            }
            .footer {
              padding: 24px !important;
            }
            .footer-row {
              display: block !important;
            }
            .footer-left {
              width: 100% !important;
              text-align: center !important;
              margin-bottom: 16px !important;
            }
            .footer-right {
              width: 100% !important;
              text-align: center !important;
              margin-top: 0 !important;
            }
            .button {
              font-size: 16px !important;
              line-height: 22px !important;
            }
          }
        `}</style>
      </Head>
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container} className="container">{children}</Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: colors.background,
  width: "100%",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
}

const container = {
  margin: "0 auto",
  width: layout.containerWidth,
  maxWidth: "100%",
  padding: "0",
}

