"use client"

import { useState, useEffect } from "react"
import {
  useAgentsSignOut,
  useAgentsViewer,
} from "@/lib/agents/auth/client"
import { Label } from "@/components/ui/label"
import { LogOut, Loader2, Upload, Edit } from "lucide-react"
import { AnLogoSpinner } from "@/components/features/agents/an/dashboard/an-logo-spinner"
import { useImageUpload } from "@/hooks/use-image-upload"
import { useUserProfile } from "@/components/hooks/use-user-profile"
import { toast } from "sonner"
import { api } from "@/trpc/client"
import { cn } from "@/lib/utils"
import { agentsHref } from "@/lib/utils/agents-href"
import { useSetAtom } from "jotai"
import { resetSelectedTeamIdAtom } from "@/lib/atoms/team"

export function ProfilePageClient() {
  const viewer = useAgentsViewer()
  const signOut = useAgentsSignOut()
  const {
    user: dbUser,
    isLoading: isUserLoading,
  } = useUserProfile()
  const utils = api.useUtils()
  const resetSelectedTeamId = useSetAtom(resetSelectedTeamIdAtom)

  const [fullName, setFullName] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const { previewUrl, fileInputRef, handleThumbnailClick, handleFileChange } =
    useImageUpload()

  useEffect(() => {
    if (!isUserLoading && (dbUser || viewer)) {
      setFullName(dbUser?.display_name || viewer?.fullName || "")
      setProfileImage(dbUser?.display_image_url || viewer?.imageUrl || "")
    }
  }, [isUserLoading, dbUser, viewer])

  useEffect(() => {
    if (previewUrl) {
      setProfileImage(previewUrl)
    }
  }, [previewUrl])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: fullName || null,
          display_image_url: profileImage || null,
        }),
      })
      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Failed to update profile")
      }
      await utils.users.getCurrentUserProfile.invalidate()
      toast.success("Profile updated")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile",
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const base64String = await handleFileChange(event)
    if (base64String) {
      setProfileImage(base64String)
    }
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      resetSelectedTeamId()
      await signOut(agentsHref("/agents"))
    } catch {
      setIsSigningOut(false)
    }
  }

  if (isUserLoading) {
    return (
      <div className="mx-auto max-w-2xl px-8 py-10">
        <div className="flex items-center justify-center py-20">
          <AnLogoSpinner />
        </div>
      </div>
    )
  }

  const currentImageUrl =
    previewUrl || profileImage || dbUser?.display_image_url || viewer?.imageUrl
  const email = viewer?.email

  return (
    <div className="mx-auto max-w-2xl px-8 py-10 space-y-6">
      <h1 className="text-lg font-semibold">Profile</h1>

      {/* Account card */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="p-4 space-y-6">
          {/* Profile Picture */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Label className="text-sm font-medium">Profile Picture</Label>
              <p className="text-sm text-muted-foreground">
                How you appear around the app
              </p>
            </div>
            <div className="flex-shrink-0 relative group">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80 relative overflow-hidden",
                  currentImageUrl
                    ? "bg-muted"
                    : "bg-muted border-2 border-dashed border-border",
                )}
                onClick={handleThumbnailClick}
              >
                {currentImageUrl ? (
                  <>
                    <img
                      src={currentImageUrl}
                      alt={fullName || "User"}
                      className="w-full h-full rounded-full object-cover"
                    />
                    <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Edit className="w-4 h-4 text-foreground" />
                    </div>
                  </>
                ) : (
                  <Upload className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Full Name */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <Label className="text-sm font-medium">Full Name</Label>
              <p className="text-sm text-muted-foreground">
                Your display name
              </p>
            </div>
            <div className="flex-shrink-0 w-56">
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your name"
                className="an-focus-input w-full h-8 rounded-md bg-foreground/[0.05] border border-border hover:border-foreground/15 px-2.5 text-[13px] text-foreground placeholder:text-foreground/40"
              />
            </div>
          </div>

          {/* Email (read-only) */}
          {email && (
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm text-muted-foreground">
                  Managed by your auth provider
                </p>
              </div>
              <div className="flex-shrink-0 w-56">
                <input
                  value={email}
                  disabled
                  className="an-focus-input w-full h-8 rounded-md bg-foreground/[0.05] border border-border px-2.5 text-[13px] text-foreground/70 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          )}
        </div>

        {/* Save footer */}
        <div className="bg-muted p-3 flex justify-end border-t">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="an-focus-btn flex items-center justify-center gap-2 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background hover:opacity-90 disabled:opacity-60"
          >
            {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Save
          </button>
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="an-focus-btn flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm text-muted-foreground hover:bg-muted disabled:opacity-60"
      >
        {isSigningOut ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4" />
        )}
        {isSigningOut ? "Signing out..." : "Sign out"}
      </button>
    </div>
  )
}
