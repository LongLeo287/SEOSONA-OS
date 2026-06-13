"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function ApiKeysSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl flex flex-col gap-0 px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <Skeleton className="h-[15px] w-[72px] rounded" />
        <Skeleton className="mt-2 h-3 w-[320px] rounded" />
      </div>

      {/* Card */}
      <div className="rounded-xl border border-border bg-background overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-2.5 py-2.5 border-b border-border">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Skeleton className="h-7 w-full rounded-md" />
          </div>
          {/* Add button */}
          <Skeleton className="h-7 w-[52px] rounded-md" />
        </div>

        {/* Rows */}
        <div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-2.5 h-[48px] border-b border-border/50 last:border-b-0"
            >
              {/* Key icon */}
              <Skeleton className="h-3.5 w-3.5 shrink-0 rounded" />
              {/* Name */}
              <Skeleton
                className="h-3 shrink-0 rounded"
                style={{ width: [80, 100, 72, 110][i] }}
              />
              {/* Masked key */}
              <Skeleton className="h-3 w-[120px] shrink-0 rounded" />
              <div className="flex-1" />
              {/* Time ago */}
              <Skeleton className="h-3 w-[40px] shrink-0 rounded hidden sm:block" />
              {/* More button */}
              <Skeleton className="h-6 w-6 shrink-0 rounded-md" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-2.5 py-2 border-t border-border">
          <Skeleton className="h-2.5 w-[80px] rounded" />
        </div>
      </div>
    </div>
  )
}
