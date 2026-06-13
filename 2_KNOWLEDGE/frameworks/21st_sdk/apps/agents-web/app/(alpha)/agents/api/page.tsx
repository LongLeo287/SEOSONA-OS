import type { Metadata } from "next"
import { ApiReferenceContent } from "@/app/agents/docs/api-reference/content"

export const metadata: Metadata = { title: "API" }

export default function DashboardApiPage() {
  return (
    <div className="mx-auto max-w-2xl px-8 py-10">
      <ApiReferenceContent />
    </div>
  )
}
