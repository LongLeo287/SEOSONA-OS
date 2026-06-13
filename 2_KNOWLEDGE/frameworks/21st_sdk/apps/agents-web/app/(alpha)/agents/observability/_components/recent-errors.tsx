"use client"

import { AlertCircle } from "lucide-react"
import { TimestampCell } from "../../threads/_components/timestamp-cell"

interface ErrorDialog {
  id: string
  created_at: string | Date
  error?: string | null
}

interface RecentErrorsProps {
  errors: ErrorDialog[]
}

export function RecentErrors({ errors }: RecentErrorsProps) {
  return (
    <div className="rounded-lg border border-border">
      <div className="flex h-9 items-center border-b border-border bg-muted/30 px-4 text-[11px] font-medium text-muted-foreground">
        Recent Errors
      </div>
      {errors.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-[13px] text-muted-foreground">
          No errors in this period
        </div>
      ) : (
        <div>
          {errors.map((dialog, i) => (
            <div
              key={dialog.id}
              className={`flex items-start gap-3 px-4 py-2.5 ${
                i < errors.length - 1
                  ? "border-b border-border/50"
                  : ""
              }`}
            >
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] text-destructive">
                  {dialog.error || "Unknown error"}
                </p>
                <TimestampCell
                  date={dialog.created_at}
                  className="text-[11px] text-muted-foreground"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
