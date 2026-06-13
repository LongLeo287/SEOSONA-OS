"use client"

import {
  settingsDialogActiveTabAtom,
  SettingsTab,
} from "@/lib/atoms/settings-dialog"
import { cn } from "@/lib/utils"
import { useAtom } from "jotai"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import {
  EyeOpenFilledIcon,
  ProfileIconFilled,
  MembersIcon,
} from "../[id]/{components}/ui/icons"
import { AppearanceTab } from "./settings-tabs/appearance-tab"
import { ProfileTab } from "./settings-tabs/profile-tab"
import { MembersTab } from "./settings-tabs/members-tab"
import {
  useIsNarrowScreen,
  useIsTouchDevice,
} from "@/hooks/use-media-query"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { api } from "@/trpc/client"
import { usePathname } from "next/navigation"

interface SettingsDialogProps {
  isOpen: boolean
  onClose: () => void
}

const ALL_ACCOUNT_TABS = [
  {
    id: "profile" as SettingsTab,
    label: "Profile",
    icon: ProfileIconFilled,
    description: "Manage your profile settings",
  },
  {
    id: "appearance" as SettingsTab,
    label: "Appearance",
    icon: EyeOpenFilledIcon,
    description: "Performance and visuals",
  },
]

const ALL_WORKSPACE_TABS = [
  {
    id: "members" as SettingsTab,
    label: "Members",
    icon: MembersIcon,
    description: "Manage team members",
  },
]

interface TabButtonProps {
  tab: (typeof ALL_ACCOUNT_TABS)[number]
  isActive: boolean
  onClick: () => void
  isMobile?: boolean
}

function TabButton({ tab, isActive, onClick, isMobile }: TabButtonProps) {
  const Icon = tab.icon
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center whitespace-nowrap ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 cursor-pointer shadow-none w-full justify-start gap-2 text-left px-3 py-1.5 text-sm",
        isMobile
          ? "h-12 rounded-lg bg-foreground/5 hover:bg-foreground/10"
          : "h-8 rounded-md",
        !isMobile && isActive
          ? "bg-foreground/10 text-foreground font-medium hover:bg-foreground/15 hover:text-foreground"
          : !isMobile
            ? "text-muted-foreground hover:bg-foreground/5 hover:text-foreground font-medium"
            : "text-foreground font-medium",
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4",
          isMobile ? "opacity-70" : isActive ? "opacity-100" : "opacity-50",
        )}
      />
      <span className="flex-1">{tab.label}</span>
      {isMobile && (
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      )}
    </button>
  )
}

// Dialog dimensions constants for reference
// width: 90vw, height: 80vh, maxWidth: 900px

