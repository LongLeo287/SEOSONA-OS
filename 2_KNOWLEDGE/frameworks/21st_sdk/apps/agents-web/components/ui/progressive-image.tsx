"use client"

import NextImage from "next/image"
import { cn } from "@/lib/utils"
import { memo, useState } from "react"

type ProgressiveImageProps = {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  sizes?: string
  priority?: boolean
}

function ProgressiveImage({
  src,
  alt,
  className,
  width = 800,
  height = 600,
  sizes = "(min-width: 720px) 200px, 40vw",
  priority = false,
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <>
      {!isLoaded && (
        <div className={cn(className, "bg-muted animate-pulse")} aria-hidden />
      )}
      <NextImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className={cn("opacity-0", isLoaded && "opacity-100", className)}
        onLoadingComplete={() => setIsLoaded(true)}
        priority={priority}
      />
    </>
  )
}

export default memo(ProgressiveImage)
