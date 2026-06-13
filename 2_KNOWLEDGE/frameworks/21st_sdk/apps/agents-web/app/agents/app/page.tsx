import { getAgentsServerSession } from "@/lib/agents/auth/server"
import { redirect } from "next/navigation"
import { AnAppEntryClient } from "./_components/an-app-entry-client"

export default async function AnAppPage() {
  const session = await getAgentsServerSession()

  if (!session.isAuthenticated) {
    redirect("/sign-in?redirect_url=%2Fagents%2Fapp")
  }

  return <AnAppEntryClient />
}
