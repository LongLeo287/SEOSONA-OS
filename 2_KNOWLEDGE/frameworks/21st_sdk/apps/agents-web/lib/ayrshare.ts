// Using native fetch instead of axios

export type SocialPlatform =
  | "twitter"
  | "instagram"
  | "linkedin"
  | "facebook"
  | "pinterest"

export async function postOne(
  platform: SocialPlatform,
  caption: string,
  mediaUrl: string | string[],
  scheduleDate?: Date,
  platformOptions?: any,
  approvalNotes?: string,
  requiresApproval?: boolean,
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    if (!process.env.AYRSHARE_API_KEY) {
      throw new Error("AYRSHARE_API_KEY environment variable is not set")
    }

    const staticPlatformOptions: Record<string, any> = {}

    // Platform-specific options
    if (platform === "instagram") {
      staticPlatformOptions.instagramOptions = { isReel: true }
    }

    // Add Pinterest thumbnail for videos
    if (platform === "pinterest") {
      // Check if the mediaUrl is a video
      const isVideoUrl = Array.isArray(mediaUrl)
        ? mediaUrl[0]?.toLowerCase().includes(".mp4")
        : typeof mediaUrl === "string" &&
          mediaUrl.toLowerCase().includes(".mp4")

      if (isVideoUrl) {
        // Need to provide a thumbnail for Pinterest videos
        // Find an image URL to use as thumbnail
        const imageUrl =
          Array.isArray(mediaUrl) && mediaUrl.length > 1
            ? mediaUrl.find((url) => !url.toLowerCase().includes(".mp4"))
            : null

        staticPlatformOptions.pinterestOptions = {
          thumbNail: imageUrl || `https://cdn.21st.dev/static/thumb.jpg`, // Fallback to a static image if no other image is available
        }

        console.log(
          `🖼️ [Ayrshare] Adding Pinterest thumbnail for video:`,
          staticPlatformOptions.pinterestOptions,
        )
      }
    }

    const postData: any = {
      platforms: [platform],
      post: caption, // Ayrshare API requires 'post' field, not 'caption'
      requiresApproval: requiresApproval ?? false, // Use parameter or default to false
      notes: approvalNotes || `Automated post for ${platform}`,
      ...staticPlatformOptions,
    }

    // Handle media URLs - for Twitter threads with mediaUrls in platformOptions, don't add main mediaUrls field at all
    if (!(platform === "twitter" && platformOptions?.mediaUrls)) {
      // Only add mediaUrls for non-Twitter threads
      if (mediaUrl && (!Array.isArray(mediaUrl) || mediaUrl.length > 0)) {
        postData.mediaUrls = Array.isArray(mediaUrl) ? mediaUrl : [mediaUrl]
      } else {
        postData.mediaUrls = []
      }
    }
    // For Twitter threads, mediaUrls is ONLY in twitterOptions.mediaUrls, not in main postData

    // Add Twitter-specific options
    if (platform === "twitter" && platformOptions) {
      postData.twitterOptions = platformOptions
      if (platformOptions.thread) {
        console.log(
          `🧵 [Ayrshare] Creating Twitter thread with ${caption.split("\n\n").length} posts`,
        )
        console.log(
          `🔍 [Ayrshare Debug] Twitter Options:`,
          JSON.stringify(platformOptions, null, 2),
        )
      }
    }

    // Add scheduling if date provided
    if (scheduleDate) {
      postData.scheduleDate = scheduleDate.toISOString()
    }

    console.log(`📤 [Ayrshare] Posting to ${platform}:`, {
      platform,
      mediaCount: Array.isArray(mediaUrl) ? mediaUrl.length : 1,
      mediaUrl: Array.isArray(mediaUrl)
        ? `${mediaUrl.length} items (carousel)`
        : mediaUrl && typeof mediaUrl === "string"
          ? mediaUrl.substring(0, 100) + "..."
          : "no media",
      captionLength: caption.length,
      requiresApproval: postData.requiresApproval,
      hasSchedule: !!scheduleDate,
      isThread: platform === "twitter" && platformOptions?.thread,
      hasMainMediaUrls: !!postData.mediaUrls,
    })

    console.log(
      `🔍 [Ayrshare Debug] Full request data:`,
      JSON.stringify(postData, null, 2),
    )

    const response = await fetch("https://api.ayrshare.com/api/post", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AYRSHARE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Ayrshare API Error for ${platform}:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url: response.url,
      })
      throw new Error(
        `HTTP error! status: ${response.status}, details: ${errorText}`,
      )
    }

    const responseData = await response.json()

    const action = requiresApproval ? "submitted for approval" : "published"
    console.log(`✅ Successfully ${action} on ${platform}:`, {
      status: response.status,
      data: responseData,
      scheduledFor: scheduleDate?.toISOString(),
      requiresApproval: requiresApproval ?? false,
    })

    return {
      success: true,
      postId: responseData?.id || responseData?.postId,
    }
  } catch (error: unknown) {
    console.error(`❌ Failed to post to ${platform}:`, error)

    let errorMessage = "Unknown error"
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === "string") {
      errorMessage = error
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

export async function postToAllPlatforms(
  caption: {
    tw: string
    ig: string
    li: string
    fb?: string
    pin?: string
  },
  mediaUrl: string | string[], // can be single URL or array for carousels
  scheduleDate?: Date,
  platforms: SocialPlatform[] = ["twitter", "instagram", "linkedin"],
  componentUrl?: string, // for Twitter threads
  isDigest: boolean = false, // for special digest handling
  digestComponents?: Array<{
    name: string
    url: string
    author?: string
    authorData?: any
  }>, // for digest threads/carousels
  approvalNotes?: string, // Custom approval notes
  requiresApproval?: boolean, // Whether posts need approval
): Promise<
  Record<SocialPlatform, { success: boolean; postId?: string; error?: string }>
> {
  const platformCaptionMap: Record<SocialPlatform, string> = {
    twitter: caption.tw,
    instagram: caption.ig,
    linkedin: caption.li,
    facebook: caption.fb || caption.ig, // fallback to Instagram caption
    pinterest: caption.pin || caption.ig, // fallback to Instagram caption
  }

  // Determine if media is video
  const isVideo = Array.isArray(mediaUrl)
    ? mediaUrl[0]?.toLowerCase().includes(".mp4")
    : typeof mediaUrl === "string" && mediaUrl.toLowerCase().includes(".mp4")

  // Check for high resolution videos that might exceed Instagram's limits
  // Instagram has a 1920px width limit
  const mightExceedInstagramLimits =
    isVideo &&
    (Array.isArray(mediaUrl)
      ? mediaUrl[0]?.toLowerCase().match(/2[0-9]{3,}x|3[0-9]{3,}x|4[0-9]{3,}x/)
      : typeof mediaUrl === "string" &&
        mediaUrl.toLowerCase().match(/2[0-9]{3,}x|3[0-9]{3,}x|4[0-9]{3,}x/))

  if (mightExceedInstagramLimits && platforms.includes("instagram")) {
    console.log(
      "⚠️ [Ayrshare] Detected potentially oversized video for Instagram:",
      Array.isArray(mediaUrl) ? mediaUrl[0] : mediaUrl,
    )
  }

  const results = await Promise.all(
    platforms.map(async (platform) => {
      let postContent = platformCaptionMap[platform]
      let platformOptions: any = undefined
      let platformMediaUrl: string | string[] = mediaUrl

      // Special handling for video dimensions on Instagram
      if (platform === "instagram" && isVideo && mightExceedInstagramLimits) {
        // Try to find an image alternative for Instagram when video might be too large
        // Find first non-video URL if it's an array
        if (Array.isArray(mediaUrl) && mediaUrl.length > 1) {
          const imageUrl = mediaUrl.find(
            (url) => !url.toLowerCase().includes(".mp4"),
          )
          if (imageUrl) {
            console.log(
              "🔄 [Ayrshare] Using image instead of oversized video for Instagram:",
              imageUrl,
            )
            platformMediaUrl = imageUrl
          }
        } else {
          // If only video is available, warn but proceed (will likely fail)
          console.warn(
            "⚠️ [Ayrshare] No image alternative found for potentially oversized Instagram video",
          )
        }
      }

      // Special handling for Twitter threads
      if (platform === "twitter" && (componentUrl || isDigest)) {
        if (isDigest && digestComponents) {
          // Create digest thread: AI caption (first post) + individual component posts
          const componentPosts = digestComponents.map((comp, idx) => {
            // Create author credit without @ for 21st.dev usernames
            let authorCredit = ""
            if (comp.author) {
              // Check if author has Twitter URL - if yes, use @mention, if no, use display name
              const authorData = (comp as any).authorData
              if (authorData?.twitter_url) {
                // Extract Twitter handle from URL
                const twitterMatch = authorData.twitter_url.match(
                  /(?:twitter\.com|x\.com)\/([^\/\?]+)/,
                )
                authorCredit = twitterMatch
                  ? ` by @${twitterMatch[1]}`
                  : ` by ${authorData.display_name || authorData.name || comp.author}`
              } else {
                // No Twitter URL - use display name without @
                authorCredit = ` by ${authorData?.display_name || authorData?.name || comp.author}`
              }
            }
            return `✨ ${comp.name}${authorCredit} - ${comp.url}`
          })

          // Join AI caption (first post) with component posts using \n\n for thread separation
          postContent = [postContent, ...componentPosts].join("\n\n")

          // Create thread media array: null for first post, then media for each component
          const threadMediaUrls: (string | null)[] = [
            null, // First post (AI digest caption) has no media
            ...digestComponents.map((comp, idx) => {
              if (
                Array.isArray(mediaUrl) &&
                idx < mediaUrl.length &&
                mediaUrl[idx]
              ) {
                return mediaUrl[idx]
              }
              return null
            }),
            // Keep null entries for posts without media
          ]

          platformOptions = {
            thread: true,
            threadNumber: false,
            mediaUrls: threadMediaUrls,
          }
          // For Twitter threads, use empty array since media is in twitterOptions.mediaUrls
          platformMediaUrl = []
        } else if (componentUrl) {
          // For trending posts: Create thread with AI caption + component URL
          // Use \n\n to separate posts in thread
          postContent = `${postContent}\n\n${componentUrl}`
          platformOptions = {
            thread: true,
            threadNumber: false, // Don't add numbers like 1/2
          }
          // For Twitter, use only first media URL even if it's an array
          platformMediaUrl = Array.isArray(mediaUrl)
            ? mediaUrl[0] || ""
            : mediaUrl
        }
      } else if (componentUrl && !isDigest) {
        // For non-Twitter platforms: Add component URL or "Link in bio" for Instagram
        if (platform === "instagram") {
          // Only add "Link in bio" if not already present
          if (!postContent.toLowerCase().includes("link in bio")) {
            postContent = `${postContent}\n\nLink in bio 👆`
          }
        } else {
          postContent = `${postContent}\n\n${componentUrl}`
        }
      }

      // Special handling for digest posts
      if (isDigest) {
        if (platform === "instagram") {
          // Instagram digest: use carousel + "Link in bio" if not already present
          if (
            !platformCaptionMap[platform].toLowerCase().includes("link in bio")
          ) {
            postContent = `${platformCaptionMap[platform]}\n\nLink in bio 👆`
          } else {
            postContent = platformCaptionMap[platform]
          }
          // Use carousel for Instagram digest
          platformMediaUrl = mediaUrl
        } else if (platform === "facebook" || platform === "pinterest") {
          // Facebook/Pinterest: use carousel with all images
          platformMediaUrl = mediaUrl
        } else if (platform === "linkedin") {
          // LinkedIn: use all media (carousel) with link to 21st.dev
          postContent = `${platformCaptionMap[platform]}\n\nDiscover more at 21st.dev`
          platformMediaUrl = mediaUrl
        }
      }

      // Generate approval notes with context
      let notes = approvalNotes
      if (!notes) {
        if (isDigest) {
          notes = `Weekly digest for ${platform} - contains ${digestComponents?.length || 0} components`
        } else if (componentUrl) {
          notes = `Component post for ${platform} - ${componentUrl}`
        } else {
          notes = `Automated trending post for ${platform}`
        }
      }

      const result = await postOne(
        platform,
        postContent,
        platformMediaUrl,
        scheduleDate,
        platformOptions,
        notes,
        requiresApproval,
      )
      return { platform, result }
    }),
  )

  // Convert array to object
  const resultObject: Record<string, any> = {}
  results.forEach(({ platform, result }) => {
    resultObject[platform] = result
  })

  return resultObject as Record<
    SocialPlatform,
    { success: boolean; postId?: string; error?: string }
  >
}
