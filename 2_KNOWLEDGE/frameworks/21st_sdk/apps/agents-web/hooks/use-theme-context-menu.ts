import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { api } from "@/trpc/client"
import { trackCanvasHomeAction } from "@/lib/posthog-canvas-home"
import { convertPresetToCss } from "@/lib/utils/themes/convert-preset-to-css"

interface UseThemeContextMenuProps {
  theme?: {
    key: string
    id?: string // Database ID for proper deletion
    name: string
    preset: {
      label: string
      styles: any
    }
    isCustom?: boolean
    isCommunity?: boolean
    isPreset?: boolean
    isSaved?: boolean // saved community theme in "My Themes"
  }
  teamId?: string
  onThemeDeleted?: () => void
  basePath?: string // Base path for theme navigation (e.g., "/community/themes" or "/canvas/themes")
}

export function useThemeContextMenu({
  theme,
  teamId,
  onThemeDeleted,
  basePath = "/canvas/themes", // Default to regular themes path for backward compatibility
}: UseThemeContextMenuProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  const [isAddingToProject, setIsAddingToProject] = useState(false)

  const [isApplyingToProject, setIsApplyingToProject] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Get API utils once at top level to avoid Rules of Hooks violations
  const apiUtils = api.useUtils()

  // Get user projects for "Apply to project" submenu
  const { data: userProjectsData, isLoading: isProjectsLoading } =
    api.teams.getUserProjects.useQuery({
      limit: 100, // Get more projects for the menu
      offset: 0,
      hasCanvas: true, // Only show projects with canvas data
    })

  // Delete custom theme mutation (full deletion)
  const deleteThemeMutation = api.styleProfile.deleteCustomTheme.useMutation({
    onSuccess: () => {
      toast.success("Theme deleted permanently")
      onThemeDeleted?.()
      setIsDeleting(false)
      setShowDeleteConfirm(false) // Close dialog
      // Invalidate custom themes to update "My Themes" tab
      if (teamId) {
        apiUtils.styleProfile.getTeamCustomThemes.invalidate({
          teamId,
        })
        apiUtils.styleProfile.getTeamStyleProfile.invalidate({
          teamId,
        })
        apiUtils.styleProfile.getTeamSavedThemes.invalidate({
          teamId,
        })
      }
    },
    onError: (error) => {
      toast.error("Failed to delete theme: " + error.message)
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    },
  })

  // Add community theme to team mutation
  const addThemeToTeamMutation =
    api.styleProfile.addCommunityThemeToTeam.useMutation({
      onSuccess: () => {
        toast.success("Theme added to project successfully!")
        setIsAddingToProject(false)
        // Invalidate saved themes to update "My Themes" tab
        if (teamId) {
          apiUtils.styleProfile.getTeamSavedThemes.invalidate({
            teamId,
          })
          apiUtils.styleProfile.getTeamStyleProfile.invalidate({
            teamId,
          })
        }
      },
      onError: (error) => {
        toast.error("Failed to add theme: " + error.message)
        setIsAddingToProject(false)
      },
    })

  // Apply theme to team mutation (set as active)
  const applyThemeToTeamMutation =
    api.styleProfile.applyThemeToTeam.useMutation({
      onSuccess: () => {
        // Don't show toast here - will be shown by caller with project name
        // Invalidate to update active theme status
        if (teamId) {
          apiUtils.styleProfile.getTeamStyleProfile.invalidate({
            teamId,
          })
          apiUtils.styleProfile.getTeamSavedThemes.invalidate({
            teamId,
          })
          apiUtils.styleProfile.getTeamCustomThemes.invalidate({
            teamId,
          })
        }
      },
      onError: (error) => {
        toast.error("Failed to apply theme: " + error.message)
      },
    })

  // Remove theme from team mutation (for saved community themes)
  const removeThemeFromTeamMutation =
    api.styleProfile.removeThemeFromTeam.useMutation({
      onSuccess: () => {
        toast.success("Theme removed from team successfully!")
        setIsDeleting(false) // Use same state as delete for consistency
        setShowDeleteConfirm(false) // Close dialog
        onThemeDeleted?.()
        // Invalidate saved themes to update "My Themes" tab
        if (teamId) {
          apiUtils.styleProfile.getTeamSavedThemes.invalidate({
            teamId,
          })
          apiUtils.styleProfile.getTeamStyleProfile.invalidate({
            teamId,
          })
        }
      },
      onError: (error) => {
        toast.error("Failed to remove theme: " + error.message)
        setIsDeleting(false)
        setShowDeleteConfirm(false)
      },
    })

  const handleOpenTheme = () => {
    if (!theme) return
    window.open(`${basePath}/${theme.key}`, "_blank")
  }

  const handleCopyTheme = async () => {
    if (!theme) {
      toast.error("Theme not available")
      return
    }

    if (!theme.preset.styles) {
      toast.error("Theme styles are not available")
      return
    }

    setIsCopying(true)

    // Track theme copying
    trackCanvasHomeAction("theme_copied", {
      source: "themes_page_context_menu",
      theme_key: theme.key,
      theme_name: theme.preset.label,
      theme_type: theme.isCustom
        ? "custom"
        : theme.isCommunity
          ? "community"
          : "built_in",
    })

    try {
      const css = convertPresetToCss(theme.preset.styles)
      if (!css) {
        toast.error("Theme styles are empty")
        setIsCopying(false)
        return
      }

      await navigator.clipboard.writeText(css)
      toast.success("Theme CSS copied to clipboard")
    } catch (error) {
      toast.error("Failed to copy theme CSS")
    } finally {
      setIsCopying(false)
    }
  }

  const handleAddToProject = async () => {
    if (!theme || !theme.isCommunity) {
      toast.error("Only community themes can be added to project")
      return
    }

    if (!teamId) {
      toast.error("Team ID is required")
      return
    }

    setIsAddingToProject(true)

    try {
      // Extract the profile ID from the community theme key
      const styleProfileId = theme.key.replace("community-", "")
      await addThemeToTeamMutation.mutateAsync({
        teamId,
        styleProfileId,
      })
    } catch (error) {
      // Error handled in mutation
    }
  }

  const handleDeleteTheme = () => {
    if (!theme) {
      toast.error("Theme not available")
      return
    }

    // Check if theme can be deleted/removed
    const canDeleteOrRemove =
      theme.isCustom || theme.isPreset || (theme.isCommunity && theme.isSaved)

    if (!canDeleteOrRemove) {
      toast.error("This theme cannot be deleted")
      return
    }

    if (!teamId) {
      toast.error("Team ID is required")
      return
    }

    // Show confirmation dialog instead of deleting immediately
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = async () => {
    if (!theme || !teamId) return

    setIsDeleting(true)

    try {
      if (theme.isCustom) {
        // Custom theme - delete completely
        const profileId = theme.id || theme.key.replace("team-", "")
        await deleteThemeMutation.mutateAsync({
          profileId,
          teamId,
        })
      } else if (theme.isPreset || (theme.isCommunity && theme.isSaved)) {
        // Preset theme or saved community theme - remove only the link
        const styleProfileId =
          theme.id || theme.key.replace(/^(community-|preset-)/, "")

        await removeThemeFromTeamMutation.mutateAsync({
          teamId,
          styleProfileId,
        })
      }
    } catch (error) {
      // Error handled in mutations
    }
  }

  const handleApplyToProject = async (project: {
    id: string
    name: string
    team: { id: string; name: string } | null
  }) => {
    if (!theme) {
      toast.error("Theme not available")
      return
    }

    if (!project.team?.id) {
      toast.error("Project team not found")
      return
    }

    setIsApplyingToProject(true)

    try {
      let profileId: string

      if (theme.isCustom) {
        // For custom themes, extract profile ID from key
        profileId = theme.key.replace("team-", "")
      } else if (theme.isCommunity || theme.isSaved) {
        // For community/saved themes, extract profile ID from key
        profileId = theme.key.replace("community-", "")
      } else {
        // For built-in preset themes, use theme key as is
        profileId = theme.key
      }

      await applyThemeToTeamMutation.mutateAsync({
        teamId: project.team.id,
        styleProfileId: profileId,
      })

      toast.success(`Theme applied to "${project.name}" successfully!`)
    } catch (error) {
      toast.error("Failed to apply theme to project")
    } finally {
      setIsApplyingToProject(false)
    }
  }

  const handleApplyToCanvas = async (projectId: string) => {
    if (!theme) {
      toast.error("Theme not available")
      return
    }

    // Emit custom event to notify canvas to apply theme to all variants
    const event = new CustomEvent("applyThemeToCanvas", {
      detail: { themeKey: theme.key, projectId },
    })
    window.dispatchEvent(event)

    toast.success("Theme applied to all canvas variants!")
  }

  return {
    handlers: {
      handleOpenTheme,
      handleCopyTheme,
      handleAddToProject,
      handleDeleteTheme,
      handleConfirmDelete,
      handleApplyToProject,
      handleApplyToCanvas,
      setShowDeleteConfirm,
    },
    state: {
      isDeleting,
      isCopying,
      isAddingToProject,

      isApplyingToProject,
      showDeleteConfirm,
      canDelete:
        theme?.isCustom ||
        theme?.isPreset ||
        (theme?.isCommunity && theme?.isSaved) ||
        false,
      canAddToProject: theme?.isCommunity || false,
    },
    data: {
      userProjects: userProjectsData?.projects || [],
      isProjectsLoading,
    },
  }
}
