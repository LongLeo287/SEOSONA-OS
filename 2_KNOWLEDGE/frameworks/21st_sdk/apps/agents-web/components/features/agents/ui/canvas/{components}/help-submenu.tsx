"use client"

import { DiscordIcon, TwitterIcon } from "@/components/icons"
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "../[id]/{components}/ui/dropdown-menu"
import {
  BookIcon,
  ExternalLinkIcon,
  LightbulbIcon,
  QuestionCircleIcon,
  MailIcon,
} from "../[id]/{components}/ui/icons"
import { openSupportChat, openFeedbackWidget } from "@/components/features/support"

interface HelpSubmenuProps {
  onClose?: () => void
}

export function HelpSubmenu({ onClose }: HelpSubmenuProps) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="gap-2">
        <QuestionCircleIcon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        <span className="flex-1">Help</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-48" sideOffset={6} alignOffset={-4}>
        <DropdownMenuItem
          onClick={() => {
            window.open("https://help.21st.dev/", "_blank")
            onClose?.()
          }}
          className="gap-2"
        >
          <BookIcon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <span className="flex-1">Documentation</span>
          <ExternalLinkIcon className="h-3 w-3 text-muted-foreground" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            window.open("https://discord.gg/Qx4rFunHfm", "_blank")
            onClose?.()
          }}
          className="gap-2"
        >
          <DiscordIcon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <span className="flex-1">Community</span>
          <ExternalLinkIcon className="h-3 w-3 text-muted-foreground" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            onClose?.()
            openSupportChat()
          }}
          className="gap-2"
        >
          <MailIcon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          Contact Support
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onClose?.()
            openFeedbackWidget()
          }}
          className="gap-2"
        >
          <LightbulbIcon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          Share Feedback
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            window.open("https://x.com/21st_dev", "_blank")
            onClose?.()
          }}
          className="gap-2"
        >
          <TwitterIcon className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <span className="flex-1">Twitter</span>
          <ExternalLinkIcon className="h-3 w-3 text-muted-foreground" />
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}
