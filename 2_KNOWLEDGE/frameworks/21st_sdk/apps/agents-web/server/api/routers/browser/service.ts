import { retryWithBackoff } from "@/lib/utils"

// Simple queue to manage request rate limiting
class RequestQueue {
  private queue: Array<() => Promise<any>> = []
  private isProcessing = false
  private readonly minDelay = 500 // Minimum delay between requests in ms

  async add<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await requestFn()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      this.processQueue()
    })
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return

    this.isProcessing = true

    while (this.queue.length > 0) {
      const requestFn = this.queue.shift()
      if (requestFn) {
        try {
          await requestFn()
        } catch (error) {
          console.error("Queue request failed:", error)
        }
        // Wait between requests to respect rate limits
        await new Promise((resolve) => setTimeout(resolve, this.minDelay))
      }
    }

    this.isProcessing = false
  }
}

// Singleton queue instance
const screenshotQueue = new RequestQueue()

// Types for the service
export interface ViewportSize {
  width: number
  height: number
}

export interface Screenshot {
  viewport: ViewportSize
  data: string // base64 encoded image data
  format: "jpeg"
  theme?: string // Add theme information
}

export interface CaptureScreenshotsInput {
  url: string
  width?: number // Optional width parameter, defaults to 1920
  height?: number // Optional height parameter
  theme?: string // Add theme parameter
}

export interface CaptureScreenshotsResult {
  url: string
  screenshots: Screenshot[]
}

export class BrowserService {
  // Default viewport configuration
  private static readonly DEFAULT_WIDTH = 1920
  private static readonly DEFAULT_HEIGHT = 1080

  static async captureScreenshots({
    url,
    width = this.DEFAULT_WIDTH,
    height,
    theme,
  }: CaptureScreenshotsInput): Promise<CaptureScreenshotsResult> {
    // Use the queue to manage request rate limiting
    return screenshotQueue.add(async () => {
      // Browserless.io implementation
      const token = process.env.BROWSERLESS_API_TOKEN
      if (!token) {
        throw new Error("Browserless API token not configured")
      }

      const screenshots: Screenshot[] = []
      const browserlessUrl = `https://production-sfo.browserless.io/screenshot?token=${token}`
      const headers = {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
      }

      try {
        // Use provided height or calculate proportional height based on 16:9 ratio, with fallback to default
        // Ensure height is a positive integer
        let finalHeight = this.DEFAULT_HEIGHT
        if (height && height > 0) {
          finalHeight = Math.round(height)
        } else if (width && width > 0) {
          finalHeight = Math.round(width * (9 / 16))
        }

        // Ensure both width and height are positive integers
        const finalWidth = Math.max(1, Math.round(width))
        finalHeight = Math.max(1, finalHeight)

        const data = {
          url,
          options: {
            optimizeForSpeed: true,
            fullPage: true,
            type: "jpeg",
            quality: 80,
            captureBeyondViewport: true,
          },
          scrollPage: true,
          viewport: {
            width: finalWidth,
            height: finalHeight,
          },
        }

        const response = await retryWithBackoff(async () => {
          const res = await fetch(browserlessUrl, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
          })

          if (!res.ok) {
            const errorText = await res.text()
            throw new Error(
              `Browserless API error: ${res.status} ${res.statusText} - ${errorText}`,
            )
          }

          return res
        })

        const imageBuffer = await response.arrayBuffer()
        const base64Data = Buffer.from(imageBuffer).toString("base64")

        screenshots.push({
          viewport: { width: finalWidth, height: finalHeight },
          data: base64Data,
          format: "jpeg",
          theme,
        })

        return {
          url,
          screenshots,
        }
      } catch (error) {
        throw new Error(
          `Failed to capture screenshots: ${error instanceof Error ? error.message : String(error)}`,
        )
      }
    })
  }
}
