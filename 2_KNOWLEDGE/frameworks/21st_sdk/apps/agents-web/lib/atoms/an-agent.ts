import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export type AnAgentConfig = {
  id: string
  name: string
  slug: string
}

// Persisted ID survives page reloads; full object is restored from API data in the layout
export const anSelectedAgentIdAtom = atomWithStorage<string | null>(
  "an-selected-agent-id",
  null,
)

// Internal atom holding the full object
const _anSelectedAgentAtom = atom<AnAgentConfig | null>(null)

// Derived writable atom that auto-syncs the persisted ID on every write
export const anSelectedAgentAtom = atom(
  (get) => get(_anSelectedAgentAtom),
  (get, set, value: AnAgentConfig | null) => {
    set(_anSelectedAgentAtom, value)
    set(anSelectedAgentIdAtom, value?.id ?? null)
  },
)

/** Callback for the "restart chat" action shown in DashboardHeader on playground page */
export const anPlaygroundRestartAtom = atom<(() => void) | null>(null)

/** Persisted sandbox IDs for the playground, keyed by agent slug – survives page reloads, cleared on "New chat" */
export const anPlaygroundSandboxMapAtom = atomWithStorage<
  Record<string, { sandboxId: string; deploymentId: string }>
>("an-playground-sandbox-map", {})

/** Callback for the "create skill" action shown in DashboardHeader on skills page */
export const anSkillsCreateAtom = atom<(() => void) | null>(null)

/** Skill save action exposed to DashboardHeader */
export type SkillsSaveState = {
  onSave: () => void
  state: "idle" | "saving" | "saved"
  disabled: boolean
  label: string
}
export const anSkillsSaveAtom = atom<SkillsSaveState | null>(null)

/** Callback for the "create API key" action shown in DashboardHeader on api-keys page */
export const anApiKeysCreateAtom = atom<(() => void) | null>(null)

/** Callback for the "toggle theme builder" action shown in DashboardHeader on playground page */
export const anPlaygroundThemeToggleAtom = atom<(() => void) | null>(null)

/** Agent currently being edited in Settings page — set by sidebar/settings, read by header for breadcrumb */
export const anSettingsEditingAgentAtom = atom<{ id: string; name: string } | null>(null)

/** Current studio project — set by workspace page, read by header for breadcrumb */
export const anStudioProjectAtom = atom<{ id: string; name: string } | null>(null)
