"use client"

import { useState, useEffect } from "react"
import { useAtom, useAtomValue } from "jotai"
import { useAgentsRouter } from "@/hooks/use-agents-router"
import { api } from "@/trpc/client"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import {
  anSettingsEditingAgentAtom,
} from "@/lib/atoms/an-agent"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { AnLogoSpinner } from "@/components/features/agents/an/dashboard/an-logo-spinner"
import { Spinner } from "@/components/icons/spinner"
import { AnimatePresence, motion } from "motion/react"
import { createPortal } from "react-dom"

export function AgentSettingsClient({ agentId }: { agentId: string }) {
  const router = useAgentsRouter()
  const teamId = useAtomValue(selectedTeamIdAtom)
  const [, setSettingsEditingAgent] = useAtom(anSettingsEditingAgentAtom)

  const { data: agents, isLoading } = api.agentConfigs.listConfigs.useQuery(
    { teamId: teamId! },
    { enabled: !!teamId },
  )

  const agent = agents?.find((a) => a.id === agentId)

  // Agent form state
  const [agentName, setAgentName] = useState("")
  const [agentSlug, setAgentSlug] = useState("")
  const [agentSaving, setAgentSaving] = useState(false)

  // Delete agent dialog
  const [showDelete, setShowDelete] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState("")

  // Sync form state when agent loads
  useEffect(() => {
    if (agent) {
      setAgentName(agent.name)
      setAgentSlug(agent.slug)
    }
  }, [agent?.id])

  // Sync atom for header breadcrumb
  useEffect(() => {
    if (agent) {
      setSettingsEditingAgent({ id: agent.id, name: agent.name })
    }
    return () => setSettingsEditingAgent(null)
  }, [agent?.id])

  const utils = api.useUtils()
  const updateAgent = api.agentConfigs.updateConfig.useMutation()
  const deleteAgentMutation = api.agentConfigs.deleteConfig.useMutation()

  async function handleSaveAgent() {
    if (!agent) return
    setAgentSaving(true)
    try {
      await updateAgent.mutateAsync({
        id: agent.id,
        name: agentName.trim() || undefined,
        slug: agentSlug.trim() || undefined,
      })
      await utils.agentConfigs.listConfigs.invalidate()
      toast.success("Agent updated")
    } catch (err: any) {
      toast.error(err.message || "Failed to update agent")
    } finally {
      setAgentSaving(false)
    }
  }

  async function handleDeleteAgent() {
    if (!agent || deleteConfirm !== agent.name) return
    try {
      await deleteAgentMutation.mutateAsync({ id: agent.id })
      await utils.agentConfigs.listConfigs.invalidate()
      toast.success("Agent deleted")
      router.push("/agents/settings")
    } catch (err: any) {
      toast.error(err.message || "Failed to delete agent")
    } finally {
      setShowDelete(false)
      setDeleteConfirm("")
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-8 py-10">
        <div className="flex items-center justify-center py-20">
          <AnLogoSpinner />
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
        Agent not found
      </div>
    )
  }

  const hasChanges = agentName !== agent.name || agentSlug !== agent.slug

  return (
    <>
      <div className="mx-auto max-w-2xl px-8 py-10 space-y-6">
        {/* Agent General card */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="p-4 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <Label className="text-sm font-medium">Agent Name</Label>
                <p className="text-sm text-muted-foreground">
                  Display name for this agent
                </p>
              </div>
              <div className="flex-shrink-0 w-56">
                <input
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="My agent"
                  className="an-focus-input w-full h-8 rounded-md bg-foreground/[0.05] border border-border hover:border-foreground/15 px-2.5 text-[13px] text-foreground placeholder:text-foreground/40"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <Label className="text-sm font-medium">Slug</Label>
                <p className="text-sm text-muted-foreground">
                  Used in API endpoints and CLI
                </p>
              </div>
              <div className="flex-shrink-0 w-56">
                <input
                  value={agentSlug}
                  onChange={(e) => setAgentSlug(e.target.value)}
                  placeholder="my-agent"
                  className="an-focus-input w-full h-8 rounded-md bg-foreground/[0.05] border border-border hover:border-foreground/15 px-2.5 text-[13px] font-mono text-foreground placeholder:text-foreground/40"
                />
              </div>
            </div>
          </div>

          <div className="bg-muted p-3 flex justify-end border-t">
            <button
              onClick={handleSaveAgent}
              disabled={!hasChanges || agentSaving}
              className="an-focus-btn flex items-center justify-center gap-2 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background hover:opacity-90 disabled:opacity-60"
            >
              {agentSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save
            </button>
          </div>
        </div>

        {/* Delete Agent */}
        <div className="rounded-lg border border-destructive/30 overflow-hidden">
          <div className="px-5 py-5">
            <h2 className="text-sm font-semibold">Delete Agent</h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              Permanently remove this agent and all its sandboxes and
              threads. This action is not reversible.
            </p>
          </div>
          <div className="bg-destructive/[0.06] px-5 py-3 flex items-center justify-end border-t border-destructive/30">
            <button
              onClick={() => setShowDelete(true)}
              className="an-focus-btn rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Agent
            </button>
          </div>
        </div>
      </div>

      {/* Delete Agent Dialog */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {showDelete && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: [0.55, 0.055, 0.675, 0.19] }}
                className="fixed inset-0 z-[45] bg-black/25"
                onClick={() => { if (!deleteAgentMutation.isPending) { setShowDelete(false); setDeleteConfirm("") } }}
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
                    <div className="px-5 pt-4 pb-4 space-y-3">
                      <div>
                        <h2 className="text-[15px] font-semibold">Delete Agent</h2>
                        <p className="text-[12px] text-muted-foreground mt-1.5 leading-relaxed">
                          This will permanently delete the agent and all its sandboxes and threads. This action cannot be undone.
                        </p>
                      </div>
                      <div>
                        <p className="text-[12px] text-muted-foreground mb-1.5">
                          Type{" "}
                          <code
                            className="px-1 py-0.5 bg-muted rounded text-foreground font-medium text-[11px] select-all"
                            onClick={(e) => {
                              const range = document.createRange()
                              range.selectNodeContents(e.currentTarget)
                              const sel = window.getSelection()
                              sel?.removeAllRanges()
                              sel?.addRange(range)
                            }}
                          >
                            {agent.name}
                          </code>{" "}
                          to confirm
                        </p>
                        <input
                          value={deleteConfirm}
                          onChange={(e) => setDeleteConfirm(e.target.value)}
                          placeholder={agent.name}
                          disabled={deleteAgentMutation.isPending}
                          autoComplete="off"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && deleteConfirm === agent.name && !deleteAgentMutation.isPending) {
                              handleDeleteAgent()
                            }
                            if (e.key === "Escape") { setShowDelete(false); setDeleteConfirm("") }
                          }}
                          className="an-focus-input w-full h-9 rounded-lg bg-foreground/[0.05] border border-border hover:border-foreground/15 px-3 text-[13px] text-foreground placeholder:text-foreground/30 disabled:opacity-50"
                        />
                      </div>
                    </div>
                    <div className="bg-muted/50 px-5 py-3 flex justify-between" style={{ boxShadow: "inset 0 1px 0 0 var(--border), inset 0 2px 0 0 var(--background)" }}>
                      <button
                        onClick={() => { setShowDelete(false); setDeleteConfirm("") }}
                        disabled={deleteAgentMutation.isPending}
                        className="h-8 px-3 rounded-lg text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteAgent}
                        disabled={deleteAgentMutation.isPending || deleteConfirm !== agent.name}
                        className="relative h-8 min-w-[72px] px-3 rounded-lg bg-destructive text-destructive-foreground text-[12px] font-medium hover:bg-destructive/90 transition-colors disabled:opacity-40 overflow-hidden"
                      >
                        <span className={deleteAgentMutation.isPending ? "opacity-0" : ""}>Delete</span>
                        <AnimatePresence>
                          {deleteAgentMutation.isPending && (
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
    </>
  )
}
