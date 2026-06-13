import { useEffect, useState } from "react"

// Desktop API interface (must match global.d.ts)
interface DesktopApiInterface {
  getVersion: () => Promise<string>
  getPlatform: () => Promise<NodeJS.Platform>
  // Window controls
  windowMinimize: () => Promise<void>
  windowMaximize: () => Promise<void>
  windowClose: () => Promise<void>
  windowIsMaximized: () => Promise<boolean>
  // Auth
  getUser: () => Promise<{
    id: string
    email: string
    name: string | null
    imageUrl: string | null
    username: string | null
  } | null>
  isAuthenticated: () => Promise<boolean>
  logout: () => Promise<void>
  startAuthFlow: () => Promise<void>
  onAuthSuccess: (callback: (user: any) => void) => () => void
  onAuthError: (callback: (error: string) => void) => () => void
}

/**
 * Hook to detect if the app is running inside Electron
 * Returns true if running in Electron desktop app, false otherwise
 */
export function useIsElectron(): boolean {
  const [isElectron, setIsElectron] = useState(false)

  useEffect(() => {
    // Check if we're in Electron environment
    const isElectronEnv =
      typeof window !== "undefined" &&
      // Check for Electron-specific APIs
      (typeof window.desktopApi !== "undefined" ||
        // Alternative check via user agent
        navigator.userAgent.toLowerCase().includes("electron") ||
        // Check for window.process (Electron exposes this)
        // @ts-ignore
        !!(window.process && window.process.type))

    setIsElectron(isElectronEnv)
  }, [])

  return isElectron
}

/**
 * Get desktop API if available (only works in Electron)
 */
export function useDesktopApi(): DesktopApiInterface | null {
  const isElectron = useIsElectron()

  if (!isElectron || typeof window === "undefined") {
    return null
  }

  return (window.desktopApi as DesktopApiInterface | undefined) ?? null
}

/**
 * Hook to get desktop user
 */
export function useDesktopUser() {
  const [user, setUser] = useState<{
    id: string
    email: string
    name: string | null
    imageUrl: string | null
    username: string | null
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const desktopApi = useDesktopApi()

  useEffect(() => {
    if (!desktopApi) {
      setLoading(false)
      return
    }

    desktopApi.getUser().then((userData) => {
      setUser(userData)
      setLoading(false)
    })

    // Listen for auth changes
    const unsubSuccess = desktopApi.onAuthSuccess((userData) => {
      setUser(userData)
    })

    return () => {
      unsubSuccess()
    }
  }, [desktopApi])

  return { user, loading, isElectron: !!desktopApi }
}
