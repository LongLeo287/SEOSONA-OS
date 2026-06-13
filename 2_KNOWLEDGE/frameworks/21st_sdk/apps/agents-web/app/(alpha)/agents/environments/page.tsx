import { Badge } from "@/components/ui/badge"
import { Server } from "lucide-react"

export default function EnvironmentsPage() {
  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-8 px-8 py-10">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Environments</h1>
        <p className="mt-0.5 text-[13px] text-muted-foreground">
          Sandbox environment configuration for agents.
        </p>
      </div>

      <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary">
          <Server className="h-5 w-5 text-muted-foreground/60" />
        </div>
        <p className="text-[15px] text-muted-foreground">Coming soon</p>
        <Badge variant="outline" className="rounded-md text-[11px]">
          In development
        </Badge>
      </div>
    </div>
  )
}
