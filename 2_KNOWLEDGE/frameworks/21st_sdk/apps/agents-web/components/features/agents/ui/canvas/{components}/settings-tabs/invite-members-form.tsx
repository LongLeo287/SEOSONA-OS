"use client"

import { useState, useRef, useEffect } from "react"
import { Button as CustomButton } from "@/components/ui/button"
import { IS_STANDALONE_APP } from "@/lib/agents/auth/config"
import {
  IconSpinner,
  LinkIcon,
  CheckIcon,
  PlusIcon,
} from "../../[id]/{components}/ui/icons"
import { X } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/trpc/client"
import { buildInviteUrl } from "@/lib/utils/invite"
import { isValidEmail } from "@/lib/utils/validation"

interface InviteRow {
  id: string
  email: string
}

interface InviteMembersFormProps {
  teamId: string
  inviteLink?: string
  onInvitesSent?: () => void
  autoFocus?: boolean
  showBorder?: boolean
  showSkip?: boolean
  inviteSource?: "canvas" | "agents"
}

export function InviteMembersForm({
  teamId,
  inviteLink: externalInviteLink,
  onInvitesSent,
  autoFocus = true,
  showBorder = true,
  showSkip = true,
  inviteSource,
}: InviteMembersFormProps) {
  const [copied, setCopied] = useState(false)
  const [isSendingInvites, setIsSendingInvites] = useState(false)
  const [inviteRows, setInviteRows] = useState<InviteRow[]>([
    { id: "1", email: "" },
  ])
  const [newRowId, setNewRowId] = useState<string | null>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map())

  // Get or create invite link if not provided externally
  const { data: inviteLinkData } = api.teams.getOrCreateInviteLink.useQuery(
    { teamId },
    { enabled: !!teamId && !externalInviteLink },
  )

  const sendInviteEmail = api.teams.sendInviteEmail.useMutation()

  const inviteLink =
    externalInviteLink ||
    (inviteLinkData?.token
      ? buildInviteUrl(
          inviteLinkData.token,
          typeof window !== "undefined" ? window.location.origin : undefined,
          false,
          inviteSource,
        )
      : "")
  const showEmailInviteForm = !IS_STANDALONE_APP

  // Auto-focus email input on mount
  useEffect(() => {
    if (autoFocus && emailInputRef.current) {
      const timer = setTimeout(() => {
        emailInputRef.current?.focus()
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [autoFocus])

  // Focus on newly added row
  useEffect(() => {
    if (newRowId) {
      const timer = setTimeout(() => {
        const input = inputRefs.current.get(newRowId)
        input?.focus()
        setNewRowId(null)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [newRowId])

  const copyInviteLink = async () => {
    if (!inviteLink) return
    await navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const addInviteRow = () => {
    const newId = Date.now().toString()
    setInviteRows((prev) => [...prev, { id: newId, email: "" }])
    setNewRowId(newId)
  }

  const updateInviteRow = (id: string, email: string) => {
    setInviteRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, email } : row)),
    )
  }

  const removeInviteRow = (id: string) => {
    if (inviteRows.length > 1) {
      setInviteRows((prev) => prev.filter((row) => row.id !== id))
    }
  }

  const handleSendInvites = async () => {
    if (!teamId) return

    const validEmails = inviteRows
      .filter((row) => isValidEmail(row.email))
      .map((row) => row.email)

    if (validEmails.length === 0) {
      toast.error("Please enter at least one valid email")
      return
    }

    setIsSendingInvites(true)

    let successCount = 0
    let failCount = 0

    for (const email of validEmails) {
      try {
        await sendInviteEmail.mutateAsync({
          teamId,
          email,
          source: inviteSource,
        })
        successCount++
      } catch {
        failCount++
      }
    }

    setIsSendingInvites(false)

    if (successCount > 0) {
      setInviteRows([{ id: "1", email: "" }])
      onInvitesSent?.()
    } else {
      toast.error("Failed to send invitations")
    }
  }

  const hasValidEmailToSend = inviteRows.some((row) => isValidEmail(row.email))

  return (
    <div
      className={
        showBorder
          ? "bg-background rounded-lg border border-border overflow-hidden"
          : ""
      }
    >
      {showEmailInviteForm && (
        <div className={showBorder ? "p-4 space-y-3" : "space-y-3"}>
          {inviteRows.map((row, index) => (
            <div key={row.id} className="space-y-1.5">
              {index === 0 && (
                <label className="text-xs text-muted-foreground">
                  Email Address
                </label>
              )}
              <div className="relative">
                <input
                  ref={(el) => {
                    if (index === 0) {
                      emailInputRef.current = el
                    }
                    if (el) {
                      inputRefs.current.set(row.id, el)
                    } else {
                      inputRefs.current.delete(row.id)
                    }
                  }}
                  type="email"
                  placeholder="jane@example.com"
                  value={row.email}
                  onChange={(e) => updateInviteRow(row.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      hasValidEmailToSend &&
                      !isSendingInvites
                    ) {
                      e.preventDefault()
                      handleSendInvites()
                    }
                  }}
                  className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
                {inviteRows.length > 1 && (
                  <button
                    onClick={() => removeInviteRow(row.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}

          <CustomButton
            variant="outline"
            size="sm"
            onClick={addInviteRow}
            className="gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Add Member
          </CustomButton>
        </div>
      )}

      {/* Footer */}
      <div
        className={
          showBorder
            ? `bg-muted p-3 flex items-center ${showEmailInviteForm ? "justify-between border-t rounded-b-lg" : "justify-start rounded-lg"}`
            : `bg-muted ${showEmailInviteForm ? "mt-5 -mx-5 -mb-5 border-t border-border rounded-b-xl justify-between" : "rounded-xl justify-start"} p-4 flex items-center`
        }
      >
        <CustomButton
          variant="outline"
          onClick={copyInviteLink}
          disabled={!inviteLink}
          className="gap-2"
        >
          {copied ? (
            <CheckIcon className="w-4 h-4" />
          ) : (
            <LinkIcon className="w-4 h-4" />
          )}
          Invite Link
        </CustomButton>
        {showEmailInviteForm &&
          (hasValidEmailToSend ? (
            <CustomButton
              onClick={handleSendInvites}
              disabled={isSendingInvites}
              className="relative transition-all duration-200"
            >
              <div className="flex items-center justify-center gap-2">
                {isSendingInvites && (
                  <IconSpinner className="h-4 w-4 text-current" />
                )}
                Invite
              </div>
            </CustomButton>
          ) : showSkip ? (
            <CustomButton
              variant="ghost"
              onClick={onInvitesSent}
              className="transition-all duration-200"
            >
              Skip
            </CustomButton>
          ) : (
            <CustomButton
              disabled
              className="relative transition-all duration-200"
            >
              Invite
            </CustomButton>
          ))}
      </div>
    </div>
  )
}
