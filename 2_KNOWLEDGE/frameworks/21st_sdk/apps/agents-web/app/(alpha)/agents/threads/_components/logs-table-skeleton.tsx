"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function LogsTableSkeleton() {
  return (
    <div>
      {/* Skeleton rows */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex h-10 items-center border-b-[0.5px] border-border"
        >
          <div className="shrink-0 pl-4" style={{ width: 180 }}>
            <Skeleton className="h-3.5 w-[140px] rounded" />
          </div>
          <div className="flex shrink-0 items-center justify-center pl-2" style={{ width: 28 }}>
            <Skeleton className="h-2 w-2 rounded-full" />
          </div>
          <div className="shrink-0" style={{ width: 120 }}>
            <Skeleton className="h-3.5 w-16 rounded" />
          </div>
          <div className="min-w-0 flex-1 px-2">
            <Skeleton className="h-3.5 w-48 rounded" />
          </div>
          <div className="shrink-0 text-right" style={{ width: 72 }}>
            <Skeleton className="ml-auto h-3.5 w-10 rounded" />
          </div>
          <div className="shrink-0 pr-4 text-right" style={{ width: 72 }}>
            <Skeleton className="ml-auto h-3.5 w-8 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
