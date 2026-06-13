import { visit } from "unist-util-visit"
import { codeToHtml } from "shiki"
import type { Root, Element } from "hast"

export function rehypeCode() {
  return async (tree: Root) => {
    const nodes: { node: Element; parent: Element; index: number }[] = []

    visit(tree, "element", (node, index, parent) => {
      if (
        node.tagName === "pre" &&
        node.children.length === 1 &&
        (node.children[0] as Element).tagName === "code"
      ) {
        nodes.push({ node, parent: parent as Element, index: index as number })
      }
    })

    for (const { node, parent, index } of nodes) {
      const codeEl = node.children[0] as Element
      const classNames = (codeEl.properties?.className as string[]) || []
      const langClass = classNames.find((c) => c.startsWith("language-"))
      const lang = langClass ? langClass.replace("language-", "") : "text"

      // Extract raw text content from code element
      const raw = extractText(codeEl)

      const html = await codeToHtml(raw, {
        lang,
        themes: { dark: "github-dark", light: "github-light" },
        defaultColor: false,
        cssVariablePrefix: "--shiki-",
      })

      // Replace the pre node with a custom component placeholder
      parent.children[index] = {
        type: "element",
        tagName: "code-block",
        properties: {
          "data-html": html,
          "data-code": raw,
        },
        children: [],
      }
    }
  }
}

function extractText(node: Element | { type: string; value?: string }): string {
  if (node.type === "text" && "value" in node) return node.value || ""
  if ("children" in node && Array.isArray(node.children)) {
    return node.children.map((c: Element | { type: string; value?: string }) => extractText(c)).join("")
  }
  return ""
}
