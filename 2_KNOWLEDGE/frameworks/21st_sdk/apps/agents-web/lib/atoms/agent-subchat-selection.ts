import { atom } from "jotai"

// Set of selected sub-chat IDs
export const selectedSubChatIdsAtom = atom<Set<string>>(new Set<string>())

// Derived atom to check if multi-select mode is active
export const isSubChatMultiSelectModeAtom = atom(
  (get) => get(selectedSubChatIdsAtom).size > 0,
)

// Derived atom for selected sub-chats count
export const selectedSubChatsCountAtom = atom(
  (get) => get(selectedSubChatIdsAtom).size,
)

// Action atom to toggle sub-chat selection
export const toggleSubChatSelectionAtom = atom(
  null,
  (get, set, subChatId: string) => {
    const current = get(selectedSubChatIdsAtom)
    const newSet = new Set(current)
    if (newSet.has(subChatId)) {
      newSet.delete(subChatId)
    } else {
      newSet.add(subChatId)
    }
    set(selectedSubChatIdsAtom, newSet)
  },
)

// Action atom to select all sub-chats
export const selectAllSubChatsAtom = atom(
  null,
  (_get, set, subChatIds: string[]) => {
    set(selectedSubChatIdsAtom, new Set(subChatIds))
  },
)

// Action atom to clear selection
export const clearSubChatSelectionAtom = atom(null, (_get, set) => {
  set(selectedSubChatIdsAtom, new Set<string>())
})



