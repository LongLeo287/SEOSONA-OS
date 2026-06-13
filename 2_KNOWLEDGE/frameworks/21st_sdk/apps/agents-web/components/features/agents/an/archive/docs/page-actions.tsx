"use client"

import { useState, useCallback } from "react"
import { useAgentsPathname } from "@/hooks/use-agents-pathname"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { AnimatedCopyIcon, ChevronDownIcon } from "./icons"

/* ── Brand icons (from project SVGs) ────────────────────────────────── */

const ChatGPTIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <mask id="openai_a" width="16" height="16" x="0" y="0" maskUnits="userSpaceOnUse">
      <path fill="#fff" d="M15.568.494H.433v15h15.135z" />
    </mask>
    <g mask="url(#openai_a)">
      <path fill="currentColor" d="M6.238 5.954V4.529c0-.12.045-.21.15-.27l2.865-1.65c.39-.225.855-.33 1.335-.33 1.8 0 2.94 1.395 2.94 2.88 0 .105 0 .225-.015.345l-2.97-1.74a.5.5 0 0 0-.54 0zm6.69 5.55V8.099c0-.21-.09-.36-.27-.465l-3.765-2.19 1.23-.705a.27.27 0 0 1 .3 0l2.865 1.65c.825.48 1.38 1.5 1.38 2.49 0 1.14-.675 2.19-1.74 2.625m-7.575-3-1.23-.72c-.105-.06-.15-.15-.15-.27v-3.3c0-1.605 1.23-2.82 2.895-2.82.63 0 1.215.21 1.71.585l-2.955 1.71a.5.5 0 0 0-.27.465zm2.648 1.53-1.763-.99v-2.1l1.763-.99 1.762.99v2.1zm1.132 4.56c-.63 0-1.215-.21-1.71-.585l2.955-1.71a.5.5 0 0 0 .27-.465v-4.35l1.245.72c.105.06.15.15.15.27v3.3c0 1.605-1.245 2.82-2.91 2.82m-3.555-3.345-2.865-1.65c-.825-.48-1.38-1.5-1.38-2.49 0-1.155.69-2.19 1.755-2.625v3.42c0 .21.09.36.27.465l3.75 2.175-1.23.705a.27.27 0 0 1-.3 0m-.165 2.46c-1.695 0-2.94-1.275-2.94-2.85 0-.12.015-.24.03-.36l2.955 1.71q.27.158.54 0l3.765-2.175v1.425c0 .12-.045.21-.15.27l-2.865 1.65c-.39.225-.855.33-1.335.33m3.72 1.785a3.75 3.75 0 0 0 3.675-3c1.68-.435 2.76-2.01 2.76-3.615 0-1.05-.45-2.07-1.26-2.805.075-.315.12-.63.12-.945 0-2.145-1.74-3.75-3.75-3.75-.405 0-.795.06-1.185.195A3.76 3.76 0 0 0 6.868.494a3.75 3.75 0 0 0-3.675 3c-1.68.435-2.76 2.01-2.76 3.615 0 1.05.45 2.07 1.26 2.805a4 4 0 0 0-.12.945c0 2.145 1.74 3.75 3.75 3.75.405 0 .795-.06 1.185-.195a3.76 3.76 0 0 0 2.625 1.08" />
    </g>
  </svg>
)

const ClaudeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path fill="#D97757" d="M3.432 10.466 6.39 8.81l.05-.144-.05-.08h-.144l-.495-.03-1.69-.045-1.467-.061-1.42-.076-.358-.076-.335-.44.035-.22.3-.201.43.038.952.064 1.428.099 1.036.06 1.534.16h.244l.034-.099-.084-.06-.065-.061-1.477-.998L3.25 5.586l-.837-.607-.453-.308-.229-.288-.099-.63.411-.451.552.038.141.038.56.428 1.195.922 1.561 1.146.229.19L6.37 6l.012-.046-.103-.17-.85-1.53-.905-1.556-.404-.645-.107-.387a1.9 1.9 0 0 1-.064-.455l.468-.634.259-.083.624.083.263.228.388.884.629 1.393.974 1.893.286.562.152.52.057.159h.1v-.091l.08-1.066.148-1.31.144-1.684.05-.475.236-.569.468-.307.366.174.3.43-.041.276-.18 1.157-.35 1.814-.228 1.215h.133l.152-.152.617-.816 1.036-1.29.457-.513.533-.565.342-.27h.648l.476.706-.214.729-.666.842-.552.714-.792 1.062-.495.85.046.069.118-.012 1.79-.38.966-.174 1.154-.197.522.243.057.246-.206.505-1.234.304-1.446.288-2.155.508-.027.02.03.037.971.091.415.023h1.017l1.892.14.495.327.297.398-.05.304-.76.387-1.029-.243-2.398-.569-.823-.205h-.114v.068l.685.668 1.257 1.131 1.572 1.457.08.36-.202.285-.213-.03-1.382-1.036-.533-.467-1.207-1.013h-.08v.106l.278.406 1.47 2.201.076.676-.107.22-.38.133-.42-.076-.86-1.203-.887-1.355-.716-1.214-.087.05-.423 4.534-.198.231-.457.175-.38-.289-.202-.466.202-.923.243-1.202.198-.957.18-1.187.106-.395-.008-.027-.087.012-.899 1.23-1.367 1.84-1.081 1.153-.259.103-.45-.232.043-.413.251-.368 1.496-1.898.903-1.176.582-.68-.004-.098h-.034L3.07 12.094l-.708.09-.304-.284.038-.467.144-.151 1.196-.82z" />
  </svg>
)

const CursorIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path fill="currentColor" d="M14.473 3.953 8.318.399a.64.64 0 0 0-.64 0L1.524 3.953a.54.54 0 0 0-.27.465v7.166a.54.54 0 0 0 .27.465l6.155 3.555a.64.64 0 0 0 .64 0l6.155-3.554a.54.54 0 0 0 .27-.465V4.417a.54.54 0 0 0-.27-.465m-.386.752L8.145 14.998c-.04.069-.147.04-.147-.04v-6.74a.38.38 0 0 0-.189-.326L1.974 4.524c-.07-.041-.042-.147.039-.147h11.884a.22.22 0 0 1 .19.328" />
  </svg>
)

const ExternalLinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto shrink-0 text-muted-foreground">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

/* ── AI tools config ─────────────────────────────────────────────────── */

const AI_TOOLS = [
  {
    name: "ChatGPT",
    icon: <ChatGPTIcon />,
    url: (md: string) => `https://chatgpt.com/?q=${encodeURIComponent(md)}`,
  },
  {
    name: "Claude",
    icon: <ClaudeIcon />,
    url: (md: string) => `https://claude.ai/new?q=${encodeURIComponent(md)}`,
  },
  {
    name: "Cursor",
    icon: <CursorIcon />,
    url: (md: string) => `https://cursor.com/?q=${encodeURIComponent(md.slice(0, 2000))}`,
  },
]

/* ── Component ───────────────────────────────────────────────────────── */

export function PageActions() {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = useAgentsPathname()

  const getSlug = useCallback(() => {
    return pathname.replace(/^\/(?:an|agents)\/docs\/?/, "") || ""
  }, [pathname])

  const fetchMarkdown = useCallback(async () => {
    const slug = getSlug()
    const res = await fetch(`/agents/api/markdown?slug=${encodeURIComponent(slug)}`)
    if (!res.ok) return null
    return res.text()
  }, [getSlug])

  const handleCopy = useCallback(async () => {
    const md = await fetchMarkdown()
    if (!md) return
    await navigator.clipboard.writeText(md)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [fetchMarkdown])

  const handleOpenIn = useCallback(
    async (buildUrl: (md: string) => string) => {
      const md = await fetchMarkdown()
      if (!md) return
      setOpen(false)
      window.open(buildUrl(md), "_blank")
    },
    [fetchMarkdown],
  )

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-1.5 rounded-[10px] border border-input bg-background shadow-sm shadow-black/5 px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-muted-foreground">
          Open
          <ChevronDownIcon className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-[200px] overflow-hidden rounded-[10px] border border-border bg-background py-1 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
        >
          <DropdownMenu.Item
            onSelect={handleCopy}
            className="flex cursor-default select-none items-center gap-1.5 min-h-[32px] py-[5px] px-1.5 mx-1 rounded-md text-sm text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus:bg-accent focus:text-foreground"
          >
            <AnimatedCopyIcon copied={copied} size="h-3.5 w-3.5" />
            {copied ? "Copied!" : "Copy as Markdown"}
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="mx-1.5 my-1 h-px bg-border" />

          {AI_TOOLS.map((tool) => (
            <DropdownMenu.Item
              key={tool.name}
              onSelect={() => handleOpenIn(tool.url)}
              className="flex cursor-default select-none items-center gap-1.5 min-h-[32px] py-[5px] px-1.5 mx-1 rounded-md text-sm text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus:bg-accent focus:text-foreground"
            >
              <span className="shrink-0">{tool.icon}</span>
              Open in {tool.name}
              <ExternalLinkIcon />
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
