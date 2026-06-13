"use client"

import { ResizableSidebar } from "@/components/features/agents/ui/canvas/[id]/{components}/resizable-sidebar"
import {
  ClaudeCodeIcon,
  IconDoubleChevronRight,
} from "@/components/features/agents/ui/canvas/[id]/{components}/ui/icons"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/features/agents/ui/canvas/[id]/{components}/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { useChat, type Chat } from "@ai-sdk/react"
import { AnAgentChat, createAnChat } from "@21st-sdk/react"
import "@21st-sdk/react/styles.css"
import type { UIMessage } from "ai"
import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { RefreshCw } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

const CLOSE_BTN =
  "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-foreground transition-[background-color,transform] duration-150 ease-out hover:bg-foreground/10 active:scale-[0.97]"

const AGENT_SLUG = "an-docs-agent"
const TOKEN_URL = "/api/an/docs-token"
const SESSION_URL = "/api/an/docs-session"

export const docsAgentSidebarWidthAtom = atomWithStorage<number>(
  "docs-agent-sidebar-width",
  380,
  undefined,
  { getOnInit: true },
)

type DocsAgentSession = {
  sandboxId: string | null
  threadId: string | null
}

const docsAgentSessionAtom = atomWithStorage<DocsAgentSession>(
  "docs-agent-session",
  { sandboxId: null, threadId: null },
  undefined,
  { getOnInit: true },
)

const docsAgentMessagesAtom = atomWithStorage<Record<string, UIMessage[]>>(
  "docs-agent-messages",
  {},
  undefined,
  { getOnInit: true },
)

export const docsAgentSidebarOpenAtom = atomWithStorage<boolean>(
  "docs-agent-sidebar-open",
  false,
  undefined,
  { getOnInit: true },
)

export function DocsAgentSidebar() {
  const [isOpen, setIsOpen] = useAtom(docsAgentSidebarOpenAtom)
  const [session, setSession] = useAtom(docsAgentSessionAtom)
  const [, setStoredMessagesByThread] = useAtom(docsAgentMessagesAtom)
  const isMobile = useIsMobile()
  const [isPreparingSession, setIsPreparingSession] = useState(false)
  const sessionRequestRef = useRef<Promise<void> | null>(null)

  const ensureSession = useCallback(
    async (forceNew: boolean) => {
      if (!forceNew && session.sandboxId && session.threadId) return
      if (sessionRequestRef.current) {
        await sessionRequestRef.current
        return
      }

      const req = (async () => {
        setIsPreparingSession(true)
        try {
          const res = await fetch(SESSION_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          })

          if (!res.ok) {
            throw new Error(`Failed to create docs session: ${res.status}`)
          }

          const data = (await res.json()) as {
            sandboxId?: string
            threadId?: string
          }
          if (!data.sandboxId || !data.threadId) {
            throw new Error("Docs session response is missing sandboxId/threadId")
          }

          setSession({ sandboxId: data.sandboxId, threadId: data.threadId })
        } catch (error) {
          console.error("[docs-agent] failed to create session", error)
        } finally {
          setIsPreparingSession(false)
          sessionRequestRef.current = null
        }
      })()

      sessionRequestRef.current = req
      await req
    },
    [session.sandboxId, session.threadId, setSession],
  )

  useEffect(() => {
    if (!isOpen) return
    void ensureSession(false)
  }, [isOpen, ensureSession])

  const handleResetChat = useCallback(async () => {
    const storageKey =
      session.sandboxId && session.threadId
        ? `${session.sandboxId}:${session.threadId}`
        : null

    // Unmount current chat immediately so in-memory messages are reset as well.
    setSession({ sandboxId: null, threadId: null })

    if (storageKey) {
      setStoredMessagesByThread((prev) => {
        if (!(storageKey in prev)) return prev
        const next = { ...prev }
        delete next[storageKey]
        return next
      })
    }

    await ensureSession(true)
  }, [
    ensureSession,
    session.sandboxId,
    session.threadId,
    setSession,
    setStoredMessagesByThread,
  ])

  const panelHeader = (
    <div className="flex h-10 flex-shrink-0 items-center gap-2 border-b border-border/50 px-2">
      <button
        type="button"
        onClick={() => setIsOpen(false)}
        className={CLOSE_BTN}
        aria-label="Close sidebar"
      >
        <IconDoubleChevronRight className="h-4 w-4" />
      </button>
      <span className="text-sm text-muted-foreground">Ask about docs</span>
      <button
        type="button"
        onClick={() => void handleResetChat()}
        className={cn(
          "ml-auto flex h-7 w-7 items-center justify-center rounded-md",
          "text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground",
          "disabled:cursor-not-allowed disabled:opacity-60",
        )}
        disabled={isPreparingSession}
        aria-label="Reset chat"
        title="Reset chat"
      >
        <RefreshCw
          className={cn("h-4 w-4", isPreparingSession && "animate-spin")}
        />
      </button>
    </div>
  )

  if (isMobile) {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 z-[60] flex flex-col bg-background md:hidden">
        {panelHeader}
        <div className="min-h-0 flex-1 overflow-hidden pb-[env(safe-area-inset-bottom)]">
          <DocsAgentChatInner
            sandboxId={session.sandboxId}
            threadId={session.threadId}
            isPreparingSession={isPreparingSession}
          />
        </div>
        <div className="flex-shrink-0 px-3 pt-0 pb-2 text-center text-[11px] text-muted-foreground/40">
          powered by 21st
        </div>
      </div>
    )
  }

  return (
    <ResizableSidebar
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      widthAtom={docsAgentSidebarWidthAtom}
      minWidth={320}
      maxWidth={500}
      side="right"
      animationDuration={0.2}
      initialWidth={0}
      exitWidth={0}
      showResizeTooltip={true}
      className="hidden md:flex bg-background border-l"
      style={{ borderLeftWidth: "0.5px", overflow: "hidden" }}
    >
      <div className="flex h-full min-w-0 flex-col overflow-hidden">
        {panelHeader}

        <div className="min-h-0 flex-1 overflow-hidden">
          {isOpen && (
            <DocsAgentChatInner
              sandboxId={session.sandboxId}
              threadId={session.threadId}
              isPreparingSession={isPreparingSession}
            />
          )}
        </div>
        <div className="flex-shrink-0 px-3 pt-0 pb-2 text-center text-[11px] text-muted-foreground/40">
          powered by 21st
        </div>
      </div>
    </ResizableSidebar>
  )
}

