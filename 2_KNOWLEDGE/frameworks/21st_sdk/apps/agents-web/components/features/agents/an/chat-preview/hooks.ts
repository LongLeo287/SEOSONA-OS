/**
 * Re-export shim — hooks have been split into individual files under hooks/.
 * This file preserves backward compatibility for existing imports.
 */
"use client"

export { useAnimationTimeline } from "./hooks/use-animation-timeline"
export { useStreamingText } from "./hooks/use-streaming-text"
export { useInputTyping } from "./hooks/use-input-typing"
export { useToolComplete } from "./hooks/use-tool-complete"
export { useContainerHeight } from "./hooks/use-container-height"
export { groupIntoTurns } from "./hooks/group-into-turns"
