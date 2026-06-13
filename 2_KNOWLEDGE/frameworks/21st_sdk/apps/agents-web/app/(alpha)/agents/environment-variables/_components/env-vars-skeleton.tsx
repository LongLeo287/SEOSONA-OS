"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function EnvVarsSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl flex flex-col gap-0 px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <Skeleton className="h-[15px] w-[168px] rounded" />
        <Skeleton className="mt-2 h-3 w-[340px] rounded" />
      </div>

      {/* Card */}
      <div className="rounded-xl border border-border bg-background overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-2.5 py-2.5 border-b border-border">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Skeleton className="h-7 w-full rounded-md" />
          </div>
          {/* Action buttons */}
          <Skeleton className="h-7 w-[52px] rounded-md" />
          <Skeleton className="h-7 w-[64px] rounded-md" />
          <Skeleton className="h-7 w-[64px] rounded-md" />
        </div>

        {/* Rows */}
        <div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-2.5 h-[38px] border-b border-border/50 last:border-b-0"
            >
              {/* Key */}
              <Skeleton
                className="h-3 shrink-0 rounded"
                style={{ width: [120, 160, 100, 140, 180][i] }}
              />
              {/* Value (masked dots) */}
              <Skeleton className="h-3 flex-1 max-w-[200px] rounded" />
              <div className="flex-1" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-2.5 py-2 border-t border-border">
          <Skeleton className="h-2.5 w-[72px] rounded" />
        </div>
      </div>
    </div>
  )
}
