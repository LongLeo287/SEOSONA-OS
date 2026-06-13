"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ChevronDown, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

type NavSubItem = {
  title: string
  href: string
  externalLink?: boolean
  isNew?: boolean
  icon?: React.ComponentType<{ className?: string }>
  description?: string
}

type NavSubGroup = {
  title: string
  items: NavSubItem[]
}

type NavItem = {
  title: string
  value: string
  href: string
  isNew?: boolean
  subitems?: NavSubItem[]
  subgroups?: NavSubGroup[]
  announcement?: {
    title: string
    description: string
    href: string
    badge?: string
    icon?: React.ComponentType<{ className?: string }>
  }
}

interface DropdownNavigationProps {
  navItems: NavItem[]
}

export function DropdownNavigation({ navItems }: DropdownNavigationProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [isHover, setIsHover] = useState<string | null>(null)
  const pathname = usePathname()
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const handleHover = (menuValue: string | null) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    setOpenMenu(menuValue)
  }

  const handleMouseLeave = () => {
    // Add delay before closing to allow smooth transition between menu items
    timeoutRef.current = setTimeout(() => {
      setOpenMenu(null)
    }, 100)
  }

  const handleMouseEnter = (menuValue: string | null) => {
    // Clear timeout and set new menu
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    if (menuValue) {
      setOpenMenu(menuValue)
    }
  }

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <ul className="relative flex items-center space-x-0">
      {navItems.map((navItem) => {
        const isActive =
          navItem.value === "home"
            ? pathname === "/" || pathname === "/home"
            : pathname.startsWith(`/${navItem.value}`)

        return (
          <li
            key={navItem.value}
            className="relative"
            onMouseEnter={() =>
              handleMouseEnter(
                navItem.subitems || navItem.subgroups ? navItem.value : null,
              )
            }
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href={navItem.href}
              className={cn(
                "text-sm py-1.5 px-4 flex cursor-pointer group transition-colors duration-300 items-center justify-center gap-1 relative",
                isActive
                  ? "text-accent-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onMouseEnter={() => setIsHover(navItem.value)}
              onMouseLeave={() => setIsHover(null)}
            >
              <span className="relative z-10">{navItem.title}</span>
              {navItem.isNew && (
                <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] relative z-10">
                  New
                </span>
              )}
              {(navItem.subitems || navItem.subgroups) && (
                <ChevronDown
                  className={`h-3 w-3 ml-1 group-hover:rotate-180 duration-300 transition-transform relative z-10 ${
                    openMenu === navItem.value ? "rotate-180" : ""
                  }`}
                />
              )}
              {(isHover === navItem.value ||
                openMenu === navItem.value ||
                isActive) && (
                <motion.div
                  layoutId="hover-bg"
                  className={cn(
                    "absolute inset-0 size-full rounded-md z-0",
                    isActive ? "bg-accent" : "bg-accent/50",
                  )}
                />
              )}
            </Link>

            <AnimatePresence>
              {openMenu === navItem.value &&
                (navItem.subitems || navItem.subgroups) && (
                  <div
                    className="w-auto absolute left-0 top-full pt-2 z-50"
                    onMouseEnter={() => handleMouseEnter(navItem.value)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <motion.div
                      className="bg-popover border border-border p-4 w-max shadow-lg"
                      style={{ borderRadius: 12 }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                    >
                      {/* Render subgroups if available */}
                      {navItem.subgroups && (
                        <div className="flex gap-8">
                          {navItem.subgroups.map((group) => (
                            <div key={group.title} className="min-w-0">
                              <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                {group.title}
                              </h3>
                              <div className="space-y-1">
                                {group.items.map((item) => {
                                  const Icon = item.icon
                                  return (
                                    <motion.div
                                      layout
                                      className="w-full"
                                      key={item.title}
                                    >
                                      <Link
                                        href={item.href}
                                        target={
                                          item.externalLink
                                            ? "_blank"
                                            : undefined
                                        }
                                        rel={
                                          item.externalLink
                                            ? "noopener noreferrer"
                                            : undefined
                                        }
                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors duration-200 group min-w-[200px]"
                                      >
                                        {Icon && (
                                          <div className="mt-0.5 p-1.5 rounded-md bg-muted text-muted-foreground group-hover:bg-accent-foreground group-hover:text-accent transition-colors">
                                            <Icon className="h-4 w-4" />
                                          </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-foreground">
                                              {item.title}
                                            </span>
                                            {item.isNew && (
                                              <span className="rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000]">
                                                New
                                              </span>
                                            )}
                                            {item.externalLink && (
                                              <ArrowUpRight className="h-3 w-3 text-muted-foreground group-hover:text-accent-foreground" />
                                            )}
                                          </div>
                                          {item.description && (
                                            <p className="text-xs text-muted-foreground mt-1 group-hover:text-accent-foreground/80">
                                              {item.description}
                                            </p>
                                          )}
                                        </div>
                                      </Link>
                                    </motion.div>
                                  )
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Render announcement if available */}
                      {navItem.announcement && (
                        <div className="border-t border-border mt-3 pt-3">
                          <Link
                            href={navItem.announcement.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors duration-200 group"
                          >
                            <div className="flex items-start gap-3">
                              {navItem.announcement.icon && (
                                <div className="mt-0.5 p-1.5 rounded-md bg-muted text-muted-foreground group-hover:bg-accent-foreground group-hover:text-accent transition-colors">
                                  <navItem.announcement.icon className="h-4 w-4" />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium text-foreground">
                                    {navItem.announcement.title}
                                  </span>
                                  {navItem.announcement.badge && (
                                    <span className="rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000]">
                                      {navItem.announcement.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground group-hover:text-accent-foreground/80">
                                  {navItem.announcement.description}
                                </p>
                              </div>
                              <ArrowUpRight className="h-3 w-3 text-muted-foreground group-hover:text-accent-foreground mt-0.5" />
                            </div>
                          </Link>
                        </div>
                      )}

                      {/* Render simple subitems if no subgroups */}
                      {navItem.subitems && !navItem.subgroups && (
                        <div className="w-fit shrink-0 flex flex-col space-y-1 overflow-hidden">
                          {navItem.subitems.map((subitem) => {
                            const Icon = subitem.icon
                            return (
                              <motion.div
                                layout
                                className="w-full"
                                key={subitem.title}
                              >
                                <Link
                                  href={subitem.href}
                                  target={
                                    subitem.externalLink ? "_blank" : undefined
                                  }
                                  rel={
                                    subitem.externalLink
                                      ? "noopener noreferrer"
                                      : undefined
                                  }
                                  className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors duration-200 group min-w-[180px]"
                                >
                                  {Icon && (
                                    <div className="p-1 rounded-md bg-muted text-muted-foreground group-hover:bg-accent-foreground group-hover:text-accent transition-colors">
                                      <Icon className="h-3.5 w-3.5" />
                                    </div>
                                  )}
                                  <div className="flex items-center justify-between flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-foreground font-medium">
                                        {subitem.title}
                                      </span>
                                      {subitem.isNew && (
                                        <span className="rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000]">
                                          New
                                        </span>
                                      )}
                                    </div>
                                    {subitem.externalLink && (
                                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent-foreground" />
                                    )}
                                  </div>
                                </Link>
                              </motion.div>
                            )
                          })}
                        </div>
                      )}
                    </motion.div>
                  </div>
                )}
            </AnimatePresence>
          </li>
        )
      })}
    </ul>
  )
}
