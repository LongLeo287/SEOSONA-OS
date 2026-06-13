"use client"

import { AnLogoSpinner } from "@/components/features/agents/an/dashboard/an-logo-spinner"
import { DashedBox } from "@/components/features/agents/landing/dashed-divider"
import { useChat, type Chat } from "@ai-sdk/react"
import { AnAgentChat, createAnChat } from "@21st-sdk/react"
import "@21st-sdk/react/styles.css"
import type { UIMessage } from "ai"
import { ArrowUpRight, Loader2, Plus, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

/* ── Types ── */

type ThreadMeta = {
  sandboxId: string
  threadId: string
  name: string
  createdAt: number
}

type MutableChatSession = {
  id: string
  transport: { body?: Record<string, string> }
}

/* ── Constants ── */

const AGENT_SLUG = "an-showcase-agent"
const TOKEN_URL = "/api/an/docs-token"
const SESSION_URL = "/api/an/docs-session"
const LS_THREADS_KEY = "an_showcase_threads-v2"
const LS_ACTIVE_KEY = "an_showcase_active_thread-v2"
const PENDING_THREAD_PREFIX = "pending-"

function messagesKey(t: ThreadMeta) {
  return `an_showcase_msgs-v2_${t.sandboxId}:${t.threadId}`
}

function createPendingThread(): ThreadMeta {
  return {
    sandboxId: "",
    threadId: `${PENDING_THREAD_PREFIX}${crypto.randomUUID()}`,
    name: "New Chat",
    createdAt: Date.now(),
  }
}

/* ── localStorage helpers ── */

function loadThreads(): ThreadMeta[] {
  try {
    const raw = localStorage.getItem(LS_THREADS_KEY)
    if (raw) return JSON.parse(raw) as ThreadMeta[]
  } catch {}
  return []
}

function saveThreads(threads: ThreadMeta[]) {
  try { localStorage.setItem(LS_THREADS_KEY, JSON.stringify(threads)) } catch {}
}

function loadActiveThreadId(): string | null {
  try { return localStorage.getItem(LS_ACTIVE_KEY) } catch { return null }
}

function saveActiveThreadId(id: string | null) {
  try {
    if (id) localStorage.setItem(LS_ACTIVE_KEY, id)
    else localStorage.removeItem(LS_ACTIVE_KEY)
  } catch {}
}

/* ── ChatPanel ── */

function ChatPanel({
  thread,
  onRename,
  onSessionCreated,
}: {
  thread: ThreadMeta
  onRename?: (threadId: string, name: string) => void
  onSessionCreated?: (pendingId: string, real: ThreadMeta) => void
}) {
  const didAutoNameRef = useRef(false)
  const [isCreatingSession, setIsCreatingSession] = useState(false)
  const [sessionCreateError, setSessionCreateError] = useState<Error | null>(null)
  const chatRef = useRef<Chat<UIMessage> | null>(null)

  if (!chatRef.current) {
    chatRef.current = createAnChat({
      agent: AGENT_SLUG,
      tokenUrl: TOKEN_URL,
      ...(thread.sandboxId
        ? {
            sandboxId: thread.sandboxId,
            threadId: thread.threadId,
          }
        : {}),
    }) as unknown as Chat<UIMessage>
  }

  const { messages, sendMessage, status, stop, error, setMessages } = useChat({
    chat: chatRef.current,
  })

  const hasSession = Boolean(thread.sandboxId) && !thread.threadId.startsWith(PENDING_THREAD_PREFIX)

  const handleSend = useCallback(async (msg: { content: string }) => {
    if (hasSession) {
      setSessionCreateError(null)
      sendMessage({ text: msg.content })
      return
    }

    if (isCreatingSession) return

    const optimisticId = crypto.randomUUID()
    setSessionCreateError(null)
    setMessages((prev) => [
      ...prev,
      {
        id: optimisticId,
        role: "user",
        parts: [{ type: "text", text: msg.content }],
      } as UIMessage,
    ])
    setIsCreatingSession(true)

    try {
      const res = await fetch(SESSION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent: AGENT_SLUG }),
      })
      if (!res.ok) throw new Error(`Failed to create session: ${res.status}`)

      const data = await res.json()
      if (!data.sandboxId || !data.threadId) throw new Error("Missing sandboxId/threadId")

      const chat = chatRef.current as unknown as MutableChatSession
      chat.id = data.sandboxId
      chat.transport.body = {
        sandboxId: data.sandboxId,
        threadId: data.threadId,
      }

      onSessionCreated?.(thread.threadId, {
        sandboxId: data.sandboxId,
        threadId: data.threadId,
        name: thread.name,
        createdAt: thread.createdAt,
      })

      void sendMessage({ text: msg.content, messageId: optimisticId })
      setIsCreatingSession(false)
    } catch (err) {
      console.error("[showcase] Session creation failed:", err)
      setSessionCreateError(err instanceof Error ? err : new Error("Failed to create session"))
      setIsCreatingSession(false)
    }
  }, [thread, sendMessage, setMessages, isCreatingSession, onSessionCreated, hasSession])

  // Hydrate messages from localStorage on mount
  const didHydrateRef = useRef(false)
  const lsKey = messagesKey(thread)
  useEffect(() => {
    if (didHydrateRef.current) return
    didHydrateRef.current = true
    if (messages.length > 0) return
    try {
      const stored = localStorage.getItem(lsKey)
      if (stored) {
        const parsed = JSON.parse(stored) as UIMessage[]
        if (parsed.length > 0) setMessages(parsed)
      }
    } catch {}
  }, [messages.length, setMessages, lsKey])

  // Persist messages to localStorage on change
  useEffect(() => {
    if (messages.length === 0) return
    try { localStorage.setItem(lsKey, JSON.stringify(messages)) } catch {}
  }, [messages, lsKey])

  // Auto-name thread from first user message
  useEffect(() => {
    if (didAutoNameRef.current || !onRename) return
    const firstUser = messages.find((m) => m.role === "user")
    if (!firstUser) return
    const text = firstUser.parts.find((p) => p.type === "text")
    if (!text || text.type !== "text") return
    didAutoNameRef.current = true
    const name = text.text.slice(0, 40) + (text.text.length > 40 ? "..." : "")
    onRename(thread.threadId, name)
  }, [messages, onRename, thread.threadId])

  const containerRef = useRef<HTMLDivElement>(null)
  const didPrefillRef = useRef(false)

  useEffect(() => {
    if (didPrefillRef.current || messages.length > 0) return
    const timer = setTimeout(() => {
      const textarea = containerRef.current?.querySelector("textarea")
      if (textarea && !didPrefillRef.current) {
        didPrefillRef.current = true
        const nativeSet = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set
        nativeSet?.call(textarea, "Hey, how are you?")
        textarea.dispatchEvent(new Event("input", { bubbles: true }))
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [messages.length])

  return (
    <div ref={containerRef} className="h-[520px] flex flex-col">
      <div className="flex-1 overflow-hidden">
        <AnAgentChat
          messages={messages}
          onSend={handleSend}
          status={isCreatingSession ? "submitted" : status}
          onStop={stop}
          error={sessionCreateError ?? error ?? undefined}
          colorMode="dark"
          className="h-full"
        />
      </div>
    </div>
  )
}

/* ── ThreadSidebar ── */

function ThreadSidebar({
  threads,
  activeThreadId,
  onSelect,
  onCreateNew,
  onDelete,
  onRename,
  isCreating,
}: {
  threads: ThreadMeta[]
  activeThreadId: string | null
  onSelect: (threadId: string) => void
  onCreateNew: () => void
  onDelete: (threadId: string) => void
  onRename: (threadId: string, name: string) => void
  isCreating: boolean
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const editInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingId) editInputRef.current?.focus()
  }, [editingId])

  function commitRename() {
    if (editingId && editValue.trim()) {
      onRename(editingId, editValue.trim())
    }
    setEditingId(null)
  }

  return (
    <div className="hidden sm:flex w-[200px] border-r border-foreground/[0.06] flex-col h-[520px]">
      {/* New chat button */}
      <button
        type="button"
        onClick={onCreateNew}
        disabled={isCreating}
        className="flex items-center gap-2 px-3 py-2.5 text-sm text-foreground/50 hover:text-foreground/70 transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-b border-foreground/[0.06]"
      >
        {isCreating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
        New chat
      </button>

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto py-1">
        {threads.map((t) => {
          const isActive = t.threadId === activeThreadId
          const isEditing = editingId === t.threadId
          return (
            <div
              key={t.threadId}
              onClick={() => !isEditing && onSelect(t.threadId)}
              onDoubleClick={() => {
                setEditingId(t.threadId)
                setEditValue(t.name)
              }}
              className={`group flex items-center gap-2 px-3 py-2 mx-1 rounded-md cursor-pointer transition-colors ${
                isActive
                  ? "bg-foreground/[0.06] text-foreground"
                  : "text-foreground/50 hover:bg-foreground/[0.04]"
              }`}
            >
              {isEditing ? (
                <input
                  ref={editInputRef}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitRename()
                    if (e.key === "Escape") setEditingId(null)
                  }}
                  className="flex-1 min-w-0 bg-transparent text-sm outline-none border-b border-foreground/20"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="flex-1 truncate text-sm">{t.name || "New Chat"}</span>
              )}
              {threads.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(t.threadId)
                  }}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-foreground/30 hover:text-foreground/60 transition-opacity"
                  aria-label="Delete thread"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Main export ── */

export function AnShowcase() {
  const [threads, setThreads] = useState<ThreadMeta[]>([])
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const initRef = useRef(false)

  const addThread = useCallback((thread: ThreadMeta, currentThreads: ThreadMeta[]) => {
    const named = { ...thread, name: "New Chat" }
    const updated = [named, ...currentThreads]
    setThreads(updated)
    setActiveThreadId(named.threadId)
    saveThreads(updated)
    saveActiveThreadId(named.threadId)
    return updated
  }, [])

  const handleCreateNew = useCallback(() => {
    addThread(createPendingThread(), threads)
  }, [addThread, threads])

  const handleSessionCreated = useCallback((pendingId: string, real: ThreadMeta) => {
    setThreads((prev) => {
      const updated = prev.map((t) => t.threadId === pendingId ? { ...real, name: t.name } : t)
      saveThreads(updated)
      return updated
    })

    if (activeThreadId === pendingId) {
      setActiveThreadId(real.threadId)
      saveActiveThreadId(real.threadId)
    }
  }, [activeThreadId])

  const handleRename = useCallback((threadId: string, name: string) => {
    setThreads((prev) => {
      const updated = prev.map((t) => t.threadId === threadId ? { ...t, name } : t)
      saveThreads(updated)
      return updated
    })
  }, [])

  const handleSelect = useCallback((threadId: string) => {
    setActiveThreadId(threadId)
    saveActiveThreadId(threadId)
  }, [])

  const handleDelete = useCallback((threadId: string) => {
    setThreads((prev) => {
      const thread = prev.find((t) => t.threadId === threadId)
      if (thread) {
        try { localStorage.removeItem(messagesKey(thread)) } catch {}
      }

      const updated = prev.filter((t) => t.threadId !== threadId)
      saveThreads(updated)

      if (threadId === activeThreadId) {
        const next = updated[0]?.threadId ?? null
        setActiveThreadId(next)
        saveActiveThreadId(next)
      }

      return updated
    })
  }, [activeThreadId])

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    const stored = loadThreads()
    if (stored.length > 0) {
      setThreads(stored)
      const savedActive = loadActiveThreadId()
      const active = stored.find((t) => t.threadId === savedActive) ? savedActive : stored[0]!.threadId
      setActiveThreadId(active)
      saveActiveThreadId(active)
      return
    }

    const pending = createPendingThread()
    setThreads([pending])
    setActiveThreadId(pending.threadId)
    saveThreads([pending])
    saveActiveThreadId(pending.threadId)
  }, [])

  return (
    <section className="px-4 sm:px-8 py-10 sm:py-14">
      <div className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.15em] text-foreground/40 mb-3">
          Interactive demo
        </p>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[clamp(1.1rem,2.5vw,1.35rem)] font-semibold leading-[1.2] tracking-normal text-foreground">
            Talk to Claude Code powered by 21st Agents SDK.
          </h2>
          <a
            href="/agents/docs/get-started"
            className="hidden sm:inline-flex items-center gap-2 shrink-0 rounded-[10px] h-9 px-4 text-[13px] font-medium bg-foreground text-background hover:bg-foreground/90 shadow-[0_0_0_0.5px_hsl(var(--foreground)/0.5),inset_0_0_0_1px_hsl(var(--foreground)/0.14)] active:scale-[0.99] transition-all duration-150"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Copy integration prompt
          </a>
        </div>
      </div>

      <DashedBox className="overflow-hidden">
        {threads.length === 0 ? (
          <div className="flex items-center justify-center h-[520px]">
            <AnLogoSpinner className="size-6" />
          </div>
        ) : (
          <div className="flex h-[520px] border border-foreground/[0.06]">
            <ThreadSidebar
              threads={threads}
              activeThreadId={activeThreadId}
              onSelect={handleSelect}
              onCreateNew={() => void handleCreateNew()}
              onDelete={handleDelete}
              onRename={handleRename}
              isCreating={false}
            />
            <div className="flex-1 overflow-hidden relative">
              {threads.map((t) => (
                <div
                  key={t.createdAt}
                  className={t.threadId === activeThreadId ? "h-full" : "h-full absolute inset-0 invisible pointer-events-none"}
                >
                  <ChatPanel thread={t} onRename={handleRename} onSessionCreated={handleSessionCreated} />
                </div>
              ))}
            </div>
          </div>
        )}
      </DashedBox>
    </section>
  )
}
