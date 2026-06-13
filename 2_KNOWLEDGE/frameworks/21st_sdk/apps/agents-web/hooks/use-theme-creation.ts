import { useState } from "react"
import { api } from "@/trpc/client"
import { toast } from "sonner"

export interface ThemeCreationState {
  isCreating: boolean
  url: string
  setUrl: (url: string) => void
  createTheme: () => void
  createThemeFromUrl: (websiteUrl: string) => Promise<void>
  cancelCreation: () => void
  isGenerating: boolean
  processingThemes: Array<{ url: string; label: string }>
  setProcessingThemes: React.Dispatch<
    React.SetStateAction<Array<{ url: string; label: string }>>
  >
}

export function useThemeCreation(
  teamId?: string,
  onThemeCreated?: (themeKey: string) => void,
) {
  const [isCreating, setIsCreating] = useState(false)
  const [url, setUrl] = useState("")
  const [processingThemes, setProcessingThemes] = useState<
    Array<{ url: string; label: string }>
  >([])

  // Get utils outside the mutation for proper hook usage
  const utils = api.useUtils()

  // tRPC mutation for creating custom theme (persist)
  const createCustomTheme = api.styleProfile.createCustomTheme.useMutation({
    onSuccess: (result, variables) => {
      // Loading toast dismissed by caller, just show success
      toast.success(
        `Theme inspired by ${variables.name.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")} created!`,
      )

      // Remove from processing
      setProcessingThemes((prev) =>
        prev.filter((t) => t.label !== variables.name),
      )

      // Reset state
      setIsCreating(false)
      setUrl("")

      // Invalidate team themes to refetch
      if (teamId) {
        utils.styleProfile.getTeamStyleProfile.invalidate({ teamId })
      }

      // Auto-select theme if callback provided
      if (result.profileId && onThemeCreated) {
        const themeKey = `team-${result.profileId}`
        onThemeCreated(themeKey)
      }
    },
    onError: (error, variables) => {
      // Error handling will be done by caller
      toast.error(`Failed to create theme: ${error.message}`)
      setProcessingThemes((prev) =>
        prev.filter((t) => t.label !== variables.name),
      )
    },
  })

  const createTheme = async () => {
    if (!url.trim()) return

    // Show initial loading toast immediately
    const loadingId = `theme-loading-${Date.now()}`
    toast.loading(`Building ${url} ui kit...`, {
      id: loadingId,
      duration: 30000,
    })

    try {
      // Validate URL
      const validUrl = url.startsWith("http") ? url : `https://${url}`
      new URL(validUrl) // This will throw if invalid

      // Ask AI to generate the theme preset first
      const response = await fetch("/api/ai-sdk-5/generate-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteUrl: validUrl }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate theme via AI")
      }

      const data = await response.json()
      if (!data.success || !data.theme) {
        throw new Error("AI did not return a theme")
      }

      // Update loading toast with actual theme name
      toast.loading(`Creating ${data.theme.label} theme...`, {
        id: loadingId,
        duration: 30000,
      })

      setProcessingThemes((prev) => [
        ...prev,
        { url: validUrl, label: data.theme.label },
      ])

      // Persist in database & link to team
      await createCustomTheme.mutateAsync({
        name: data.theme.label,
        teamId: teamId!,
        css: data.theme.css,
      })

      // Dismiss loading toast on success (mutation will show success toast)
      toast.dismiss(loadingId)
    } catch (error) {
      console.error("Theme creation failed:", error)
      toast.dismiss(loadingId)
      toast.error("Please enter a valid URL")
      // Remove from processing on error
      setProcessingThemes((prev) => prev.filter((t) => t.url !== url))
    }
  }

  const cancelCreation = () => {
    setIsCreating(false)
    setUrl("")
  }

  // Create theme from URL directly (for WebsiteThemePopover)
  const createThemeFromUrl = async (websiteUrl: string) => {
    const validUrl = websiteUrl.startsWith("http")
      ? websiteUrl
      : `https://${websiteUrl}`

    // Extract site name for initial loading state
    let siteName = "Custom Theme"
    try {
      const urlObj = new URL(validUrl)
      siteName = urlObj.hostname.replace("www.", "")
    } catch {
      siteName = "Custom Theme"
    }

    // Show initial loading toast immediately
    const loadingId = `theme-url-${Date.now()}`
    toast.loading(`Checking existing themes for ${siteName}...`, {
      id: loadingId,
      duration: 30000,
    })

    try {
      // Validate URL
      new URL(validUrl)

      if (!teamId) {
        throw new Error("Team ID is required")
      }

      // First, check if we already have a theme for this URL
      const existingThemeResp = await fetch("/api/style-profile/find-by-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteUrl: validUrl,
          teamId: teamId,
        }),
      })

      if (existingThemeResp.ok) {
        const existingData = await existingThemeResp.json()
        if (existingData.success && existingData.theme) {
          // Found existing theme, reuse it
          toast.loading(
            `Reusing existing ${existingData.theme.siteName || siteName} theme...`,
            {
              id: loadingId,
              duration: 3000,
            },
          )

          // Set this theme as the team's active theme
          await createCustomTheme.mutateAsync({
            name: existingData.theme.siteName || siteName,
            teamId: teamId,
            css: existingData.theme.css,
            originalUrl: validUrl,
          })

          toast.dismiss(loadingId)
          return
        }
      }

      // No existing theme found, create new one
      toast.loading(`Analyzing ${siteName} website...`, {
        id: loadingId,
        duration: 30000,
      })

      // Ask AI for theme preset
      const aiResp = await fetch("/api/ai-sdk-5/generate-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteUrl: validUrl }),
      })
      if (!aiResp.ok) {
        const errorData = await aiResp.json().catch(() => ({}))
        throw new Error(
          errorData.error || `AI generation failed (${aiResp.status})`,
        )
      }
      const aiData = await aiResp.json()
      if (!aiData.success || !aiData.theme) {
        throw new Error(aiData.error || "No theme generated from website")
      }

      // Update loading toast with actual theme name
      toast.loading(`Creating ${aiData.theme.label} theme...`, {
        id: loadingId,
        duration: 30000,
      })

      setProcessingThemes((prev) => [
        ...prev,
        {
          url: validUrl,
          label: aiData.theme.label,
        },
      ])

      // Save to DB with original URL for future deduplication
      await createCustomTheme.mutateAsync({
        name: aiData.theme.label,
        teamId: teamId,
        css: aiData.theme.css,
        originalUrl: validUrl,
      })

      // Dismiss loading toast on success (mutation will show success toast)
      toast.dismiss(loadingId)
    } catch (error) {
      console.error("Theme creation error:", error)
      toast.dismiss(loadingId)

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred"

      // Show more specific error messages
      if (errorMessage.includes("Failed to scrape")) {
        toast.error(
          `Unable to access ${siteName}. The website may be blocking automated access.`,
        )
      } else if (errorMessage.includes("AI generation failed")) {
        toast.error(
          `Failed to generate theme from ${siteName}. Please try a different website.`,
        )
      } else if (errorMessage.includes("Team ID is required")) {
        toast.error("Please select a project first")
      } else {
        toast.error(`Failed to create theme: ${errorMessage}`)
      }
    }
  }

  return {
    isCreating,
    setIsCreating,
    url,
    setUrl,
    createTheme,
    createThemeFromUrl,
    cancelCreation,
    isGenerating: createCustomTheme.isPending,
    processingThemes,
    setProcessingThemes,
  }
}
