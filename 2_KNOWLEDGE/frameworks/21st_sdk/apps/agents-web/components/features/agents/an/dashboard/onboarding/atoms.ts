import { atom } from "jotai"
import type { VisualConfig } from "@/components/features/agents/an/types"

export type OnboardingStep = "purpose" | "theme" | "identity" | "overview" | "get-started"
export type AgentPurpose =
  | "customer-support"
  | "sales"
  | "research"
  | "docs-assistant"
  | "onboarding"
  | "internal-tools"
  | "custom"
export type ThemePreset = "notion" | "cursor" | "minimal" | "custom"
export type OnboardingRuntime = "claude-code" | "codex"

export interface OnboardingState {
  currentStep: OnboardingStep
  purpose: AgentPurpose | null
  theme: ThemePreset | null
  primaryColor: string
  visualConfig: VisualConfig | null
  agentName: string
  agentSlug: string
  systemPrompt: string
  autoGeneratePrompt: boolean
  projectDescription: string
  selectedTools: string[]
  runtime: OnboardingRuntime
  model: string
}

export const defaultOnboardingState: OnboardingState = {
  currentStep: "identity",
  purpose: null,
  theme: "notion",
  primaryColor: "#3b82f6",
  visualConfig: null,
  agentName: "",
  agentSlug: "",
  systemPrompt: "",
  autoGeneratePrompt: true,
  projectDescription: "",
  selectedTools: [],
  runtime: "claude-code",
  model: "claude-sonnet-4-6",
}

export const onboardingStateAtom = atom<OnboardingState>(defaultOnboardingState)

export const ONBOARDING_STEPS: OnboardingStep[] = [
  "identity",
  "theme",
  "get-started",
]
