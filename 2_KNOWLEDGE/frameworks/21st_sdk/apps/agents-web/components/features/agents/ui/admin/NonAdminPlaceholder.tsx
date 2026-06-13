"use client"

import { FC, useEffect, useState } from "react"
import { motion } from "motion/react"
import Link from "next/link"
import { useAgentsSession } from "@/lib/agents/auth/client"
import { Button } from "@/components/ui/button"
import { AuthDialog } from "@/components/auth/auth-dialog"
import { Logo } from "@/components/features/agents/ui/canvas/[id]/{components}/ui/logo"
import { ShieldX, LogIn, Home, ArrowLeft } from "lucide-react"

const NonAdminPlaceholder: FC = () => {
  const { isSignedIn, isLoaded } = useAgentsSession()
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  // Auto-open auth dialog if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setShowAuthDialog(true)
    }
  }, [isLoaded, isSignedIn])

  // Show loading state while auth is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </motion.div>
      </div>
    )
  }

  // Not signed in state
  if (!isSignedIn) {
    return (
      <>
        <div className="min-h-screen bg-background flex flex-col">
          {/* Header */}
          <header className="border-b border-border/50 px-6 py-4">
            <div className="flex items-center gap-3">
              <Link href="/canvas" className="hover:opacity-80 transition-opacity">
                <Logo className="h-5 w-5" />
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium text-sm">Admin</span>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center text-center max-w-md"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <LogIn className="h-8 w-8 text-primary" />
              </div>

              {/* Title */}
              <h1 className="text-2xl font-semibold mb-3">
                Sign in Required
              </h1>

              {/* Description */}
              <p className="text-muted-foreground mb-8 leading-relaxed">
                You need to be signed in to access the admin dashboard.
                Please sign in with your account to continue.
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button
                  onClick={() => setShowAuthDialog(true)}
                  className="gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
                <Button variant="outline" asChild className="gap-2">
                  <Link href="/canvas">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Canvas
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Auth Dialog */}
        <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
      </>
    )
  }

  // Signed in but not admin
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/canvas" className="hover:opacity-80 transition-opacity">
            <Logo className="h-5 w-5" />
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium text-sm">Admin</span>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center text-center max-w-md"
        >
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
            <ShieldX className="h-8 w-8 text-destructive" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold mb-3">
            Access Restricted
          </h1>

          {/* Description */}
          <p className="text-muted-foreground mb-8 leading-relaxed">
            You don&apos;t have permission to access the admin dashboard.
            If you believe this is an error, please contact an administrator.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button asChild className="gap-2">
              <Link href="/canvas">
                <Home className="h-4 w-4" />
                Go to Canvas
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Homepage
              </Link>
            </Button>
          </div>

          {/* Help text */}
          <p className="text-xs text-muted-foreground/70 mt-8">
            Need help? Contact us at{" "}
            <a 
              href="mailto:support@21st.dev" 
              className="text-primary hover:underline"
            >
              support@21st.dev
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default NonAdminPlaceholder
