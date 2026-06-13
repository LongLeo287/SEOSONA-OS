"use client"

import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import Link from "next/link"
import React, { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { BrandAssetsMenu, useBrandAssetsMenu } from "./brand-assets-menu"

interface LogoProps {
  fill?: string
  className?: string
  position?: "fixed" | "flex"
  hasLink?: boolean
}

export function Logo({
  fill = "currentColor",
  className,
  position = "fixed",
  hasLink = true,
}: LogoProps) {
  const { isVisible, setIsVisible, toggleMenu } = useBrandAssetsMenu()
  const logoRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Brand menu visibility state change
  }, [isVisible])

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsVisible(true)
  }

  const svgLogo = (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="21st logo - Right-click to open brand assets menu"
    >
      <path
        d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.5 35.5 20 40H40C40 51.0457 31.0457 60 20 60C8.95431 60 0 51.0457 0 40C0 28.9543 9.5 22 20 20H0Z"
        fill={fill}
      />
      <path
        d="M40 60C51.7324 55.0977 60 43.5117 60 30C60 16.4883 51.7324 4.90234 40 0V60Z"
        fill={fill}
      />
    </svg>
  )

  const renderLogo = () => {
    if (!isMounted) {
      return null
    }
    return <div className="w-full h-full relative">{svgLogo}</div>
  }

  const renderMenu = () => {
    if (!isVisible) return null

    if (isMounted) {
      return createPortal(
        <BrandAssetsMenu isVisible={isVisible} setIsVisible={setIsVisible} />,
        document.body,
      )
    }

    return null
  }

  if (!hasLink) {
    return (
      <div
        ref={logoRef}
        className={cn(
          `${position === "fixed" ? position : ""} w-6 h-6 flex items-center justify-center ${position === "fixed" ? "left-4 top-4" : ""} rounded-full group cursor-pointer relative`,
          className,
        )}
        onContextMenu={handleContextMenu}
        title="Right-click for brand assets menu"
      >
        {renderLogo()}
        {renderMenu()}
        <span
          id="brand-tooltip"
          role="tooltip"
          className="opacity-0 hidden bg-white w-max group-focus-within:block text-[13px] text-slate-600 absolute shadow-md left-1/2 px-1 -translate-x-1/2 rounded-md transition-opacity top-full mt-1 dark:bg-neutral-900 dark:text-indigo-100 dark:outline dark:outline-1 dark:outline-neutral-700/50"
          style={{ animationDelay: "1000ms" }}
        >
          Right-Click to open brand menu
        </span>
      </div>
    )
  }

  return (
    <div ref={logoRef} className="relative">
      <Link
        href="/home"
        className={cn(
          `${position === "fixed" ? position : ""} w-6 h-6 flex items-center justify-center ${position === "fixed" ? "left-4 top-4" : ""} rounded-full group cursor-pointer`,
          className,
        )}
        onContextMenu={handleContextMenu}
        title="Right-click for brand assets menu"
      >
        {renderLogo()}
        <span
          id="brand-tooltip"
          role="tooltip"
          className="opacity-0 hidden bg-white w-max group-focus-within:block text-[13px] text-slate-600 absolute shadow-md left-1/2 px-1 -translate-x-1/2 rounded-md transition-opacity top-full mt-1 dark:bg-neutral-900 dark:text-indigo-100 dark:outline dark:outline-1 dark:outline-neutral-700/50"
          style={{ animationDelay: "1000ms" }}
        >
          Right-Click to open brand menu
        </span>
      </Link>
      {renderMenu()}
    </div>
  )
}
