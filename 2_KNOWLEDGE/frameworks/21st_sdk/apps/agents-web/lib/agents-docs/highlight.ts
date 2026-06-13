import { codeToHtml } from "shiki"

export async function highlight(code: string, lang = "typescript") {
  return codeToHtml(code, {
    lang,
    themes: {
      dark: "github-dark",
      light: "github-light",
    },
    defaultColor: false,
    cssVariablePrefix: "--shiki-",
  })
}
