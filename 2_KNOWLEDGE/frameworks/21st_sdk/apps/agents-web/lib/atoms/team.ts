import { atom } from "jotai"
import { atomWithStorage, RESET } from "jotai/utils"

// Stores the currently selected team ID, persisted to localStorage
export const selectedTeamIdAtom = atomWithStorage<string | null>(
  "canvas-selected-team-id",
  null,
)

export const resetSelectedTeamIdAtom = atom(null, (_get, set) => {
  set(selectedTeamIdAtom, RESET)
})

// Controls the create team dialog visibility
export const createTeamDialogOpenAtom = atom(false)

// When set, opens the team dialog directly in invite mode for the specified team
export const inviteToTeamIdAtom = atom<string | null>(null)

// GitHub setup complete toast state
export interface GitHubSetupCompleteToastState {
  isVisible: boolean
  repositoryName?: string
}

export const githubSetupCompleteToastAtom = atom<GitHubSetupCompleteToastState>({
  isVisible: false,
  repositoryName: undefined,
})