export function DocsAgentTrigger() {
  const [isOpen, setIsOpen] = useAtom(docsAgentSidebarOpenAtom)

  if (isOpen) return null

  return (
    <>
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className={cn(
                "fixed right-5 top-5 z-50 hidden h-10 w-10 items-center justify-center md:flex",
                "rounded-full border border-border bg-background/95",
                "text-[13px] font-medium text-foreground shadow-sm backdrop-blur-sm",
                "cursor-pointer hover:bg-accent/50",
              )}
              aria-label="Open Claude Code assistant"
            >
              <ClaudeCodeIcon className="h-5 w-5 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="end">
            Ask Claude Code
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed right-4 bottom-4 z-50 flex h-11 w-11 items-center justify-center md:hidden",
          "rounded-full border border-border bg-background/95",
          "text-[13px] font-medium text-foreground shadow-sm backdrop-blur-sm",
          "cursor-pointer hover:bg-accent/50",
        )}
        aria-label="Open Claude Code assistant"
      >
        <ClaudeCodeIcon className="h-5 w-5 text-muted-foreground" />
      </button>
    </>
  )
}

function DocsAgentChatInner(props: {
  sandboxId: string | null
  threadId: string | null
  isPreparingSession: boolean
}) {
  const { sandboxId, threadId, isPreparingSession } = props

  if (!sandboxId || !threadId) {
    return (
      <div className="flex h-full items-center justify-center px-4 text-sm text-muted-foreground">
        {isPreparingSession ? "Preparing chat..." : "Open chat to start"}
      </div>
    )
  }

  return (
    <DocsAgentChatSession
      key={`${sandboxId}:${threadId}`}
      sandboxId={sandboxId}
      threadId={threadId}
    />
  )
}

function DocsAgentChatSession(props: { sandboxId: string; threadId: string }) {
  const { sandboxId, threadId } = props
  const storageKey = `${sandboxId}:${threadId}`
  const [storedMessagesByThread, setStoredMessagesByThread] = useAtom(
    docsAgentMessagesAtom,
  )
  const chat = useMemo<Chat<UIMessage>>(
    () =>
      createAnChat({
        agent: AGENT_SLUG,
        tokenUrl: TOKEN_URL,
        sandboxId,
        threadId,
      }) as unknown as Chat<UIMessage>,
    [sandboxId, threadId],
  )

  const { messages, sendMessage, status, stop, error, setMessages } = useChat({
    chat,
  })
  const didHydrateMessagesRef = useRef(false)
  const storedMessages = storedMessagesByThread[storageKey] ?? []

  useEffect(() => {
    if (didHydrateMessagesRef.current) return
    didHydrateMessagesRef.current = true
    if (messages.length > 0 || storedMessages.length === 0) return
    setMessages(storedMessages)
  }, [messages.length, setMessages, storedMessages])

  useEffect(() => {
    if (messages.length === 0 && storedMessages.length > 0) return
    setStoredMessagesByThread((prev) => ({
      ...prev,
      [storageKey]: messages,
    }))
  }, [messages, setStoredMessagesByThread, storageKey, storedMessages.length])

  const onSend = useCallback(
    (message: { role: "user"; content: string }) => {
      sendMessage({
        role: "user",
        parts: [{ type: "text", text: message.content }],
      })
    },
    [sendMessage],
  )

  return (
    <AnAgentChat
      messages={messages}
      onSend={onSend}
      status={status}
      onStop={() => stop()}
      error={error ?? undefined}
      className="h-full docs-agent-chat"
      style={{ "--an-background": "transparent" } as React.CSSProperties}
    />
  )
}
