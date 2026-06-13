"use client"

import { useRouter } from "next/navigation"
import { useAtomValue, useSetAtom } from "jotai"

import { DropdownMenuItem } from "../[id]/{components}/ui/dropdown-menu"
import {
  PublisherStudioIcon,
  ProfileIcon,
  SettingsIcon,
} from "../[id]/{components}/ui/icons"
import { Logo } from "../[id]/{components}/ui/logo"
import { HelpSubmenu } from "./help-submenu"
import { userStateAtom } from "@/lib/store/user-store"
import { IS_STANDALONE_APP } from "@/lib/agents/auth/config"
import {
  settingsDialogActiveTabAtom,
  settingsDialogOpenAtom,
} from "@/lib/atoms/settings-dialog"

interface LogoDropdownContentProps {
  userId: string | null | undefined
  clerkUser: any
  clerkUsername: string | undefined
  onClose: () => void
  onSignOut: () => void
  onLogin: () => void
}

export function LogoDropdownContent({
  userId,
  clerkUser,
  clerkUsername,
  onClose,
  onSignOut,
  onLogin,
}: LogoDropdownContentProps) {
  const router = useRouter()
  const userState = useAtomValue(userStateAtom)
  const setSettingsDialogOpen = useSetAtom(settingsDialogOpenAtom)
  const setSettingsActiveTab = useSetAtom(settingsDialogActiveTabAtom)

  if (!userId) {
    return (
      <>
        <div className="">
          <DropdownMenuItem
            className="gap-2"
            onSelect={() => {
              onClose()
              onLogin()
            }}
          >
            <ProfileIcon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            Login
          </DropdownMenuItem>
        </div>

        <div className="h-px bg-border my-1 mx-2"></div>

        <HelpSubmenu onClose={onClose} />
      </>
    )
  }

  return (
    <>
      <div className="relative rounded-t-xl border-b overflow-hidden">
        <div className="absolute inset-0 bg-popover brightness-110" />
        <div className="relative px-1 pt-1 pb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded flex items-center justify-center bg-background flex-shrink-0 overflow-hidden">
              <Logo className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="font-medium text-sm text-foreground truncate">
                {userState.profile?.name ||
                  clerkUser?.fullName ||
                  clerkUsername ||
                  "21st"}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.email}
              </div>
            </div>
          </div>
        </div>
      </div>

      {!IS_STANDALONE_APP && (
        <div className="">
          <DropdownMenuItem
            className="gap-2"
            onSelect={() => {
              router.push("/studio")
            }}
          >
            <PublisherStudioIcon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            Publisher studio
          </DropdownMenuItem>
        </div>
      )}

      {(userState.profile?.display_username ||
        userState.profile?.username ||
        clerkUsername) && (
        <div className="">
          <DropdownMenuItem
            className="gap-2"
            onSelect={() => {
              const username =
                userState.profile?.display_username ||
                userState.profile?.username ||
                clerkUsername
              router.push(`/${username}`)
            }}
          >
            <ProfileIcon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            My profile
          </DropdownMenuItem>
        </div>
      )}

      <HelpSubmenu onClose={onClose} />

      <div className="">
        <DropdownMenuItem
          className="gap-2"
          onSelect={() => {
            onClose()
            setSettingsActiveTab("profile")
            setSettingsDialogOpen(true)
          }}
        >
          <SettingsIcon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          Settings
        </DropdownMenuItem>
      </div>

      <div className="h-px bg-border my-1 mx-2"></div>

      <div className="">
        <DropdownMenuItem
          className="gap-2"
          onSelect={() => onSignOut()}
        >
          <svg
            className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="16,17 21,12 16,7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="21"
              y1="12"
              x2="9"
              y2="12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Log out
        </DropdownMenuItem>
      </div>
    </>
  )
}
