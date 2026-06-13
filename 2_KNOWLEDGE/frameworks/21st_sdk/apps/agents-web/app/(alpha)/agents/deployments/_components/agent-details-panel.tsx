"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

type AgentMetadata = {
  model?: string
  systemPrompt?: string | { type: string; preset: string; append?: string }
  permissionMode?: string
  maxTurns?: number
  maxBudgetUsd?: number
  maxSandboxBudgetUsd?: number
  tools?: { name: string; description: string }[]
  hooks?: string[]
  sandbox?: {
    cpuCount?: number
    memoryMB?: number
    apt?: string[]
    setup?: string[]
    cwd?: string
    timeoutMs?: number
    networkAllowOut?: string[]
    networkDenyOut?: string[]
  }
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 1_500)
      }}
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors active:scale-95"
      aria-label="Copy"
    >
      {copied ? (
        <Check className="h-3 w-3" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </button>
  )
}

function getSystemPromptText(
  sp: string | { type: string; preset: string; append?: string },
): string {
  if (typeof sp === "string") return sp
  let text = `[preset: ${sp.preset}]`
  if (sp.append) text += `\n${sp.append}`
  return text
}

type SectionId = "config" | "prompt" | "tools" | "hooks" | "sandbox"

const ALL_SECTIONS: SectionId[] = ["config", "prompt", "tools", "hooks", "sandbox"]

