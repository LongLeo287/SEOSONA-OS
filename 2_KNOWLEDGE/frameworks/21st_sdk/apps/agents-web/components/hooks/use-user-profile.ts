import { useAgentsViewer } from "@/lib/agents/auth/client"
import { api } from "@/trpc/client"

export interface UserProfileViewer {
  id: string
  fullName: string | null
  username: string | null
  imageUrl: string | null
  primaryEmailAddressId: string | null
  primaryEmailAddress: {
    emailAddress: string
  } | null
  emailAddresses: Array<{
    id: string
    emailAddress: string
  }>
  externalAccounts: Array<{
    id: string
    provider: string
    username: string | null
    emailAddress: string | null
  }>
}

export interface UserProfile {
  id: string
  username: string | null
  name: string | null
  image_url: string | null
  display_name: string | null
  display_username: string | null
  display_image_url: string | null
  bio: string | null
  website_url: string | null
  github_url: string | null
  twitter_url: string | null
  donation_url: string | null
  created_at: Date
  manually_added: boolean
}

export function useUserProfile(): {
  user: UserProfile | null
  isLoading: boolean
  clerkUser: UserProfileViewer | null
} {
  const viewer = useAgentsViewer()
  const clerkUser = viewer
    ? {
        id: viewer.id,
        fullName: viewer.fullName,
        username: viewer.username,
        imageUrl: viewer.imageUrl,
        primaryEmailAddressId: viewer.primaryEmailAddressId,
        primaryEmailAddress: viewer.email
          ? { emailAddress: viewer.email }
          : null,
        emailAddresses: viewer.emailAddresses,
        externalAccounts: viewer.externalAccounts,
      }
    : null

  const { data: userProfile, isLoading } =
    api.users.getCurrentUserProfile.useQuery(undefined, {
      enabled: !!clerkUser?.id,
      staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchInterval: 5 * 60 * 1000,
    })

  return {
    user: userProfile ?? null,
    isLoading,
    clerkUser,
  }
}
