import { getAgentsServerSession } from "@/lib/agents/auth/server"
import { redirect } from "next/navigation"

export default async function AgentsNewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAgentsServerSession()

  if (!session.isAuthenticated) {
    redirect("/sign-in?redirect_url=%2Fagents%2Fnew")
  }

  return children
}
