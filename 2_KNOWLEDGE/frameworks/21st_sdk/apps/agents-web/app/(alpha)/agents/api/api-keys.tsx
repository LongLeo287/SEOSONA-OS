"use client"

import { useState } from "react"
import { useAtomValue } from "jotai"
import { Check, Copy, Plus, RotateCw, X } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/trpc/client"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface AnApiKey {
  id: string
  key_prefix: string | null
  name: string
  is_active: boolean
  created_at: string
  last_used_at: string | null
}

function displayKeyPrefix(prefix: string | null): string {
  return prefix ? `${prefix}...` : "Legacy key"
}

function CopyableValue({
  value,
  displayValue,
  label,
}: {
  value: string
  displayValue?: string
  label?: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    toast.success(label ? `${label} copied` : "Copied to clipboard")
    setTimeout(() => setCopied(false), 2_000)
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
    >
      <span className="truncate">{displayValue ?? value}</span>
      {copied ? (
        <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
      ) : (
        <Copy className="h-3 w-3 flex-shrink-0" />
      )}
    </button>
  )
}

export function AnApiKeys() {
  const selectedTeamId = useAtomValue(selectedTeamIdAtom)
  const [newKeyName, setNewKeyName] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null)

  const utils = api.useUtils()

  const { data: rawKeys, isLoading } = api.anApiKeys.list.useQuery(
    { teamId: selectedTeamId! },
    { enabled: !!selectedTeamId, staleTime: 30_000 },
  )
  const keys = rawKeys as AnApiKey[] | undefined

  const createMutation = api.anApiKeys.create.useMutation({
    onSuccess: (data) => {
      toast.success("API key created")
      setNewlyCreatedKey(data.key)
      setNewKeyName("")
      setShowCreateForm(false)
      utils.anApiKeys.list.invalidate()
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
    onSuccess: (data) => {
      toast.success("API key rotated")
      setNewlyCreatedKey(data.key)
      utils.anApiKeys.list.invalidate()
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const handleCreate = () => {
    if (!selectedTeamId) return
    createMutation.mutate({
      teamId: selectedTeamId,
      name: newKeyName || "Default",
    })
  }

  if (isLoading) return null

  const activeKeys = keys?.filter((k) => k.is_active) ?? []
  const revokedKeys = keys?.filter((k) => !k.is_active) ?? []

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">API Keys</h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          Create and manage API keys for the Relay API. Keys use the{" "}
          <code className="text-[13px]">21st_sk_</code> prefix and are scoped to
          your workspace.
        </p>
      </div>

      {/* Newly created key banner */}
      {newlyCreatedKey && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Save your API key — it won't be shown again
            </span>
            <button
              onClick={() => setNewlyCreatedKey(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <CopyableValue value={newlyCreatedKey} label="API key" />
        </div>
      )}

      {/* Keys list */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Your Keys</h3>
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              <Plus className="h-3 w-3" />
              Create Key
            </Button>
          </div>

          {showCreateForm && (
            <div className="flex items-center gap-2 pt-1">
              <Input
                placeholder="Key name (optional)"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="text-sm h-8"
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
              <Button
                size="sm"
                className="text-xs shrink-0"
                onClick={handleCreate}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          )}

          {activeKeys.length === 0 && revokedKeys.length === 0 && (
            <p className="text-xs text-muted-foreground py-2">
              No API keys yet. Create one to get started.
            </p>
          )}

          {activeKeys.map((k) => (
            <div
              key={k.id}
              className="flex items-center justify-between py-2 border-t border-border first:border-t-0"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{k.name}</span>
                <span className="text-xs font-mono text-muted-foreground">
                  {displayKeyPrefix(k.key_prefix)}
                </span>
                <span className="text-[10px] text-muted-foreground/60">
                  Created {new Date(k.created_at).toLocaleDateString()}
                  {k.last_used_at &&
                    ` · Last used ${new Date(k.last_used_at).toLocaleDateString()}`}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs gap-1 h-7"
                    >
                      <RotateCw className="h-3 w-3" />
                      Rotate
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Rotate API key?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will revoke the current key and create a new one
                        with the same name. Any systems using the old key will
                        stop working.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => rotateMutation.mutate({ id: k.id })}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Rotate
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-destructive hover:text-destructive h-7"
                    >
                      Revoke
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Revoke API key?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This key will immediately stop working. This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => revokeMutation.mutate({ id: k.id })}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Revoke
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}

          {revokedKeys.length > 0 && (
            <>
              <div className="border-t border-border" />
              <span className="text-[10px] text-muted-foreground/60 font-medium">
                Revoked
              </span>
              {revokedKeys.map((k) => (
                <div
                  key={k.id}
                  className="flex items-center justify-between py-1 opacity-50"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm">{k.name}</span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {displayKeyPrefix(k.key_prefix)}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    Revoked
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
