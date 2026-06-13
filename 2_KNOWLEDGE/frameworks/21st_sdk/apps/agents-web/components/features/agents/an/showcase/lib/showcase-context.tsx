"use client"

import { createContext, useContext } from "react"

interface ShowcaseContextValue {
  colorMode: "light" | "dark"
}

export const ShowcaseContext = createContext<ShowcaseContextValue>({ colorMode: "light" })

export function useShowcaseContext() {
  return useContext(ShowcaseContext)
}
