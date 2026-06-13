"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconSpinner } from "@/components/features/agents/ui/canvas/[id]/{components}/ui/icons"
import { useClerk, useUser } from "@clerk/nextjs"
import { toast } from "sonner"

interface DeleteAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const [confirmationInput, setConfirmationInput] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const { signOut } = useClerk()
  const { user } = useUser()

  const userEmail = user?.primaryEmailAddress?.emailAddress || ""
  const isConfirmed = confirmationInput === userEmail && userEmail !== ""

  async function handleDeleteAccount() {
    if (!isConfirmed) return

    setIsDeleting(true)

    try {
      const response = await fetch("/api/user/delete-account", {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete account")
      }

      // Close the dialog first
      onOpenChange(false)

      toast.success("Account deleted successfully")

      // Sign out and redirect to community components
      // Using window.location for hard redirect to clear all state
      await signOut()
      window.location.href = "/community/components"
    } catch (error) {
      console.error("Error deleting account:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to delete account",
      )
      setIsDeleting(false)
    }
  }

  function handleOpenChange(newOpen: boolean) {
    if (!isDeleting) {
      setConfirmationInput("")
      onOpenChange(newOpen)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account, all your components, demos, and cancel any active
            subscriptions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            To confirm, type your email{" "}
            <code className="px-1.5 py-0.5 bg-muted rounded text-foreground font-medium select-all cursor-text">
              {userEmail}
            </code>{" "}
            below:
          </p>
          <Input
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            placeholder="Enter your email"
            disabled={isDeleting}
            autoComplete="off"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={!isConfirmed || isDeleting}
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <IconSpinner className="h-4 w-4" />
                Deleting...
              </div>
            ) : (
              "Delete Account"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
