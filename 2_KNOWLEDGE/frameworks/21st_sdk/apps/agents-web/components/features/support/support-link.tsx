"use client"

import { openSupportChat } from "./featurebase-provider"

interface SupportLinkProps {
  className?: string
  children: React.ReactNode
}

export function SupportLink({ className, children }: SupportLinkProps) {
  return (
    <button type="button" onClick={openSupportChat} className={className}>
      {children}
    </button>
  )
}