// Helper to get tab label from tab id
function getTabLabel(tabId: SettingsTab): string {
  return (
    ALL_ACCOUNT_TABS.find((t) => t.id === tabId)?.label ??
    ALL_WORKSPACE_TABS.find((t) => t.id === tabId)?.label ??
    "Settings"
  )
}

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useAtom(settingsDialogActiveTabAtom)
  const [mounted, setMounted] = useState(false)
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)
  const isNarrowScreen = useIsNarrowScreen()
  const isTouchDevice = useIsTouchDevice()
  const pathname = usePathname() ?? ""
  const { data: teams, isLoading: isLoadingTeams } = api.teams.getUserTeams.useQuery(undefined, {
    enabled: isOpen,
  })
  const isAgentsRoute = pathname.startsWith("/agents")

  const accountTabs = ALL_ACCOUNT_TABS
  const workspaceTabs =
    isAgentsRoute && teams && teams.length > 0 ? ALL_WORKSPACE_TABS : []

  // Narrow screen: track whether we're showing tab list or content
  const [showContent, setShowContent] = useState(false)

  // Reset content view when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setShowContent(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || activeTab !== "members") return
    if (!isAgentsRoute) {
      setActiveTab("profile")
      return
    }
    if (!isLoadingTeams && teams && teams.length === 0) {
      setActiveTab("profile")
    }
  }, [activeTab, isAgentsRoute, isLoadingTeams, isOpen, setActiveTab, teams])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        if (isNarrowScreen && showContent) {
          setShowContent(false)
        } else {
          onClose()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, isNarrowScreen, showContent])

  // Ensure portal target only accessed on client
  useEffect(() => {
    setMounted(true)
    if (typeof document !== "undefined") {
      setPortalTarget(document.body)
    }
  }, [])

  const handleTabClick = (tabId: SettingsTab) => {
    setActiveTab(tabId)
    if (isNarrowScreen) {
      setShowContent(true)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />
      case "appearance":
        return <AppearanceTab />
      case "members":
        return <MembersTab inviteSource="agents" />
      default:
        return null
    }
  }

  const renderTabList = () => (
      <div className="space-y-4 px-1">
        <div className="space-y-1.5">
          <div className="px-3 py-1">
            <h3 className="text-xs font-medium text-muted-foreground tracking-wider">
              Account
            </h3>
          </div>
          {accountTabs.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => handleTabClick(tab.id)}
              isMobile={isNarrowScreen}
            />
          ))}
        </div>

        {workspaceTabs.length > 0 && (
          <div className="space-y-1.5">
            <div className="px-3 py-1">
              <h3 className="text-xs font-medium text-muted-foreground tracking-wider">
                Team
              </h3>
            </div>
            {workspaceTabs.map((tab) => (
              <TabButton
                key={tab.id}
                tab={tab}
                isActive={activeTab === tab.id}
                onClick={() => handleTabClick(tab.id)}
                isMobile={isNarrowScreen}
              />
            ))}
          </div>
        )}

    </div>
  )

  if (!mounted || !portalTarget) return null

  // Touch device + narrow screen: Render as Drawer (swipeable)
  if (isNarrowScreen && isTouchDevice) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="h-[85vh] max-h-[85vh]">
          <DrawerHeader className="px-4 pb-2 pt-0">
            <div className="flex items-center gap-2">
              {showContent && (
                <button
                  onClick={() => setShowContent(false)}
                  className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-foreground/5 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}
              <DrawerTitle className="text-lg font-semibold">
                {showContent ? getTabLabel(activeTab) : "Settings"}
              </DrawerTitle>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4 pb-8">
            {showContent ? (
              <div className="bg-tl-background rounded-xl overflow-hidden">
                {renderTabContent()}
              </div>
            ) : (
              renderTabList()
            )}
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  // Desktop narrow screen (no touch): Full-screen overlay
  if (isNarrowScreen && !isTouchDevice) {
    if (!isOpen) return null

    return createPortal(
      <>
        {/* Full-screen settings panel */}
        <div
          className="fixed inset-0 z-[45] flex flex-col bg-background overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-dialog-title-narrow"
          data-modal="settings"
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            {showContent && (
              <button
                onClick={() => setShowContent(false)}
                className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-foreground/5 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <h2
              id="settings-dialog-title-narrow"
              className="text-lg font-semibold flex-1"
            >
              {showContent ? getTabLabel(activeTab) : "Settings"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-foreground/5 transition-colors"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {showContent ? (
              <div className="bg-tl-background min-h-full">
                {renderTabContent()}
              </div>
            ) : (
              <div className="p-4">
                {renderTabList()}
              </div>
            )}
          </div>
        </div>
      </>,
      portalTarget,
    )
  }

  // Desktop wide screen: Render as centered modal
  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Custom Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/25"
            onClick={onClose}
            style={{ pointerEvents: isOpen ? "auto" : "none" }}
            data-modal="settings"
          />

          {/* Settings Dialog */}
          <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[45]">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-[90vw] h-[80vh] max-w-[900px] p-0 flex flex-col rounded-[20px] bg-background border-none bg-clip-padding shadow-2xl overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="settings-dialog-title"
              data-modal="settings"
            >
              <h2 id="settings-dialog-title" className="sr-only">
                Settings
              </h2>

              <div className="flex h-full p-2">
                {/* Left Sidebar - Tabs */}
                <div className="w-52 px-1 py-5 space-y-4">
                  <h2 className="text-lg font-semibold px-2 pb-3 text-foreground">
                    Settings
                  </h2>

                  {/* Account Section */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="px-3 py-1">
                        <h3 className="text-xs font-medium text-muted-foreground tracking-wider">
                          Account
                        </h3>
                      </div>
                      {accountTabs.map((tab) => (
                        <TabButton
                          key={tab.id}
                          tab={tab}
                          isActive={activeTab === tab.id}
                          onClick={() => setActiveTab(tab.id)}
                        />
                      ))}
                    </div>

                    {workspaceTabs.length > 0 && (
                      <div className="space-y-1">
                        <div className="px-3 py-1">
                          <h3 className="text-xs font-medium text-muted-foreground tracking-wider">
                            Team
                          </h3>
                        </div>
                        {workspaceTabs.map((tab) => (
                          <TabButton
                            key={tab.id}
                            tab={tab}
                            isActive={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* Right Content Area */}
                <div className="flex-1 overflow-hidden">
                  <div className="flex flex-col relative h-full bg-tl-background rounded-xl w-full transition-all duration-300 overflow-y-auto">
                    {renderTabContent()}
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute appearance-none outline-none select-none top-5 right-5 rounded-full cursor-pointer flex items-center justify-center ring-offset-background focus:ring-ring bg-secondary h-8 w-8 text-foreground/70 hover:text-foreground focus:outline-hidden disabled:pointer-events-none active:scale-95 transition-all duration-200 ease-in-out z-[60] focus:outline-none focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    portalTarget,
  )
}
