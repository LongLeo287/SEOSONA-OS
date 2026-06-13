// Desktop app download configuration
// Version is fetched dynamically from latest-mac.yml manifest (same as auto-updater)

export const DESKTOP_DOWNLOAD_BASE_URL = "https://cdn.21st.dev/releases/desktop"
export const DESKTOP_MANIFEST_URL = `${DESKTOP_DOWNLOAD_BASE_URL}/latest-mac.yml`
export const DESKTOP_MANIFEST_WIN_URL = `${DESKTOP_DOWNLOAD_BASE_URL}/latest.yml`
export const DESKTOP_MANIFEST_LINUX_URL = `${DESKTOP_DOWNLOAD_BASE_URL}/latest-linux.yml`

// Fallback version - update this when releasing new versions as a safety net
const FALLBACK_VERSION = "0.0.69"

// In-memory cache for the fetched version
let cachedVersion: string | null = null
let cacheTimestamp: number = 0
const CACHE_TTL_MS = 1 * 60 * 1000 // 1 minute (reduced from 5 to get fresh versions faster)

// App name prefix based on version (1Code for 0.0.10+, Agents for older)
function getAppPrefix(version: string): string {
  const [major, minor, patch] = version.split(".").map(Number)
  if (major === 0 && minor === 0 && patch >= 10) {
    return "1Code"
  }
  return "Agents"
}

// Parse version from YAML manifest (simple parsing, no dependency needed)
function parseVersionFromYaml(yaml: string): string | null {
  const match = yaml.match(/^version:\s*(.+)$/m)
  return match ? match[1].trim() : null
}

// Fetch latest version from manifest (for server-side use)
export async function getLatestDesktopVersion(): Promise<string> {
  const now = Date.now()

  // Return cached version if still valid
  if (cachedVersion && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedVersion
  }

  try {
    // Add cache-busting query param to bypass CDN cache
    const cacheBuster = Date.now()
    const response = await fetch(`${DESKTOP_MANIFEST_URL}?v=${cacheBuster}`, {
      cache: "no-store", // Disable Next.js cache
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const yaml = await response.text()
    const version = parseVersionFromYaml(yaml)

    if (version) {
      cachedVersion = version
      cacheTimestamp = now
      return version
    }
  } catch (error) {
    console.error("Failed to fetch desktop version from manifest:", error)
  }

  return FALLBACK_VERSION
}

// Build download URL for a specific version
export function buildDesktopDownloadUrl(version: string, arch: "arm64" | "x64" = "arm64"): string {
  const prefix = getAppPrefix(version)
  if (arch === "arm64") {
    return `${DESKTOP_DOWNLOAD_BASE_URL}/${prefix}-${version}-arm64.dmg`
  }
  return `${DESKTOP_DOWNLOAD_BASE_URL}/${prefix}-${version}.dmg`
}

// Synchronous download URL using fallback version (for client-side components)
// The fallback version should be kept up-to-date, but even if it's slightly behind,
// auto-updater will bring users to latest version after install
export function getDesktopDownloadUrl(arch: "arm64" | "x64" = "arm64"): string {
  // Use cached version if available (populated by server-side fetch), otherwise fallback
  const version = cachedVersion || FALLBACK_VERSION
  return buildDesktopDownloadUrl(version, arch)
}

// Build Windows download URL for a specific version
export function buildWindowsDownloadUrl(version: string): string {
  const prefix = getAppPrefix(version)
  // Windows NSIS installer uses "Setup" with spaces (electron-builder default)
  return `${DESKTOP_DOWNLOAD_BASE_URL}/${encodeURIComponent(`${prefix} Setup ${version}.exe`)}`
}

// Get Windows download URL (synchronous, uses cached/fallback version)
export function getWindowsDownloadUrl(): string {
  const version = cachedVersion || FALLBACK_VERSION
  return buildWindowsDownloadUrl(version)
}

// Build Linux download URL for a specific version
export function buildLinuxDownloadUrl(version: string): string {
  const prefix = getAppPrefix(version)
  return `${DESKTOP_DOWNLOAD_BASE_URL}/${prefix}-${version}.AppImage`
}

// Get Linux download URL (synchronous, uses cached/fallback version)
export function getLinuxDownloadUrl(): string {
  const version = cachedVersion || FALLBACK_VERSION
  return buildLinuxDownloadUrl(version)
}

// Fetch latest Linux version from manifest
export async function getLatestLinuxVersion(): Promise<string> {
  const now = Date.now()

  if (cachedVersion && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedVersion
  }

  try {
    const cacheBuster = Date.now()
    const response = await fetch(`${DESKTOP_MANIFEST_LINUX_URL}?v=${cacheBuster}`, {
      cache: "no-store",
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const yaml = await response.text()
    const version = parseVersionFromYaml(yaml)

    if (version) {
      cachedVersion = version
      cacheTimestamp = now
      return version
    }
  } catch (error) {
    console.error("Failed to fetch Linux desktop version from manifest:", error)
  }

  return FALLBACK_VERSION
}

// Fetch latest Windows version from manifest
export async function getLatestWindowsVersion(): Promise<string> {
  const now = Date.now()

  // Return cached version if still valid (shared cache with mac)
  if (cachedVersion && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedVersion
  }

  try {
    // Add cache-busting query param to bypass CDN cache
    const cacheBuster = Date.now()
    const response = await fetch(`${DESKTOP_MANIFEST_WIN_URL}?v=${cacheBuster}`, {
      cache: "no-store", // Disable Next.js cache
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const yaml = await response.text()
    const version = parseVersionFromYaml(yaml)

    if (version) {
      cachedVersion = version
      cacheTimestamp = now
      return version
    }
  } catch (error) {
    console.error("Failed to fetch Windows desktop version from manifest:", error)
  }

  return FALLBACK_VERSION
}
