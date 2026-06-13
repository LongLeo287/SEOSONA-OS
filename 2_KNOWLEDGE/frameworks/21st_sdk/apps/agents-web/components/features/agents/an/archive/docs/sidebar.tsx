"use client"

import { useState } from "react"
import { AgentsLink as Link } from "@/components/agents-link"
import { useAgentsPathname } from "@/hooks/use-agents-pathname"
import { cn } from "@/lib/utils"
import {
  getTabForPath,
  getRefSubSection,
  referenceSubSections,
  backendApiOverview,
  backendApiItems,
  type NavItem,
} from "@/lib/agents-docs/manifest"
import { useFramework, FRAMEWORKS, type FrameworkId } from "@/lib/agents-docs/framework-context"
import {
  NextjsIcon,
  ReactIcon,
  JavaScriptIcon,
} from "./framework-icons"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { BookIcon, CodeIcon, CaretRightIcon, ChevronDownIcon } from "./icons"

/* ── Framework icon map ──────────────────────────────────────────── */

const FRAMEWORK_ICONS: Record<FrameworkId, React.ReactNode> = {
  nextjs: <NextjsIcon className="h-4 w-4" />,
  react: <ReactIcon className="h-4 w-4" />,
  "js-backend": <JavaScriptIcon className="h-4 w-4" />,
}

/* ── Frameworks with availability ─────────────────────────────────── */

const FRAMEWORK_AVAILABLE: Record<FrameworkId, boolean> = {
  nextjs: true,
  react: false,
  "js-backend": false,
}

/* ── Helpers ─────────────────────────────────────────────────────── */

function hrefMatchesPath(href: string, pathname: string): boolean {
  const base = href.split("#")[0]
  return base === pathname
}

function isPathInGroup(pathname: string, item: NavItem): boolean {
  if (item.href && hrefMatchesPath(item.href, pathname)) return true
  if (item.items) return item.items.some((child) => isPathInGroup(pathname, child))
  return false
}

