"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy, Rss } from "lucide-react"

export function WhatsNewPageActions({ rssHref }: { rssHref: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={handleCopy}
        className="h-8 rounded-md border-border/60 px-3 text-[13px] shadow-none"
      >
        {copied ? (
          <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
        ) : (
          <Copy className="mr-1.5 h-3.5 w-3.5" />
        )}
        {copied ? "Copied" : "Copy page"}
      </Button>

      <Button
        asChild
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-md border-border/60 shadow-none"
      >
        <a href={rssHref} aria-label="Open RSS feed">
          <Rss className="h-3.5 w-3.5" />
        </a>
      </Button>
    </div>
  )
}
