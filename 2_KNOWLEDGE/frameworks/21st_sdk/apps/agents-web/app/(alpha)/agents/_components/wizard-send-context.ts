import { createContext } from "react"

export type WizardSendFn = (text: string) => void
export const WizardSendContext = createContext<WizardSendFn>(() => {})
