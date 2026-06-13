import fs from "fs/promises"
import path from "path"
import { load, type CheerioAPI } from "cheerio"
import { AN_TEMPLATES, type AnTemplate } from "../lib/constants/agents-templates"

interface CliOptions {
  baseUrl: string
  outDir: string
  timeoutMs: number
}

const EXCLUDED_DOC_PATHS = new Set([
  "/docs/cli-deploy",
  "/docs/create-deploy",
  "/docs/project-structure",
])

const SKIP_TAGS = new Set(["button", "style", "svg", "script", "nav", "noscript", "aside"])
const FENCE = "```"
const DOCS_PATH_ALIASES: Record<string, string> = {
  "/docs/skills": "/docs/build/skills",
  "/docs/customization": "/docs/build/themes",
}

type NodeLike = {
  type?: string
  tagName?: string
  name?: string
  data?: string
  children?: NodeLike[]
}

function nodeTagName(node: NodeLike): string {
  return String(node.tagName || node.name || "").toLowerCase()
}

function normalizeInternalDocsPath(pathname: string): string {
  let normalized = pathname

  if (normalized === "/agents/docs") normalized = "/docs"
  if (normalized.startsWith("/agents/docs/")) {
    normalized = `/docs/${normalized.slice("/agents/docs/".length)}`
  }
  if (normalized === "/an/docs") normalized = "/docs"
  if (normalized.startsWith("/an/docs/")) {
    normalized = `/docs/${normalized.slice("/an/docs/".length)}`
  }
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1)
  }
  const alias = DOCS_PATH_ALIASES[normalized]
  if (alias) normalized = alias

  return normalized
}

function toMdDocsPath(pathname: string): string | null {
  const normalized = normalizeInternalDocsPath(pathname)

  if (normalized === "/docs") return "/agents/docs/md"
  if (normalized === "/docs/md" || normalized.startsWith("/docs/md/")) {
    return `/agents${normalized}`
  }
  if (normalized.startsWith("/docs/")) {
    return `/agents/docs/md/${normalized.slice("/docs/".length)}`
  }

  return null
}

function mapDocsHrefToMd(href: string): string {
  const value = href.trim()
  if (!value) return value

  try {
    if (value.startsWith("/")) {
      const parsed = new URL(value, "https://21st.dev")
      const rewrittenPath = toMdDocsPath(parsed.pathname)
      if (!rewrittenPath) return value
      return `${rewrittenPath}${parsed.search}${parsed.hash}`
    }

    const parsed = new URL(value)
    const isInternalDocsHost =
      parsed.hostname === "an.dev" ||
      parsed.hostname === "www.an.dev" ||
      parsed.hostname === "21st.dev" ||
      parsed.hostname === "www.21st.dev"
    if (!isInternalDocsHost) return value

    const rewrittenPath = toMdDocsPath(parsed.pathname)
    if (!rewrittenPath) return value
    return `${rewrittenPath}${parsed.search}${parsed.hash}`
  } catch {
    return value
  }
}

function rewriteMarkdownDocLinks(markdown: string): string {
  return markdown.replace(/\]\(([^)\s]+)\)/g, (_match, url: string) => {
    return `](${mapDocsHrefToMd(url)})`
  })
}

function getMarkdownOverride(raw: string | undefined): string | null {
  if (raw === undefined) return null
  return raw.replace(/\r\n?/g, "\n").trim()
}

function getTemplateForDocPath(docPath: string): AnTemplate | null {
  const prefix = "/docs/templates/"
  if (!docPath.startsWith(prefix)) return null
  const slug = docPath.slice(prefix.length)
  if (!slug) return null
  return AN_TEMPLATES.find((template) => template.slug === slug) ?? null
}

function stripLeadingH1(markdown: string): string {
  const cleaned = markdown.replace(/^\uFEFF/, "").trim()
  const lines = cleaned.split("\n")
  if (!lines[0]?.startsWith("# ")) return cleaned
  return lines.slice(1).join("\n").trim()
}

