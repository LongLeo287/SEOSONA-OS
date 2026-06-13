"use client"

import { useAgentsViewer } from "@/lib/agents/auth/client"
import { LogOut, RefreshCw } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/features/agents/ui/1code/{components}/ui/dropdown-menu"

export function UserAvatarMenu({
  onSignOut,
  onSwitchAccount,
}: {
  onSignOut: () => void
  onSwitchAccount: () => void
}) {
  const user = useAgentsViewer()

  const imageUrl = user?.imageUrl
  const email = user?.email

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="an-focus-btn flex items-center gap-2 rounded-full ring-offset-2 ring-offset-background transition-all hover:opacity-80 data-[state=open]:ring-2 data-[state=open]:ring-foreground/20">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              className="h-7 w-7 rounded-full border border-border object-cover"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-foreground/[0.06] text-[11px] font-medium text-muted-foreground">
              {email?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="end"
        sideOffset={8}
        className="w-52 pt-0"
      >
        <div className="relative overflow-hidden rounded-t-xl border-b">
          <div className="absolute inset-0 bg-popover brightness-110" />
          <div className="relative pb-2 pl-2 pt-1.5">
            <div className="flex min-w-0 items-center gap-2">
              <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/[0.06] text-[11px] font-medium text-muted-foreground">
                    {email?.[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="truncate text-sm font-medium text-foreground">
                  {user?.fullName ?? user?.username ?? "User"}
                </div>
                {email && (
                  <div className="truncate text-xs text-muted-foreground">
                    {email}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DropdownMenuItem className="gap-2" onClick={onSwitchAccount}>
          <RefreshCw className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
          Switch account
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="gap-2" onClick={onSignOut}>
          <LogOut className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
