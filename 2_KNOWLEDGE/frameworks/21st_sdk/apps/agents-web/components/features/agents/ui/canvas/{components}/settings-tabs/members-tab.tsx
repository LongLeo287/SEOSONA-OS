"use client"

import { api } from "@/trpc/client"
import { useState } from "react"
import {
  IconSpinner,
  MembersIcon,
  SearchIcon,
  TrashIcon,
} from "../../[id]/{components}/ui/icons"
import { MoreVertical, Crown, Mail, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../[id]/{components}/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useAtomValue } from "jotai"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { InviteMembersForm } from "./invite-members-form"

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export function MembersTab({
  inviteSource,
}: {
  inviteSource?: "canvas" | "agents"
}) {
  const teamId = useAtomValue(selectedTeamIdAtom)
  const [searchQuery, setSearchQuery] = useState("")
  const [memberToRemove, setMemberToRemove] = useState<{
    userId: string
    displayName: string
  } | null>(null)
  const [memberToTransfer, setMemberToTransfer] = useState<{
    userId: string
    displayName: string
  } | null>(null)
  const [transferConfirmation, setTransferConfirmation] = useState("")
  const [inviteToRevoke, setInviteToRevoke] = useState<{
    id: string
    email: string
  } | null>(null)

  // Team members
  const { data: membersData, refetch: refetchMembers } =
    api.teams.getTeamMembers.useQuery(
      { teamId: teamId || "" },
      { enabled: !!teamId },
    )

  // Pending invites
  const { data: pendingInvites, refetch: refetchPendingInvites } =
    api.teams.getPendingInvites.useQuery(
      { teamId: teamId || "" },
      { enabled: !!teamId },
    )

  const removeMember = api.teams.removeMember.useMutation({
    onSuccess: () => {
      toast.success("Member removed")
      setMemberToRemove(null)
      refetchMembers()
    },
    onError: (error) => {
      toast.error(error.message)
      setMemberToRemove(null)
    },
  })

  const transferOwnership = api.teams.transferOwnership.useMutation({
    onSuccess: (data) => {
      toast.success(`Ownership transferred to ${data.newOwner.displayName}`)
      setMemberToTransfer(null)
      setTransferConfirmation("")
      refetchMembers()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const revokeInvite = api.teams.revokeInvite.useMutation({
    onSuccess: () => {
      toast.success("Invitation revoked")
      setInviteToRevoke(null)
      refetchPendingInvites()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const resendInvite = api.teams.resendInvite.useMutation({
    onSuccess: () => {
      toast.success("Invitation resent")
      refetchPendingInvites()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleRemoveMember = () => {
    if (!teamId || !memberToRemove) return
    removeMember.mutate({ teamId, memberId: memberToRemove.userId })
  }

  const handleTransferOwnership = () => {
    if (!teamId || !memberToTransfer) return
    transferOwnership.mutate({ teamId, newOwnerId: memberToTransfer.userId })
  }

  const handleRevokeInvite = () => {
    if (!teamId || !inviteToRevoke) return
    revokeInvite.mutate({ teamId, inviteId: inviteToRevoke.id })
  }

  const handleResendInvite = (inviteId: string) => {
    if (!teamId) return
    resendInvite.mutate({ teamId, inviteId, source: inviteSource })
  }

  const handleInvitesSent = () => {
    refetchMembers()
    refetchPendingInvites()
  }

  if (!teamId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No team selected</p>
      </div>
    )
  }

  if (!membersData) {
    return (
      <div className="flex items-center justify-center h-full">
        <IconSpinner className="h-6 w-6" />
      </div>
    )
  }

  // Combine owner and members for display
  const allMembers = [
    ...(membersData.owner
      ? [
          {
            id: "owner",
            user_id: membersData.owner.id,
            email: membersData.owner.email,
            display_name: membersData.owner.display_name,
            image_url: membersData.owner.image_url,
            role: "Owner" as const,
          },
        ]
      : []),
    ...membersData.members.map((m) => ({
      id: m.id,
      user_id: m.user_id,
      email: m.email,
      display_name: m.user?.display_name || null,
      image_url: m.user?.image_url || null,
      role: "Member" as const,
    })),
  ]

  const filteredMembers = allMembers.filter((member) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      member.email.toLowerCase().includes(query) ||
      (member.display_name?.toLowerCase().includes(query) ?? false)
    )
  })

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-6">
        {/* Invite Section - owner only */}
        {teamId && membersData?.isOwner && (
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-3 mb-4">
              <h3 className="text-sm font-medium text-foreground">
                Invite Members
              </h3>
            </div>
            <InviteMembersForm
              teamId={teamId}
              onInvitesSent={handleInvitesSent}
              inviteSource={inviteSource}
              showSkip={false}
            />
          </div>
        )}

        {/* Pending Invitations Section - owner only */}
        {membersData?.isOwner && pendingInvites && pendingInvites.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-3 mb-4">
              <h3 className="text-sm font-medium text-foreground">
                Pending Invitations ({pendingInvites.length})
              </h3>
            </div>

            <div className="bg-background rounded-lg border border-border overflow-hidden">
              <div className="divide-y divide-border">
                {pendingInvites.map((invite) => (
                  <div key={invite.id} className="p-4 flex items-center gap-4">
                    {/* Mail Icon */}
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {invite.email}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Invited by{" "}
                        {invite.inviter.display_name ||
                          invite.inviter.email.split("@")[0]}{" "}
                        · {formatRelativeTime(new Date(invite.last_sent_at))}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <span className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400 px-2 py-0.5 rounded">
                      Pending
                    </span>

                    {/* Actions - dropdown with three dots */}
                    {membersData?.isOwner && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleResendInvite(invite.id)}
                            disabled={resendInvite.isPending}
                          >
                            <RotateCcw className="w-3.5 h-3.5 mr-2" />
                            Resend invite
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              setInviteToRevoke({
                                id: invite.id,
                                email: invite.email,
                              })
                            }
                            className="text-destructive hover:text-destructive focus:text-destructive"
                          >
                            <TrashIcon className="w-3.5 h-3.5 mr-2 text-destructive" />
                            Revoke invite
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Members Section */}
        <div className="space-y-2">
            <div className="flex items-center justify-between pb-3 mb-4">
              <h3 className="text-sm font-medium text-foreground">
                Team Members
              </h3>
            </div>

          {/* Search */}
          <div className="relative mb-4">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-md bg-muted/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Members List */}
          <div className="bg-background rounded-lg border border-border overflow-hidden">
            <div className="divide-y divide-border">
              {filteredMembers.map((member) => (
                <div key={member.id} className="p-4 flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <MembersIcon className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {member.display_name || member.email.split("@")[0]}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {member.email}
                    </p>
                  </div>

                  {/* Role Badge */}
                  <span className="text-xs text-muted-foreground">
                    {member.role}
                  </span>

                  {/* Actions - only for owner, and can't remove owner */}
                  {membersData.isOwner && member.role !== "Owner" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            setMemberToTransfer({
                              userId: member.user_id,
                              displayName:
                                member.display_name ||
                                member.email.split("@")[0] ||
                                "this member",
                            })
                          }
                        >
                          <Crown className="w-3.5 h-3.5 mr-2" />
                          Transfer ownership
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            setMemberToRemove({
                              userId: member.user_id,
                              displayName:
                                member.display_name ||
                                member.email.split("@")[0] ||
                                "this member",
                            })
                          }
                          className="text-destructive hover:text-destructive focus:text-destructive"
                        >
                          <TrashIcon className="w-3.5 h-3.5 mr-2 text-destructive" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))}

              {filteredMembers.length === 0 && (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No members found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Remove Member Confirmation Dialog */}
      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={(open) => {
          if (!open) setMemberToRemove(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-medium text-foreground">
                {memberToRemove?.displayName}
              </span>{" "}
              from this team? They will lose access to all team projects.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removeMember.isPending}>
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleRemoveMember}
              disabled={removeMember.isPending}
            >
              {removeMember.isPending ? (
                <div className="flex items-center gap-2">
                  <IconSpinner className="h-4 w-4" />
                  Removing...
                </div>
              ) : (
                "Remove"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Transfer Ownership Confirmation Dialog */}
      <AlertDialog
        open={!!memberToTransfer}
        onOpenChange={(open) => {
          if (!open) {
            setMemberToTransfer(null)
            setTransferConfirmation("")
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Transfer Team Ownership
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <span>
                You are about to transfer ownership of this team to{" "}
                <span className="font-medium text-foreground">
                  {memberToTransfer?.displayName}
                </span>
                .
              </span>
              <span className="block text-destructive font-medium">
                This action cannot be undone. You will become a regular member
                and lose owner privileges.
              </span>
              <span className="block">
                To confirm, type{" "}
                <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
                  {memberToTransfer?.displayName}
                </span>{" "}
                below:
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <Input
              placeholder="Type member name to confirm"
              value={transferConfirmation}
              onChange={(e) => setTransferConfirmation(e.target.value)}
              className="w-full"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={transferOwnership.isPending}
              onClick={() => setTransferConfirmation("")}
            >
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleTransferOwnership}
              disabled={
                transferOwnership.isPending ||
                transferConfirmation !== memberToTransfer?.displayName
              }
            >
              {transferOwnership.isPending ? (
                <div className="flex items-center gap-2">
                  <IconSpinner className="h-4 w-4" />
                  Transferring...
                </div>
              ) : (
                "Transfer Ownership"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Revoke Invite Confirmation Dialog */}
      <AlertDialog
        open={!!inviteToRevoke}
        onOpenChange={(open) => {
          if (!open) setInviteToRevoke(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Invitation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke the invitation for{" "}
              <span className="font-medium text-foreground">
                {inviteToRevoke?.email}
              </span>
              ? They will no longer be able to join the team using the invite
              link.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={revokeInvite.isPending}>
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleRevokeInvite}
              disabled={revokeInvite.isPending}
            >
              {revokeInvite.isPending ? (
                <div className="flex items-center gap-2">
                  <IconSpinner className="h-4 w-4" />
                  Revoking...
                </div>
              ) : (
                "Revoke"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
