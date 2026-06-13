// Media validation utility for social platforms

interface MediaValidationResult {
  isValid: boolean
  reason?: string
  fileSize?: number
  contentType?: string
  dimensions?: { width: number; height: number } | null
}

interface PlatformMediaRequirements {
  maxSizeBytes: number
  allowedFormats: string[]
  maxPixels?: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
}

const PLATFORM_REQUIREMENTS: Record<string, PlatformMediaRequirements> = {
  linkedin: {
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedFormats: ["image/jpeg", "image/jpg", "image/png", "image/gif"],
    maxPixels: 36152320, // LinkedIn limit
  },
  facebook: {
    maxSizeBytes: 4 * 1024 * 1024, // 4MB
    allowedFormats: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
  },
  instagram: {
    maxSizeBytes: 8 * 1024 * 1024, // 8MB
    allowedFormats: ["image/jpeg", "image/jpg", "image/png", "video/mp4"],
    minWidth: 320,
    minHeight: 320,
    maxWidth: 1920, // Max width for videos
    maxHeight: 3600, // Max height for videos
  },
  pinterest: {
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedFormats: ["image/jpeg", "image/jpg", "image/png", "image/gif"],
    // Pinterest doesn't support videos without thumbnails in API
    // Will fallback to images for video posts
  },
  twitter: {
    maxSizeBytes: 5 * 1024 * 1024, // 5MB for images
    allowedFormats: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "video/mp4",
    ],
  },
}

