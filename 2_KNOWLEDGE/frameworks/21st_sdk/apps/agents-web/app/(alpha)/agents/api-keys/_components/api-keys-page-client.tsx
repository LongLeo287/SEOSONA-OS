"use client"

import { useState, useCallback, useEffect } from "react"
import { KeyRound, MoreHorizontal, Search, Copy } from "lucide-react"
import { api } from "@/trpc/client"
import { useAtomValue, useSetAtom } from "jotai"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { anApiKeysCreateAtom } from "@/lib/atoms/an-agent"
import { motion, AnimatePresence } from "motion/react"
import { toast } from "sonner"
import { createPortal } from "react-dom"
import { ApiKeysSkeleton } from "./api-keys-skeleton"
import { Spinner } from "@/components/icons/spinner"
import { CopyText } from "../../threads/_components/copy-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/features/agents/ui/canvas/[id]/{components}/ui/dropdown-menu"

// ── Types ──

interface AnApiKey {
  id: string
  key_prefix: string | null
  name: string
  is_active: boolean
  created_at: string
  last_used_at: string | null
}

// ── Helpers ──

function displayKeyPrefix(prefix: string | null): string {
  return prefix ? `${prefix}...` : "Legacy key"
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const seconds = Math.floor((now - date) / 1000)

  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

// ── Main page ──

export function ApiKeysPageClient() {
  const teamId = useAtomValue(selectedTeamIdAtom)
  const setApiKeysCreate = useSetAtom(anApiKeysCreateAtom)

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [dialogStep, setDialogStep] = useState<"name" | "created">("name")
  const [newKeyName, setNewKeyName] = useState("")
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [deletingKey, setDeletingKey] = useState<AnApiKey | null>(null)

  const utils = api.useUtils()

  const { data: rawKeys, isLoading } = api.anApiKeys.list.useQuery(
    { teamId: teamId! },
    { enabled: !!teamId, staleTime: 30_000 },
  )
  const keys = rawKeys as AnApiKey[] | undefined

  const createMutation = api.anApiKeys.create.useMutation({
    onSuccess: async (data) => {
      if (!data.key) {
        toast.error("API key was created but the plaintext key was not returned")
        return
      }
      setNewlyCreatedKey(data.key)
      setDialogStep("created")
      utils.anApiKeys.list.invalidate()
      await navigator.clipboard.writeText(data.key)
      toast.success("API key copied to clipboard")
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const revokeMutation = api.anApiKeys.revoke.useMutation({
    onSuccess: () => {
      toast.success("API key revoked")
      utils.anApiKeys.list.invalidate()
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const rotateMutation = api.anApiKeys.rotate.useMutation({
    onSuccess: async (data) => {
      if (!data.key) {
        toast.error("API key was rotated but the plaintext key was not returned")
        return
      }
      setNewlyCreatedKey(data.key)
      setDialogStep("created")
      setShowCreateDialog(true)
      utils.anApiKeys.list.invalidate()
      await navigator.clipboard.writeText(data.key)
      toast.success("New API key copied to clipboard")
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const openCreateDialog = useCallback(() => {
    setNewKeyName("")
    setNewlyCreatedKey(null)
    setDialogStep("name")
    setShowCreateDialog(true)
  }, [])

  const closeCreateDialog = useCallback(() => {
    if (createMutation.isPending) return
    setShowCreateDialog(false)
    setNewKeyName("")
    setNewlyCreatedKey(null)
    setDialogStep("name")
  }, [createMutation.isPending])

  const handleCreate = useCallback(() => {
    if (!teamId) return
    createMutation.mutate({
      teamId,
      name: newKeyName || "Default",
    })
  }, [teamId, newKeyName, createMutation])

  // Wire up header + button
  useEffect(() => {
    setApiKeysCreate(() => openCreateDialog)
    return () => setApiKeysCreate(null)
  }, [setApiKeysCreate, openCreateDialog])

  const activeKeys = keys?.filter((k) => k.is_active) ?? []
  const revokedKeys = keys?.filter((k) => !k.is_active) ?? []
  const allKeys = [...activeKeys, ...revokedKeys]

  const filtered = searchQuery
    ? allKeys.filter(
        (k) =>
          k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (k.key_prefix ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : allKeys


  // ── Loading ──

  if (!teamId || isLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-auto bg-tl-background">
        <ApiKeysSkeleton />
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
            API Keys
          </h1>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            Create and manage API keys for the Relay API. Keys use the{" "}
            <code className="text-[11px] font-mono">21st_sk_</code> prefix and
            are scoped to your workspace.
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
                placeholder="Search keys..."
                className="an-focus-input h-8 w-full rounded-md border border-border bg-foreground/[0.05] pl-8 pr-3 text-[12px] text-foreground/70 placeholder:text-foreground/40 hover:border-foreground/15 transition-colors"
              />
            </div>

            {/* Add */}
            <button
              onClick={openCreateDialog}
              className="flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all active:scale-95"
            >
              <KeyRound className="h-3 w-3" />
              Add
            </button>
          </div>

          {/* List */}
          <div>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <KeyRound className="h-6 w-6 text-muted-foreground/25" />
                <p className="text-[12px] text-muted-foreground">
                  {allKeys.length === 0
                    ? "No API keys yet"
                    : "No keys match your search"}
                </p>
                {allKeys.length === 0 && (
                  <p className="text-[11px] text-muted-foreground/60">
                    Create an API key to get started
                  </p>
                )}
              </div>
            ) : (
              <>
                {filtered.map((k) => (
                  <div
                    key={k.id}
                    className="group flex items-center gap-3 px-2.5 h-[48px] border-b border-border/50 last:border-b-0"
                  >
                    {/* Icon */}
                    <KeyRound className={`h-3.5 w-3.5 shrink-0 ${k.is_active ? "text-muted-foreground/50" : "text-muted-foreground/25"}`} />

                    {/* Name + last used */}
                    <div className="min-w-0 flex-1">
                      <span className={`text-[12px] truncate block ${k.is_active ? "font-medium text-foreground" : "text-muted-foreground/50 line-through"}`}>
                        {k.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground/60 truncate block">
                        {k.is_active
                          ? k.last_used_at
                            ? `Used ${timeAgo(k.last_used_at)}`
                            : "Never used"
                          : "Revoked"}
                      </span>
                    </div>

                    {k.is_active ? (
                      <>
                        <span className="shrink-0 hidden sm:inline-block font-mono text-[11px] text-muted-foreground/60">
                          {displayKeyPrefix(k.key_prefix)}
                        </span>

                        {/* Created */}
                        <span className="shrink-0 text-[11px] text-muted-foreground/60 hidden sm:block">
                          Created {timeAgo(k.created_at)}
                        </span>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all active:scale-95">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={() =>
                                rotateMutation.mutate({ id: k.id })
                              }
                            >
                              Rotate key
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => setDeletingKey(k)}
                              className="data-[highlighted]:bg-red-500/15 data-[highlighted]:text-red-400 focus:bg-red-500/15 focus:text-red-400"
                            >
                              Delete key
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    ) : (
                      <span className="shrink-0 font-mono text-[11px] text-muted-foreground/30 hidden sm:block">
                        {displayKeyPrefix(k.key_prefix)}
                      </span>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Footer */}
          {allKeys.length > 0 && (
            <div className="px-2.5 py-2 border-t border-border">
              <span className="text-[10px] text-muted-foreground/60">
                {activeKeys.length} active key
                {activeKeys.length !== 1 ? "s" : ""}
                {revokedKeys.length > 0 &&
                  ` · ${revokedKeys.length} revoked`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Delete API Key Confirmation Dialog */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {deletingKey && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18, ease: [0.55, 0.055, 0.675, 0.19] }}
                  className="fixed inset-0 z-[45] bg-black/25"
                  onClick={() => { if (!revokeMutation.isPending) setDeletingKey(null) }}
                />
                <div className="fixed inset-0 z-[46] flex items-center justify-center pointer-events-none">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.55, 0.055, 0.675, 0.19] }}
                    className="w-[90vw] max-w-[400px] pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="bg-background rounded-2xl border border-border/50 overflow-hidden" style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)" }}>
                      <div className="px-5 pt-4 pb-4 space-y-1">
                        <h2 className="text-[15px] font-semibold">Delete API Key</h2>
                        <p className="text-[12px] text-muted-foreground leading-relaxed">
                          Are you sure you want to delete{" "}
                          <span className="font-medium text-foreground">{deletingKey.name}</span>?
                          Any integrations using this key will stop working immediately.
                        </p>
                      </div>
                      <div className="bg-muted/50 px-5 py-3 flex justify-between" style={{ boxShadow: "inset 0 1px 0 0 var(--border), inset 0 2px 0 0 var(--background)" }}>
                        <button
                          onClick={() => setDeletingKey(null)}
                          disabled={revokeMutation.isPending}
                          className="h-8 px-3 rounded-lg text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            revokeMutation.mutate({ id: deletingKey.id }, {
                              onSuccess: () => setDeletingKey(null),
                            })
                          }}
                          disabled={revokeMutation.isPending}
                          className="relative h-8 min-w-[72px] px-3 rounded-lg bg-destructive text-destructive-foreground text-[12px] font-medium hover:bg-destructive/90 transition-colors disabled:opacity-40 overflow-hidden"
                        >
                          <span className={revokeMutation.isPending ? "opacity-0" : ""}>Delete</span>
                          <AnimatePresence>
                            {revokeMutation.isPending && (
                              <motion.span
                                initial={{ y: 12, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -12, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="absolute inset-0 flex items-center justify-center"
                              >
                                <Spinner size={14} color="currentColor" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}

      {/* Create API Key Dialog */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {showCreateDialog && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.18,
                    ease: [0.55, 0.055, 0.675, 0.19],
                  }}
                  className="fixed inset-0 z-[45] bg-black/25"
                  onClick={closeCreateDialog}
                />
                <div className="fixed inset-0 z-[46] flex items-center justify-center pointer-events-none">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{
                      duration: 0.2,
                      ease: [0.55, 0.055, 0.675, 0.19],
                    }}
                    className="w-[90vw] max-w-[400px] pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className="bg-background rounded-2xl border border-border/50 overflow-hidden"
                      style={{
                        boxShadow:
                          "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      {dialogStep === "name" ? (
                        <>
                          <div className="px-5 pt-4 pb-4 space-y-3">
                            <div>
                              <h2 className="text-[15px] font-semibold">
                                Create API Key
                              </h2>
                              <p className="text-[12px] text-muted-foreground mt-1.5 leading-relaxed">
                                Give your key a name to identify it later. Keys
                                are scoped to your workspace.
                              </p>
                            </div>
                            <div>
                              <p className="text-[12px] text-muted-foreground mb-1.5">
                                Key name
                              </p>
                              <input
                                value={newKeyName}
                                onChange={(e) => setNewKeyName(e.target.value)}
                                placeholder="e.g. Production, CI/CD, Development"
                                autoFocus
                                autoComplete="off"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !createMutation.isPending) {
                                    handleCreate()
                                  }
                                  if (e.key === "Escape") {
                                    closeCreateDialog()
                                  }
                                }}
                                disabled={createMutation.isPending}
                                className="an-focus-input w-full h-9 rounded-lg bg-foreground/[0.05] border border-border hover:border-foreground/15 px-3 text-[13px] text-foreground placeholder:text-foreground/30 disabled:opacity-50"
                              />
                            </div>
                          </div>
                          <div
                            className="bg-muted/50 px-5 py-3 flex justify-between"
                            style={{
                              boxShadow:
                                "inset 0 1px 0 0 var(--border), inset 0 2px 0 0 var(--background)",
                            }}
                          >
                            <button
                              onClick={closeCreateDialog}
                              disabled={createMutation.isPending}
                              className="h-8 px-3 rounded-lg text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors disabled:opacity-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleCreate}
                              disabled={createMutation.isPending}
                              className="relative h-8 min-w-[72px] px-3 rounded-lg bg-foreground text-background text-[12px] font-medium hover:bg-foreground/90 transition-colors disabled:opacity-40 overflow-hidden"
                            >
                              <span
                                className={
                                  createMutation.isPending ? "opacity-0" : ""
                                }
                              >
                                Create
                              </span>
                              <AnimatePresence>
                                {createMutation.isPending && (
                                  <motion.span
                                    initial={{ y: 12, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -12, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                  >
                                    <Spinner
                                      size={14}
                                      color="currentColor"
                                    />
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="px-5 pt-4 pb-4 space-y-3">
                            <div>
                              <h2 className="text-[15px] font-semibold">
                                API Key Created
                              </h2>
                              <p className="text-[12px] text-muted-foreground mt-1.5 leading-relaxed">
                                Copy your API key now. For security reasons, it
                                won't be shown again.
                              </p>
                            </div>
                            <CopyText value={newlyCreatedKey ?? ""} className="block">
                              <div className="flex items-center gap-2 rounded-lg bg-foreground/[0.05] border border-border p-2.5 hover:border-foreground/15 transition-colors">
                                <div className="flex-1 min-w-0 overflow-x-auto scrollbar-none">
                                  <code className="text-[12px] font-mono text-foreground whitespace-nowrap select-all">
                                    {newlyCreatedKey}
                                  </code>
                                </div>
                                <Copy className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                              </div>
                            </CopyText>
                          </div>
                          <div
                            className="bg-muted/50 px-5 py-3 flex justify-end"
                            style={{
                              boxShadow:
                                "inset 0 1px 0 0 var(--border), inset 0 2px 0 0 var(--background)",
                            }}
                          >
                            <button
                              onClick={closeCreateDialog}
                              className="h-8 px-3 rounded-lg bg-foreground text-background text-[12px] font-medium hover:bg-foreground/90 transition-colors"
                            >
                              Done
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </motion.div>
  )
}
