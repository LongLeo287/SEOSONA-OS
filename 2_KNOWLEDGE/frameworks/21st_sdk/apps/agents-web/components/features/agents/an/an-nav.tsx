"use client"

import { useState } from "react"
import { Logo } from "@/components/features/agents/ui/canvas/[id]/{components}/ui/logo"
import { AnEarlyAccessDialog } from "./an-early-access-dialog"

export function AnNav() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <nav className="flex items-center justify-between px-8 py-5">
        <span className="flex items-center gap-2 text-sm font-medium tracking-tight">
          <Logo className="w-4 h-4" fill="white" />
          21st
        </span>

        <div className="flex items-center gap-2">
          <a
            href="#how-it-works"
            className="hidden sm:inline-flex items-center justify-center rounded-[10px] h-8 px-3 text-sm font-medium text-white/50 hover:text-white active:scale-[0.99] transition-all duration-150"
          >
            How it works
          </a>
          <button
            onClick={() => setDialogOpen(true)}
            className="inline-flex items-center justify-center rounded-[10px] h-8 px-4 text-sm font-medium bg-white text-[#09090b] hover:bg-white/90 shadow-[0_0_0_0.5px_rgba(255,255,255,0.5),inset_0_0_0_1px_rgba(255,255,255,0.14)] active:scale-[0.99] transition-all duration-150"
          >
            Get early access
          </button>
        </div>
      </nav>

      <AnEarlyAccessDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
