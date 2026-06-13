// Desktop API types (exposed by Electron preload)
interface DesktopApi {
  getVersion: () => Promise<string>
  getPlatform: () => Promise<NodeJS.Platform>
  // Window controls
  windowMinimize: () => Promise<void>
  windowMaximize: () => Promise<void>
  windowClose: () => Promise<void>
  windowIsMaximized: () => Promise<boolean>
  windowToggleFullscreen: () => Promise<void>
  windowIsFullscreen: () => Promise<boolean>
  onFullscreenChange: (callback: (isFullscreen: boolean) => void) => () => void
  onFocusChange: (callback: (isFocused: boolean) => void) => () => void
  // Zoom controls
  zoomIn: () => Promise<void>
  zoomOut: () => Promise<void>
  zoomReset: () => Promise<void>
  getZoom: () => Promise<number>
  // Badge count (dock badge on macOS)
  setBadge: (count: number | null) => Promise<void>
  // Native notifications
  showNotification: (options: { title: string; body: string }) => Promise<void>
  // Clipboard
  clipboardWrite: (text: string) => Promise<void>
  clipboardRead: () => Promise<string>
  // Open external URL
  openExternal: (url: string) => Promise<void>
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

declare global {
  interface Window {
    desktopApi?: DesktopApi
  }
}

export {}
