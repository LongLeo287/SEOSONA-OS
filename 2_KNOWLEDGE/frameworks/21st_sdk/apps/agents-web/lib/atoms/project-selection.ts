import { atom } from "jotai"

// Set of selected project IDs
export const selectedProjectIdsAtom = atom<Set<string>>(new Set<string>())

// Derived atom to check if multi-select mode is active
export const isMultiSelectModeAtom = atom(
  (get) => get(selectedProjectIdsAtom).size > 0,
)

// Derived atom for selected projects count
export const selectedProjectsCountAtom = atom(
  (get) => get(selectedProjectIdsAtom).size,
)

// Action atom to toggle project selection
export const toggleProjectSelectionAtom = atom(
  null,
  (get, set, projectId: string) => {
    const current = get(selectedProjectIdsAtom)
    const newSet = new Set(current)
    if (newSet.has(projectId)) {
      newSet.delete(projectId)
    } else {
      newSet.add(projectId)
    }
    set(selectedProjectIdsAtom, newSet)
  },
)

// Action atom to select a project (add to selection)
export const selectProjectAtom = atom(null, (get, set, projectId: string) => {
  const current = get(selectedProjectIdsAtom)
  const newSet = new Set(current)
  newSet.add(projectId)
  set(selectedProjectIdsAtom, newSet)
})

// Action atom to deselect a project (remove from selection)
export const deselectProjectAtom = atom(null, (get, set, projectId: string) => {
  const current = get(selectedProjectIdsAtom)
  const newSet = new Set(current)
  newSet.delete(projectId)
  set(selectedProjectIdsAtom, newSet)
})

// Action atom to select all projects
export const selectAllProjectsAtom = atom(
  null,
  (_get, set, projectIds: string[]) => {
    set(selectedProjectIdsAtom, new Set(projectIds))
  },
)

// Action atom to clear selection
export const clearSelectionAtom = atom(null, (_get, set) => {
  set(selectedProjectIdsAtom, new Set<string>())
})
