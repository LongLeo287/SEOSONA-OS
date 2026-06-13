declare module "css-tree" {
  export type CssNode = any
  export type Declaration = any
  export type Raw = any
  export type Rule = any
  export type Selector = any
  export type SelectorList = any

  export function generate(ast: CssNode): string
  export function parse(css: string): CssNode
  export function walk(ast: CssNode, visitor: any): void
}

