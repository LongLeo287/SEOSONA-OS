declare module "parse-css-color" {
  interface ParseCSSColorResult {
    type: "rgb" | "hsl" | "hex" | "named"
    values: number[]
    alpha?: number
  }

  function parseCSSColor(color: string): ParseCSSColorResult | null
  export default parseCSSColor
}

