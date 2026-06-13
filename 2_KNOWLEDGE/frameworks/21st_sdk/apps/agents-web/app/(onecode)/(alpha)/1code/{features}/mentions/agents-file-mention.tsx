"use client"

import {
  Code2,
  Container,
  Database,
  FileJson,
  FileText,
  Terminal,
} from "lucide-react"

import {
  GoIcon,
  JavaScriptIcon,
  PythonIcon,
  ReactIcon,
  TypeScriptIcon,
} from "@/components/features/agents/an/docs/framework-icons"
import {
  FilesIcon,
  MarkdownIcon,
} from "@/components/features/agents/ui/canvas/[id]/{components}/ui/icons"

export function getFileIconByExtension(
  filename: string,
  returnNullForUnknown = false,
) {
  const filenameLower = filename.toLowerCase()

  if (filenameLower === "dockerfile" || filenameLower.endsWith("/dockerfile")) {
    return Container
  }

  const baseFilename = filenameLower.split("/").pop() || filenameLower
  if (baseFilename === ".env" || baseFilename.startsWith(".env.")) {
    return Terminal
  }

  if (filenameLower.endsWith(".md") || filenameLower.endsWith(".mdx")) {
    return MarkdownIcon
  }

  if (
    filenameLower.endsWith(".js") ||
    filenameLower.endsWith(".mjs") ||
    filenameLower.endsWith(".cjs")
  ) {
    return JavaScriptIcon
  }

  const ext = filename.split(".").pop()?.toLowerCase() || ""

  switch (ext) {
    case "tsx":
    case "jsx":
      return ReactIcon
    case "ts":
      return TypeScriptIcon
    case "js":
    case "mjs":
    case "cjs":
      return JavaScriptIcon
    case "py":
    case "pyw":
    case "pyi":
      return PythonIcon
    case "go":
      return GoIcon
    case "md":
    case "mdx":
      return MarkdownIcon
    case "json":
    case "jsonc":
      return FileJson
    case "yaml":
    case "yml":
    case "toml":
      return FileText
    case "sh":
    case "bash":
    case "zsh":
      return Terminal
    case "sql":
    case "prisma":
      return Database
    case "html":
    case "htm":
    case "css":
    case "scss":
    case "sass":
    case "graphql":
    case "gql":
    case "rs":
    case "java":
    case "c":
    case "h":
    case "cpp":
    case "cc":
    case "cxx":
    case "hpp":
    case "cs":
    case "php":
    case "rb":
    case "kt":
    case "vue":
    case "svelte":
    case "astro":
    case "swift":
      return Code2
    case "dockerfile":
      return Container
    default:
      return returnNullForUnknown ? null : FilesIcon
  }
}
