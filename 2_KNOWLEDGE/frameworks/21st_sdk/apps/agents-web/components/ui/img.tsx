"use client"

import {
  cloudflarePreviewImageLoader,
  isCloudflarePreviewImage,
} from "@/lib/cloudflare-image"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useEffect, useState } from "react"

type ImgProps = {
  src: string
  alt: string
  width: number
  height: number
  fallbackSrc?: string
  className?: string
  quality?: number
  sizes?: string
  onLoad?: () => void
  onError?: () => void
}

export default function Img({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc = "/placeholder.svg",
  quality = 75,
  sizes,
  onLoad,
  onError,
}: ImgProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const useCloudflareLoader = isCloudflarePreviewImage(imgSrc)

  useEffect(() => {
    setImgSrc(src)
  }, [src])

  // Cloudflare Transform-via-URL
  // const urlOptions = {
  //   width: 640, // 280 * 2,
  //   height: 480, // 210 * 2,
  //   quality: 75,
  //   fit: "cover",
  //   format: "webp",
  //   //"slow-connection-quality": 50,
  // }
  // const optionsString = Object.entries(urlOptions)
  //   .filter(([_, value]) => value !== undefined)
  //   .map(([key, value]) => `${key}=${value}`)
  //   .join(",")
  //const transformedUrl = `${process.env.NEXT_PUBLIC_CLOUDFLARE_ZONE_URL}/cdn-cgi/image/${optionsString}/${src}`

  // Vercel Image Optimization
  // const transformUrl = (w: number) => {
  //   const params = new URLSearchParams({
  //     url: imgSrc,
  //     w: w.toString(),
  //     q: quality.toString(),
  //   })
  //   return `/_next/image?${params.toString()}`
  // }

  // // Preserve Retina
  // const transformedUrls = [
  //   `${transformUrl(width)} 1x`,
  //   `${transformUrl(width * 2)} 2x`,
  // ]

  return (
    <>
      {/* <img
        srcSet={transformedUrls.join(", ")}
        alt={alt}
        className={cn("w-full h-full object-cover")}
        width={width}
        height={height}
        loading="lazy"
        onError={() => {
          if (fallbackSrc) {
            setImgSrc(fallbackSrc)
          }
        }}
      /> */}
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        loader={useCloudflareLoader ? cloudflarePreviewImageLoader : undefined}
        className={cn("w-full h-full object-cover", className)}
        quality={quality}
        sizes={sizes}
        loading="lazy"
        onLoad={() => {
          onLoad?.()
        }}
        onError={() => {
          if (fallbackSrc) {
            setImgSrc(fallbackSrc)
          }
          onError?.()
        }}
      />
    </>
  )
}
