"use client"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/features/agents/ui/canvas/[id]/{components}/ui/tooltip"
import { Kbd } from "@/components/features/agents/ui/canvas/[id]/{components}/ui/kbd"
import { cn } from "@/lib/utils"
import { SlashIcon } from "@/components/icons"
import React, { useCallback, useState } from "react"
import { useSidebar } from "../../{components}/ui/sidebar"
import { useHasScrolled } from "@/hooks/use-has-scrolled"
import { usePathname, useRouter } from "next/navigation"
import { useSetAtom, useAtomValue } from "jotai"
import { sidebarViewModeAtom } from "@/app/(alpha)/atoms"
import { Search, ChevronDown, AlignJustify } from "lucide-react"
import { useIsMobile } from "@/hooks/use-media-query"
import { Logo } from "../../[id]/{components}/ui/logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/features/agents/ui/canvas/[id]/{components}/ui/dropdown-menu"
import { HelpSubmenu } from "../../{components}/help-submenu"
import {
  inviteToTeamIdAtom,
} from "@/lib/atoms/team"

export type CommunityHeaderProps = {
  /**
   * Base label for the breadcrumb. Defaults to "Community".
   */
  baseLabel?: string | React.ReactNode
  /**
   * Optional suffix shown after base label, rendered as: Base > Suffix
   */
  suffixLabel?: string | React.ReactNode
  /**
   * If provided, base label becomes a clickable element; used to navigate back.
   */
  onBaseClick?: () => void
  /**
   * Provide a scroll container to trigger progressive blur on top shadow.
   * Can be an element or a ref. If not provided, will attach to window scroll.
   */
  scrollContainer?: HTMLElement | null | { current: HTMLElement | null }
  className?: string
  /** Hide right-side actions */
  hideActions?: boolean
/** Optional extra actions rendered on the right */
  extraActionsRight?: React.ReactNode
  /** Optional click handler for suffix label to make it clickable */
  onSuffixClick?: () => void
  /** Optional content to show centered (desktop only) */
  centerContent?: React.ReactNode
  /** Override sidebar toggle behavior (e.g. for floating sidebar on component detail pages) */
  onSidebarToggle?: () => void
  /** Always show sidebar toggle button regardless of sidebar state */
  alwaysShowSidebarToggle?: boolean
}

