import { redirect } from "next/navigation"
import { getAgentsServerSession } from "@/lib/agents/auth/server"
import { InviteAccept } from "./invite-accept"

// Disable static generation for this page
export const dynamic = "force-dynamic"

export default async function InvitePage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; github?: string }>
}) {
  const { code, github } = await searchParams

  if (!code) {
    redirect("/")
  }

  const session = await getAgentsServerSession()

  return (
    <InviteAccept
      token={code}
      isLoggedIn={session.isAuthenticated}
      redirectToGitHub={github === "true"}
    />
  )
}
