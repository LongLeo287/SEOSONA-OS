// Legacy interfaces - kept for compatibility but no longer used
export interface ColorToken {
  role: string
  hex: string
  rgb: { r: number; g: number; b: number }
  usage: number
  description?: string
}

export interface TypographyToken {
  fontFamily: string
  secondaryFonts?: string[]
  fontSize: number[]
  fontWeights: number[]
  letterSpacing: string[]
  lineHeight: { headings: number; body: number }
}

export interface SpacingToken {
  baseUnit: number
  commonGaps: number[]
  containerMaxWidths: { [key: string]: number }
}

export interface ShapeToken {
  borderRadius: { [component: string]: number }
  shadows: string[]
  transitions: string[]
}

export interface ComponentRecipe {
  name: string
  properties: { [key: string]: string }
}

export interface StyleProfile {
  id?: string
  siteName: string
  url: string
  generatedAt: string
  css?: string // Complete CSS theme
  styles?: any // Parsed styles for UI compatibility
}

export interface StyleProfileResult {
  success: boolean
  profile?: StyleProfile
  markdownContent?: string
  markdownUrl?: string
  error?: string
}
