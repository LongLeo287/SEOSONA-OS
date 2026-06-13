declare module "color-namer" {
  interface ColorNamerResult {
    ntc: Array<{
      name: string
      hex: string
    }>
  }

  function colorNamer(color: string): ColorNamerResult
  export default colorNamer
}

