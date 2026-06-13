"use client"

import { useEffect, useMemo, useRef, useState, useCallback, type DragEvent } from "react"
import { Chat, useChat, type UIMessage } from "ai-latest-react"
import { DefaultChatTransport } from "ai-latest"
import type { VisualConfig } from "@/components/features/agents/an/types"
import { VISUAL_PRESETS } from "@/components/features/agents/an/types"
import { WindowChrome, DateDivider } from "../chat-preview/components"
import { loadGoogleFont } from "../chat-preview/utils/load-google-font"
import { LiveMessageList } from "./live-message-list"
import { LiveInputBar } from "./live-input-bar"
import type { AttachedImage, AttachedFile } from "./live-context-items"

const IMAGE_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".svg",
])

function isImageFile(filename: string): boolean {
  const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase()
  return IMAGE_EXTENSIONS.has(ext)
}

let nextAttachId = 0
function makeAttachId() {
  return `attach-${++nextAttachId}-${Date.now()}`
}

const RELAY_URL = process.env.NEXT_PUBLIC_RELAY_URL || "https://relay.an.dev"

const DEFAULT_VC = { ...VISUAL_PRESETS.notion!.config, showToolIcons: false, userMessageBg: "" }

/* ── Token fetcher ── */

async function fetchRelayToken(
  teamId: string,
  agentSlug: string,
): Promise<string> {
  const res = await fetch("/api/agents/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ teamId, agent: agentSlug }),
  })
  if (!res.ok) throw new Error("Failed to get token")
  const data = await res.json()
  return data.token as string
}

/* ── Chat panel ── */

