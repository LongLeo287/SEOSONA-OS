"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSetAtom } from "jotai"
import { api } from "@/trpc/client"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { XCircle, Loader2 } from "lucide-react"
import {
  ProfileIcon,
  MembersIcon,
} from "@/components/features/agents/ui/canvas/[id]/{components}/ui/icons"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Logo } from "@/components/features/agents/ui/canvas/[id]/{components}/ui/logo"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { openSupportChat } from "@/components/features/support"

function InviteFooter() {
  return (
    <footer className="p-6 pb-10 text-center">
      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
        <a
          href="https://help.21st.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          <Logo className="w-3.5 h-3.5" />
          What is 21st?
        </a>
        <span>·</span>
        <button
          type="button"
          onClick={openSupportChat}
          className="hover:text-foreground transition-colors"
        >
          Contact support
        </button>
      </div>
    </footer>
  )
}

export function InviteAccept({
  token,
  isLoggedIn,
  redirectToGitHub = false,
}: {
  token: string
  isLoggedIn: boolean
  redirectToGitHub?: boolean
}) {
  const router = useRouter()
  const setSelectedTeamId = useSetAtom(selectedTeamIdAtom)
  const inviteSearchParams = new URLSearchParams({
    code: token,
    source: "agents",
  })

  if (redirectToGitHub) {
    inviteSearchParams.set("github", "true")
  }

  const signInHref = `/sign-in?redirect_url=${encodeURIComponent(`/invite?${inviteSearchParams.toString()}`)}`

  // Get team info (works for everyone)
  const { data: team, isLoading: isLoadingTeam } =
    api.teams.getTeamByInviteToken.useQuery({ token })

  const joinMutation = api.teams.joinTeamViaLink.useMutation({
    onSuccess: (data) => {
      // Set the joined team as the selected team before redirect
      setSelectedTeamId(data.teamId)
      document.cookie =
        "agents_landing_seen=true; path=/; max-age=31536000; samesite=lax"

      if (redirectToGitHub) {
        router.push(`/agents/app?connectGitHub=true&teamId=${data.teamId}`)
        return
      }

      router.push("/agents/app")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  // Loading
  if (isLoadingTeam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    )
  }

  // Invalid/expired link
  if (!team) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="p-6">
          <div className="flex items-center gap-2">
            <Logo className="w-6 h-6" />
            <span className="font-semibold text-lg">21st</span>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md p-8">
            <XCircle className="h-16 w-16 text-muted-foreground mx-auto" />
            <h1 className="text-2xl font-semibold">Invalid invite link</h1>
            <p className="text-muted-foreground">
              This link may have expired or been revoked.
            </p>
            <Button variant="brand" onClick={() => router.push("/")}>
              Go Home
            </Button>
          </div>
        </div>
        <InviteFooter />
      </div>
    )
  }

  // Not logged in - show sign in prompt
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="p-6">
          <div className="flex items-center gap-2">
            <Logo className="w-6 h-6" />
            <span className="font-semibold text-lg">21st</span>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md p-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto overflow-hidden">
              {team.image_url ? (
                <img
                  src={team.image_url}
                  alt={team.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <MembersIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>

            <div className="space-y-1">
              <h1 className="text-xl font-semibold">
                {redirectToGitHub
                  ? `Connect GitHub for ${team.name}`
                  : `${team.inviter} invited you to ${team.name}`}
              </h1>
              <p className="text-sm text-muted-foreground">
                {redirectToGitHub
                  ? `${team.inviter} asked you to integrate GitHub. Sign in to continue.`
                  : "Sign in to join this team."}
              </p>
            </div>

            <Button asChild variant="brand">
              <Link href={signInHref}>
                <ProfileIcon className="h-4 w-4 mr-2" />
                {redirectToGitHub ? "Sign in to connect GitHub" : "Sign in to join"}
              </Link>
            </Button>
          </div>
        </div>
        <InviteFooter />
      </div>
    )
  }

  // Logged in - show join button
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-6">
        <div className="flex items-center gap-2">
          <Logo className="w-6 h-6" />
          <span className="font-semibold text-lg">21st</span>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md p-8">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto overflow-hidden">
            {team.image_url ? (
              <img
                src={team.image_url}
                alt={team.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <MembersIcon className="h-8 w-8 text-muted-foreground" />
            )}
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-semibold">
              {redirectToGitHub
                ? `Connect GitHub for ${team.name}`
                : `${team.inviter} invited you to ${team.name}`}
            </h1>
            <p className="text-sm text-muted-foreground">
              {redirectToGitHub
                ? `${team.inviter} asked you to integrate GitHub for their team.`
                : "Join this team to collaborate together."}
            </p>
          </div>

          <Button
            variant="brand"
            onClick={() => joinMutation.mutate({ token })}
            disabled={joinMutation.isPending}
          >
            {joinMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
            {redirectToGitHub ? "Join & Connect GitHub" : "Join"}
          </Button>
        </div>
      </div>
      <InviteFooter />
    </div>
  )
}
