"use client"

import { useAtom } from "jotai"
import { AnimatePresence, motion } from "motion/react"
import {
  onboardingStateAtom,
  defaultOnboardingState,
  ONBOARDING_STEPS,
  type OnboardingStep,
} from "./atoms"
import { PurposeStep } from "./steps/purpose-step"
import { ThemeStep } from "./steps/theme-step"
import { IdentityStep } from "./steps/identity-step"
import { OverviewStep } from "./steps/overview-step"
import { ArrowLeft } from "lucide-react"

const STEP_LABELS: Record<OnboardingStep, string> = {
  purpose: "Purpose",
  theme: "Theme",
  identity: "Identity",
  overview: "Overview",
  "get-started": "Get Started",
}

export function OnboardingWizard() {
  const [state, setState] = useAtom(onboardingStateAtom)

  const currentIndex = ONBOARDING_STEPS.indexOf(state.currentStep)
  const progress = ((currentIndex + 1) / ONBOARDING_STEPS.length) * 100

  function goToStep(step: OnboardingStep) {
    setState((s) => ({ ...s, currentStep: step }))
  }

  function goNext() {
    const nextIndex = currentIndex + 1
    if (nextIndex < ONBOARDING_STEPS.length) {
      goToStep(ONBOARDING_STEPS[nextIndex]!)
    }
  }

  function goBack() {
    const prevIndex = currentIndex - 1
    if (prevIndex >= 0) {
      goToStep(ONBOARDING_STEPS[prevIndex]!)
    }
  }

  function reset() {
    setState(defaultOnboardingState)
  }

  const stepComponent = (() => {
    switch (state.currentStep) {
      case "purpose":
        return <PurposeStep state={state} setState={setState} onNext={goNext} />
      case "theme":
        return <ThemeStep state={state} setState={setState} />
      case "identity":
        return (
          <IdentityStep state={state} setState={setState} />
        )
      case "overview":
        return <OverviewStep state={state} setState={setState} />
      default:
        return null
    }
  })()

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-[640px] flex-col px-6 py-12">
      {/* Progress bar */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentIndex > 0 && (
            <button
              onClick={goBack}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <span className="text-[13px] font-medium text-muted-foreground">
            Step {currentIndex + 1} of {ONBOARDING_STEPS.length}
          </span>
        </div>
        <span className="text-[13px] font-medium">
          {STEP_LABELS[state.currentStep]}
        </span>
      </div>

      <div className="mb-8 h-1 overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="h-full rounded-full bg-foreground"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Step content */}
      <div className="flex-1 min-h-0 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="flex-1 min-h-0 flex flex-col"
          >
            {stepComponent}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
