"use client"

import { useState, useCallback, useEffect } from "react"
import { Plus, Trash2, Eye, EyeOff } from "lucide-react"
import { api } from "@/trpc/client"
import { toast } from "sonner"
import { Spinner } from "@/components/icons/spinner"
import { CopyText } from "../../threads/_components/copy-button"
import type { AnAgentConfig } from "@/prisma/client"

type EnvEntry = { key: string; value: string }

function parseEnvVars(raw: unknown): EnvEntry[] {
  if (!raw || typeof raw !== "object") return []
  return Object.entries(raw as Record<string, string>).map(([key, value]) => ({
    key,
    value: String(value),
  }))
}

function entriesToRecord(entries: EnvEntry[]): Record<string, string> | null {
  if (entries.length === 0) return null
  const record: Record<string, string> = {}
  for (const e of entries) {
    if (e.key.trim()) record[e.key.trim()] = e.value
  }
  return Object.keys(record).length > 0 ? record : null
}

export function EnvVarsSection({
  agentConfig,
}: {
  agentConfig: Pick<AnAgentConfig, "id" | "env_vars">
}) {
  const [entries, setEntries] = useState<EnvEntry[]>(() =>
    parseEnvVars(agentConfig.env_vars),
  )
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set())
  const [showAddForm, setShowAddForm] = useState(false)
  const [newKey, setNewKey] = useState("")
  const [newValue, setNewValue] = useState("")

  useEffect(() => {
    setEntries(parseEnvVars(agentConfig.env_vars))
  }, [agentConfig.env_vars])

  const utils = api.useUtils()

  const updateMutation = api.agentConfigs.updateEnvVars.useMutation({
    onSuccess: () => {
      utils.agentConfigs.getConfig.invalidate({ id: agentConfig.id })
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const handleAdd = useCallback(() => {
    const trimmedKey = newKey.trim()
    if (!trimmedKey || !newValue) return
    if (entries.some((e) => e.key === trimmedKey)) {
      toast.error(`Key "${trimmedKey}" already exists`)
      return
    }
    const next = [...entries, { key: trimmedKey, value: newValue }]
    setEntries(next)
    setNewKey("")
    setNewValue("")
    setShowAddForm(false)
    updateMutation.mutate({
      id: agentConfig.id,
      envVars: entriesToRecord(next),
    })
  }, [newKey, newValue, entries, agentConfig.id, updateMutation])

  const handleDelete = useCallback(
    (key: string) => {
      const next = entries.filter((e) => e.key !== key)
      setEntries(next)
      setRevealedKeys((prev) => {
        const s = new Set(prev)
        s.delete(key)
        return s
      })
      updateMutation.mutate({
        id: agentConfig.id,
        envVars: entriesToRecord(next),
      })
    },
    [entries, agentConfig.id, updateMutation],
  )

  const toggleReveal = useCallback((key: string) => {
    setRevealedKeys((prev) => {
      const s = new Set(prev)
      if (s.has(key)) s.delete(key)
      else s.add(key)
      return s
    })
  }, [])

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between pb-1">
        <p className="text-[10px] font-medium text-foreground/40">
          Environment Variables
        </p>
        <button
          onClick={() => setShowAddForm(true)}
          disabled={showAddForm}
          className="flex h-5 items-center gap-1 rounded-md px-1.5 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all active:scale-95 disabled:opacity-40"
        >
          <Plus className="h-3 w-3" />
          Add
        </button>
      </div>

      <div className="rounded-lg border-[0.5px] border-border bg-card overflow-hidden">
        {/* Add form */}
        {showAddForm && (
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border/50">
            <input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ""))}
              placeholder="KEY_NAME"
              className="an-focus-input h-7 w-[120px] shrink-0 rounded-md border border-border bg-foreground/[0.05] px-2 text-[12px] font-mono text-foreground placeholder:text-foreground/40"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd()
                if (e.key === "Escape") {
                  setShowAddForm(false)
                  setNewKey("")
                  setNewValue("")
                }
              }}
            />
            <input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="value"
              className="an-focus-input h-7 flex-1 min-w-0 rounded-md border border-border bg-foreground/[0.05] px-2 text-[12px] font-mono text-foreground placeholder:text-foreground/40"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd()
                if (e.key === "Escape") {
                  setShowAddForm(false)
                  setNewKey("")
                  setNewValue("")
                }
              }}
            />
            <button
              onClick={handleAdd}
              disabled={!newKey.trim() || !newValue}
              className="h-7 px-3 rounded-md bg-foreground text-background text-[11px] font-medium hover:bg-foreground/90 transition-colors active:scale-[0.97] disabled:opacity-40"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowAddForm(false)
                setNewKey("")
                setNewValue("")
              }}
              className="h-7 px-2 rounded-md text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Entries */}
        {entries.length === 0 && !showAddForm ? (
          <div className="py-6 text-center">
            <p className="text-[11px] text-muted-foreground/40">
              No environment variables configured.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {entries.map((entry) => {
              const isRevealed = revealedKeys.has(entry.key)
              return (
                <div
                  key={entry.key}
                  className="flex items-center gap-3 px-3 py-2"
                >
                  <div className="shrink-0">
                    <CopyText value={entry.key}>
                      <span className="block text-[12px] font-mono font-medium text-foreground">
                        {entry.key}
                      </span>
                    </CopyText>
                  </div>
                  <div className="flex-1 min-w-0">
                    <CopyText value={entry.value}>
                      <span className="block text-[12px] font-mono text-foreground/40 truncate">
                        {isRevealed ? entry.value : "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"}
                      </span>
                    </CopyText>
                  </div>
                  <button
                    onClick={() => toggleReveal(entry.key)}
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all"
                    aria-label={isRevealed ? "Hide value" : "Reveal value"}
                  >
                    {isRevealed ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(entry.key)}
                    disabled={updateMutation.isPending}
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all disabled:opacity-40"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Saving indicator */}
        {updateMutation.isPending && (
          <div className="flex items-center justify-center gap-2 py-2 border-t border-border/50">
            <Spinner size={12} color="currentColor" />
            <span className="text-[11px] text-muted-foreground">Saving...</span>
          </div>
        )}
      </div>
    </div>
  )
}
