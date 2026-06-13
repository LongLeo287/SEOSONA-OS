"use client"

import Link, { type LinkProps } from "next/link"
import { forwardRef } from "react"
import { agentsHref } from "@/lib/utils/agents-href"

type AgentsLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof LinkProps
> &
  LinkProps & { children?: React.ReactNode }

export const AgentsLink = forwardRef<HTMLAnchorElement, AgentsLinkProps>(
  function AgentsLink({ href, ...props }, ref) {
    const resolved = typeof href === "string" ? agentsHref(href) : href
    return <Link ref={ref} href={resolved} {...props} />
  },
)
