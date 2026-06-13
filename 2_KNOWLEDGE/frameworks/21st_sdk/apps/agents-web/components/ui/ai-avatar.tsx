"use client"

import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import dynamic from "next/dynamic"
import React, { useEffect, useRef, useState } from "react"

const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

// Animation cache to prevent multiple fetches of the same file
const animationCache = new Map<string, any>()

// Preload the default animation
if (typeof window !== "undefined") {
  fetch("/loading.json")
    .then((response) => response.json())
    .then((data) => {
      animationCache.set("/loading.json", data)
    })
    .catch((error) => console.error("Error preloading animation:", error))
}

interface AIAvatarProps {
  isThinking?: boolean
  className?: string
  size?: number
  animationFile?: string
}

export function AIAvatar({
  isThinking = false,
  className,
  size = 32,
  animationFile = "/loading.json",
}: AIAvatarProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [animationData, setAnimationData] = useState<any>(
    animationCache.get(animationFile) || null,
  )
  const [lottieReady, setLottieReady] = useState(false)
  const hasFetchedRef = useRef(false)
  const { resolvedTheme } = useTheme()

  // Only render on client-side
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Skip fetch if we already have the animation in cache
    if (animationCache.has(animationFile)) {
      setAnimationData(animationCache.get(animationFile))
      return
    }

    // Skip duplicate fetches
    if (hasFetchedRef.current) return
    hasFetchedRef.current = true

    // We'll use the JSON file as default
    if (animationFile && animationFile.endsWith(".json")) {
      fetch(animationFile)
        .then((response) => response.json())
        .then((data) => {
          // Cache the animation data
          animationCache.set(animationFile, data)
          setAnimationData(data)
        })
        .catch((error) =>
          console.error("Error loading Lottie animation:", error),
        )
    }
  }, [animationFile])

  // Set lottieReady to true after a small delay when animation data is available
  useEffect(() => {
    if (animationData) {
      const timer = setTimeout(() => {
        setLottieReady(true)
      }, 300) // Small delay to ensure Lottie is rendered before fading in
      return () => clearTimeout(timer)
    }
  }, [animationData])

  const staticLogo = (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="21st AI Assistant"
    >
      <path
        d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.5 35.5 20 40H40C40 51.0457 31.0457 60 20 60C8.95431 60 0 51.0457 0 40C0 28.9543 9.5 22 20 20H0Z"
        fill="currentColor"
      />
      <path
        d="M40 60C51.7324 55.0977 60 43.5117 60 30C60 16.4883 51.7324 4.90234 40 0V60Z"
        fill="currentColor"
      />
    </svg>
  )

  if (!isMounted) {
    return null
  }

  return (
    <div
      className={cn("flex items-center justify-center shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <div
        className="w-6 h-6 relative"
        style={{
          color: resolvedTheme === "dark" ? "white" : "black",
        }}
      >
        {/* Static Logo */}
        <div
          className={cn(
            "w-full h-full absolute inset-0 transition-opacity duration-300",
            isThinking ? "opacity-0" : "opacity-100",
          )}
        >
          {staticLogo}
        </div>

        {/* Animated Logo when thinking */}
        {animationData && (
          <div
            className={cn(
              "w-full h-full absolute inset-0 transition-opacity duration-300",
              isThinking && lottieReady ? "opacity-100" : "opacity-0",
            )}
            style={{
              filter:
                resolvedTheme === "dark"
                  ? "brightness(0) invert(1)" // Makes it white in dark mode
                  : "brightness(0)", // Makes it black in light mode
            }}
          >
            <Lottie
              animationData={animationData}
              style={{ width: "100%", height: "100%" }}
              rendererSettings={{
                preserveAspectRatio: "xMidYMid slice",
                progressiveLoad: true,
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
