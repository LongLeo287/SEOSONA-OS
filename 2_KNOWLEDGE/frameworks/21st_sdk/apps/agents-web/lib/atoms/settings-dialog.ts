import { atom } from "jotai"

export type SettingsTab =
  | "profile"
  | "billing"
  | "rules"
  | "appearance"
  | "emails"
  | "team"
  | "members"
  | "github"
  | "claude-code"
  | "linear"
  | "discord"
  | "debug"
  | "automations"
  | "api"
export type GitHubFlowStep = "status" | "repositories" | "configuration"

export type SettingsDialogSource = "magic-chat" | "default"

export const settingsDialogOpenAtom = atom(false)
export const settingsDialogActiveTabAtom = atom<SettingsTab>("profile")
export const settingsDialogSourceAtom = atom<SettingsDialogSource>("default")
export const githubFlowStepAtom = atom<GitHubFlowStep>("status")
