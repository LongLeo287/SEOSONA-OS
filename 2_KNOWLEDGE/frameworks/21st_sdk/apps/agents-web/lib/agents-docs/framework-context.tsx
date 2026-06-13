"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export const FRAMEWORKS = [
  { id: "nextjs", name: "Next.js" },
  { id: "react", name: "React" },
  { id: "js-backend", name: "JS Backend SDK" },
] as const

export type FrameworkId = (typeof FRAMEWORKS)[number]["id"]

interface FrameworkContextValue {
  framework: FrameworkId
  setFramework: (id: FrameworkId) => void
}

const FrameworkContext = createContext<FrameworkContextValue>({
  framework: "nextjs",
  setFramework: () => {},
})

const STORAGE_KEY = "an-docs-framework"

export function FrameworkProvider({ children }: { children: ReactNode }) {
  const [framework, setFrameworkState] = useState<FrameworkId>("nextjs")

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && FRAMEWORKS.some((f) => f.id === stored)) {
      setFrameworkState(stored as FrameworkId)
    }
  }, [])

  const setFramework = (id: FrameworkId) => {
    setFrameworkState(id)
    localStorage.setItem(STORAGE_KEY, id)
  }

  return (
    <FrameworkContext.Provider value={{ framework, setFramework }}>
      {children}
    </FrameworkContext.Provider>
  )
}

export function useFramework() {
  return useContext(FrameworkContext)
}