function renderTitle(title: string) {
  const parts = title.split(/(`[^`]+`)/)
  if (parts.length === 1) return title
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="rounded bg-muted px-1 py-0.5 text-[11px] font-mono">
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}

/* ── Tab icons ───────────────────────────────────────────────────── */

const TAB_ICONS: Record<string, React.ReactNode> = {
  book: <BookIcon className="h-4 w-4" />,
  code: <CodeIcon className="h-4 w-4" />,
}

/* ── Chevron ─────────────────────────────────────────────────────── */

function ChevronIcon({ open }: { open: boolean }) {
  if (open) {
    return <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
  }
  return <CaretRightIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
}

/* ── Framework selector dropdown ─────────────────────────────────── */

function FrameworkSelect() {
  const { framework } = useFramework()
  const currentFw = FRAMEWORKS.find((f) => f.id === framework)

  return (
    <Select value={framework} onValueChange={() => {}}>
      <SelectTrigger className="w-full" aria-label="Select framework">
        <SelectValue>
          <span className="flex items-center gap-2">
            {FRAMEWORK_ICONS[framework]}
            <span>{currentFw?.name}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {FRAMEWORKS.map((f) => {
          const available = FRAMEWORK_AVAILABLE[f.id]
          return (
            <SelectItem
              key={f.id}
              value={f.id}
              disabled={!available}
            >
              <span className="flex items-center gap-2">
                <span className={cn(!available && "opacity-50")}>{FRAMEWORK_ICONS[f.id]}</span>
                <span className={cn(!available && "opacity-50")}>{f.name}</span>
                {!available && (
                  <span className="ml-auto rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/50">
                    Soon
                  </span>
                )}
              </span>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

/* ── Collapsible section ─────────────────────────────────────────── */

function SidebarSection({
  title,
  icon,
  defaultOpen,
  forceOpen,
  children,
  className,
  triggerClassName,
  depth = 0,
}: {
  title: React.ReactNode
  icon?: React.ReactNode
  defaultOpen?: boolean
  forceOpen?: boolean
  children: React.ReactNode
  className?: string
  triggerClassName?: string
  depth?: number
}) {
  const [open, setOpen] = useState(defaultOpen ?? false)
  const isOpen = forceOpen ?? open

  return (
    <div className={className}>
      <button
        onClick={() => setOpen(!isOpen)}
        className={cn(
          "flex w-full items-center gap-2 rounded-md py-1.5 text-[14px] transition-colors",
          "px-3",
          triggerClassName,
        )}
        style={depth > 0 ? { paddingLeft: `${12 + depth * 14}px` } : undefined}
      >
        {icon}
        <span className="truncate">{title}</span>
        <span className="ml-auto">
          <ChevronIcon open={isOpen} />
        </span>
      </button>
      {isOpen && children}
    </div>
  )
}

/* ── Collapsible nav item group ──────────────────────────────────── */

function SidebarCollapsible({
  item,
  pathname,
  depth,
}: {
  item: NavItem
  pathname: string
  depth: number
}) {
  const hasActiveChild = isPathInGroup(pathname, item)

  return (
    <SidebarSection
      title={renderTitle(item.title)}
      defaultOpen={item.defaultOpen || hasActiveChild}
      depth={depth}
      triggerClassName={cn(
        hasActiveChild
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <ul className="mt-0.5">
        {item.items?.map((child) => {
          const barInset = 14 + depth * 12
          return (
            <li
              key={child.href || child.title}
              className="sidebar-item"
              data-has-bar="true"
              style={{ "--bar-inset": `${barInset}px` } as React.CSSProperties}
            >
              <SidebarItemRouter
                item={child}
                pathname={pathname}
                depth={depth + 1}
              />
            </li>
          )
        })}
      </ul>
    </SidebarSection>
  )
}

/* ── Leaf link ───────────────────────────────────────────────────── */

function SidebarLink({
  item,
  pathname,
  depth,
}: {
  item: NavItem
  pathname: string
  depth: number
}) {
  if (!item.href) {
    if (item.disabled) {
      return (
        <span
          className="sidebar-link relative flex items-center gap-2 rounded-md py-1.5 text-[14px] text-muted-foreground/50 cursor-default"
          style={{
            paddingLeft: `${12 + depth * 14}px`,
            paddingRight: "12px",
          }}
        >
          <span className="truncate">{renderTitle(item.title)}</span>
          {item.tag && (
            <span className="ml-auto shrink-0 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/50">
              {item.tag}
            </span>
          )}
        </span>
      )
    }
    return null
  }
  const active = hrefMatchesPath(item.href, pathname)
  const barInset = depth > 0 ? 14 + (depth - 1) * 12 : 2

  return (
    <Link
      href={item.href}
      className={cn(
        "sidebar-link relative flex items-center gap-2 rounded-md py-1.5 text-[14px] transition-colors",
        active
          ? "text-foreground bg-accent"
          : "text-muted-foreground hover:bg-secondary hover:text-muted-foreground",
      )}
      data-active={active ? "true" : undefined}
      style={{
        paddingLeft: `${12 + depth * 14}px`,
        paddingRight: "12px",
        "--bar-inset": `${barInset}px`,
      } as React.CSSProperties}
    >
      <span className="truncate">{renderTitle(item.title)}</span>
      {item.tag && (
        <span className="ml-auto shrink-0 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          {item.tag}
        </span>
      )}
    </Link>
  )
}

/* ── Item router ─────────────────────────────────────────────────── */

function SidebarItemRouter({
  item,
  pathname,
  depth,
}: {
  item: NavItem
  pathname: string
  depth: number
}) {
  if (item.type === "heading") {
    return (
      <div
        className="mb-1 mt-5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
        style={{ paddingLeft: `${12 + depth * 14}px` }}
      >
        {item.title}
      </div>
    )
  }

  if (item.items && !item.href) {
    return <SidebarCollapsible item={item} pathname={pathname} depth={depth} />
  }

  return <SidebarLink item={item} pathname={pathname} depth={depth} />
}

/* ── Reference sub-section links (under Reference tab button) ──── */

function RefSubSectionLinks({
  pathname,
}: {
  pathname: string
}) {
  const activeSubSection = getRefSubSection(pathname)

  return (
    <ul className="mt-0.5">
      {referenceSubSections.map((section) => {
        if (section.disabled) {
          return (
            <li key={section.slug} className="sidebar-item" data-has-bar="true" style={{ "--bar-inset": "14px" } as React.CSSProperties}>
              <span
                className="sidebar-link relative flex items-center rounded-md py-1.5 text-[13px] text-muted-foreground/50 cursor-default"
                style={{ paddingLeft: "26px", paddingRight: "12px" }}
              >
                {section.title}
                {section.tag && (
                  <span className="ml-auto shrink-0 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/50">
                    {section.tag}
                  </span>
                )}
              </span>
            </li>
          )
        }

        const isActive = activeSubSection?.slug === section.slug
        return (
          <li
            key={section.slug}
            className="sidebar-item"
            data-has-bar="true"
            style={{ "--bar-inset": "14px" } as React.CSSProperties}
          >
            <Link
              href={section.href}
              className={cn(
                "sidebar-link relative flex items-center rounded-md py-1.5 text-[13px] transition-colors",
                isActive
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-muted-foreground",
              )}
              data-active={isActive ? "true" : undefined}
              style={{
                paddingLeft: "26px",
                paddingRight: "12px",
                "--bar-inset": "14px",
              } as React.CSSProperties}
            >
              {section.title}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

/* ── Active sub-section items (below divider) ────────────────────── */

function ActiveSubSectionItems({
  pathname,
}: {
  pathname: string
}) {
  const overview = backendApiOverview
  const items = backendApiItems

  return (
    <div className="space-y-1">
      {/* Overview as a highlighted button */}
      {overview?.href && (
        <Link
          href={overview.href}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-[14px] font-medium transition-all",
            hrefMatchesPath(overview.href, pathname)
              ? "bg-accent text-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-muted-foreground",
          )}
        >
          {overview.title}
        </Link>
      )}

      {/* Collapsible groups */}
      {items.map((item) => (
        <SidebarItemRouter
          key={item.href || item.title}
          item={item}
          pathname={pathname}
          depth={0}
        />
      ))}
    </div>
  )
}

/* ── Sidebar shell ───────────────────────────────────────────────── */

export function Sidebar() {
  const pathname = useAgentsPathname()
  const activeTab = getTabForPath(pathname)
  const isReference = activeTab.title === "Reference"

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-[260px] shrink-0 overflow-y-auto border-r border-border pb-8 md:block">
      {/* Framework selector */}
      <div className="px-4 pt-4 pb-3">
        <FrameworkSelect />
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-border" />

      {/* Guides / Reference tabs */}
      <div className="px-4 pb-2 pt-3">
        <div className="flex flex-col gap-0.5">
          {/* Guides tab */}
          <Link
            href="/agents/docs"
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-[14px] font-medium transition-all",
              !isReference
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-muted-foreground",
            )}
          >
            <span className="text-muted-foreground">
              {TAB_ICONS["book"]}
            </span>
            Guides
            {isReference && (
              <CaretRightIcon className="ml-auto h-4 w-4 text-muted-foreground" />
            )}
          </Link>

          {/* Reference tab + nested sub-section links */}
          <div>
            <Link
              href="/agents/docs/reference/api"
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-[14px] font-medium transition-all",
                isReference
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-muted-foreground",
              )}
            >
              <span className="text-muted-foreground">
                {TAB_ICONS["code"]}
              </span>
              Reference
              {!isReference && (
                <CaretRightIcon className="ml-auto h-4 w-4 text-muted-foreground" />
              )}
            </Link>

            {/* Sub-section links nested under Reference */}
            {isReference && (
              <RefSubSectionLinks pathname={pathname} />
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-border" />

      {/* Navigation items */}
      <nav className="px-2 pt-4">
        {isReference ? (
          <ActiveSubSectionItems pathname={pathname} />
        ) : (
          <div className="space-y-0.5">
            {activeTab.items.map((item) => (
              <SidebarItemRouter
                key={item.href || item.title}
                item={item}
                pathname={pathname}
                depth={0}
              />
            ))}
          </div>
        )}
      </nav>
    </aside>
  )
}
