import { atom } from "jotai"

// Set of selected agent chat IDs
export const selectedAgentChatIdsAtom = atom<Set<string>>(new Set<string>())

// Derived atom to check if multi-select mode is active
export const isAgentMultiSelectModeAtom = atom(
  (get) => get(selectedAgentChatIdsAtom).size > 0,
)

// Derived atom for selected chats count
export const selectedAgentChatsCountAtom = atom(
  (get) => get(selectedAgentChatIdsAtom).size,
)

// Action atom to toggle chat selection
export const toggleAgentChatSelectionAtom = atom(
  null,
  (get, set, chatId: string) => {
    const current = get(selectedAgentChatIdsAtom)
    const newSet = new Set(current)
    if (newSet.has(chatId)) {
      newSet.delete(chatId)
    } else {
      newSet.add(chatId)
    }
    set(selectedAgentChatIdsAtom, newSet)
  },
)

// Action atom to select a chat (add to selection)
export const selectAgentChatAtom = atom(null, (get, set, chatId: string) => {
  const current = get(selectedAgentChatIdsAtom)
  const newSet = new Set(current)
  newSet.add(chatId)
  set(selectedAgentChatIdsAtom, newSet)
})

// Action atom to deselect a chat (remove from selection)
export const deselectAgentChatAtom = atom(null, (get, set, chatId: string) => {
  const current = get(selectedAgentChatIdsAtom)
  const newSet = new Set(current)
  newSet.delete(chatId)
  set(selectedAgentChatIdsAtom, newSet)
})

// Action atom to select all chats
export const selectAllAgentChatsAtom = atom(
  null,
  (_get, set, chatIds: string[]) => {
    set(selectedAgentChatIdsAtom, new Set(chatIds))
  },
)

// Action atom to clear selection
export const clearAgentChatSelectionAtom = atom(null, (_get, set) => {
  set(selectedAgentChatIdsAtom, new Set<string>())
})



