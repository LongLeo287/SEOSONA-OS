import { atomWithStorage } from "jotai/utils"

export type DocsCodeLanguage = "typescript" | "python" | "go"

// Persists the preferred language for multi-language docs examples.
export const docsCodeLanguageAtom = atomWithStorage<DocsCodeLanguage>(
  "an-docs-code-language-v2",
  "typescript",
)

// Persists the selected agent slug for API reference code examples.
export const apiRefSelectedAgentSlugAtom = atomWithStorage<string | null>(
  "an-api-ref-agent-slug",
  null,
)
