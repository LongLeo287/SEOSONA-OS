"use client"

import { createContext, useContext, ReactNode } from "react"

interface DesktopAuthContextValue {
  isDesktopAuth: boolean
  desktopUserId: string | null
}

const DesktopAuthContext = createContext<DesktopAuthContextValue>({
  isDesktopAuth: false,
  desktopUserId: null,
})

export function DesktopAuthProvider({
  children,
  isDesktopAuth,
  desktopUserId,
}: {
  children: ReactNode
  isDesktopAuth: boolean
  desktopUserId: string | null
}) {
  return (
    <DesktopAuthContext.Provider value={{ isDesktopAuth, desktopUserId }}>
      {children}
    </DesktopAuthContext.Provider>
  )
}

export function useDesktopAuth() {
  return useContext(DesktopAuthContext)
}
