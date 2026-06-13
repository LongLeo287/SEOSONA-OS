import { createJSONStorage } from "jotai/utils"

function isLocalStorageAvailable(): boolean {
  if (typeof window === "undefined") return false
  try {
    return typeof localStorage?.getItem === "function"
  } catch {
    return false
  }
}

export const safeStorage = createJSONStorage<unknown>(() => {
  if (!isLocalStorageAvailable()) {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    }
  }
  return localStorage
})
