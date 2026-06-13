"use client"

import { useEffect, useState } from "react"
import {
  getLatestDesktopVersion,
  getLatestWindowsVersion,
  getLatestLinuxVersion,
  buildDesktopDownloadUrl,
  buildWindowsDownloadUrl,
  buildLinuxDownloadUrl,
} from "@/lib/desktop"

export type DesktopPlatform = "macos" | "windows" | "linux" | "unknown"

interface UseDesktopDownloadReturn {
  platform: DesktopPlatform | null
  downloadUrl: string | null
  isLoading: boolean
  platformLabel: string | null
  isDesktopAvailable: boolean
}

function detectPlatform(): DesktopPlatform {
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes("mac")) return "macos"
  if (ua.includes("win")) return "windows"
  if (ua.includes("linux")) return "linux"
  return "unknown"
}

export function useDesktopDownload(): UseDesktopDownloadReturn {
  const [platform, setPlatform] = useState<DesktopPlatform | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const detected = detectPlatform()
    setPlatform(detected)

    if (detected === "macos") {
      getLatestDesktopVersion().then((version) => {
        setDownloadUrl(buildDesktopDownloadUrl(version, "arm64"))
        setIsLoading(false)
      })
    } else if (detected === "windows") {
      getLatestWindowsVersion().then((version) => {
        setDownloadUrl(buildWindowsDownloadUrl(version))
        setIsLoading(false)
      })
    } else if (detected === "linux") {
      getLatestLinuxVersion().then((version) => {
        setDownloadUrl(buildLinuxDownloadUrl(version))
        setIsLoading(false)
      })
    } else {
      setIsLoading(false)
    }
  }, [])

  const platformLabel =
    platform === "macos"
      ? "macOS"
      : platform === "windows"
        ? "Windows"
        : platform === "linux"
          ? "Linux"
          : null

  const isDesktopAvailable = platform === "macos" || platform === "windows" || platform === "linux"

  return { platform, downloadUrl, isLoading, platformLabel, isDesktopAvailable }
}
