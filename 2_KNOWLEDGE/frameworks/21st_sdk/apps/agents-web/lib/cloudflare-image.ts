import type { ImageLoaderProps } from "next/image"

const CLOUDFLARE_IMAGE_HOSTS = new Set(["cdn.21st.dev", "assets.21st.dev"])

export const COMMUNITY_COMPONENT_CARD_SIZES =
  "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1536px) 33vw, 25vw"

export const COMMUNITY_SCREEN_CARD_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"

export const DIALOG_COMPONENT_CARD_SIZES =
  "(max-width: 768px) 100vw, 50vw"

export const FIXED_32PX_ICON_SIZES = "32px"
export const FIXED_40PX_ICON_SIZES = "40px"

export function isCloudflarePreviewImage(src: string): boolean {
  if (
    !src ||
    src.startsWith("/") ||
    src.startsWith("data:") ||
    src.startsWith("blob:")
  ) {
    return false
  }

  try {
    const sourceUrl = new URL(src)
    return (
      CLOUDFLARE_IMAGE_HOSTS.has(sourceUrl.hostname) &&
      !sourceUrl.pathname.toLowerCase().endsWith(".svg")
    )
  } catch {
    return false
  }
}

export function cloudflarePreviewImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  const sourceUrl = new URL(src)
  const transformOptions = [
    "fit=scale-down",
    `width=${Math.max(1, Math.round(width))}`,
    `quality=${quality ?? 75}`,
    "format=auto",
  ]

  return `${sourceUrl.origin}/cdn-cgi/image/${transformOptions.join(",")}/${sourceUrl.href}`
}
