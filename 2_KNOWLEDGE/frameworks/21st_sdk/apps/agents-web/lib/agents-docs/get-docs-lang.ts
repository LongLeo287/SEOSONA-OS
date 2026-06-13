import type { DocsCodeLanguage } from "@/lib/atoms/agents-docs"

const VALID_LANGS = new Set<string>(["typescript", "python", "go"])

/**
 * Read the docs language from searchParams.
 * Server-safe — call from page.tsx and pass result as `lang` prop to content components.
 */
export function getDocsLang(
  searchParams?: { lang?: string } | URLSearchParams,
): DocsCodeLanguage {
  const raw =
    searchParams instanceof URLSearchParams
      ? searchParams.get("lang")
      : searchParams?.lang
  return raw && VALID_LANGS.has(raw)
    ? (raw as DocsCodeLanguage)
    : "typescript"
}
