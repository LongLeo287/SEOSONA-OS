// Email Design System Tokens
// Based on Figma design: https://www.figma.com/design/PlvSFvgVYZ9XKbIzCAuD1c/21st?node-id=7464-82893

export const colors = {
  primary: "#0033ff",
  background: "#0033ff",
  white: "#ffffff",
  black: "#000000",
  text: {
    primary: "#000000",
    secondary: "rgba(0, 0, 0, 0.8)",
    tertiary: "rgba(0, 0, 0, 0.6)",
  },
  footer: {
    text: "rgba(255, 255, 255, 0.8)",
    textMuted: "rgba(255, 255, 255, 0.48)",
  },
  highlight: "#0033ff",
} as const

export const typography = {
  fontFamily: {
    abc: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    geistMono: "'Geist Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
  },
  h1: {
    fontSize: "45px",
    fontWeight: "590",
    lineHeight: "50px",
    letterSpacing: "-0.9px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  h2: {
    fontSize: "35px",
    fontWeight: "590",
    lineHeight: "40px",
    letterSpacing: "-0.7px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  body: {
    fontSize: "19px",
    fontWeight: "400",
    lineHeight: "32px",
    letterSpacing: "-0.38px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  footer: {
    fontSize: "15px",
    fontWeight: "400",
    lineHeight: "20px",
    letterSpacing: "-0.3px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  button: {
    fontSize: "13px",
    fontWeight: "400",
    lineHeight: "18px",
    letterSpacing: "0.66px",
    fontFamily: "'Geist Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
    textTransform: "uppercase" as const,
  },
} as const

export const spacing = {
  xs: "10px",
  sm: "16px",
  md: "24px",
  lg: "32px",
  xl: "48px",
  section: "48px",
  subsection: "32px",
  element: "16px",
} as const

export const borderRadius = {
  card: "24px",
  button: "999px",
} as const

export const layout = {
  containerWidth: "600px",
  containerWidthMobile: "100%",
  cardPadding: "48px",
  cardPaddingMobile: "24px",
  headerPadding: "48px",
  headerPaddingMobile: "24px",
  footerPadding: "48px",
  footerPaddingMobile: "24px",
} as const

export const button = {
  padding: {
    horizontal: "20px",
    vertical: "16px",
  },
} as const