function rewriteLegacySdkRefs(markdown: string): string {
  return markdown.replaceAll("@an-sdk/", "@21st-sdk/")
}

async function fetchTemplateReadme(
  template: AnTemplate,
  timeoutMs: number,
): Promise<string | null> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const url = `https://raw.githubusercontent.com/${template.sourceRepo}/main/${template.sourcePath}/README.md`
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "an-docs-markdown-export/1.0",
      },
      redirect: "follow",
    })
    if (!response.ok) return null
    const text = (await response.text()).trim()
    return text ? rewriteLegacySdkRefs(text) : null
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

function buildTemplateMarkdown(
  template: AnTemplate,
  readme: string | null,
): string {
  const repoUrl = `https://github.com/${template.sourceRepo}/tree/main/${template.sourcePath}`
  const parts = [
    `# ${template.name}`,
    "",
    template.description,
    "",
    `- [All Templates](/agents/docs/md/templates)`,
    `- [GitHub](${repoUrl})`,
  ]

  const body = readme ? stripLeadingH1(readme) : ""
  if (body) {
    parts.push("", "---", "", body)
  }

  return parts.join("\n").trim()
}

function inferSection(docPath: string): string {
  if (docPath.startsWith("/docs/build/")) return "Build"
  if (docPath.startsWith("/docs/deploy/")) return "Deploy & Operate"
  if (docPath.startsWith("/docs/security/")) return "Security & Access"
  if (docPath.startsWith("/docs/reference/") || docPath === "/docs/api-reference") return "Reference"
  if (docPath.startsWith("/docs/get-started/") || docPath === "/docs") return "Get Started"
  return "Get Started"
}

function inferSlug(docPath: string): string {
  if (docPath === "/docs") return "introduction"
  return docPath
    .replace(/^\/docs\/?/, "")
    .replace(/\//g, "-")
}

function extractTitle(markdown: string, fallback: string): string {
  const line = markdown
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.startsWith("# "))
  if (!line) return fallback
  const text = line.replace(/^#\s+/, "").trim()
  return text || fallback
}

function extractDescription(markdown: string): string {
  const lines = markdown.split("\n").map((l) => l.trim())
  let passedTitle = false
  for (const line of lines) {
    if (!passedTitle) {
      if (line.startsWith("# ")) passedTitle = true
      continue
    }
    if (!line) continue
    if (line.startsWith("#")) continue
    if (line.startsWith("```")) continue
    if (line.startsWith("|")) continue
    if (line.startsWith("- ")) continue
    if (/^\d+\.\s+/.test(line)) continue
    return line.slice(0, 240)
  }
  return ""
}

async function discoverDocsPaths(): Promise<string[]> {
  const docsRoot = path.join(process.cwd(), "app", "agents", "docs")
  const paths: string[] = []

  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (entry.name.startsWith("[")) continue
        await walk(path.join(dir, entry.name))
        continue
      }

      if (entry.name !== "page.tsx") continue
      const relativeDir = path.relative(docsRoot, dir)
      const routePath =
        !relativeDir || relativeDir === "."
          ? "/docs"
          : `/docs/${relativeDir.replaceAll(path.sep, "/")}`
      paths.push(routePath)
    }
  }

  await walk(docsRoot)

  for (const template of AN_TEMPLATES) {
    paths.push(`/docs/templates/${template.slug}`)
  }

  return Array.from(new Set(paths))
    .filter((docPath) => !EXCLUDED_DOC_PATHS.has(docPath))
    .sort((a, b) => {
      if (a === "/docs") return -1
      if (b === "/docs") return 1
      return a.localeCompare(b)
    })
}

