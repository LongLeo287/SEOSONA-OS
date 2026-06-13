"use client"

import { atom } from "jotai"

export interface CreateProjectDialogState {
  isOpen: boolean
  selectedTeamId?: string
  placeholder?: string
  onSuccess?: (data: { projectId: string }) => void
  onError?: (error: string) => void
}

export const createProjectDialogAtom = atom<CreateProjectDialogState>({
  isOpen: false,
  selectedTeamId: undefined,
  placeholder: "Describe what you want to prototype...",
  onSuccess: undefined,
  onError: undefined,
})

// Helper atoms for easier access
export const openCreateProjectDialogAtom = atom(
  null,
  (get, set, params: Omit<CreateProjectDialogState, "isOpen">) => {
    set(createProjectDialogAtom, {
      ...params,
      isOpen: true,
    })
  },
)

export const closeCreateProjectDialogAtom = atom(null, (get, set) => {
  set(createProjectDialogAtom, {
    isOpen: false,
    selectedTeamId: undefined,
    placeholder: "Describe what you want to prototype...",
    onSuccess: undefined,
    onError: undefined,
  })
})
