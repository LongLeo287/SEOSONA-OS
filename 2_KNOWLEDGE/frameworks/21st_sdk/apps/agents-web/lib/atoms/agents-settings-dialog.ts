import { atom } from "jotai"
import { SettingsTab, GitHubFlowStep } from "./settings-dialog"

export const agentsSettingsDialogOpenAtom = atom(false)
export const agentsSettingsDialogActiveTabAtom = atom<SettingsTab>("profile")
export const agentsGithubFlowStepAtom = atom<GitHubFlowStep>("status")
// Stores the URL to redirect back to after GitHub OAuth (e.g. automation page)
export const agentsGithubRedirectUrlAtom = atom<string | null>(null)