function printHelp() {
  console.log(`Export AN docs pages (TSX rendered) to markdown files.

Usage:
  pnpm docs:export-markdown [--base-url URL] [--out-dir DIR] [--timeout-ms N]

Options:
  --base-url    Base docs URL. Default: AN_DOCS_EXPORT_BASE_URL or http://127.0.0.1:3000/agents
  --out-dir     Output directory. Default: public/an-docs-markdown
  --timeout-ms  Per-page timeout in ms. Default: 30000
`)
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2)
  if (args.includes("--help") || args.includes("-h")) {
    printHelp()
    process.exit(0)
  }

  let baseUrl =
    process.env.AN_DOCS_EXPORT_BASE_URL || "http://127.0.0.1:3000/agents"
  let outDir = "public/an-docs-markdown"
  let timeoutMs = 30_000

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === "--base-url" && args[i + 1]) {
      baseUrl = args[i + 1]!
      i++
      continue
    }
    if (arg === "--out-dir" && args[i + 1]) {
      outDir = args[i + 1]!
      i++
      continue
    }
    if (arg === "--timeout-ms" && args[i + 1]) {
      const parsed = Number(args[i + 1])
      if (Number.isFinite(parsed) && parsed > 0) {
        timeoutMs = parsed
      }
      i++
      continue
    }
  }

  return {
    baseUrl: baseUrl.replace(/\/+$/, ""),
    outDir: path.resolve(process.cwd(), outDir),
    timeoutMs,
  }
}

async function fetchRenderedHtml(url: string, timeoutMs: number): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "an-docs-markdown-export/1.0",
      },
      redirect: "follow",
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`)
    }

    return await response.text()
  } finally {
    clearTimeout(timeout)
  }
}

function inlineToMarkdown($: CheerioAPI, node: NodeLike): string {
  let result = ""
  const children = (node.children || []) as NodeLike[]

  for (const child of children) {
    if (child.type === "text") {
      result += child.data || ""
      continue
    }

    if (child.type !== "tag") continue

    const tag = nodeTagName(child)
    if (SKIP_TAGS.has(tag)) continue

    const childEl = $(child as never)
    if (childEl.attr("data-copy-md") !== undefined) continue
    const markdownOverride = getMarkdownOverride(childEl.attr("data-markdown"))
    if (markdownOverride !== null) {
      result += markdownOverride
      continue
    }

    if (tag === "a") {
      const href = mapDocsHrefToMd(childEl.attr("href") || "")
      result += `[${childEl.text().trim()}](${href})`
      continue
    }

    if (tag === "strong" || tag === "b") {
      result += `**${childEl.text().trim()}**`
      continue
    }

    if (tag === "em" || tag === "i") {
      result += `*${childEl.text().trim()}*`
      continue
    }

    if (tag === "code") {
      result += `\`${childEl.text()}\``
      continue
    }

    if (tag === "br") {
      result += "\n"
      continue
    }

    result += inlineToMarkdown($, child)
  }

  return result
}

function tryExtractCodeBlock($: CheerioAPI, node: NodeLike): string | null {
  const nodeEl = $(node as never)
  if (nodeEl.find("section").length > 0 || nodeEl.find("h1, h2, h3").length > 0) {
    return null
  }

  const codeContainer = nodeEl.hasClass("an-docs-code")
    ? nodeEl
    : nodeEl.find(".an-docs-code").first()
  if (codeContainer.length === 0) return null

  let filename = ""
  const filenameDiv = codeContainer
    .children("div")
    .filter((_, el) => {
      const cls = $(el).attr("class") || ""
      return !cls.includes("absolute")
    })
    .first()

  if (filenameDiv.length > 0) {
    const text = filenameDiv
      .contents()
      .filter((_, n) => n.type === "text")
      .map((_, n) => (n.data || "").trim())
      .get()
      .filter(Boolean)
      .join("")

    if (text && !text.includes("{") && text.length < 100) {
      filename = text
    }
  }

  const rawCode = (codeContainer.attr("data-raw-code") || "").trim()
  const preText = codeContainer.find("pre").first().text().trim()
  const codeText = rawCode || preText
  if (!codeText) return null

  const ext = filename.split(".").pop() || ""
  const langMap: Record<string, string> = {
    ts: "typescript",
    tsx: "tsx",
    js: "javascript",
    jsx: "jsx",
    py: "python",
    go: "go",
    json: "json",
    bash: "bash",
    sh: "bash",
  }
  const lang = langMap[ext] || ""

  let result = ""
  if (filename) result += `${filename}\n`
  result += `${FENCE}${lang}\n${codeText}\n${FENCE}\n\n`
  return result
}