export async function validateMediaForPlatform(
  mediaUrl: string,
  platform: string,
  timeout: number = 5000,
): Promise<MediaValidationResult> {
  try {
    const requirements = PLATFORM_REQUIREMENTS[platform]
    if (!requirements) {
      return { isValid: false, reason: `Unknown platform: ${platform}` }
    }

    console.log(`🔍 [Media Validator] Checking ${mediaUrl} for ${platform}`)

    // Check if URL is accessible and get headers
    const response = await fetch(mediaUrl, {
      method: "HEAD",
      signal: AbortSignal.timeout(timeout),
    })

    if (!response.ok) {
      return {
        isValid: false,
        reason: `Media not accessible: ${response.status} ${response.statusText}`,
      }
    }

    const contentType = response.headers.get("content-type")?.toLowerCase()
    const contentLength = response.headers.get("content-length")

    if (!contentType) {
      return { isValid: false, reason: "No content-type header found" }
    }

    // Check format
    const isFormatAllowed = requirements.allowedFormats.some((format) =>
      contentType.includes(format.replace("image/", "").replace("video/", "")),
    )

    if (!isFormatAllowed) {
      return {
        isValid: false,
        reason: `Format ${contentType} not allowed for ${platform}. Allowed: ${requirements.allowedFormats.join(", ")}`,
      }
    }

    // Check file size
    const fileSize = contentLength ? parseInt(contentLength) : 0
    if (fileSize > requirements.maxSizeBytes) {
      return {
        isValid: false,
        reason: `File size ${Math.round((fileSize / 1024 / 1024) * 100) / 100}MB exceeds ${Math.round(requirements.maxSizeBytes / 1024 / 1024)}MB limit for ${platform}`,
        fileSize,
      }
    }

    // For images, check dimensions if needed
    if (
      contentType.startsWith("image/") &&
      (requirements.maxPixels ||
        requirements.minWidth ||
        requirements.minHeight ||
        requirements.maxWidth ||
        requirements.maxHeight)
    ) {
      try {
        const dimensions = await getImageDimensions(mediaUrl)

        if (requirements.maxPixels && dimensions) {
          const totalPixels = dimensions.width * dimensions.height
          if (totalPixels > requirements.maxPixels) {
            return {
              isValid: false,
              reason: `Image ${dimensions.width}x${dimensions.height} (${totalPixels} pixels) exceeds ${requirements.maxPixels} pixel limit for ${platform}`,
              dimensions,
            }
          }
        }

        if (
          requirements.minWidth &&
          dimensions &&
          dimensions.width < requirements.minWidth
        ) {
          return {
            isValid: false,
            reason: `Image width ${dimensions.width}px below minimum ${requirements.minWidth}px for ${platform}`,
            dimensions,
          }
        }

        if (
          requirements.minHeight &&
          dimensions &&
          dimensions.height < requirements.minHeight
        ) {
          return {
            isValid: false,
            reason: `Image height ${dimensions.height}px below minimum ${requirements.minHeight}px for ${platform}`,
            dimensions,
          }
        }

        if (
          requirements.maxWidth &&
          dimensions &&
          dimensions.width > requirements.maxWidth
        ) {
          return {
            isValid: false,
            reason: `Image width ${dimensions.width}px exceeds maximum ${requirements.maxWidth}px for ${platform}`,
            dimensions,
          }
        }

        if (
          requirements.maxHeight &&
          dimensions &&
          dimensions.height > requirements.maxHeight
        ) {
          return {
            isValid: false,
            reason: `Image height ${dimensions.height}px exceeds maximum ${requirements.maxHeight}px for ${platform}`,
            dimensions,
          }
        }

        return {
          isValid: true,
          fileSize,
          contentType,
          dimensions,
        }
      } catch (dimensionError) {
        console.warn(
          `⚠️ [Media Validator] Could not get dimensions for ${mediaUrl}:`,
          dimensionError,
        )
        // If we can't get dimensions but other checks pass, assume it's valid
        return {
          isValid: true,
          fileSize,
          contentType,
        }
      }
    }

    // For videos, check dimensions if specified (Instagram has video size limits)
    if (
      contentType.startsWith("video/") &&
      (requirements.maxWidth || requirements.maxHeight)
    ) {
      try {
        const dimensions = await getVideoDimensions(mediaUrl)

        if (
          requirements.maxWidth &&
          dimensions &&
          dimensions.width > requirements.maxWidth
        ) {
          return {
            isValid: false,
            reason: `Video width ${dimensions.width}px exceeds maximum ${requirements.maxWidth}px for ${platform}`,
            dimensions,
          }
        }

        if (
          requirements.maxHeight &&
          dimensions &&
          dimensions.height > requirements.maxHeight
        ) {
          return {
            isValid: false,
            reason: `Video height ${dimensions.height}px exceeds maximum ${requirements.maxHeight}px for ${platform}`,
            dimensions,
          }
        }

        return {
          isValid: true,
          fileSize,
          contentType,
          dimensions,
        }
      } catch (dimensionError) {
        console.warn(
          `⚠️ [Media Validator] Could not get video dimensions for ${mediaUrl}:`,
          dimensionError,
        )
        // If we can't get video dimensions but other checks pass, assume it's valid
        return {
          isValid: true,
          fileSize,
          contentType,
        }
      }
    }

    return {
      isValid: true,
      fileSize,
      contentType,
    }
  } catch (error) {
    console.error(`❌ [Media Validator] Error validating ${mediaUrl}:`, error)
    return {
      isValid: false,
      reason: `Validation error: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

async function getImageDimensions(
  imageUrl: string,
): Promise<{ width: number; height: number } | null> {
  try {
    // Download first few KB to get image headers
    const response = await fetch(imageUrl, {
      headers: {
        Range: "bytes=0-2048", // First 2KB should be enough for headers
      },
      signal: AbortSignal.timeout(3000),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch image headers: ${response.status}`)
    }

    const buffer = await response.arrayBuffer()
    const uint8Array = new Uint8Array(buffer)

    // Try to extract dimensions from image headers
    if (uint8Array[0] === 0xff && uint8Array[1] === 0xd8) {
      // JPEG
      return extractJPEGDimensions(uint8Array)
    } else if (uint8Array[0] === 0x89 && uint8Array[1] === 0x50) {
      // PNG
      return extractPNGDimensions(uint8Array)
    } else if (uint8Array[0] === 0x47 && uint8Array[1] === 0x49) {
      // GIF
      return extractGIFDimensions(uint8Array)
    }

    return null
  } catch (error) {
    console.warn(`⚠️ [Media Validator] Could not extract dimensions:`, error)
    return null
  }
}

function extractJPEGDimensions(
  data: Uint8Array,
): { width: number; height: number } | null {
  let i = 2
  while (i < data.length) {
    if (data[i] !== 0xff) break

    if (i + 1 >= data.length) break
    const marker = data[i + 1]
    if (marker === 0xc0 || marker === 0xc2) {
      // SOF0 or SOF2 - need at least 9 bytes from current position
      if (i + 8 >= data.length) break
      const height = (data[i + 5]! << 8) | data[i + 6]!
      const width = (data[i + 7]! << 8) | data[i + 8]!
      return { width, height }
    }

    if (i + 3 >= data.length) break
    const length = (data[i + 2]! << 8) | data[i + 3]!
    i += 2 + length
  }
  return null
}

function extractPNGDimensions(
  data: Uint8Array,
): { width: number; height: number } | null {
  if (data.length < 24) return null

  const width =
    (data[16]! << 24) | (data[17]! << 16) | (data[18]! << 8) | data[19]!
  const height =
    (data[20]! << 24) | (data[21]! << 16) | (data[22]! << 8) | data[23]!

  return { width, height }
}

