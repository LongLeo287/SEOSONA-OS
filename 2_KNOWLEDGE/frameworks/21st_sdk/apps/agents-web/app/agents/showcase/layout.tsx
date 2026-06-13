"use client"

import { useState } from "react"
import { ShowcaseSidebar } from "@/components/features/agents/an/showcase/components/sidebar"
import { ShowcaseContext } from "@/components/features/agents/an/showcase/lib/showcase-context"
import "@21st-sdk/react/styles.css"

export default function ShowcaseLayout({ children }: { children: React.ReactNode }) {
  const [colorMode, setColorMode] = useState<"light" | "dark">("light")

  return (
    <ShowcaseContext.Provider value={{ colorMode }}>
      <div className="h-screen flex overflow-hidden bg-white">
        <ShowcaseSidebar colorMode={colorMode} onColorModeChange={setColorMode} />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </ShowcaseContext.Provider>
  )
}