function ChatPanel({
  chat,
  vc,
  attachmentsEnabled,
  allowedModels,
  defaultModelId,
}: {
  chat: Chat<UIMessage>
  vc: VisualConfig
  attachmentsEnabled?: boolean
  allowedModels?: { id: string; name: string; version?: string }[]
  defaultModelId?: string
}) {
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [attachedImages, setAttachedImages] = useState<AttachedImage[]>([])
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const { messages, sendMessage, status, stop } = useChat({ chat })

  const isStreaming = status === "streaming" || status === "submitted"

  // Load Google font when fontFamily changes
  useEffect(() => {
    if (vc.fontFamily) loadGoogleFont(vc.fontFamily)
  }, [vc.fontFamily])

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages])

  const processFiles = useCallback(
    (fileList: FileList | File[]) => {
      const files = Array.from(fileList)
      for (const file of files) {
        const id = makeAttachId()
        if (isImageFile(file.name)) {
          const url = URL.createObjectURL(file)
          setAttachedImages((prev) => [
            ...prev,
            { id, filename: file.name, url, size: file.size },
          ])
        } else {
          setAttachedFiles((prev) => [
            ...prev,
            { id, filename: file.name, size: file.size },
          ])
        }
      }
    },
    [],
  )

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent) => {
    const container = e.currentTarget as HTMLElement
    if (container.contains(e.relatedTarget as Node)) return
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      if (e.dataTransfer?.files?.length) {
        processFiles(e.dataTransfer.files)
      }
    },
    [processFiles],
  )

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        processFiles(e.target.files)
      }
      e.target.value = ""
    },
    [processFiles],
  )

  const handleAttachClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const imageFiles = Array.from(e.clipboardData.items)
        .filter((item) => item.type.startsWith("image/"))
        .map((item) => item.getAsFile())
        .filter(Boolean) as File[]

      if (imageFiles.length > 0) {
        e.preventDefault()
        for (const file of imageFiles) {
          const id = makeAttachId()
          const filename = file.name || `screenshot-${Date.now()}.png`
          const url = URL.createObjectURL(file)
          setAttachedImages((prev) => [
            ...prev,
            { id, filename, url, size: file.size },
          ])
        }
      }
    },
    [],
  )

  const handleRemoveImage = useCallback((id: string) => {
    setAttachedImages((prev) => {
      const item = prev.find((i) => i.id === id)
      if (item) URL.revokeObjectURL(item.url)
      return prev.filter((i) => i.id !== id)
    })
  }, [])

  const handleRemoveFile = useCallback((id: string) => {
    setAttachedFiles((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const handleSend = useCallback(() => {
    const text = input.trim()
    if (!text || isStreaming) return
    setInput("")
    // Clear attachments (visual-only, not sent)
    attachedImages.forEach((img) => URL.revokeObjectURL(img.url))
    setAttachedImages([])
    setAttachedFiles([])
    sendMessage({ role: "user", parts: [{ type: "text", text }] })
  }, [input, isStreaming, sendMessage, attachedImages])

  const previewConfig = useMemo(() => {
    const cfg: Record<string, any> = {}
    if (attachmentsEnabled) cfg.attachmentsEnabled = true
    if (allowedModels?.length) {
      cfg.allowedModels = allowedModels
      cfg.activeModelId = defaultModelId
    }
    return Object.keys(cfg).length > 0 ? cfg : undefined
  }, [attachmentsEnabled, allowedModels, defaultModelId])

  const showAttachments = attachmentsEnabled

  return (
    <div
      className="flex flex-col h-full relative"
      style={{ fontFamily: vc.fontFamily || undefined }}
      onDragOver={showAttachments ? handleDragOver : undefined}
      onDragLeave={showAttachments ? handleDragLeave : undefined}
      onDrop={showAttachments ? handleDrop : undefined}
    >
      {vc.showWindowChrome && <WindowChrome />}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto px-4 py-2" style={{ maxWidth: "420px" }}>
          {vc.showDateDivider && messages.length > 0 && <DateDivider />}

          <LiveMessageList
            messages={messages}
            status={status}
            vc={vc}
          />
        </div>
      </div>

      {/* Hidden file input */}
      {showAttachments && (
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileInputChange}
        />
      )}

      {/* Input bar */}
      <LiveInputBar
        value={input}
        onChange={setInput}
        onSend={handleSend}
        onStop={() => stop()}
        isStreaming={isStreaming}
        vc={vc}
        previewConfig={previewConfig}
        attachedImages={attachedImages}
        attachedFiles={attachedFiles}
        onRemoveImage={handleRemoveImage}
        onRemoveFile={handleRemoveFile}
        onAttachClick={showAttachments ? handleAttachClick : undefined}
        onPaste={showAttachments ? handlePaste : undefined}
        isDragOver={isDragOver}
      />
    </div>
  )
}

/* ── Main exported component ── */

export function LiveChat({
  teamId,
  agentSlug,
  sandboxId: sandboxIdProp,
  visualConfig,
  attachmentsEnabled,
  allowedModels,
  defaultModelId,
}: {
  teamId: string
  agentSlug: string
  sandboxId?: string
  visualConfig?: VisualConfig | null
  attachmentsEnabled?: boolean
  allowedModels?: { id: string; name: string; version?: string }[]
  defaultModelId?: string
}) {
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const vc = visualConfig ?? DEFAULT_VC

  useEffect(() => {
    setLoading(true)
    setError(null)
    setToken(null)
    fetchRelayToken(teamId, agentSlug)
      .then(setToken)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [teamId, agentSlug])

  const sandboxId = useMemo(
    () => sandboxIdProp ?? `dashboard-${agentSlug}-${Date.now()}`,
    [sandboxIdProp, agentSlug],
  )

  const chat = useMemo(() => {
    if (!token) return null
    return new Chat({
      id: sandboxId,
      transport: new DefaultChatTransport({
        api: `${RELAY_URL}/v1/chat/${agentSlug}`,
        headers: { Authorization: `Bearer ${token}` },
        body: { sandboxId },
      }),
    })
  }, [token, agentSlug, sandboxId])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-4">
        <p className="text-[13px] text-destructive">Failed to connect</p>
        <p className="text-[12px] text-muted-foreground">{error}</p>
        <button
          onClick={() => {
            setLoading(true)
            setError(null)
            fetchRelayToken(teamId, agentSlug)
              .then(setToken)
              .catch((err) => setError(err.message))
              .finally(() => setLoading(false))
          }}
          className="mt-2 rounded-lg border border-border px-3 py-1.5 text-[12px] font-medium text-muted-foreground hover:bg-muted transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!chat) return null

  return (
    <ChatPanel
      chat={chat}
      vc={vc}
      attachmentsEnabled={attachmentsEnabled}
      allowedModels={allowedModels}
      defaultModelId={defaultModelId}
    />
  )
}
