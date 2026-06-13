"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useAtomValue } from "jotai"
import {
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Globe,
  Info,
  KeyRound,
  Link2,
  LockKeyhole,
  MoreHorizontal,
  Plus,
  Server,
  Star,
  Trash2,
  Vault,
  X as XIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { api } from "@/trpc/client"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { MCP_REGISTRY } from "@/lib/mcp-registry"
import { Spinner } from "@/components/icons/spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/features/agents/ui/1code/{components}/ui/select"

type AuthType = "bearer" | "oauth"

interface McpSuggestion {
  name: string
  url: string
  faviconDomain: string | null
  faviconFallback: string | null
}

function OptionalBadge() {
  return (
    <span className="rounded-md bg-foreground/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
      Optional
    </span>
  )
}

function FieldAccordion({
  label,
  optional = false,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  infoTooltip,
  children,
}: {
  label: string
  optional?: boolean
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  infoTooltip?: string
  children: ReactNode
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = controlledOpen ?? internalOpen
  const toggle = () => {
    const next = !isOpen
    if (onOpenChange) onOpenChange(next)
    else setInternalOpen(next)
  }
  return (
    <div className="rounded-xl border border-border bg-background">
      <button
        type="button"
        onClick={toggle}
        className="an-focus-btn flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5"
      >
        <div className="flex items-center gap-2">
          <ChevronRight
            className={cn(
              "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform",
              isOpen && "rotate-90",
            )}
          />
          <span className="text-[12px] font-medium text-foreground">
            {label}
          </span>
          {optional ? <OptionalBadge /> : null}
        </div>
        {infoTooltip ? (
          <span title={infoTooltip} className="text-muted-foreground/60">
            <Info className="h-3.5 w-3.5" />
          </span>
        ) : null}
      </button>
      {isOpen ? (
        <div className="space-y-3 border-t border-border px-3 py-3">
          {children}
        </div>
      ) : null}
    </div>
  )
}
type Metadata = Record<string, string>

function parseMetadataText(value: string): Metadata {
  const trimmed = value.trim()
  if (!trimmed) return {}

  const parsed = JSON.parse(trimmed) as unknown
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Metadata must be a JSON object")
  }

  const metadata: Metadata = {}
  for (const [key, entry] of Object.entries(parsed)) {
    if (typeof entry !== "string") {
      throw new Error("Metadata values must be strings")
    }
    metadata[key] = entry
  }
  return metadata
}

function MetadataBadges({ metadata }: { metadata?: unknown }) {
  const entries =
    metadata && typeof metadata === "object" && !Array.isArray(metadata)
      ? Object.entries(metadata).filter(
          (entry): entry is [string, string] => typeof entry[1] === "string",
        )
      : []
  if (entries.length === 0) return null

  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {entries.slice(0, 4).map(([key, value]) => (
        <Badge key={key} variant="outline" className="max-w-full text-[10px]">
          <span className="truncate">
            {key}: {value}
          </span>
        </Badge>
      ))}
      {entries.length > 4 ? (
        <Badge variant="outline" className="text-[10px]">
          +{entries.length - 4}
        </Badge>
      ) : null}
    </div>
  )
}

function statusBadge(status: string) {
  if (status === "ready") {
    return (
      <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/10">
        Ready
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="border-amber-500/30 text-amber-700 dark:text-amber-300">
      Missing credential
    </Badge>
  )
}

function formatVaultId(id: string) {
  if (!id) return ""
  const tail = id.slice(-6)
  return `vlt_…${tail}`
}

function confirmDestructiveAction(message: string) {
  return window.confirm(message)
}

function VaultStatusBadge({ status }: { status: string }) {
  if (status === "archived") {
    return (
      <span className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
        Archived
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
      Active
    </span>
  )
}

function CopyableVaultId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false)
  const doCopy = () => {
    if (!navigator.clipboard) return
    void navigator.clipboard.writeText(id).then(() => {
      setCopied(true)
      toast.success("Vault ID copied")
      window.setTimeout(() => setCopied(false), 1500)
    })
  }
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation()
        doCopy()
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          e.stopPropagation()
          doCopy()
        }
      }}
      className="group/id inline-flex items-center gap-1 rounded font-mono text-[10px] text-muted-foreground/80 hover:text-foreground transition-colors"
      title={`${id} — click to copy`}
    >
      <span className="tabular-nums">{formatVaultId(id)}</span>
      {copied ? (
        <Check className="h-2.5 w-2.5 text-emerald-500" />
      ) : (
        <Copy className="h-2.5 w-2.5 opacity-0 group-hover/id:opacity-100 transition-opacity" />
      )}
    </span>
  )
}

function DetailPaneSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Credentials card */}
      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-2.5 py-2.5">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Skeleton className="h-3.5 w-24 rounded" />
            <Skeleton className="h-4 w-12 rounded-md" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            <Skeleton className="h-7 w-[104px] rounded-md" />
            <Skeleton className="h-7 w-7 rounded-md" />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-3 px-2.5 h-[48px] border-b border-border/50 last:border-b-0">
            <Skeleton className="h-3.5 w-3.5 rounded-sm shrink-0" />
            <div className="min-w-0 flex-1 space-y-1">
              <Skeleton className="h-3 w-40 rounded" />
              <Skeleton className="h-2.5 w-56 rounded" />
            </div>
            <Skeleton className="hidden sm:block h-3 w-12 rounded shrink-0" />
            <Skeleton className="hidden sm:block h-3 w-10 rounded shrink-0" />
            <Skeleton className="h-6 w-6 rounded-md shrink-0" />
          </div>
        </div>
      </div>

      {/* Agent coverage card */}
      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <div className="flex items-center gap-2 px-2.5 py-2.5 border-b border-border">
          <Skeleton className="h-3 w-24 rounded" />
        </div>
        <div className="flex flex-col items-center justify-center gap-2 py-12">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-3 w-56 rounded" />
        </div>
      </div>
    </div>
  )
}

function McpsPageSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
      {/* Left — vault list skeleton */}
      <div className="rounded-xl border border-border bg-background overflow-hidden self-start">
        <div className="flex items-center justify-between gap-2 px-2.5 py-2.5 border-b border-border">
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-6 w-12 rounded-md" />
        </div>
        <div className="flex flex-col">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-2.5 py-2.5 border-b border-border/50 last:border-b-0"
            >
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-3 w-24 rounded" />
                  <Skeleton className="h-3.5 w-12 rounded-md" />
                </div>
                <Skeleton className="h-2.5 w-32 rounded" />
              </div>
              <Skeleton className="h-3.5 w-3.5 rounded shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Right — detail pane skeleton */}
      <DetailPaneSkeleton />
    </div>
  )
}

export function VaultsPageClient() {
  const teamId = useAtomValue(selectedTeamIdAtom)
  const [selectedVaultId, setSelectedVaultId] = useState<string | null>(null)
  const [isCreateVaultOpen, setIsCreateVaultOpen] = useState(false)
  const [isCreateCredentialOpen, setIsCreateCredentialOpen] = useState(false)
  const [vaultName, setVaultName] = useState("")
  const [vaultDescription, setVaultDescription] = useState("")
  const [vaultMetadataText, setVaultMetadataText] = useState("")
  const [credentialName, setCredentialName] = useState("")
  const [credentialMetadataText, setCredentialMetadataText] = useState("")
  const [serverUrl, setServerUrl] = useState("")
  const [authType, setAuthType] = useState<AuthType>("bearer")
  const [bearerToken, setBearerToken] = useState("")
  const [oauthAccessToken, setOauthAccessToken] = useState("")
  const [oauthRefreshToken, setOauthRefreshToken] = useState("")
  const [oauthClientId, setOauthClientId] = useState("")
  const [oauthClientSecret, setOauthClientSecret] = useState("")
  const [oauthTokenEndpoint, setOauthTokenEndpoint] = useState("")
  const [oauthTokenEndpointAuth, setOauthTokenEndpointAuth] = useState<
    "none" | "client_secret_basic" | "client_secret_post"
  >("none")
  const [oauthTokenType, setOauthTokenType] = useState("")
  const [oauthExpiresAt, setOauthExpiresAt] = useState("")
  const [oauthScope, setOauthScope] = useState("")
  const [oauthResource, setOauthResource] = useState("")
  const [injectKind, setInjectKind] = useState<"header" | "query" | "basic">(
    "header",
  )
  const [injectHeaderName, setInjectHeaderName] = useState("Authorization")
  const [injectHeaderPrefix, setInjectHeaderPrefix] = useState("Bearer ")
  const [injectQueryParam, setInjectQueryParam] = useState("")
  const [injectBasicUsername, setInjectBasicUsername] = useState("")
  const [serverQuery, setServerQuery] = useState("")
  const [isCustomizingInjection, setIsCustomizingInjection] = useState(false)
  const [credentialStep, setCredentialStep] = useState<1 | 2 | 3>(1)

  const utils = api.useUtils()
  const listQuery = api.mcpVaults.list.useQuery(
    { teamId: teamId! },
    { enabled: !!teamId, staleTime: 10_000 },
  )
  const detailQuery = api.mcpVaults.get.useQuery(
    { teamId: teamId!, vaultId: selectedVaultId! },
    { enabled: !!teamId && !!selectedVaultId, staleTime: 10_000 },
  )

  useEffect(() => {
    if (!selectedVaultId && listQuery.data?.vaults?.length) {
      setSelectedVaultId(listQuery.data.vaults[0]!.id)
    }
  }, [listQuery.data?.vaults, selectedVaultId])

  const createVaultMutation = api.mcpVaults.create.useMutation({
    onSuccess: async (vault) => {
      toast.success("Vault created")
      setIsCreateVaultOpen(false)
      setVaultName("")
      setVaultDescription("")
      setVaultMetadataText("")
      await utils.mcpVaults.list.invalidate()
      setSelectedVaultId(vault.id)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const createCredentialMutation = api.mcpVaults.createCredential.useMutation({
    onSuccess: async () => {
      toast.success("Credential saved")
      setIsCreateCredentialOpen(false)
      resetCredentialForm()
      await Promise.all([
        utils.mcpVaults.list.invalidate(),
        selectedVaultId
          ? utils.mcpVaults.get.invalidate({
              teamId: teamId!,
              vaultId: selectedVaultId,
            })
          : Promise.resolve(),
      ])
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const archiveCredentialMutation = api.mcpVaults.archiveCredential.useMutation(
    {
      onSuccess: async () => {
        toast.success("Credential archived")
        await Promise.all([
          utils.mcpVaults.list.invalidate(),
          selectedVaultId
            ? utils.mcpVaults.get.invalidate({
                teamId: teamId!,
                vaultId: selectedVaultId,
              })
            : Promise.resolve(),
        ])
      },
      onError: (error) => {
        toast.error(error.message)
      },
    },
  )

  const hardDeleteCredentialMutation =
    api.mcpVaults.hardDeleteCredential.useMutation({
      onSuccess: async () => {
        toast.success("Credential permanently deleted")
        await Promise.all([
          utils.mcpVaults.list.invalidate(),
          selectedVaultId
            ? utils.mcpVaults.get.invalidate({
                teamId: teamId!,
                vaultId: selectedVaultId,
              })
            : Promise.resolve(),
        ])
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })

  const archiveVaultMutation = api.mcpVaults.archive.useMutation({
    onSuccess: async () => {
      toast.success("Vault archived")
      setSelectedVaultId(null)
      await Promise.all([
        utils.mcpVaults.list.invalidate(),
        utils.mcpVaults.get.invalidate(),
      ])
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const hardDeleteVaultMutation = api.mcpVaults.hardDelete.useMutation({
    onSuccess: async () => {
      toast.success("Vault permanently deleted")
      setSelectedVaultId(null)
      await Promise.all([
        utils.mcpVaults.list.invalidate(),
        utils.mcpVaults.get.invalidate(),
      ])
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const setDefaultVaultMutation = api.mcpVaults.setDefault.useMutation({
    onSuccess: async () => {
      toast.success("Default vault updated")
      await Promise.all([
        utils.mcpVaults.list.invalidate(),
        selectedVaultId
          ? utils.mcpVaults.get.invalidate({
              teamId: teamId!,
              vaultId: selectedVaultId,
            })
          : Promise.resolve(),
      ])
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const suggestions = useMemo<McpSuggestion[]>(() => {
    const serverRaw =
      listQuery.data?.suggestions ?? detailQuery.data?.suggestions ?? []

    const registryUrls = new Set(
      MCP_REGISTRY.map((entry) => entry.url.toLowerCase()),
    )

    const combined: McpSuggestion[] = [
      ...MCP_REGISTRY.map((entry) => ({
        name: entry.name,
        url: entry.url,
        faviconDomain: entry.faviconDomain,
        faviconFallback: entry.faviconFallback,
      })),
      ...serverRaw
        .filter((s) => !registryUrls.has(s.url.toLowerCase()))
        .map((s) => ({
          name: s.name,
          url: s.url,
          faviconDomain: null,
          faviconFallback: null,
        })),
    ]

    const query = serverQuery.trim().toLowerCase()
    if (!query) return combined
    return combined.filter(
      (entry) =>
        entry.name.toLowerCase().includes(query) ||
        entry.url.toLowerCase().includes(query),
    )
  }, [detailQuery.data?.suggestions, listQuery.data?.suggestions, serverQuery])

  const selectedSuggestion = useMemo<McpSuggestion | null>(() => {
    const url = serverUrl.trim().toLowerCase()
    if (!url) return null
    const match = MCP_REGISTRY.find((entry) => entry.url.toLowerCase() === url)
    if (!match) return null
    return {
      name: match.name,
      url: match.url,
      faviconDomain: match.faviconDomain,
      faviconFallback: match.faviconFallback,
    }
  }, [serverUrl])

  useEffect(() => {
    if (selectedSuggestion && !credentialName.trim()) {
      setCredentialName(selectedSuggestion.name)
    }
  }, [selectedSuggestion, credentialName])

  function resetCredentialForm() {
    setCredentialName("")
    setCredentialMetadataText("")
    setServerUrl("")
    setAuthType("bearer")
    setBearerToken("")
    setOauthAccessToken("")
    setOauthRefreshToken("")
    setOauthClientId("")
    setOauthClientSecret("")
    setOauthTokenEndpoint("")
    setOauthTokenEndpointAuth("none")
    setOauthTokenType("")
    setOauthExpiresAt("")
    setOauthScope("")
    setOauthResource("")
    setInjectKind("header")
    setInjectHeaderName("Authorization")
    setInjectHeaderPrefix("Bearer ")
    setInjectQueryParam("")
    setInjectBasicUsername("")
    setServerQuery("")
    setIsCustomizingInjection(false)
    setCredentialStep(1)
  }

  const selectedVault = detailQuery.data?.vault

  return (
    <motion.div
      className="flex flex-1 flex-col overflow-auto bg-tl-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="mx-auto w-full max-w-5xl flex flex-col gap-0 px-8 py-6">
        <div className="mb-6">
          <h1 className="text-[15px] font-semibold tracking-tight text-foreground">
            Vaults
          </h1>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            Store credentials for third-party APIs and MCP servers. The relay
            injects them into outbound requests — your sandboxes never see the
            secrets.
          </p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
        {!teamId || !listQuery.isSuccess ? (
          <motion.div
            key="page-skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <McpsPageSkeleton />
          </motion.div>
        ) : (
          <motion.div
            key="page-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18 }}
            className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]"
          >
            <div className="rounded-xl border border-border bg-background overflow-hidden">
              <div className="flex items-center justify-between gap-2 px-2.5 py-2.5 border-b border-border">
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Vaults
                </span>
                <button
                  onClick={() => setIsCreateVaultOpen(true)}
                  className="flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all active:scale-95"
                >
                  <Plus className="h-3 w-3" />
                  New
                </button>
              </div>

              <div className="flex flex-col">
                {listQuery.data.vaults.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                    <Vault className="h-5 w-5 text-muted-foreground/25" />
                    <p className="text-[12px] text-muted-foreground">
                      No vaults yet.
                    </p>
                  </div>
                ) : (
                  listQuery.data!.vaults.map((vault) => (
                    <div
                      key={vault.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedVaultId(vault.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          setSelectedVaultId(vault.id)
                        }
                      }}
                      className={cn(
                        "group flex cursor-pointer items-center gap-2 px-2.5 py-2.5 text-left border-b border-border/50 last:border-b-0 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        selectedVaultId === vault.id
                          ? "bg-muted/40"
                          : "hover:bg-muted/30",
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-[12px] font-medium text-foreground">
                            {vault.name}
                          </span>
                          {vault.isDefault ? (
                            <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />
                          ) : null}
                          <VaultStatusBadge status={vault.status} />
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <CopyableVaultId id={vault.id} />
                          <span className="text-[10px] text-muted-foreground/60 tabular-nums">
                            {vault.credentials.length} cred
                            {vault.credentials.length === 1 ? "" : "s"}
                          </span>
                        </div>
                        {vault.description ? (
                          <p className="mt-1 truncate text-[11px] text-muted-foreground/70">
                            {vault.description}
                          </p>
                        ) : null}
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <AnimatePresence mode="wait" initial={false}>
              {detailQuery.isLoading && selectedVaultId ? (
                <motion.div
                  key="detail-skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <DetailPaneSkeleton />
                </motion.div>
              ) : !selectedVault ? (
                <motion.div
                  key="detail-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="rounded-xl border border-border bg-background px-4 py-10 text-center text-[12px] text-muted-foreground"
                >
                  {listQuery.data.vaults.length === 0
                    ? "Create your first vault to start adding MCP credentials."
                    : "Select a vault to inspect its credentials and agent coverage."}
                </motion.div>
              ) : (
                <motion.div
                  key={`detail-${selectedVault.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.18 }}
                  className="flex flex-col gap-4"
                >
                  <div className="rounded-xl border border-border bg-background overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-2.5 py-2.5">
                      <div className="min-w-0 flex items-center gap-2 flex-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <h2 className="truncate text-[12px] font-medium text-foreground">
                            {selectedVault.name}
                          </h2>
                          {selectedVault.isDefault ? (
                            <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />
                          ) : null}
                          <VaultStatusBadge status={selectedVault.status} />
                        </div>
                        <CopyableVaultId id={selectedVault.id} />
                      </div>

                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => setIsCreateCredentialOpen(true)}
                          className="flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all active:scale-95"
                        >
                          <Plus className="h-3 w-3" />
                          Add credential
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              aria-label="More options"
                              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all active:scale-95"
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            {!selectedVault.isDefault &&
                            selectedVault.status !== "archived" ? (
                              <DropdownMenuItem
                                disabled={setDefaultVaultMutation.isPending}
                                onClick={() =>
                                  setDefaultVaultMutation.mutate({
                                    teamId: teamId!,
                                    vaultId: selectedVault.id,
                                  })
                                }
                              >
                                <Star className="h-4 w-4 mr-2" />
                                Set as default
                              </DropdownMenuItem>
                            ) : null}
                            {!selectedVault.isDefault &&
                            selectedVault.status !== "archived" ? (
                              <DropdownMenuSeparator />
                            ) : null}
                            <DropdownMenuItem
                              onClick={() => {
                                const payload = {
                                  teamId: teamId!,
                                  vaultId: selectedVault.id,
                                }
                                if (selectedVault.status === "archived") {
                                  if (
                                    !confirmDestructiveAction(
                                      `Permanently delete "${selectedVault.name}"? This cannot be undone.`,
                                    )
                                  ) {
                                    return
                                  }
                                  hardDeleteVaultMutation.mutate(payload)
                                } else {
                                  if (
                                    !confirmDestructiveAction(
                                      `Archive "${selectedVault.name}" and remove its active credentials?`,
                                    )
                                  ) {
                                    return
                                  }
                                  archiveVaultMutation.mutate(payload)
                                }
                              }}
                              className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {selectedVault.status === "archived"
                                ? "Delete permanently"
                                : "Archive"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div>
                      {selectedVault.credentials.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                          <KeyRound className="h-5 w-5 text-muted-foreground/25" />
                          <p className="text-[12px] text-muted-foreground">
                            No credentials in this vault yet.
                          </p>
                        </div>
                      ) : (
                        selectedVault.credentials.map((credential) => (
                          <div
                            key={credential.id}
                            className="group flex items-center gap-3 px-2.5 h-[48px] border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors"
                          >
                            <KeyRound className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                            <div className="min-w-0 flex-1">
                              <span className="text-[12px] truncate block font-medium text-foreground">
                                {credential.name || credential.serverUrl}
                              </span>
                              <span className="text-[11px] text-muted-foreground/60 truncate block">
                                {credential.serverUrlNormalized}
                              </span>
                            </div>
                            <span className="shrink-0 text-[11px] text-muted-foreground/70 capitalize hidden sm:block">
                              {credential.authType}
                            </span>
                            <span className="shrink-0 text-[11px] text-muted-foreground/60 hidden sm:block">
                              {credential.status}
                            </span>
                            <button
                              onClick={() => {
                                const payload = {
                                  teamId: teamId!,
                                  vaultId: selectedVault.id,
                                  credentialId: credential.id,
                                }
                                if (credential.status === "archived") {
                                  if (
                                    !confirmDestructiveAction(
                                      `Permanently delete "${credential.name || credential.serverUrl}"? This cannot be undone.`,
                                    )
                                  ) {
                                    return
                                  }
                                  hardDeleteCredentialMutation.mutate(payload)
                                } else {
                                  if (
                                    !confirmDestructiveAction(
                                      `Archive "${credential.name || credential.serverUrl}"? The secret will be removed.`,
                                    )
                                  ) {
                                    return
                                  }
                                  archiveCredentialMutation.mutate(payload)
                                }
                              }}
                              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all active:scale-95"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-background overflow-hidden">
                    <div className="flex items-center gap-2 px-2.5 py-2.5 border-b border-border">
                      <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Agent coverage
                      </span>
                    </div>

                    {detailQuery.data?.agents.length ? (
                      <div>
                        {detailQuery.data.agents.map((agent) => (
                          <div
                            key={agent.id}
                            className="border-b border-border/50 last:border-b-0"
                          >
                            <div className="flex items-center gap-2 px-2.5 py-2 bg-muted/20">
                              <span className="text-[12px] font-medium text-foreground truncate">
                                {agent.name}
                              </span>
                              <span className="text-[11px] text-muted-foreground/60 truncate">
                                {agent.slug} · {agent.runtime}
                                {agent.activeVersion
                                  ? ` · v${agent.activeVersion}`
                                  : ""}
                              </span>
                            </div>

                            {agent.servers.map((server) => (
                              <div
                                key={`${agent.id}:${server.name}`}
                                className="flex items-center gap-3 px-2.5 h-[40px]"
                              >
                                {server.status === "ready" ? (
                                  <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500 dark:text-emerald-400" />
                                ) : (
                                  <LockKeyhole className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                                )}
                                <div className="min-w-0 flex-1">
                                  <span className="text-[12px] font-medium text-foreground truncate block">
                                    {server.name}
                                  </span>
                                  <span className="text-[11px] text-muted-foreground/60 truncate block">
                                    {server.url}
                                  </span>
                                </div>
                                {statusBadge(server.status)}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                        <Server className="h-5 w-5 text-muted-foreground/25" />
                        <p className="text-[12px] text-muted-foreground">
                          No deployed agents declare MCP servers yet.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>

      <Dialog open={isCreateVaultOpen} onOpenChange={setIsCreateVaultOpen}>
        <DialogContent className="p-0 gap-0 overflow-hidden sm:max-w-md border-border/50">
          <div className="px-5 pt-5 pb-4 space-y-3">
            <div>
              <DialogTitle className="text-[15px] font-semibold">
                Create vault
              </DialogTitle>
              <DialogDescription className="text-[12px] text-muted-foreground mt-1.5 leading-relaxed">
                A workspace-shared container for MCP credentials.
              </DialogDescription>
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-foreground">
                Name
              </label>
              <Input
                autoFocus
                value={vaultName}
                onChange={(e) => setVaultName(e.target.value)}
                placeholder="Sales ops vault"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <label className="text-[12px] font-medium text-foreground">
                  Description
                </label>
                <OptionalBadge />
              </div>
              <Textarea
                value={vaultDescription}
                onChange={(e) => setVaultDescription(e.target.value)}
                placeholder="Optional note about who should use this vault."
                rows={3}
                className="text-[12px]"
              />
            </div>

            <FieldAccordion label="Metadata" optional>
              <Textarea
                value={vaultMetadataText}
                onChange={(e) => setVaultMetadataText(e.target.value)}
                placeholder={'{"external_user_id":"usr_123"}'}
                rows={3}
                className="font-mono text-[11px]"
              />
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Returned on GET. Do not store secrets here.
              </p>
            </FieldAccordion>
          </div>

          <div
            className="bg-muted/50 px-5 py-3 flex justify-between"
            style={{
              boxShadow:
                "inset 0 1px 0 0 var(--border), inset 0 2px 0 0 var(--background)",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setIsCreateVaultOpen(false)
                setVaultName("")
                setVaultDescription("")
                setVaultMetadataText("")
              }}
              disabled={createVaultMutation.isPending}
              className="an-focus-btn h-8 px-3 rounded-lg text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  createVaultMutation.mutate({
                    teamId: teamId!,
                    name: vaultName,
                    description: vaultDescription || null,
                    metadata: parseMetadataText(vaultMetadataText),
                  })
                } catch (error) {
                  toast.error(
                    error instanceof Error ? error.message : String(error),
                  )
                }
              }}
              disabled={
                !teamId || !vaultName.trim() || createVaultMutation.isPending
              }
              className="an-focus-btn relative h-8 min-w-[92px] px-3 rounded-lg bg-foreground text-background text-[12px] font-medium hover:bg-foreground/90 transition-colors disabled:opacity-40 overflow-hidden"
            >
              <span
                className={createVaultMutation.isPending ? "opacity-0" : ""}
              >
                Create vault
              </span>
              <AnimatePresence>
                {createVaultMutation.isPending ? (
                  <motion.span
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -12, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Spinner size={14} color="currentColor" />
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isCreateCredentialOpen}
        onOpenChange={(open) => {
          setIsCreateCredentialOpen(open)
          if (!open) {
            resetCredentialForm()
          }
        }}
      >
        <DialogContent className="p-0 gap-0 overflow-hidden sm:max-w-lg border-border/50">
          {/* Header */}
          <div className="px-5 pt-5 pb-3">
            <DialogTitle className="text-[15px] font-semibold pr-7">
              Add credential
            </DialogTitle>
            <DialogDescription className="text-[12px] text-muted-foreground mt-1.5 leading-relaxed">
              {credentialStep === 1
                ? "Pick the MCP server you want to authorize."
                : credentialStep === 2
                  ? "How should we authenticate to this server?"
                  : "Review and save."}
            </DialogDescription>

            {/* Step indicator */}
            <div className="mt-3 flex items-center gap-1.5">
              {[
                { num: 1 as const, label: "Service" },
                { num: 2 as const, label: "Auth" },
                { num: 3 as const, label: "Review" },
              ].map((s, i) => (
                <div key={s.num} className="flex items-center gap-1.5">
                  <div
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium transition-colors",
                      credentialStep === s.num
                        ? "bg-foreground text-background"
                        : credentialStep > s.num
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {credentialStep > s.num ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      s.num
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[11px] font-medium",
                      credentialStep === s.num
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {s.label}
                  </span>
                  {i < 2 ? (
                    <div className="ml-0.5 h-px w-5 bg-border" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Body — scrollable, capped */}
          <div className="px-5 pb-4 max-h-[60vh] overflow-y-auto">
            {/* STEP 1: Pick service — list is always visible; clicking auto-advances */}
            {credentialStep === 1 ? (
              <div className="rounded-md border border-border bg-background overflow-hidden transition-shadow [&:has(input:focus-visible)]:border-ring [&:has(input:focus-visible)]:ring-[3px] [&:has(input:focus-visible)]:ring-ring/20">
                <div className="relative">
                  <Link2 className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
                  <input
                    autoFocus
                    value={serverQuery}
                    onChange={(e) => {
                      setServerQuery(e.target.value)
                      setServerUrl(e.target.value)
                    }}
                    placeholder="Search registry or paste MCP server URL"
                    className="h-9 w-full bg-transparent pl-8 pr-3 text-[12px] text-foreground placeholder:text-muted-foreground/50 border-0 outline-none focus:outline-none"
                  />
                </div>
                <div className="max-h-72 overflow-y-auto border-t border-border">
                  {suggestions.map((suggestion) => {
                    const isSelected =
                      selectedSuggestion?.url === suggestion.url
                    return (
                      <button
                        key={suggestion.url}
                        type="button"
                        className={cn(
                          "flex w-full items-center gap-2.5 px-2.5 py-2 text-left border-b border-border/50 last:border-b-0 transition-colors outline-none focus-visible:bg-foreground/[0.08]",
                          isSelected
                            ? "bg-foreground/[0.06]"
                            : "hover:bg-muted/40",
                        )}
                        onClick={() => {
                          setServerUrl(suggestion.url)
                          setServerQuery(suggestion.url)
                          setCredentialStep(2)
                        }}
                      >
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-background">
                          {suggestion.faviconDomain ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={`https://www.google.com/s2/favicons?domain=${suggestion.faviconDomain}&sz=48`}
                              alt=""
                              width={14}
                              height={14}
                              loading="lazy"
                              className="object-contain"
                            />
                          ) : suggestion.faviconFallback ? (
                            <span className="text-[10px] font-medium text-muted-foreground">
                              {suggestion.faviconFallback}
                            </span>
                          ) : (
                            <Server className="h-3 w-3 text-muted-foreground/70" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[12px] font-medium text-foreground truncate block">
                            {suggestion.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground/60 truncate block">
                            {suggestion.url}
                          </span>
                        </div>
                        {isSelected ? (
                          <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        ) : null}
                      </button>
                    )
                  })}
                  <button
                    type="button"
                    className="flex w-full items-center gap-2.5 px-2.5 py-2 text-left border-t border-border bg-muted/20 hover:bg-muted/40 transition-colors disabled:opacity-50 outline-none focus-visible:bg-muted/60"
                    disabled={!serverQuery.trim()}
                    onClick={() => {
                      const trimmed = serverQuery.trim()
                      if (!trimmed) return
                      const finalUrl = /^https?:\/\//i.test(trimmed)
                        ? trimmed
                        : `https://${trimmed}`
                      setServerUrl(finalUrl)
                      setServerQuery(finalUrl)
                      setCredentialStep(2)
                    }}
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                      <Globe className="h-3.5 w-3.5 text-muted-foreground/60" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[12px] font-medium text-foreground block">
                        Custom Server
                      </span>
                      <span className="text-[11px] text-muted-foreground/60 truncate block">
                        {serverQuery.trim()
                          ? /^https?:\/\//i.test(serverQuery.trim())
                            ? `Use ${serverQuery.trim()}`
                            : `Use https://${serverQuery.trim()}`
                          : "Type any MCP server URL above"}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            ) : null}

            {/* STEP 2: Authenticate */}
            {credentialStep === 2 ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-[12px] font-medium text-foreground shrink-0">
                    Type
                  </label>
                  <div className="inline-flex rounded-md border border-border bg-foreground/[0.04] p-0.5">
                    <button
                      type="button"
                      className={cn(
                        "an-focus-btn rounded px-2.5 py-1 text-[11px] font-medium transition-colors",
                        authType === "bearer"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                      onClick={() => setAuthType("bearer")}
                    >
                      Bearer token
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "an-focus-btn rounded px-2.5 py-1 text-[11px] font-medium transition-colors",
                        authType === "oauth"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                      onClick={() => setAuthType("oauth")}
                    >
                      OAuth
                    </button>
                  </div>
                </div>

                {authType === "bearer" ? (
                  <div className="space-y-2">
                    <label className="text-[12px] font-medium text-foreground">
                      Token
                    </label>
                    <Input
                      autoFocus
                      type="password"
                      value={bearerToken}
                      onChange={(e) => setBearerToken(e.target.value)}
                      placeholder="API key or bearer token"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
                        Access
                      </div>
                      <Input
                        autoFocus
                        type="password"
                        value={oauthAccessToken}
                        onChange={(e) => setOauthAccessToken(e.target.value)}
                        placeholder="OAuth access token"
                      />
                    </div>

                    <div>
                      <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
                        Client
                      </div>
                      <div className="space-y-2">
                        <Input
                          value={oauthClientId}
                          onChange={(e) => setOauthClientId(e.target.value)}
                          placeholder="Client ID"
                        />
                        <Input
                          type="password"
                          value={oauthClientSecret}
                          onChange={(e) =>
                            setOauthClientSecret(e.target.value)
                          }
                          placeholder="Client secret"
                        />
                      </div>
                    </div>

                    {oauthAccessToken.trim().length > 0 ? (
                      <div>
                        <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
                          Refresh (optional)
                        </div>
                        <div className="space-y-2">
                          <Input
                            type="password"
                            value={oauthRefreshToken}
                            onChange={(e) =>
                              setOauthRefreshToken(e.target.value)
                            }
                            placeholder="OAuth refresh token"
                          />
                          <Input
                            value={oauthTokenEndpoint}
                            onChange={(e) =>
                              setOauthTokenEndpoint(e.target.value)
                            }
                            placeholder="Token endpoint (https://example.com/oauth/token)"
                          />
                          <Select
                            value={oauthTokenEndpointAuth}
                            onValueChange={(value) =>
                              setOauthTokenEndpointAuth(
                                value as
                                  | "none"
                                  | "client_secret_basic"
                                  | "client_secret_post",
                              )
                            }
                          >
                            <SelectTrigger className="h-9 rounded-md bg-foreground/[0.05] border-border hover:border-foreground/15 text-[12px] shadow-none">
                              <SelectValue placeholder="Auth method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="client_secret_post">
                                Auth: client_secret_post
                              </SelectItem>
                              <SelectItem value="client_secret_basic">
                                Auth: client_secret_basic
                              </SelectItem>
                              <SelectItem value="none">
                                Auth: none
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            ) : null}

            {/* STEP 3: Review */}
            {credentialStep === 3 ? (
              <div className="space-y-3">
                {/* Service summary */}
                {selectedSuggestion ? (
                  <div className="flex items-center gap-2 rounded-md border border-border bg-foreground/[0.03] px-2.5 py-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-background">
                      {selectedSuggestion.faviconDomain ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${selectedSuggestion.faviconDomain}&sz=48`}
                          alt=""
                          width={18}
                          height={18}
                          loading="lazy"
                          className="object-contain"
                        />
                      ) : (
                        <Server className="h-4 w-4 text-muted-foreground/70" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[12px] font-medium text-foreground">
                        {selectedSuggestion.name}
                      </div>
                      <div className="truncate text-[11px] text-muted-foreground/70">
                        {selectedSuggestion.url}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-md border border-border bg-foreground/[0.03] px-2.5 py-2 text-[12px] text-foreground truncate">
                    {serverUrl}
                  </div>
                )}

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-foreground">
                    Name
                  </label>
                  <Input
                    value={credentialName}
                    onChange={(e) => setCredentialName(e.target.value)}
                    placeholder={
                      selectedSuggestion?.name ?? "e.g. Linear · Brave · Stripe"
                    }
                  />
                </div>

                {/* Authentication preview + Customize */}
                <div className="rounded-xl border border-border bg-background">
                  <div className="flex items-start gap-2 px-3 py-2.5">
                    <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-500" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium text-foreground">
                        Will be sent as
                      </p>
                      <code className="mt-1 block truncate rounded bg-secondary px-1.5 py-1 font-mono text-[10px] text-foreground">
                        {(() => {
                          if (injectKind === "header") {
                            const h =
                              injectHeaderName.trim() || "Authorization"
                            return `${h}: ${injectHeaderPrefix}<token>`
                          }
                          if (injectKind === "query") {
                            return `?${injectQueryParam.trim() || "key"}=<token>`
                          }
                          return `Authorization: Basic base64(${injectBasicUsername.trim() || "user"}:<token>)`
                        })()}
                      </code>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setIsCustomizingInjection(!isCustomizingInjection)
                      }
                      className="an-focus-btn rounded px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    >
                      {isCustomizingInjection ? "Done" : "Customize"}
                    </button>
                  </div>

                  {isCustomizingInjection ? (
                    <div className="border-t border-border px-3 py-3 space-y-3">
                      <div className="inline-flex rounded-md border border-border bg-foreground/[0.04] p-0.5">
                        <button
                          type="button"
                          className={cn(
                            "an-focus-btn rounded px-2.5 py-1 text-[11px] font-medium transition-colors",
                            injectKind === "header"
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                          onClick={() => setInjectKind("header")}
                        >
                          Header
                        </button>
                        <button
                          type="button"
                          className={cn(
                            "an-focus-btn rounded px-2.5 py-1 text-[11px] font-medium transition-colors",
                            injectKind === "query"
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                          onClick={() => setInjectKind("query")}
                        >
                          Query param
                        </button>
                        <button
                          type="button"
                          className={cn(
                            "an-focus-btn rounded px-2.5 py-1 text-[11px] font-medium transition-colors",
                            injectKind === "basic"
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                          onClick={() => setInjectKind("basic")}
                        >
                          Basic auth
                        </button>
                      </div>

                      {injectKind === "header" ? (
                        <div className="grid gap-2 sm:grid-cols-2">
                          <div className="space-y-1">
                            <label className="text-[11px] font-medium text-foreground">
                              Header name
                            </label>
                            <Input
                              value={injectHeaderName}
                              onChange={(e) =>
                                setInjectHeaderName(e.target.value)
                              }
                              placeholder="Authorization"
                              className="font-mono text-[11px]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-medium text-foreground">
                              Prefix (optional)
                            </label>
                            <Input
                              value={injectHeaderPrefix}
                              onChange={(e) =>
                                setInjectHeaderPrefix(e.target.value)
                              }
                              placeholder="Bearer "
                              className="font-mono text-[11px]"
                            />
                          </div>
                        </div>
                      ) : injectKind === "query" ? (
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-foreground">
                            Query parameter name
                          </label>
                          <Input
                            value={injectQueryParam}
                            onChange={(e) =>
                              setInjectQueryParam(e.target.value)
                            }
                            placeholder="key"
                            className="font-mono text-[11px]"
                          />
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-foreground">
                            Username (optional)
                          </label>
                          <Input
                            value={injectBasicUsername}
                            onChange={(e) =>
                              setInjectBasicUsername(e.target.value)
                            }
                            placeholder="api"
                            className="font-mono text-[11px]"
                          />
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>

                {/* Advanced */}
                <FieldAccordion
                  label="Advanced"
                  optional
                  infoTooltip="Workspace metadata and OAuth RFC fields. Most users don't need these."
                >
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-foreground">
                      Metadata
                    </label>
                    <Textarea
                      value={credentialMetadataText}
                      onChange={(e) =>
                        setCredentialMetadataText(e.target.value)
                      }
                      placeholder={'{"external_user_id":"usr_123"}'}
                      rows={3}
                      className="font-mono text-[11px]"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Returned in clear text. Use auth fields for secrets.
                    </p>
                  </div>

                  {authType === "oauth" ? (
                    <div className="space-y-2 pt-2 border-t border-border">
                      <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        OAuth (RFC)
                      </div>
                      <div className="grid gap-2 md:grid-cols-2">
                        <Input
                          value={oauthTokenType}
                          onChange={(e) =>
                            setOauthTokenType(e.target.value)
                          }
                          placeholder="Token type (Bearer)"
                        />
                        <Input
                          value={oauthExpiresAt}
                          onChange={(e) =>
                            setOauthExpiresAt(e.target.value)
                          }
                          placeholder="Expires at (ISO timestamp)"
                        />
                      </div>
                      <Input
                        value={oauthScope}
                        onChange={(e) => setOauthScope(e.target.value)}
                        placeholder="Scope (space-separated)"
                      />
                      <Input
                        value={oauthResource}
                        onChange={(e) => setOauthResource(e.target.value)}
                        placeholder="Resource (RFC 8707)"
                      />
                    </div>
                  ) : null}
                </FieldAccordion>
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div
            className="bg-muted/50 px-5 py-3 flex justify-between"
            style={{
              boxShadow:
                "inset 0 1px 0 0 var(--border), inset 0 2px 0 0 var(--background)",
            }}
          >
            <button
              type="button"
              onClick={() => {
                if (credentialStep === 1) {
                  setIsCreateCredentialOpen(false)
                  resetCredentialForm()
                } else {
                  setCredentialStep(
                    (credentialStep - 1) as 1 | 2 | 3,
                  )
                }
              }}
              disabled={createCredentialMutation.isPending}
              className="an-focus-btn h-8 px-3 rounded-lg text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors disabled:opacity-50"
            >
              {credentialStep === 1 ? "Cancel" : "Back"}
            </button>

            {credentialStep < 3 ? (
              <button
                type="button"
                onClick={() => {
                  setCredentialStep(
                    (credentialStep + 1) as 1 | 2 | 3,
                  )
                }}
                disabled={
                  credentialStep === 1
                    ? !serverUrl.trim()
                    : authType === "bearer"
                      ? !bearerToken.trim()
                      : !oauthAccessToken.trim() &&
                        (!oauthClientId.trim() ||
                          !oauthClientSecret.trim())
                }
                className="an-focus-btn h-8 min-w-[92px] px-3 rounded-lg bg-foreground text-background text-[12px] font-medium hover:bg-foreground/90 transition-colors disabled:opacity-40"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                disabled={
                  !teamId ||
                  !selectedVaultId ||
                  !serverUrl.trim() ||
                  (injectKind === "query" && !injectQueryParam.trim()) ||
                  createCredentialMutation.isPending
                }
                onClick={() => {
                  if (!teamId || !selectedVaultId) return

                  try {
                    const inject =
                      injectKind === "header"
                        ? {
                            kind: "header" as const,
                            header:
                              injectHeaderName.trim() || "Authorization",
                            ...(injectHeaderPrefix
                              ? { prefix: injectHeaderPrefix }
                              : {}),
                          }
                        : injectKind === "query"
                          ? {
                              kind: "query" as const,
                              param: injectQueryParam.trim(),
                            }
                          : {
                              kind: "basic" as const,
                              ...(injectBasicUsername.trim()
                                ? { username: injectBasicUsername.trim() }
                                : {}),
                            }

                    createCredentialMutation.mutate({
                      teamId,
                      vaultId: selectedVaultId,
                      name: credentialName || null,
                      serverUrl,
                      inject,
                      metadata: parseMetadataText(credentialMetadataText),
                      auth:
                        authType === "bearer"
                          ? { type: "bearer", token: bearerToken }
                          : {
                              type: "oauth",
                              accessToken: oauthAccessToken || undefined,
                              refreshToken:
                                oauthRefreshToken || undefined,
                              clientId: oauthClientId || undefined,
                              clientSecret: oauthClientSecret || undefined,
                              tokenEndpoint:
                                oauthTokenEndpoint || undefined,
                              tokenEndpointAuth: oauthTokenEndpoint
                                ? oauthTokenEndpointAuth
                                : undefined,
                              tokenType: oauthTokenType || undefined,
                              expiresAt: oauthExpiresAt || undefined,
                              scope: oauthScope || undefined,
                              resource: oauthResource || undefined,
                            },
                    })
                  } catch (error) {
                    toast.error(
                      error instanceof Error
                        ? error.message
                        : String(error),
                    )
                  }
                }}
                className="an-focus-btn relative h-8 min-w-[112px] px-3 rounded-lg bg-foreground text-background text-[12px] font-medium hover:bg-foreground/90 transition-colors disabled:opacity-40 overflow-hidden"
              >
                <span
                  className={
                    createCredentialMutation.isPending ? "opacity-0" : ""
                  }
                >
                  {selectedSuggestion
                    ? `Connect to ${selectedSuggestion.name}`
                    : "Add credential"}
                </span>
                <AnimatePresence>
                  {createCredentialMutation.isPending ? (
                    <motion.span
                      initial={{ y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -12, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Spinner size={14} color="currentColor" />
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