function tryExtractInstallBlock($: CheerioAPI, node: NodeLike): string | null {
  const nodeEl = $(node as never)
  if (nodeEl.find("section").length > 0 || nodeEl.find("h1, h2, h3").length > 0) {
    return null
  }

  const installCode = nodeEl.find(".install-code").first()
  if (installCode.length === 0) return null

  const codeEl = installCode.find("code").first()
  const text = codeEl.text().trim()
  if (!text) return null

  return `${FENCE}bash\n${text}\n${FENCE}\n\n`
}

function htmlToMarkdown($: CheerioAPI, node: NodeLike): string {
  let md = ""
  const children = (node.children || []) as NodeLike[]

  for (const child of children) {
    if (child.type === "text") {
      md += child.data || ""
      continue
    }

    if (child.type !== "tag") continue

    const tag = nodeTagName(child)
    if (SKIP_TAGS.has(tag)) continue

    const childEl = $(child as never)
    if (childEl.attr("data-copy-md") !== undefined) continue
    const markdownOverride = getMarkdownOverride(childEl.attr("data-markdown"))
    if (markdownOverride !== null) {
      if (markdownOverride) md += `${markdownOverride}\n\n`
      continue
    }
    if (childEl.is("[data-md-skip]")) continue

    if (tag === "div") {
      const install = tryExtractInstallBlock($, child)
      if (install) {
        md += install
        continue
      }

      const codeBlock = tryExtractCodeBlock($, child)
      if (codeBlock) {
        md += codeBlock
        continue
      }
    }

    switch (tag) {
      case "h1":
        md += `# ${childEl.text().trim()}\n\n`
        break
      case "h2":
        md += `## ${childEl.text().trim()}\n\n`
        break
      case "h3":
        md += `### ${childEl.text().trim()}\n\n`
        break
      case "a": {
        const href = mapDocsHrefToMd(childEl.attr("href") || "")
        const label = inlineToMarkdown($, child).trim() || childEl.text().trim() || href
        md += `[${label}](${href})`
        break
      }
      case "code":
        md += `\`${childEl.text()}\``
        break
      case "strong":
      case "b":
        md += `**${inlineToMarkdown($, child).trim() || childEl.text().trim()}**`
        break
      case "em":
      case "i":
        md += `*${inlineToMarkdown($, child).trim() || childEl.text().trim()}*`
        break
      case "br":
        md += "\n"
        break
      case "p":
        md += `${inlineToMarkdown($, child)}\n\n`
        break
      case "pre": {
        const codeEl = childEl.find("code").first()
        const className = codeEl.attr("class") || ""
        const lang = className.match(/language-(\w+)/)?.[1] || ""
        const text = (codeEl.length > 0 ? codeEl : childEl).text().trim()
        md += `${FENCE}${lang}\n${text}\n${FENCE}\n\n`
        break
      }
      case "ul": {
        childEl.children("li").each((_, li) => {
          md += `- ${inlineToMarkdown($, li as unknown as NodeLike).trim()}\n`
        })
        md += "\n"
        break
      }
      case "ol": {
        childEl.children("li").each((i, li) => {
          md += `${i + 1}. ${inlineToMarkdown($, li as unknown as NodeLike).trim()}\n`
        })
        md += "\n"
        break
      }
      case "table": {
        childEl.find("tr").each((i, row) => {
          const cells = $(row).find("th, td")
          const rowText = cells
            .map((_, c) => $(c).text().trim())
            .get()
            .join(" | ")
          md += `| ${rowText} |\n`
          if (i === 0) {
            md += `| ${cells.map(() => "---").get().join(" | ")} |\n`
          }
        })
        md += "\n"
        break
      }
      case "section":
      case "div":
      case "article":
      case "main": {
        const nested = htmlToMarkdown($, child).replace(/\n+$/g, "")
        if (!nested.trim()) break
        if (md && !md.endsWith("\n\n")) md += "\n\n"
        md += `${nested}\n\n`
        break
      }
      default:
        md += inlineToMarkdown($, child)
        break
    }
  }

  return md
}

