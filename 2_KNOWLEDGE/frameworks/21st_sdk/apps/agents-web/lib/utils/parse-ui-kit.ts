export interface ParsedUIKit {
  siteName: string
  shadcnTheme: {
    colors: {
      light: Record<string, string>
      dark: Record<string, string>
    }
    radius: string
    fontFamily: {
      sans: string[]
      mono: string[]
    }
  } | null
  globalTokens: Array<{
    token: string
    value: string
    cssReference: string
  }>
  components: {
    buttons: {
      primary?: ButtonStyle
      secondary?: ButtonStyle
      outline?: ButtonStyle
    }
    typography: {
      h1?: TypographyStyle
      h2?: TypographyStyle
      h3?: TypographyStyle
      h4?: TypographyStyle
      h5?: TypographyStyle
      h6?: TypographyStyle
      body?: TypographyStyle
      caption?: TypographyStyle
    }
  }
  motionAndTransitions: {
    transitionFast: string | null
    keyframes: string | null
  }
}

interface ButtonStyle {
  bg: string
  fg: string
  padding: string
  radius: string
  shadow: string | null
  border?: string
}

interface TypographyStyle {
  fontSize: string
  fontWeight: string
  lineHeight: string
}

export function parseUIKitMarkdown(
  markdown: string,
  ): ParsedUIKit | null {
  try {
    // Extract site name
    const siteNameMatch = markdown.match(/# Design System for (.+)/)
    const siteName = siteNameMatch ? siteNameMatch[1] : "Unknown"

    // Extract shadcn theme JSON
    let shadcnTheme = null
    const jsonMatch = markdown.match(/```json\s*([\s\S]*?)\s*```/)
    if (jsonMatch) {
      try {
        shadcnTheme = JSON.parse(jsonMatch[1])
      } catch (e) {
        console.warn("Failed to parse shadcn theme JSON:", e)
      }
    }

    // Extract global tokens table
    const globalTokens: Array<{
      token: string
      value: string
      cssReference: string
    }> = []
    const tableMatch = markdown.match(
      /## 2\. Global Tokens\s*\|[^|]+\|[^|]+\|[^|]+\|\s*\|[^|]+\|[^|]+\|[^|]+\|\s*((?:\|[^|]+\|[^|]+\|[^|]+\|\s*)*)/,
    )
    if (tableMatch) {
      const rows = tableMatch[1]
        .split("\n")
        .filter((row) => row.trim() && row.includes("|"))
      for (const row of rows) {
        const cells = row
          .split("|")
          .map((cell) => cell.trim())
          .filter((cell) => cell)
        if (cells.length >= 3) {
          globalTokens.push({
            token: cells[0],
            value: cells[1],
            cssReference: cells[2],
          })
        }
      }
    }

    // Parse button styles
    const buttons: any = {}

    // Primary button
    const primaryMatch = markdown.match(
      /- \*\*Primary\*\*:\s*([\s\S]*?)(?=- \*\*(?:Secondary|Outline)\*\*|### Typography|$)/,
    )
    if (primaryMatch) {
      buttons.primary = parseButtonStyle(primaryMatch[1])
    }

    // Secondary button
    const secondaryMatch = markdown.match(
      /- \*\*Secondary\*\*:\s*([\s\S]*?)(?=- \*\*Outline\*\*|### Typography|$)/,
    )
    if (secondaryMatch) {
      buttons.secondary = parseButtonStyle(secondaryMatch[1])
    }

    // Outline button
    const outlineMatch = markdown.match(
      /- \*\*Outline\*\*:\s*([\s\S]*?)(?=### Typography|$)/,
    )
    if (outlineMatch) {
      buttons.outline = parseButtonStyle(outlineMatch[1])
    }

    // Parse typography
    const typography: any = {}
    const typographyMatch = markdown.match(
      /### Typography\s*([\s\S]*?)(?=## 4\. Motion|$)/,
    )
    if (typographyMatch) {
      const typoText = typographyMatch[1]

      // Parse each typography style
      const styles = ["H1", "H2", "H3", "H4", "H5", "H6", "Body", "Caption"]
      for (const style of styles) {
        const regex = new RegExp(
          `- \\*\\*${style}\\*\\*:\\s*\`([^\`]+)\`,\\s*\`([^\`]+)\`,\\s*\`([^\`]+)\``,
        )
        const match = typoText.match(regex)
        if (match) {
          typography[style.toLowerCase()] = {
            fontSize: match[1],
            fontWeight: match[2],
            lineHeight: match[3],
          }
        }
      }
    }

    // Parse motion and transitions
    const motionMatch = markdown.match(
      /## 4\. Motion & Transitions\s*([\s\S]*?)$/,
    )
    let motionAndTransitions = {
      transitionFast: null as string | null,
      keyframes: null as string | null,
    }

    if (motionMatch) {
      const motionText = motionMatch[1]

      // Extract transition-fast
      const transitionMatch = motionText.match(
        /- \*\*--transition-fast\*\*:\s*(.+)/,
      )
      if (transitionMatch && transitionMatch[1] !== "null") {
        motionAndTransitions.transitionFast = transitionMatch[1]
      }

      // Extract keyframes
      const keyframesMatch = motionText.match(/```css\s*([\s\S]*?)\s*```/)
      if (keyframesMatch) {
        motionAndTransitions.keyframes = keyframesMatch[1].trim()
      }
    }

    return {
      siteName,
      shadcnTheme,
      globalTokens,
      components: {
        buttons,
        typography,
      },
      motionAndTransitions,
    }
  } catch (error) {
    console.error("Failed to parse style profile markdown:", error)
    return null
  }
}

function parseButtonStyle(text: string): ButtonStyle | null {
  if (text.trim() === "null") return null

  const style: Partial<ButtonStyle> = {}

  // Parse each property
  const bgMatch = text.match(/`bg`:\s*`([^`]+)`/)
  if (bgMatch) style.bg = bgMatch[1]

  const fgMatch = text.match(/`fg`:\s*`([^`]+)`/)
  if (fgMatch) style.fg = fgMatch[1]

  const paddingMatch = text.match(/`padding`:\s*`([^`]+)`/)
  if (paddingMatch) style.padding = paddingMatch[1]

  const radiusMatch = text.match(/`radius`:\s*`([^`]+)`/)
  if (radiusMatch) style.radius = radiusMatch[1]

  const shadowMatch = text.match(/`shadow`:\s*`([^`]+)`/)
  if (shadowMatch && shadowMatch[1] !== "null") style.shadow = shadowMatch[1]

  const borderMatch = text.match(/`border`:\s*`([^`]+)`/)
  if (borderMatch) style.border = borderMatch[1]

  return style as ButtonStyle
}
