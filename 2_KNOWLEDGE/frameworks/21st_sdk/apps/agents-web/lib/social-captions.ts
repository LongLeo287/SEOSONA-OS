import { OpenAI } from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function downloadAndEncodeImage(
  imageUrl: string,
): Promise<string | null> {
  try {
    console.log(`📸 [Caption Generator] Downloading image: ${imageUrl}`)

    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`)
    }

    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")

    console.log(
      `✅ [Caption Generator] Image downloaded and encoded (${Math.round(buffer.byteLength / 1024)}KB)`,
    )
    return base64
  } catch (error) {
    console.error(`❌ [Caption Generator] Failed to download image:`, error)
    return null
  }
}

interface AuthorInfo {
  username: string
  display_username?: string
  name?: string
  display_name?: string
  twitter_url?: string
}

// Special function for weekly digest captions
export async function makeDigestCaptions(
  digestTitle: string,
  featuredComponents: Array<{ name: string; total_usage: number }>,
  imageUrl: string,
  platforms: string[] = ["twitter", "instagram", "linkedin"],
): Promise<{ tw: string; ig: string; li: string; fb?: string; pin?: string }> {
  const topComponentsText = featuredComponents
    .slice(0, 5)
    .map((comp) => comp.name)
    .join(", ")

  const system = `You are a social-media copywriter for 21st.dev specializing in weekly UI component digests.

Create engaging captions for each platform based on this week's top UI components.

Guidelines:
- Twitter: Engaging weekly announcement mentioning top components + end with "\\u2063\\n\\u2063\\nSee full list in thread ↓". NO HASHTAGS. Use \\u2063\\n\\u2063\\n for line breaks within the post.
- Instagram: Exciting announcement with visual appeal, mention top components, use hashtags
- LinkedIn: Professional weekly roundup format, focus on development trends
- Facebook: Community-focused, celebrate the creators and popular components

Featured components this week: ${topComponentsText}

Format response as JSON with only the requested platforms. Use these keys:
- Twitter: "tw" 
- Instagram: "ig"
- LinkedIn: "li"
- Facebook: "fb"

`

  try {
    console.log("🎨 [Social] Generating AI digest captions...")

    if (!imageUrl) {
      throw new Error("No image provided for digest caption generation")
    }

    // Download and encode image
    let base64Image: string
    try {
      console.log("🔍 [Social] Downloading digest image...")
      const response = await fetch(imageUrl, {
        signal: AbortSignal.timeout(10000),
      })
      if (!response.ok)
        throw new Error(`Failed to fetch image: ${response.status}`)

      const buffer = await response.arrayBuffer()
      base64Image = Buffer.from(buffer).toString("base64")
      console.log("✅ [Social] Image downloaded and encoded")
    } catch (imageError) {
      throw new Error(
        `Failed to download digest image: ${imageError instanceof Error ? imageError.message : "Unknown error"}`,
      )
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: system,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Weekly Digest: ${digestTitle}
Top Components: ${topComponentsText}
Platforms needed: ${platforms.join(", ")}

Please create engaging weekly digest captions for each platform.`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error("No response from OpenAI for digest captions")
    }

    // Clean response from markdown formatting
    let cleanResponse = response.trim()
    if (cleanResponse.startsWith("```json")) {
      cleanResponse = cleanResponse
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "")
    } else if (cleanResponse.startsWith("```")) {
      cleanResponse = cleanResponse
        .replace(/^```\s*/, "")
        .replace(/\s*```$/, "")
    }

    const captions = JSON.parse(cleanResponse)

    // Auto-fix Twitter line breaks in digest captions
    if (captions.tw) {
      captions.tw = finalizeTwitterCaption(captions.tw)
    }

    console.log("✅ [Social] AI digest captions generated successfully")
    return captions
  } catch (error) {
    console.error("❌ [Social] Error generating digest captions:", error)

    // Instead of returning fallback captions, throw error
    throw new Error(
      `Failed to generate digest captions: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }
}

export async function makeCaptions(
  name: string,
  description: string,
  imageUrl: string,
  author: AuthorInfo,
  componentSlug: string,
  platforms: string[] = ["twitter", "instagram", "linkedin"],
): Promise<{ tw: string; ig: string; li: string; fb?: string; pin?: string }> {
  // Extract Twitter handle from URL if available
  const getTwitterHandle = (twitterUrl?: string): string | null => {
    if (!twitterUrl) return null
    try {
      const match =
        twitterUrl.match(/twitter\.com\/([^\/\?]+)/) ||
        twitterUrl.match(/x\.com\/([^\/\?]+)/)
      return match ? `@${match[1]}` : null
    } catch {
      return null
    }
  }

  const twitterHandle = getTwitterHandle(author.twitter_url)
  const displayName =
    author.display_name ||
    author.name ||
    author.display_username ||
    author.username
  const displayUsername = author.display_username || author.username

  // Improved author credit - use only name OR username, not both
  const authorCredit = twitterHandle
    ? `Credit to ${twitterHandle}`
    : displayName && displayName !== displayUsername
      ? `Created by ${displayName}` // Use display name if different from username
      : `Created by ${displayUsername}` // Otherwise use username

  const system = `You are a casual social-media copywriter who loves discovering cool UI components. 
Your job is to share excitement about trending components that developers are actually using.

Look at the component image and create captions that feel like "hey, check out this cool thing this developer made!"

Guidelines:
- Twitter: Casual, enthusiastic description + author credit + end with "\\u2063\\n\\u2063\\nLink in thread ↓". NO HASHTAGS. Use \\u2063\\n\\u2063\\n for line breaks within the post.
- Instagram: Enthusiastic discovery, use hashtags like #UIDesign #WebDev, mention it's trending. End with "Link in bio" instead of actual URLs.
- LinkedIn: Slightly more professional but still enthusiastic, focus on why it's useful for developers 
- Facebook: Friendly community vibe, celebrate the creator's work

Tone: Casual, genuine enthusiasm, like you're sharing a cool discovery with fellow developers. Avoid marketing buzzwords.

Format response as JSON with only the requested platforms. Use these keys:
- Twitter: "tw"
- Instagram: "ig" 
- LinkedIn: "li"
- Facebook: "fb"

`

  try {
    console.log(`🤖 [Caption Generator] Generating captions for: ${name}`)
    console.log(`📋 [Caption Generator] Platforms: ${platforms.join(", ")}`)

    // Download and encode the image
    const base64Image = await downloadAndEncodeImage(imageUrl)

    const messages: any[] = [
      {
        role: "system",
        content: system,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Component Name: ${name}
Description: ${description}
Creator: ${displayName} (username: ${displayUsername})
${author.twitter_url ? `Creator Twitter: ${author.twitter_url}` : "No Twitter URL available"}
Author Credit Text: ${authorCredit}
Platforms needed: ${platforms.join(", ")}

This component is trending! Create captions that celebrate the creator's work and share excitement about this cool component that developers are actually using.

Please look at this UI component image and create engaging captions for each requested platform. Sound genuine and enthusiastic, like sharing a cool discovery with fellow developers.`,
          },
        ],
      },
    ]

    // Add image if we successfully downloaded it
    if (base64Image) {
      messages[1].content.push({
        type: "image_url",
        image_url: {
          url: `data:image/jpeg;base64,${base64Image}`,
          detail: "high",
        },
      })
    } else {
      // If image download failed, throw error instead of continuing
      throw new Error(
        "Failed to download component image for caption generation",
      )
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      max_tokens: 800,
      temperature: 0.7,
      response_format: { type: "json_object" },
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error("No content received from OpenAI")
    }

    console.log(`✅ [Caption Generator] Generated captions successfully`)

    // Try to parse JSON response
    const parsed = JSON.parse(content)

    // Build response object based on requested platforms
    const result: any = {}

    if (platforms.includes("twitter") && parsed.tw) {
      // Auto-fix Twitter content: clean up AI-generated formatting issues
      result.tw = finalizeTwitterCaption(parsed.tw)
    }
    if (platforms.includes("instagram") && parsed.ig) result.ig = parsed.ig
    if (platforms.includes("linkedin") && parsed.li) result.li = parsed.li
    if (platforms.includes("facebook") && parsed.fb) result.fb = parsed.fb

    // Ensure we have at least the basic platforms
    if (!result.tw && platforms.includes("twitter")) {
      throw new Error("Missing Twitter caption")
    }
    if (!result.ig && platforms.includes("instagram")) {
      throw new Error("Missing Instagram caption")
    }
    if (!result.li && platforms.includes("linkedin")) {
      throw new Error("Missing LinkedIn caption")
    }

    return result
  } catch (error) {
    console.error("❌ [Caption Generator] Error generating captions:", error)

    // Instead of returning fallback captions, throw error to skip this component
    throw new Error(
      `Failed to generate captions for ${name}: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }
}

// Ensure final Twitter caption uses VT+LF pattern and has no unwanted invisible chars
function finalizeTwitterCaption(text: string): string {
  let t = text
    // remove unwanted separators except VT (\u000B)
    .replace(/[\u2060-\u206F\u200B-\u200D\uFEFF]/g, "")
    // normalize any double LFs to VT pattern
    .replace(/\n\n+/g, "\u000B\n\u000B\n")
    // collapse multiple spaces
    .replace(/ +/g, " ")
    .trim()
  return t
}