export function CommunityHeader({
  baseLabel = "Community",
  suffixLabel,
  onBaseClick,
  scrollContainer,
  className,
  hideActions = false,
  extraActionsRight,
  onSuffixClick,
  centerContent,
  onSidebarToggle,
  alwaysShowSidebarToggle = false,
}: CommunityHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useIsMobile()
  const setSidebarViewMode = useSetAtom(sidebarViewModeAtom)
  const setInviteToTeamId = useSetAtom(inviteToTeamIdAtom)

  const resolvedScrollEl =
    scrollContainer && "current" in (scrollContainer as any)
      ? (scrollContainer as { current: HTMLElement | null }).current
      : (scrollContainer as HTMLElement | null)

  const hasScrolled = useHasScrolled({ scrollContainer: resolvedScrollEl })
  const { open: isSidebarOpen, setOpen: setIsSidebarOpen, setOpenMobile } = useSidebar()

  // Sidebar toggle handler
  const handleSidebarToggle = useCallback(() => {
    if (onSidebarToggle) {
      onSidebarToggle()
      return
    }
    if (isMobile) {
      setOpenMobile(true)
    } else {
      setIsSidebarOpen(!isSidebarOpen)
    }
  }, [onSidebarToggle, isMobile, isSidebarOpen, setIsSidebarOpen, setOpenMobile])

  // Search handler
  const handleSearchClick = useCallback(() => {
    if (isMobile) {
      setOpenMobile(false)
      return
    }

    setSidebarViewMode("search")
    if (!isSidebarOpen) {
      setIsSidebarOpen(true)
    }
  }, [isMobile, isSidebarOpen, setSidebarViewMode, setIsSidebarOpen, setOpenMobile])

  // hasScrolled handled by useHasScrolled hook

  return (
    <>
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-10 text-sm z-10 bg-tl-background border-b border-border",
          className,
        )}
        style={{ borderBottomWidth: "0.5px" }}
      >
        <div className="relative h-full flex items-center justify-between px-2.5">
          {/* Left: sidebar toggle + optional left content */}
          <div className="flex items-center">
            {/* Sidebar toggle button slot */}
            <div
              className="overflow-hidden transition-[width] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] max-md:!w-9"
              style={{ width: isSidebarOpen && !alwaysShowSidebarToggle ? 0 : 36 }}
            >
              {(!isSidebarOpen || isMobile || alwaysShowSidebarToggle) && (
                <div className="animate-in fade-in-0 duration-500 ease-out max-md:animate-none">
                  <Tooltip delayDuration={500}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSidebarToggle}
                        className="h-6 w-6 p-0 hover:bg-foreground/10 transition-[background-color,transform] duration-150 ease-out active:scale-[0.97] text-foreground flex-shrink-0 rounded-md"
                        aria-label="Open sidebar"
                      >
                        <AlignJustify className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Open sidebar
                      <Kbd>⌘\</Kbd>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>

            {/* Left content slot: ReactNode baseLabel (agents) OR breadcrumbs when centerContent is provided */}
            {typeof baseLabel !== "string" ? (
              baseLabel
            ) : centerContent && !isMobile ? (
              <div className="flex items-center gap-1.5">
                {baseLabel && (
                  onBaseClick ? (
                    <button
                      type="button"
                      className="an-focus-btn rounded-sm text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                      onClick={onBaseClick}
                    >
                      {baseLabel}
                    </button>
                  ) : (
                    <span className="text-[13px] font-medium text-foreground">
                      {baseLabel}
                    </span>
                  )
                )}
                {suffixLabel && baseLabel && (
                  <span className="text-[13px] text-muted-foreground/50">/</span>
                )}
                {suffixLabel && (
                  typeof suffixLabel === "string" ? (
                    <span className="text-[13px] font-medium text-foreground capitalize">
                      {suffixLabel}
                    </span>
                  ) : (
                    suffixLabel
                  )
                )}
              </div>
            ) : null}
          </div>

          {/* Center: page title / breadcrumbs — absolutely positioned */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            {centerContent ? (
              <div className="pointer-events-auto">
                {centerContent}
              </div>
            ) : (baseLabel || suffixLabel) ? (
              <div className="pointer-events-auto">
                {isMobile ? (
                  <span className="text-[13px] font-medium text-foreground truncate">
                    {suffixLabel || (typeof baseLabel === "string" ? baseLabel : "")}
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    {typeof baseLabel === "string" && baseLabel && (
                      onBaseClick ? (
                        <button
                          type="button"
                          className="an-focus-btn rounded-sm text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                          onClick={onBaseClick}
                        >
                          {baseLabel}
                        </button>
                      ) : (
                        <span className="text-[13px] font-medium text-foreground">
                          {baseLabel}
                        </span>
                      )
                    )}

                    {suffixLabel && typeof baseLabel === "string" && baseLabel && (
                      <span className="text-[13px] text-muted-foreground/50">/</span>
                    )}

                    {suffixLabel && (
                      onSuffixClick ? (
                        <button
                          type="button"
                          className="an-focus-btn rounded-sm text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                          onClick={onSuffixClick}
                        >
                          {suffixLabel}
                        </button>
                      ) : typeof suffixLabel === "string" ? (
                        <span className="text-[13px] font-medium text-foreground capitalize">
                          {suffixLabel}
                        </span>
                      ) : (
                        <span className="pointer-events-auto flex items-center gap-1.5">{suffixLabel}</span>
                      )
                    )}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1">
            {/* Search Button */}
            {!hideActions && (
              <div
                className={cn(
                  "transition-opacity duration-300",
                  !isMobile && isSidebarOpen
                    ? "md:opacity-0 md:pointer-events-none"
                    : "opacity-100",
                )}
              >
                <button
                  type="button"
                  className="flex items-center gap-2 h-7 px-3 rounded-[10px] border-[0.5px] border-border/40 bg-background/80 text-xs text-muted-foreground hover:bg-foreground/5 hover:border-border/60 transition-colors cursor-pointer outline-none ring-sidebar-ring focus-visible:ring-2 focus-visible:outline-none"
                  onClick={handleSearchClick}
                  aria-label="Search"
                  tabIndex={!isMobile && isSidebarOpen ? -1 : 0}
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>Search</span>
                  <Kbd className="hidden sm:inline-flex ml-1">⌘K</Kbd>
                </button>
              </div>
            )}

            {/* Extra Actions */}
            {extraActionsRight}
          </div>
        </div>
      </div>
    </>
  )
}

export default CommunityHeader
