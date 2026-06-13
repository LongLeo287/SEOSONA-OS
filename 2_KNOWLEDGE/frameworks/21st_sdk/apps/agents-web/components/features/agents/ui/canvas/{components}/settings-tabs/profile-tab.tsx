"use client"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Check,
  ImagePlus,
  X,
  Upload,
  LoaderCircle,
  Globe,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { IconSpinner, GitHubLogo } from "../../[id]/{components}/ui/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DeleteAccountDialog } from "@/components/ui/delete-account-dialog"
import { useImageUpload } from "@/hooks/use-image-upload"
import { useUserProfile } from "@/components/hooks/use-user-profile"
import { IS_BETTER_AUTH } from "@/lib/agents/auth/config"

const profileFormSchema = z.object({
  display_name: z.string().min(2).max(50),
  display_image_url: z.string().optional().nullable(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const CLERK_ACCOUNT_URL =
  process.env.NODE_ENV === "development"
    ? "https://wanted-titmouse-48.accounts.dev/user"
    : "https://accounts.21st.dev/user"

export function ProfileTab() {
  const [isLoading, setIsLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<
    "saved" | "saving" | "error" | null
  >(null)
  const [isVisible, setIsVisible] = useState(true)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const {
    user: dbUser,
    clerkUser: user,
    isLoading: isUserLoading,
  } = useUserProfile()

  const {
    previewUrl,
    isDragging,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  } = useImageUpload()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema as any),
    defaultValues: {
      display_name: "",
      display_image_url: "",
    },
  })

  useEffect(() => {
    if (!isUserLoading && (dbUser || user)) {
      form.reset({
        display_name: dbUser?.display_name || user?.fullName || "",
        display_image_url: dbUser?.display_image_url || user?.imageUrl || "",
      })
    }
  }, [isUserLoading, dbUser, user, form])

  useEffect(() => {
    const subscription = form.watch((_, { type }) => {
      if (type === "change") {
        setIsVisible(true)
        setSaveStatus("saving")

        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)

        saveTimeoutRef.current = setTimeout(() => {
          onSubmit(form.getValues())
        }, 1_000)
      }
    })
    return () => {
      subscription.unsubscribe()
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    }
  }, [form.watch])

  useEffect(() => {
    if (saveStatus === "saved") {
      setIsVisible(true)
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = setTimeout(() => setIsVisible(false), 3_000)
    }
  }, [saveStatus])

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)
    setSaveStatus("saving")
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: data.display_name,
          display_image_url: previewUrl || data.display_image_url || null,
        }),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Failed to update profile")

      setSaveStatus("saved")
    } catch (error) {
      setSaveStatus("error")
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile",
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <IconSpinner className="h-6 w-6" />
      </div>
    )
  }

  const username = dbUser?.display_username || user?.username || "username"
  const initials =
    (form.watch("display_name") || "U")
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"

  return (
    <div
      className={cn(
        "relative",
        isDragging && "ring-2 ring-primary ring-offset-2",
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={async (e) => {
        const base64String = await handleDrop(e)
        if (base64String) form.setValue("display_image_url", base64String)
      }}
    >
      {isDragging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="h-8 w-8" />
            <p className="text-sm">Drop image here to update avatar</p>
          </div>
        </div>
      )}

      <Form {...form}>
        <form className="divide-y divide-border">

          {/* Section: Account */}
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-foreground">Account</h3>
              {saveStatus && (
                <div
                  className={cn(
                    "flex items-center gap-1.5 text-xs transition-opacity duration-300",
                    !isVisible && saveStatus === "saved" && "opacity-0",
                    saveStatus === "saving" && "text-muted-foreground",
                    saveStatus === "saved" && "text-green-500",
                    saveStatus === "error" && "text-destructive",
                  )}
                >
                  {saveStatus === "saving" && (
                    <>
                      <LoaderCircle className="h-3 w-3 animate-spin" />
                      Saving
                    </>
                  )}
                  {saveStatus === "saved" && (
                    <>
                      <Check className="h-3 w-3" />
                      Saved
                    </>
                  )}
                  {saveStatus === "error" && (
                    <>
                      <X className="h-3 w-3" />
                      Error
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Avatar row */}
            <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-muted/40 border border-border">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={previewUrl || form.getValues("display_image_url") || undefined}
                  alt={form.watch("display_name")}
                />
                <AvatarFallback className="text-sm font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {form.watch("display_name") || "Your name"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  @{username}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleThumbnailClick}
                className="h-8 text-xs shrink-0"
              >
                <ImagePlus className="mr-1.5 h-3.5 w-3.5" />
                Change Avatar
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={async (e) => {
                  const base64String = await handleFileChange(e)
                  if (base64String) form.setValue("display_image_url", base64String)
                }}
                className="hidden"
                accept="image/*"
              />
            </div>

            {/* Display name */}
            <FormField
              control={form.control}
              name="display_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">Display Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-9 bg-background" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section: Public Profile */}
          <div className="px-6 py-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Public Profile</h3>
            {(dbUser?.display_username || dbUser?.username) && (
              <Link
                href={`/studio/${dbUser.display_username || dbUser.username}/profile`}
                className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border border-border bg-muted/40 hover:bg-muted/70 transition-colors group"
              >
                <p className="text-xs text-muted-foreground">
                  Public profile settings have moved to{" "}
                  <span className="text-foreground font-medium">Studio</span>
                </p>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
              </Link>
            )}
          </div>

          {/* Section: Connected accounts */}
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Connected accounts</h3>
              {!IS_BETTER_AUTH && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground hover:text-foreground shrink-0"
                  onClick={() => window.open(CLERK_ACCOUNT_URL, "_blank")}
                  type="button"
                >
                  Manage ↗
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {user?.emailAddresses?.map((email) => (
                <div
                  key={email.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border bg-muted/30"
                >
                  <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <svg className="h-3.5 w-3.5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{email.emailAddress}</p>
                    <p className="text-[10px] text-muted-foreground">Email</p>
                  </div>
                  {email.id === user.primaryEmailAddressId && (
                    <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded shrink-0">Primary</span>
                  )}
                </div>
              ))}

              {user?.externalAccounts?.map((account) => {
                const isGitHub = account.provider === "github"
                const isGoogle = account.provider === "google"
                const label = isGitHub ? "GitHub" : isGoogle ? "Google" : account.provider
                const detail = isGitHub
                  ? (account.username ? `@${account.username}` : account.emailAddress)
                  : account.emailAddress

                return (
                  <div
                    key={account.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                      {isGitHub ? (
                        <GitHubLogo className="h-3.5 w-3.5 text-foreground" />
                      ) : isGoogle ? (
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      ) : (
                        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{detail}</p>
                      <p className="text-[10px] text-muted-foreground">{label}</p>
                    </div>
                    <span className="text-[10px] bg-green-500/10 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded shrink-0">Connected</span>
                  </div>
                )
              })}
            </div>
          </div>

          {!IS_BETTER_AUTH && (
            <div className="px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-destructive">Danger Zone</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 text-xs shrink-0"
                  onClick={() => setDeleteDialogOpen(true)}
                  type="button"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          )}

        </form>
      </Form>

      {!IS_BETTER_AUTH && (
        <DeleteAccountDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      )}
    </div>
  )
}
