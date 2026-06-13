import fs from "fs"
import path from "path"
import type { DocPage } from "@/lib/agents-docs/markdown-content"

export interface GeneratedDocIndexEntry {
  slug: string
  path: string
  title: string
  description: string
  section: string
  file: string
}

const GENERATED_DIR = path.join(process.cwd(), "public", "an-docs-markdown")
const INDEX_FILE = path.join(GENERATED_DIR, "index.json")

function readIndex(): GeneratedDocIndexEntry[] {
  if (!fs.existsSync(INDEX_FILE)) return []

  try {
    const raw = fs.readFileSync(INDEX_FILE, "utf-8")
    const parsed = JSON.parse(raw) as
      | GeneratedDocIndexEntry[]
      | { pages?: GeneratedDocIndexEntry[] }
    if (Array.isArray(parsed)) return parsed
    return parsed.pages ?? []
  } catch {
    return []
  }
}

function readMarkdownFile(file: string): string | null {
  const fullPath = path.join(GENERATED_DIR, file)
  if (!fs.existsSync(fullPath)) return null
  try {
    return fs.readFileSync(fullPath, "utf-8")
  } catch {
    return null
  }
}

export function getGeneratedDocByPath(docPath: string): DocPage | undefined {
  const entry = readIndex().find((doc) => doc.path === docPath)
  if (!entry) return undefined

  const markdown = readMarkdownFile(entry.file)
  if (!markdown) return undefined

  return {
    slug: entry.slug,
    path: entry.path,
    title: entry.title,
    description: entry.description,
    section: entry.section,
    markdown,
  }
}

export function getAllGeneratedDocs(): DocPage[] {
  const pages: DocPage[] = []
  for (const entry of readIndex()) {
    const markdown = readMarkdownFile(entry.file)
    if (!markdown) continue
    pages.push({
      slug: entry.slug,
      path: entry.path,
      title: entry.title,
      description: entry.description,
      section: entry.section,
      markdown,
    })
  }
  return pages
}
