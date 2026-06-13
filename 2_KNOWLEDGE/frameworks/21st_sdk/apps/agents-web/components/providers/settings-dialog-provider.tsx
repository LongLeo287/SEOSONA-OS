"use client"

import { useAtom, useSetAtom } from "jotai"
import {
  settingsDialogOpenAtom,
  settingsDialogSourceAtom,
} from "@/lib/atoms/settings-dialog"
import { SettingsDialog } from "@/components/features/agents/ui/canvas/{components}/settings-dialog"

export function SettingsDialogProvider() {
  const [isOpen, setIsOpen] = useAtom(settingsDialogOpenAtom)
  const setSource = useSetAtom(settingsDialogSourceAtom)

  return (
    <SettingsDialog
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false)
        setSource("default")
      }}
    />
  )
}
