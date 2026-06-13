"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type ActiveFilterContextValue = {
  activeOnly: boolean
  setActiveOnly: (v: boolean | ((prev: boolean) => boolean)) => void
}

const ActiveFilterContext = createContext<ActiveFilterContextValue>({
  activeOnly: true,
  setActiveOnly: () => {},
})

export function ActiveFilterProvider({ children }: { children: ReactNode }) {
  const [activeOnly, setActiveOnly] = useState(true)
  return (
    <ActiveFilterContext.Provider value={{ activeOnly, setActiveOnly }}>
      {children}
    </ActiveFilterContext.Provider>
  )
}

export function useActiveFilter() {
  return useContext(ActiveFilterContext)
}
