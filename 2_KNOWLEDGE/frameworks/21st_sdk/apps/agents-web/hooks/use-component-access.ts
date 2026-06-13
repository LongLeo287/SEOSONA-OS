import { Component } from "@/types/global"

export type ComponentAccessState =
  | "UNLOCKED" // Component is accessible (free or purchased)
  | "REQUIRES_SUBSCRIPTION"
  | "REQUIRES_UNLOCK"
  | "REQUIRES_BUNDLE"
  | "UNDEFINED"
  | "LOCKED"

export function useComponentAccess(
  _component: Component,
  _initialHasPurchased: boolean = false,
): ComponentAccessState {
  return "UNLOCKED"
}