function extractGIFDimensions(
  data: Uint8Array,
): { width: number; height: number } | null {
  if (data.length < 10) return null

  const width = data[6]! | (data[7]! << 8)
  const height = data[8]! | (data[9]! << 8)

  return { width, height }
}

async function getVideoDimensions(
  videoUrl: string,
): Promise<{ width: number; height: number } | null> {
  try {
    // For videos, we can't easily extract dimensions from headers like images
    // This is a simplified approach - in production, you might want to use a service
    // that can analyze video metadata or use ffprobe-like functionality

    // For now, we'll try to infer from common patterns in the URL or filename
    const url = videoUrl.toLowerCase()

    // Common video resolution patterns in URLs/filenames
    const resolutionPatterns = [
      /(\d{3,4})x(\d{3,4})/, // e.g., 1920x1080
      /(\d{3,4})_(\d{3,4})/, // e.g., 1920_1080
      /_(\d{3,4})p/, // e.g., _1080p (assume 16:9)
    ]

    for (const pattern of resolutionPatterns) {
      const match = url.match(pattern)
      if (match) {
        if (pattern.source.includes("p")) {
          // For format like _1080p, assume 16:9 aspect ratio
          const height = parseInt(match[1]!)
          const width = Math.round((height * 16) / 9)
          return { width, height }
        } else {
          // For WxH format
          const width = parseInt(match[1]!)
          const height = parseInt(match[2]!)
          return { width, height }
        }
      }
    }

    // If no pattern found, we can't determine dimensions safely
    console.warn(
      `⚠️ [Media Validator] Could not extract video dimensions from URL: ${videoUrl}`,
    )
    return null
  } catch (error) {
    console.warn(`⚠️ [Media Validator] Error getting video dimensions:`, error)
    return null
  }
}

export async function validateMediaForPlatforms(
  mediaUrl: string,
  platforms: string[],
): Promise<Record<string, MediaValidationResult>> {
  const results: Record<string, MediaValidationResult> = {}

  // Validate for each platform
  await Promise.all(
    platforms.map(async (platform) => {
      results[platform] = await validateMediaForPlatform(mediaUrl, platform)
    }),
  )

  return results
}

export function filterValidMediaForPlatforms(
  mediaUrls: string[],
  platformValidations: Record<string, Record<string, MediaValidationResult>>,
): Record<string, string[]> {
  const validMediaByPlatform: Record<string, string[]> = {}

  // Get all platforms from the first media URL, or empty array if no URLs
  const firstUrl = mediaUrls[0]
  const platforms =
    firstUrl && platformValidations[firstUrl]
      ? Object.keys(platformValidations[firstUrl])
      : []

  platforms.forEach((platform) => {
    validMediaByPlatform[platform] = mediaUrls.filter(
      (url) => platformValidations[url]?.[platform]?.isValid,
    )
  })

  return validMediaByPlatform
}

// Helper function to choose the best media for each platform
export function chooseBestMediaForPlatforms(
  videoUrl: string | null,
  imageUrl: string | null,
  platforms: string[],
): Record<string, string | null> {
  const mediaChoices: Record<string, string | null> = {}

  platforms.forEach((platform) => {
    switch (platform) {
      case "pinterest":
        // Pinterest doesn't support videos via API without thumbnails, always use images
        mediaChoices[platform] = imageUrl
        break

      case "instagram":
        // For Instagram, check if the video URL contains resolution information
        // that might indicate it exceeds Instagram's 1920px width limit
        if (
          videoUrl &&
          /2[0-9]{3,}x|3[0-9]{3,}x|4[0-9]{3,}x/.test(videoUrl.toLowerCase())
        ) {
          // Video URL suggests it might be too large (>2000px wide), use image instead
          console.log(
            `⚠️ [Media Choice] Video URL for Instagram suggests high resolution, using image instead: ${videoUrl}`,
          )
          mediaChoices[platform] = imageUrl
        } else {
          // Otherwise, prefer video if available, fallback to image
          mediaChoices[platform] = videoUrl || imageUrl
        }
        break

      case "twitter":
      case "linkedin":
      case "facebook":
        // These platforms prefer video if available, fallback to image
        mediaChoices[platform] = videoUrl || imageUrl
        break

      default:
        // Default: prefer video, fallback to image
        mediaChoices[platform] = videoUrl || imageUrl
        break
    }
  })

  return mediaChoices
}
