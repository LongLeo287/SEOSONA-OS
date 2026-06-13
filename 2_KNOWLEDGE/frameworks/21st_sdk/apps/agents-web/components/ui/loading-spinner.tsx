"use client"

import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

// Animation cache to prevent multiple fetches of the same file
const animationCache = new Map<string, any>()

interface LoadingSpinnerProps {
  size?: "xs" | "sm"
  className?: string
  animationFile?: string
  logoFill?: string
}

export const LoadingSpinner = ({
  size = "sm",
  className,
  animationFile = "/loading.json",
  logoFill = "currentColor",
}: LoadingSpinnerProps) => {
  const [animationData, setAnimationData] = useState<any>(null)
  const [lottieReady, setLottieReady] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const hasFetchedRef = useRef(false)
  const { resolvedTheme } = useTheme()

  // Track when component is mounted to avoid hydration issues
  useEffect(() => {
    setIsMounted(true)
    // Check cache after mounting
    if (animationCache.has(animationFile)) {
      setAnimationData(animationCache.get(animationFile))
    }
  }, [])

  // Унифицированные размеры для SVG и Lottie
  const sizeMap = {
    xs: { className: "w-6 h-6", style: { width: "1.5rem", height: "1.5rem" } },
    sm: { className: "w-8 h-8", style: { width: "2rem", height: "2rem" } },
  }

  useEffect(() => {
    // Only fetch on client after mounting
    if (!isMounted) return

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
  }, [animationFile, isMounted])

  // Set lottieReady to true after a small delay when animation data is available and mounted
  useEffect(() => {
    if (animationData && isMounted) {
      const timer = setTimeout(() => {
        setLottieReady(true)
      }, 300) // Small delay to ensure Lottie is rendered before fading in
      return () => clearTimeout(timer)
    }
  }, [animationData, isMounted])

  return (
    <div
      data-test="logo-loading-spinner"
      className={cn(
        "w-full h-full flex items-center justify-center",
        className,
        (!lottieReady || !isMounted) && "animate-pulse",
      )}
    >
      <div
        className={cn(
          sizeMap[size].className,
          "flex items-center justify-center relative",
        )}
      >
        {/* Always render both with absolute positioning for smooth transition */}
        <div
          className={cn(
            "w-full h-full animate-spin-slow absolute inset-0 transition-opacity duration-300",
            lottieReady && animationData && isMounted
              ? "opacity-0"
              : "opacity-100",
          )}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="21st logo loading"
          >
            <path
              d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.5 35.5 20 40H40C40 51.0457 31.0457 60 20 60C8.95431 60 0 51.0457 0 40C0 28.9543 9.5 22 20 20H0Z"
              fill={logoFill}
            />
            <path
              d="M40 60C51.7324 55.0977 60 43.5117 60 30C60 16.4883 51.7324 4.90234 40 0V60Z"
              fill={logoFill}
            />
          </svg>
        </div>

        {/* Always render container to avoid hydration mismatch */}
        <div
          className={cn(
            "w-full h-full absolute inset-0 transition-opacity duration-300",
            lottieReady && animationData && isMounted
              ? "opacity-100"
              : "opacity-0",
            isMounted && resolvedTheme === "dark" && "lottie-dark-mode",
          )}
        >
          {animationData && isMounted && (
            <Lottie
              animationData={animationData}
              loop={true}
              style={{ width: "100%", height: "100%" }}
              rendererSettings={{
                preserveAspectRatio: "xMidYMid slice",
                progressiveLoad: true,
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export const LoadingSpinnerPage = ({
  size,
  className,
  animationFile,
  logoFill,
}: LoadingSpinnerProps) => (
  <div
    className={cn(
      "w-full h-screen flex items-center justify-center bg-background",
      className,
    )}
  >
    <LoadingSpinner
      size={size}
      animationFile={animationFile}
      logoFill={logoFill}
    />
  </div>
)
