import type { ChatTheme } from "./types"
import { contrastText } from "./utils/contrast"

export type ResolvedColorMode = "light" | "dark"

/** Resolve "auto" to a concrete color mode */
export function resolveColorMode(
  colorMode: "light" | "dark" | "auto",
): ResolvedColorMode {
  if (colorMode !== "auto") return colorMode
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

/** Apply theme CSS variables from playground JSON to a DOM element */
export function applyTheme(
  element: HTMLElement,
  theme: ChatTheme,
  colorMode: "light" | "dark" | "auto" = "auto",
) {
  // Apply shared vars
  for (const [key, value] of Object.entries(theme.theme)) {
    element.style.setProperty(key, value)
  }

  const resolvedMode = resolveColorMode(colorMode)

  const colorVars = resolvedMode === "dark" ? theme.dark : theme.light
  for (const [key, value] of Object.entries(colorVars)) {
    element.style.setProperty(key, value)
  }

  // Auto-compute contrast text color for user message bubble
  // Prefer mode-specific bg, fall back to shared
  const userBg =
    colorVars["--an-user-message-bg"] ??
    theme.theme["--an-user-message-bg"]
  if (userBg) {
    element.style.setProperty("--an-user-message-text", contrastText(userBg))
  }
}
