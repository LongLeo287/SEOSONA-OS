"use client"

import { useState, useCallback, useEffect, useRef, useMemo } from "react"
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Upload,
  Download,
  Pencil,
  Copy,
  Check,
  KeyRound,
  X,
  ChevronsUpDown,
} from "lucide-react"
import { api } from "@/trpc/client"
import { useAtomValue } from "jotai"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { anSelectedAgentAtom } from "@/lib/atoms/an-agent"
import { motion, AnimatePresence } from "motion/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { EnvVarsSkeleton } from "./env-vars-skeleton"
import { Spinner } from "@/components/icons/spinner"
import { AgentAvatar } from "@/components/features/agents/an/dashboard/agent-avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/features/agents/ui/canvas/[id]/{components}/ui/dropdown-menu"

// ── Helpers ──

type EnvEntry = { key: string; value: string; agentId: string; agentName: string }

function parseEnvVars(raw: unknown, agentId: string, agentName: string): EnvEntry[] {
  if (!raw || typeof raw !== "object") return []
  return Object.entries(raw as Record<string, string>).map(([key, value]) => ({
    key,
    value: String(value),
    agentId,
    agentName,
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

function parseEnvFileContent(content: string): { key: string; value: string }[] {
  return content
    .split("\n")
    .filter((line) => line.trim() && !line.trim().startsWith("#"))
    .map((line) => {
      const eqIdx = line.indexOf("=")
      if (eqIdx === -1) return null
      const key = line.substring(0, eqIdx).trim()
      let value = line.substring(eqIdx + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      return key ? { key, value } : null
    })
    .filter(Boolean) as { key: string; value: string }[]
}

function maskValue(value: string): string {
  return "\u2022".repeat(Math.min(value.length, 16))
}

// ── Tiny copy button ──

function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={async (e) => {
        e.stopPropagation()
        await navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
      aria-label="Copy"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </button>
  )
}

// ── Main page ──

export function EnvVarsPageClient() {
  const teamId = useAtomValue(selectedTeamIdAtom)
  const selectedAgent = useAtomValue(anSelectedAgentAtom)

  const isAllAgents = !selectedAgent

  const { data: agentConfig, isLoading: isLoadingSingle } = api.agentConfigs.getConfig.useQuery(
    { id: selectedAgent?.id! },
    { enabled: !!selectedAgent?.id },
  )

  const { data: allConfigs = [], isLoading: isLoadingAll } = api.agentConfigs.listConfigs.useQuery(
    { teamId: teamId! },
    { enabled: isAllAgents && !!teamId },
  )

  const isLoading = isAllAgents ? isLoadingAll : isLoadingSingle

  const agents = useMemo(() => {
    if (!isAllAgents && agentConfig) return [{ id: agentConfig.id, name: agentConfig.name }]
    return allConfigs.map((a) => ({ id: a.id, name: a.name }))
  }, [isAllAgents, allConfigs, agentConfig])

  // State
  const [entries, setEntries] = useState<EnvEntry[]>([])
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newKey, setNewKey] = useState("")
  const [newValue, setNewValue] = useState("")
  const [newAgentId, setNewAgentId] = useState<string>("")
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null)
  const [editKey, setEditKey] = useState("")
  const [editValue, setEditValue] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isAllAgents) {
      const all: EnvEntry[] = []
      for (const config of allConfigs) {
        all.push(...parseEnvVars(config.env_vars, config.id, config.name))
      }
      setEntries(all)
    } else if (agentConfig) {
      setEntries(parseEnvVars(agentConfig.env_vars, agentConfig.id, agentConfig.name))
    } else {
      setEntries([])
    }
  }, [isAllAgents, allConfigs, agentConfig])

  useEffect(() => {
    if (isAllAgents && agents.length > 0 && !newAgentId) {
      setNewAgentId(agents[0]!.id)
    }
  }, [isAllAgents, agents, newAgentId])

  const utils = api.useUtils()
  const updateMutation = api.agentConfigs.updateEnvVars.useMutation({
    onError: (err) => {
      toast.error(err.message)
      // Re-sync from server to restore correct state
      if (isAllAgents) {
        utils.agentConfigs.listConfigs.invalidate({ teamId: teamId! })
      } else if (agentConfig) {
        utils.agentConfigs.getConfig.invalidate({ id: agentConfig.id })
      }
    },
  })

  const saveForAgent = useCallback(
    (agentId: string, allEntries: EnvEntry[], successMessage?: string) => {
      const agentEntries = allEntries.filter((e) => e.agentId === agentId)
      updateMutation.mutate(
        { id: agentId, envVars: entriesToRecord(agentEntries) },
        {
          onSuccess: () => {
            if (successMessage) toast.success(successMessage)
          },
        },
      )
    },
    [updateMutation],
  )

  // ── Actions ──

  const handleAdd = useCallback(() => {
    const trimmed = newKey.trim()
    if (!trimmed || !newValue) return
    const targetAgentId = isAllAgents ? newAgentId : agentConfig?.id
    if (!targetAgentId) return
    if (entries.some((e) => e.key === trimmed && e.agentId === targetAgentId)) {
      const agentName = agents.find((a) => a.id === targetAgentId)?.name ?? ""
      toast.error(`"${trimmed}" already exists${isAllAgents ? ` in ${agentName}` : ""}`)
      return
    }
    const targetAgent = agents.find((a) => a.id === targetAgentId)
    const next = [...entries, { key: trimmed, value: newValue, agentId: targetAgentId, agentName: targetAgent?.name ?? "" }]
    setEntries(next)
    setNewKey("")
    setNewValue("")
    setShowAddForm(false)
    saveForAgent(targetAgentId, next, `${trimmed} is set.`)
  }, [newKey, newValue, entries, isAllAgents, newAgentId, agentConfig, agents, saveForAgent])

  const handleDelete = useCallback(
    (key: string, agentId: string) => {
      const next = entries.filter((e) => !(e.key === key && e.agentId === agentId))
      setEntries(next)
      setRevealedKeys((s) => {
        const ns = new Set(s)
        ns.delete(`${agentId}:${key}`)
        return ns
      })
      if (editingKey === key && editingAgentId === agentId) {
        setEditingKey(null)
        setEditingAgentId(null)
      }
      saveForAgent(agentId, next, `${key} was removed.`)
    },
    [entries, editingKey, editingAgentId, saveForAgent],
  )

  const handleStartEdit = useCallback(
    (key: string, agentId: string) => {
      const entry = entries.find((e) => e.key === key && e.agentId === agentId)
      if (!entry) return
      setEditingKey(key)
      setEditingAgentId(agentId)
      setEditKey(entry.key)
      setEditValue(entry.value)
    },
    [entries],
  )

  const handleSaveEdit = useCallback(() => {
    if (!editingKey || !editingAgentId) return
    const trimmedKey = editKey.trim()
    if (!trimmedKey) {
      toast.error("Key cannot be empty")
      return
    }
    if (trimmedKey !== editingKey && entries.some((e) => e.key === trimmedKey && e.agentId === editingAgentId)) {
      toast.error(`"${trimmedKey}" already exists`)
      return
    }
    const next = entries.map((e) =>
      e.key === editingKey && e.agentId === editingAgentId ? { ...e, key: trimmedKey, value: editValue } : e,
    )
    setEntries(next)
    setEditingKey(null)
    setEditingAgentId(null)
    saveForAgent(editingAgentId, next, `${trimmedKey} is set.`)
  }, [editingKey, editingAgentId, editKey, editValue, entries, saveForAgent])

  const handleCancelEdit = useCallback(() => {
    setEditingKey(null)
    setEditingAgentId(null)
    setEditKey("")
    setEditValue("")
  }, [])

  const handleImport = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      if (file.size > 1024 * 1024) {
        toast.error("File too large (max 1MB)")
        return
      }
      const reader = new FileReader()
      const targetAgentId = isAllAgents ? newAgentId : agentConfig?.id
      if (!targetAgentId) {
        toast.error("Select an agent first")
        return
      }
      const targetAgent = agents.find((a) => a.id === targetAgentId)
      reader.onload = (ev) => {
        const parsed = parseEnvFileContent(ev.target?.result as string)
        if (parsed.length === 0) {
          toast.error("No valid variables found in file")
          return
        }
        const agentEntries = entries.filter((en) => en.agentId === targetAgentId)
        const otherEntries = entries.filter((en) => en.agentId !== targetAgentId)
        const map = new Map(agentEntries.map((en) => [en.key, en.value]))
        for (const p of parsed) map.set(p.key, p.value)
        const merged = Array.from(map.entries()).map(([key, value]) => ({
          key,
          value,
          agentId: targetAgentId,
          agentName: targetAgent?.name ?? "",
        }))
        const next = [...otherEntries, ...merged]
        setEntries(next)
        saveForAgent(
          targetAgentId,
          next,
          `Imported ${parsed.length} variable${parsed.length > 1 ? "s" : ""}.`,
        )
      }
      reader.onerror = () => toast.error("Failed to read file")
      reader.readAsText(file)
      if (fileInputRef.current) fileInputRef.current.value = ""
    },
    [entries, isAllAgents, newAgentId, agentConfig, agents, saveForAgent],
  )

  const handleExport = useCallback(() => {
    if (entries.length === 0) return
    const formatVal = (v: string) =>
      v.includes(" ") || v.includes("=") ? `"${v.replace(/"/g, '\\"')}"` : v
    let content: string
    if (isAllAgents) {
      const grouped = new Map<string, EnvEntry[]>()
      for (const e of entries) {
        if (!grouped.has(e.agentId)) grouped.set(e.agentId, [])
        grouped.get(e.agentId)!.push(e)
      }
      const parts: string[] = []
      for (const [, agentEntries] of grouped) {
        parts.push(`# Agent: ${agentEntries[0]!.agentName}`)
        for (const e of agentEntries) parts.push(`${e.key}=${formatVal(e.value)}`)
        parts.push("")
      }
      content = parts.join("\n")
    } else {
      content = entries.map((e) => `${e.key}=${formatVal(e.value)}`).join("\n")
    }
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = ".env"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Exported as .env")
  }, [entries, isAllAgents])

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      const text = e.clipboardData.getData("text")
      if (!text.includes("=") || !text.includes("\n")) return
      e.preventDefault()
      const targetAgentId = isAllAgents ? newAgentId : agentConfig?.id
      if (!targetAgentId) return
      const targetAgent = agents.find((a) => a.id === targetAgentId)
      const parsed = parseEnvFileContent(text)
      if (parsed.length > 0) {
        const agentEntries = entries.filter((en) => en.agentId === targetAgentId)
        const otherEntries = entries.filter((en) => en.agentId !== targetAgentId)
        const map = new Map(agentEntries.map((en) => [en.key, en.value]))
        for (const p of parsed) map.set(p.key, p.value)
        const merged = Array.from(map.entries()).map(([key, value]) => ({
          key, value, agentId: targetAgentId, agentName: targetAgent?.name ?? "",
        }))
        const next = [...otherEntries, ...merged]
        setEntries(next)
        setShowAddForm(false)
        setNewKey("")
        setNewValue("")
        saveForAgent(
          targetAgentId,
          next,
          `Pasted ${parsed.length} variable${parsed.length > 1 ? "s" : ""}.`,
        )
      }
    },
    [entries, isAllAgents, newAgentId, agentConfig, agents, saveForAgent],
  )

  const toggleReveal = useCallback((key: string, agentId: string) => {
    const id = `${agentId}:${key}`
    setRevealedKeys((s) => {
      const ns = new Set(s)
      ns.has(id) ? ns.delete(id) : ns.add(id)
      return ns
    })
  }, [])

  // ── Filter ──

  const filtered = searchQuery
    ? entries.filter((e) =>
        e.key.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : entries

  // ── Loading / No agent ──

  if (!teamId || isLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-auto bg-tl-background">
        <EnvVarsSkeleton />
      </div>
    )
  }

  // ── Render ──

  return (
    <motion.div
      className="flex flex-1 flex-col overflow-auto bg-tl-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="mx-auto w-full max-w-2xl flex flex-col gap-0 px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[15px] font-semibold tracking-tight text-foreground">
            Environment Variables
          </h1>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            Manage secrets and configuration for your agent. Changes take effect
            on next deploy.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-border bg-background overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center gap-2 px-2.5 py-2.5 border-b border-border">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search variables..."
                className="an-focus-input h-8 w-full rounded-md border border-border bg-foreground/[0.05] pl-8 pr-3 text-[12px] text-foreground/70 placeholder:text-foreground/40 hover:border-foreground/15 transition-colors"
              />
            </div>

            {/* Actions */}
            <button
              onClick={() => {
                setShowAddForm(true)
                setSearchQuery("")
              }}
              className="flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all active:scale-95"
            >
              <Plus className="h-3 w-3" />
              Add
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all active:scale-95"
            >
              <Upload className="h-3 w-3" />
              Import
            </button>

            {entries.length > 0 && (
              <button
                onClick={handleExport}
                className="flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all active:scale-95"
              >
                <Download className="h-3 w-3" />
                Export
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".env,.env.*,text/plain"
              onChange={handleImport}
              className="hidden"
            />
          </div>

          {/* Add form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 px-2.5 py-3 bg-muted/30 border-b border-border">
                  {isAllAgents && agents.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-border bg-foreground/[0.05] px-2 text-[12px] hover:border-foreground/15 transition-colors">
                          {agents.find((a) => a.id === newAgentId) ? (
                            <AgentAvatar name={agents.find((a) => a.id === newAgentId)!.name} size="sm" />
                          ) : (
                            <div className="h-4 w-4 rounded-[4px] bg-foreground/5" />
                          )}
                          <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" sideOffset={4} className="max-h-[188px] overflow-y-auto">
                        {agents.map((agent) => (
                          <DropdownMenuItem key={agent.id} onSelect={() => setNewAgentId(agent.id)}>
                            <AgentAvatar name={agent.name} size="sm" />
                            <span className="flex-1 truncate">{agent.name}</span>
                            {newAgentId === agent.id && <Check className="h-4 w-4 shrink-0 text-muted-foreground" />}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  <input
                    value={newKey}
                    onChange={(e) =>
                      setNewKey(
                        e.target.value
                          .toUpperCase()
                          .replace(/[^A-Z0-9_]/g, ""),
                      )
                    }
                    onPaste={handlePaste}
                    placeholder="KEY_NAME"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAdd()
                      if (e.key === "Escape") {
                        setShowAddForm(false)
                        setNewKey("")
                        setNewValue("")
                      }
                    }}
                    className="an-focus-input h-8 w-[200px] shrink-0 rounded-md border border-border bg-foreground/[0.05] px-2.5 text-[12px] font-mono text-foreground placeholder:text-foreground/40 hover:border-foreground/15 transition-colors"
                  />
                  <input
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    onPaste={handlePaste}
                    placeholder="value"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAdd()
                      if (e.key === "Escape") {
                        setShowAddForm(false)
                        setNewKey("")
                        setNewValue("")
                      }
                    }}
                    className="an-focus-input h-8 flex-1 min-w-0 rounded-md border border-border bg-foreground/[0.05] px-2.5 text-[12px] font-mono text-foreground placeholder:text-foreground/40 hover:border-foreground/15 transition-colors"
                  />
                  <button
                    onClick={handleAdd}
                    disabled={!newKey.trim() || !newValue || (isAllAgents && !newAgentId)}
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
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* List */}
          <div>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <KeyRound className="h-6 w-6 text-muted-foreground/25" />
                <p className="text-[12px] text-muted-foreground">
                  {entries.length === 0
                    ? "No environment variables yet"
                    : "No variables match your search"}
                </p>
                {entries.length === 0 && (
                  <p className="text-[11px] text-muted-foreground/60">
                    Add variables manually or import a .env file
                  </p>
                )}
              </div>
            ) : (
              filtered.map((entry) => {
                const revealId = `${entry.agentId}:${entry.key}`
                const isRevealed = revealedKeys.has(revealId)
                const isEditing = editingKey === entry.key && editingAgentId === entry.agentId

                if (isEditing) {
                  return (
                    <div
                      key={revealId}
                      className="flex items-center gap-2 px-2.5 h-[38px] bg-muted/30 border-b border-border/50"
                    >
                      {isAllAgents && <AgentAvatar name={entry.agentName} size="sm" className="shrink-0" />}
                      <input
                        value={editKey}
                        onChange={(e) =>
                          setEditKey(
                            e.target.value
                              .toUpperCase()
                              .replace(/[^A-Z0-9_]/g, ""),
                          )
                        }
                        className="an-focus-input h-7 w-[200px] shrink-0 rounded-md border border-border bg-foreground/[0.05] px-2 text-[12px] font-mono text-foreground hover:border-foreground/15 transition-colors"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit()
                          if (e.key === "Escape") handleCancelEdit()
                        }}
                      />
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="an-focus-input h-7 flex-1 min-w-0 rounded-md border border-border bg-foreground/[0.05] px-2 text-[12px] font-mono text-foreground hover:border-foreground/15 transition-colors"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit()
                          if (e.key === "Escape") handleCancelEdit()
                        }}
                      />
                      <button
                        onClick={handleSaveEdit}
                        disabled={!editKey.trim()}
                        className="h-6 px-2.5 rounded bg-foreground text-background text-[11px] font-medium hover:bg-foreground/90 transition-colors active:scale-[0.97] disabled:opacity-40"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )
                }

                return (
                  <div
                    key={revealId}
                    className={cn(
                      "group flex items-center gap-3 px-2.5 border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors",
                      isAllAgents ? "h-[48px]" : "h-[38px]",
                    )}
                  >
                    {isAllAgents && <AgentAvatar name={entry.agentName} size="sm" className="shrink-0" />}
                    {/* Key */}
                    <div className="shrink-0 w-[200px] flex flex-col justify-center">
                      <span className="text-[12px] font-mono font-medium text-foreground truncate">
                        {entry.key}
                      </span>
                      {isAllAgents && (
                        <span className="text-[10px] text-muted-foreground/60 truncate">{entry.agentName}</span>
                      )}
                    </div>

                    {/* Value */}
                    <span className="flex-1 min-w-0 text-[12px] font-mono text-foreground/50 truncate">
                      {isRevealed ? entry.value : maskValue(entry.value)}
                    </span>

                    {/* Actions - show on hover */}
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toggleReveal(entry.key, entry.agentId)}
                        className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                        aria-label={isRevealed ? "Hide" : "Reveal"}
                      >
                        {isRevealed ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </button>

                      <CopyBtn value={entry.value} />

                      <button
                        onClick={() => handleStartEdit(entry.key, entry.agentId)}
                        className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                        aria-label="Edit"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>

                      <button
                        onClick={() => handleDelete(entry.key, entry.agentId)}
                        disabled={updateMutation.isPending}
                        className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all disabled:opacity-40"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer */}
          {entries.length > 0 && (
            <div className="px-2.5 py-2 border-t border-border">
              <span className="text-[10px] text-muted-foreground/60">
                {entries.length} variable{entries.length !== 1 ? "s" : ""}
                {isAllAgents && ` across ${new Set(entries.map((e) => e.agentId)).size} agent${new Set(entries.map((e) => e.agentId)).size !== 1 ? "s" : ""}`}
              </span>
            </div>
          )}
        </div>

        {/* Saving overlay */}
        {updateMutation.isPending && (
          <div className="flex items-center justify-center gap-2 py-2">
            <Spinner size={12} color="currentColor" />
            <span className="text-[11px] text-muted-foreground">Saving...</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