function renderHtmlToMarkdown(html: string): string {
  const $ = load(html)
  const main = $("main").first()
  if (main.length === 0) return ""

  const clone = load(main.toString())
  clone("[data-copy-md]").remove()
  clone(".select-none").remove()
  clone("[data-sidebar]").remove()
  clone("header").remove()

  const mainNode = clone("main").get(0) as unknown as NodeLike | undefined
  if (!mainNode) return ""

  return htmlToMarkdown(clone, mainNode).replace(/\n{3,}/g, "\n\n").trim()
}

function sanitizeMarkdownSecrets(markdown: string): string {
  return markdown
    .replace(/(AN_API_KEY=)[^\s`"'\\]+/g, "$1YOUR_API_KEY")
    .replace(/(API_KEY_21ST=)[^\s`"'\\]+/g, "$1YOUR_API_KEY")
    .replace(/(Authorization:\s*["']?Bearer\s+)[^\s`"']+/gi, "$1YOUR_API_KEY")
    .replace(/\b(?:21st_sk_|an_sk_)[a-f0-9]{8,}\b/gi, "21st_sk_...")
}

async function run() {
  const options = parseArgs()
  const docsPaths = await discoverDocsPaths()

  if (docsPaths.length === 0) {
    throw new Error("No docs pages found under app/agents/docs")
  }

  await fs.rm(options.outDir, { recursive: true, force: true })
  await fs.mkdir(options.outDir, { recursive: true })

  const generatedAt = new Date().toISOString()
  const index: Array<{
    slug: string
    path: string
    title: string
    description: string
    section: string
    file: string
  }> = []

  const combinedParts: string[] = [
    "# An Documentation (Complete)",
    "",
    "> Generated from server-rendered TSX docs pages.",
    "",
    "---",
    "",
  ]

  for (const docPath of docsPaths) {
    const url = `${options.baseUrl}${docPath}`
    console.log(`Exporting ${docPath} -> ${url}`)

    const template = getTemplateForDocPath(docPath)
    let normalized = ""

    if (template) {
      const readme = await fetchTemplateReadme(template, options.timeoutMs)
      normalized = buildTemplateMarkdown(template, readme)
    }

    if (!normalized) {
      let html: string
      try {
        html = await fetchRenderedHtml(url, options.timeoutMs)
      } catch (error) {
        throw new Error(
          `Failed to fetch docs page ${url}. Ensure server is running/reachable.\n${String(error)}`,
        )
      }

      normalized = renderHtmlToMarkdown(html)
      if (!normalized) {
        throw new Error(`Rendered markdown is empty for ${url}`)
      }
    }

    normalized = rewriteMarkdownDocLinks(sanitizeMarkdownSecrets(normalized))

    const slug = inferSlug(docPath)
    const title = extractTitle(normalized, slug)
    const description = extractDescription(normalized)
    const section = inferSection(docPath)

    const filename = `${slug}.md`
    await fs.writeFile(path.join(options.outDir, filename), `${normalized}\n`)

    index.push({
      slug,
      path: docPath,
      title,
      description,
      section,
      file: filename,
    })

    combinedParts.push(normalized)
    combinedParts.push("")
    combinedParts.push("---")
    combinedParts.push("")
  }

  await fs.writeFile(
    path.join(options.outDir, "index.json"),
    `${JSON.stringify({ generatedAt, baseUrl: options.baseUrl, pages: index }, null, 2)}\n`,
  )

  await fs.writeFile(
    path.join(options.outDir, "all.md"),
    `${combinedParts.join("\n").trimEnd()}\n`,
  )

  console.log(
    `Export complete: ${index.length} pages -> ${path.relative(process.cwd(), options.outDir)}`,
  )
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
