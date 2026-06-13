import {
  useUserProfile,
  type UserProfileViewer,
  type UserProfile,
} from "@/components/hooks/use-user-profile"

/**
 * Hook to get the user's username from the database (not Clerk).
 * Prefers display_username over username for consistency.
 *
 * @returns The user's username from the database, or null if not available
 */
export function useUserUsername(): string | null {
  const { user: dbUser } = useUserProfile()

  if (!dbUser) {
    return null
  }

  // Prefer display_username over username for consistency
  return dbUser.display_username || dbUser.username || null
}

/**
 * Hook to get both the database user and their username.
 * Useful when you need both the user object and username.
 *
 * @returns Object containing the database user and their username
 */
export function useUserWithUsername(): {
  user: UserProfile | null
  username: string | null
  isLoading: boolean
  clerkUser: UserProfileViewer | null
} {
  const { user: dbUser, isLoading, clerkUser } = useUserProfile()
  const username = dbUser?.display_username || dbUser?.username || null

  return {
    user: dbUser,
    username,
    isLoading,
    clerkUser,
  }
}
