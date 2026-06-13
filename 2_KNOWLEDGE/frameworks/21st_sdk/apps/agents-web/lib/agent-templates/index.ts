/**
 * Agent template loader for the agentic quickstart (builder) flow.
 *
 * Templates live as real folders under this directory. Each template folder
 * has a `meta.json` (name, description, icon, ordering) plus a tree of files
 * that will be copied into a new Studio project's `workspace_files` JSONB column.
 *
 * Server-side only — reads from the filesystem via `fs/promises`.
 */

import fs from "node:fs/promises"
import path from "node:path"

const META_FILE = "meta.json"
const TEMPLATE_DIR_CANDIDATES = [
  "lib/agent-templates",
  "apps/web/lib/agent-templates",
  "apps/agents-web/lib/agent-templates",
] as const

let templatesDirPromise: Promise<string> | null = null

export type TemplateMeta = {
  name: string
  slug: string
  description: string
  icon: string
  ordering: number
}

export type TemplateFiles = Record<string, string>

async function resolveTemplatesDir(): Promise<string> {
  for (const relativeDir of TEMPLATE_DIR_CANDIDATES) {
    const absoluteDir = path.join(process.cwd(), relativeDir)
    try {
      const stat = await fs.stat(absoluteDir)
      if (stat.isDirectory()) {
        return absoluteDir
      }
    } catch {
      // Keep trying candidates.
    }
  }

  throw new Error(
    `[agent-templates] Could not resolve template directory. cwd=${process.cwd()} candidates=${TEMPLATE_DIR_CANDIDATES.join(", ")}`,
  )
}

async function getTemplatesDir(): Promise<string> {
  templatesDirPromise ??= resolveTemplatesDir()
  return templatesDirPromise
}

/**
 * Recursively walk a directory and return a flat map of
 * { relativePath: fileContents }. Skips `meta.json` files and hidden files.
 */
async function readTreeAsMap(rootDir: string): Promise<TemplateFiles> {
  const result: TemplateFiles = {}

  async function walk(currentDir: string, relPrefix: string): Promise<void> {
    const entries = await fs.readdir(currentDir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue
      if (entry.name === META_FILE && relPrefix === "") continue
      const absPath = path.join(currentDir, entry.name)
      const relPath = relPrefix ? `${relPrefix}/${entry.name}` : entry.name
      if (entry.isDirectory()) {
        await walk(absPath, relPath)
      } else if (entry.isFile()) {
        result[relPath] = await fs.readFile(absPath, "utf8")
      }
    }
  }

  await walk(rootDir, "")
  return result
}

/**
 * List all available templates, ordered by `ordering` then `name`.
 */
export async function listTemplates(): Promise<TemplateMeta[]> {
  const templatesDir = await getTemplatesDir()
  const entries = await fs.readdir(templatesDir, { withFileTypes: true })

  const templates: TemplateMeta[] = []
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const metaPath = path.join(templatesDir, entry.name, META_FILE)
    try {
      const raw = await fs.readFile(metaPath, "utf8")
      const meta = JSON.parse(raw) as TemplateMeta
      if (!meta.slug) meta.slug = entry.name
      templates.push(meta)
    } catch (err) {
      // Skip folders without a valid meta.json — they're not templates.
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
        console.warn(`[agent-templates] Skipped ${entry.name}: invalid meta.json`, err)
      }
    }
  }

  return templates.sort((a, b) => {
    if (a.ordering !== b.ordering) return a.ordering - b.ordering
    return a.name.localeCompare(b.name)
  })
}

/**
 * Load a template's files as a flat `{ path: content }` map, ready to be
 * written into `studio_projects.workspace_files`.
 *
 * Throws if the template does not exist.
 */
export async function loadTemplate(slug: string): Promise<TemplateFiles> {
  // Defense in depth: validate slug against the curated template list before
  // touching the filesystem. Even though the caller normally verifies it,
  // this function shouldn't path-join an arbitrary string against TEMPLATES_DIR.
  const templates = await listTemplates()
  const match = templates.find((t) => t.slug === slug)
  if (!match) {
    throw new Error(`Template "${slug}" not found`)
  }
  const templateDir = path.join(await getTemplatesDir(), match.slug)
  return readTreeAsMap(templateDir)
}