export function AgentDetailsPanel({
  metadata,
  sections = ALL_SECTIONS,
  title = "Agent Configuration",
  hideTitle = false,
}: {
  metadata: AgentMetadata | null | undefined
  sections?: SectionId[]
  title?: string
  hideTitle?: boolean
}) {
  const [promptExpanded, setPromptExpanded] = useState(false)
  const show = (s: SectionId) => sections.includes(s)

  if (!metadata) {
    return (
      <div className="space-y-3">
        {!hideTitle && (
          <p className="text-[10px] font-medium text-foreground/40">
            {title}
          </p>
        )}
        <div className="rounded-lg border-[0.5px] border-border bg-card overflow-hidden">
          <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
            <p className="text-[12px] text-muted-foreground">
              Redeploy with the latest CLI to see agent details.
            </p>
            <code className="text-[11px] font-mono text-muted-foreground/60">
              npm i -g @21st-sdk/cli && an deploy
            </code>
          </div>
        </div>
      </div>
    )
  }

  const promptText = metadata.systemPrompt
    ? getSystemPromptText(metadata.systemPrompt)
    : null
  const isLongPrompt = promptText ? promptText.length > 200 : false

  return (
    <div className="space-y-1">
      {!hideTitle && (
        <p className="text-[10px] font-medium text-foreground/40 pb-1">
          {title}
        </p>
      )}

      {/* General */}
      {show("config") && (
        <div className="rounded-lg border-[0.5px] border-border bg-card overflow-hidden">
          <div className="divide-y divide-border/50">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-[11px] text-muted-foreground">Model</span>
              <span className="text-[12px] font-mono text-foreground">
                {metadata.model ?? "—"}
              </span>
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-[11px] text-muted-foreground">
                Permission
              </span>
              <span className="text-[12px] text-foreground">
                {metadata.permissionMode ?? "default"}
              </span>
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-[11px] text-muted-foreground">
                Max Turns
              </span>
              <span className="text-[12px] tabular-nums text-foreground">
                {metadata.maxTurns ?? 50}
              </span>
            </div>
            {metadata.maxBudgetUsd !== undefined && (
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-[11px] text-muted-foreground">
                  Max Budget
                </span>
                <span className="text-[12px] tabular-nums text-foreground">
                  ${metadata.maxBudgetUsd}
                </span>
              </div>
            )}
            {metadata.maxSandboxBudgetUsd !== undefined && (
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-[11px] text-muted-foreground">
                  Max Sandbox Budget
                </span>
                <span className="text-[12px] tabular-nums text-foreground">
                  ${metadata.maxSandboxBudgetUsd}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* System Prompt */}
      {show("prompt") && promptText && (
        <div className="pt-2">
          <p className="text-[10px] font-medium text-foreground/40 pb-1">
            System Prompt
          </p>
          <div className="rounded-lg border-[0.5px] border-border bg-card overflow-hidden">
            <div className="relative">
              <pre
                className={`whitespace-pre-wrap break-words text-[11px] leading-relaxed text-foreground/70 font-mono p-3 ${
                  !promptExpanded && isLongPrompt
                    ? "max-h-[100px] overflow-hidden"
                    : ""
                }`}
              >
                {promptText}
              </pre>
              {isLongPrompt && !promptExpanded && (
                <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-card to-transparent" />
              )}
            </div>
            <div className="flex items-center border-t border-border/50 px-3 py-1.5">
              {isLongPrompt && (
                <button
                  onClick={() => setPromptExpanded(!promptExpanded)}
                  className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {promptExpanded ? "Show less" : "Show more"}
                </button>
              )}
              <div className="ml-auto">
                <CopyButton value={promptText} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tools */}
      {show("tools") && (
        <div className="pt-2">
          <p className="text-[10px] font-medium text-foreground/40 pb-1">
            Tools{" "}
            <span className="text-foreground/25">{metadata.tools?.length ?? 0}</span>
          </p>
          {!metadata.tools?.length ? (
            <div className="rounded-lg border-[0.5px] border-border bg-card overflow-hidden">
              <p className="text-[11px] text-muted-foreground/40 px-3 py-3">
                No custom tools defined.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border-[0.5px] border-border bg-card overflow-hidden divide-y divide-border/50">
              {metadata.tools.map((tool) => (
                <div key={tool.name} className="px-3 py-2">
                  <p className="text-[12px] font-mono text-foreground">
                    {tool.name}
                  </p>
                  {tool.description && (
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      {tool.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hooks */}
      {show("hooks") && metadata.hooks && metadata.hooks.length > 0 && (
        <div className="pt-2">
          <p className="text-[10px] font-medium text-foreground/40 pb-1">
            Hooks{" "}
            <span className="text-foreground/25">{metadata.hooks.length}</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {metadata.hooks.map((hook) => (
              <span
                key={hook}
                className="inline-flex items-center rounded-md bg-foreground/[0.05] px-2 py-0.5 text-[11px] font-mono text-foreground/70"
              >
                {hook}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sandbox */}
      {show("sandbox") && metadata.sandbox && (
        <div className="pt-2">
          <p className="text-[10px] font-medium text-foreground/40 pb-1">
            Sandbox
          </p>
          <div className="rounded-lg border-[0.5px] border-border bg-card overflow-hidden divide-y divide-border/50">
            {metadata.sandbox.cpuCount !== undefined && (
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-[11px] text-muted-foreground">
                  CPU
                </span>
                <span className="text-[12px] tabular-nums text-foreground">
                  {metadata.sandbox.cpuCount}
                </span>
              </div>
            )}
            {metadata.sandbox.memoryMB !== undefined && (
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-[11px] text-muted-foreground">
                  Memory
                </span>
                <span className="text-[12px] tabular-nums text-foreground">
                  {metadata.sandbox.memoryMB} MB
                </span>
              </div>
            )}
            {metadata.sandbox.cwd && (
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-[11px] text-muted-foreground">
                  Working Dir
                </span>
                <span className="text-[12px] font-mono text-foreground">
                  {metadata.sandbox.cwd}
                </span>
              </div>
            )}
            {metadata.sandbox.timeoutMs !== undefined && (
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-[11px] text-muted-foreground">
                  Sandbox TTL
                </span>
                <span className="text-[12px] tabular-nums text-foreground">
                  {metadata.sandbox.timeoutMs} ms
                </span>
              </div>
            )}
            {metadata.sandbox.apt && metadata.sandbox.apt.length > 0 && (
              <div className="px-3 py-2">
                <span className="text-[11px] text-muted-foreground">
                  Packages
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {metadata.sandbox.apt.map((pkg) => (
                    <span
                      key={pkg}
                      className="inline-flex items-center rounded-md bg-foreground/[0.05] px-2 py-0.5 text-[11px] font-mono text-foreground/70"
                    >
                      {pkg}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {metadata.sandbox.setup && metadata.sandbox.setup.length > 0 && (
              <div className="px-3 py-2">
                <span className="text-[11px] text-muted-foreground">
                  Setup
                </span>
                <div className="mt-1 space-y-0.5">
                  {metadata.sandbox.setup.map((cmd, i) => (
                    <p
                      key={i}
                      className="text-[11px] font-mono text-foreground/70"
                    >
                      $ {cmd}
                    </p>
                  ))}
                </div>
              </div>
            )}
            {metadata.sandbox.networkAllowOut &&
              metadata.sandbox.networkAllowOut.length > 0 && (
                <div className="px-3 py-2">
                  <span className="text-[11px] text-muted-foreground">
                    Network Allow Out
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {metadata.sandbox.networkAllowOut.map((host) => (
                      <span
                        key={host}
                        className="inline-flex items-center rounded-md bg-foreground/[0.05] px-2 py-0.5 text-[11px] font-mono text-foreground/70"
                      >
                        {host}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            {metadata.sandbox.networkDenyOut &&
              metadata.sandbox.networkDenyOut.length > 0 && (
                <div className="px-3 py-2">
                  <span className="text-[11px] text-muted-foreground">
                    Network Deny Out
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {metadata.sandbox.networkDenyOut.map((host) => (
                      <span
                        key={host}
                        className="inline-flex items-center rounded-md bg-foreground/[0.05] px-2 py-0.5 text-[11px] font-mono text-foreground/70"
                      >
                        {host}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  )
}
