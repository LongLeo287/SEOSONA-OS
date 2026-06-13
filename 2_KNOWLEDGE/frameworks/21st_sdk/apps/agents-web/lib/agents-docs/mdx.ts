import fs from "fs"
import path from "path"
import matter from "gray-matter"

const CONTENT_DIR = path.join(process.cwd(), "content", "agents-docs")

export interface DocMeta {
  title: string
  description: string
  slug: string[]
}

export function getDocBySlug(slug: string[]): {
  content: string
  meta: DocMeta
} | null {
  const filePath = path.join(CONTENT_DIR, ...slug) + ".mdx"

  if (!fs.existsSync(filePath)) {
    const indexPath = path.join(CONTENT_DIR, ...slug, "index.mdx")
    if (!fs.existsSync(indexPath)) return null
    const raw = fs.readFileSync(indexPath, "utf-8")
    const { data, content } = matter(raw)
    return {
      content,
      meta: {
        title: (data.title as string) || slug[slug.length - 1] || "21st Agents Docs",
        description: (data.description as string) || "",
        slug,
      },
    }
  }

  const raw = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(raw)
  return {
    content,
    meta: {
      title: (data.title as string) || slug[slug.length - 1] || "21st Agents Docs",
      description: (data.description as string) || "",
      slug,
    },
  }
}

export function getAllDocSlugs(): string[][] {
  const slugs: string[][] = []

  function walk(dir: string, prefix: string[]) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), [...prefix, entry.name])
      } else if (entry.name.endsWith(".mdx")) {
        const name = entry.name.replace(/\.mdx$/, "")
        if (name === "index") {
          slugs.push(prefix)
        } else {
          slugs.push([...prefix, name])
        }
      }
    }
  }

  walk(CONTENT_DIR, [])
  return slugs
}
