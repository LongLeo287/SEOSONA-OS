import { useState, useCallback } from "react"

export interface ControlDefinition {
  name: string
  type: "select" | "boolean" | "string" | "number" | "color" | "json"
  options?: string[]
  defaultValue: any
  description?: string
}

export function useControls(definitions: ControlDefinition[]) {
  const [values, setValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {}
    for (const def of definitions) {
      initial[def.name] = def.defaultValue
    }
    return initial
  })

  const setValue = useCallback((name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  const reset = useCallback(() => {
    const initial: Record<string, any> = {}
    for (const def of definitions) {
      initial[def.name] = def.defaultValue
    }
    setValues(initial)
  }, [definitions])

  return { values, setValue, reset }
}
