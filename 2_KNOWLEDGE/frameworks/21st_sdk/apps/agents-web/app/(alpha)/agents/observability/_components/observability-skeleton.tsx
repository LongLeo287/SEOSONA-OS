"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

const MAIN_BAR_HEIGHTS = [
  35, 22, 48, 30, 55, 25, 42, 60, 38, 20, 45, 33, 52, 28, 40, 50, 35, 58, 27,
  44,
]

const SMALL_BAR_HEIGHTS = [
  [30, 45, 20, 55, 35, 40, 25, 50, 38, 28],
  [40, 25, 50, 30, 45, 35, 55, 20, 42, 33],
  [25, 50, 35, 42, 28, 55, 30, 45, 38, 22],
]

export function ObservabilitySkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl flex flex-col gap-4 px-8 py-6">
      {/* Date picker placeholder */}
      <div className="flex items-center justify-end gap-2 -mb-2">
        <Skeleton className="h-8 w-[180px] rounded-md" />
      </div>

      {/* Main chart card skeleton */}
      <Card className="shadow-none">
        <div className="flex items-stretch border-b">
          <div className="flex flex-1 flex-col justify-center gap-1.5 px-4 py-2.5">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="flex">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="flex flex-col justify-center gap-1.5 border-l px-5 py-2.5"
              >
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-5 w-8" />
              </div>
            ))}
          </div>
        </div>
        <CardContent className="p-4 pt-4">
          <div className="h-[250px] w-full flex items-end gap-[6px] px-3 pb-6">
            {MAIN_BAR_HEIGHTS.map((h, i) => (
              <Skeleton
                key={i}
                className="flex-1 rounded-t-sm"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bottom metric cards skeleton */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {SMALL_BAR_HEIGHTS.map((heights, i) => (
          <Card key={i} className="flex flex-col shadow-none">
            <div className="space-y-1.5 p-4 pb-3">
              <Skeleton className="h-4 w-12" />
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-1.5 w-1.5 rounded-full" />
                  <Skeleton className="h-3 w-8" />
                  <Skeleton className="h-3.5 w-10" />
                </div>
              </div>
            </div>
            <CardContent className="flex-1 p-4 pt-0 pb-3">
              <div className="h-[100px] w-full flex items-end gap-[4px] px-3 pb-4">
                {heights.map((h, j) => (
                  <Skeleton
                    key={j}
                    className="flex-1 rounded-t-sm"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
