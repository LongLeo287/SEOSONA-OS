"use client"

import { useEffect } from "react"

import { useAgentsAuthUi } from "@/lib/agents/auth/ui"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  redirectUrl?: string
}

export function AuthDialog({
  open,
  onOpenChange,
  redirectUrl,
}: AuthDialogProps) {
  const { isSignInOpen, openSignIn, closeSignIn } = useAgentsAuthUi()

  useEffect(() => {
    if (open && !isSignInOpen) {
      openSignIn({ redirectUrl })
    }

    if (!open && isSignInOpen) {
      closeSignIn()
    }
  }, [closeSignIn, isSignInOpen, open, openSignIn, redirectUrl])

  useEffect(() => {
    if (open !== isSignInOpen) {
      onOpenChange(isSignInOpen)
    }
  }, [isSignInOpen, onOpenChange, open])

  return null
}

