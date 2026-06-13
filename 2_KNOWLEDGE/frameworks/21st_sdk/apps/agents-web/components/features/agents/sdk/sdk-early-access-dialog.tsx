"use client"

import { AnimatePresence, motion } from "motion/react"
import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { addToSdkEarlyAccess } from "@/lib/resend"
import { toast } from "sonner"
import { Mail, X } from "lucide-react"

const EASING_CURVE = [0.55, 0.055, 0.675, 0.19] as const

export function SdkEarlyAccessDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const openAtRef = useRef<number>(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (open) {
      openAtRef.current = performance.now()
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onOpenChange(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  const handleClose = () => {
    const canInteract = performance.now() - openAtRef.current > 250
    if (!canInteract) return
    onOpenChange(false)
  }

  const validateEmail = (value: string) => {
    if (!value.trim()) return "Email is required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email"
    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateEmail(email)
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const { success, error: apiError } = await addToSdkEarlyAccess(email)

      if (success) {
        toast.success("You're on the list! We'll be in touch soon.")
        setEmail("")
        onOpenChange(false)
      } else {
        throw apiError
      }
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted) return null

  const portalTarget = typeof document !== "undefined" ? document.body : null
  if (!portalTarget) return null

  return createPortal(
    <AnimatePresence mode="wait" initial={false}>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.18, ease: EASING_CURVE },
            }}
            exit={{
              opacity: 0,
              pointerEvents: "none" as const,
              transition: { duration: 0.15, ease: EASING_CURVE },
            }}
            className="fixed inset-0 z-[45] bg-black/25"
            onClick={handleClose}
            style={{ pointerEvents: "auto" }}
          />

          {/* Dialog */}
          <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[46] pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: EASING_CURVE }}
              className="w-[90vw] max-w-[400px] pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-[#09090b] rounded-[36px] border border-white/[0.08] shadow-2xl ring-4 ring-white/[0.04] overflow-hidden">
                <button
                  onClick={handleClose}
                  className="absolute right-5 top-5 h-6 w-6 rounded-full flex items-center justify-center text-[#666] hover:text-white transition-colors z-10"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-white">
                    Get Early Access
                  </h2>
                  <p className="mt-1.5 text-sm text-white/40">
                    Leave your email and we'll reach out when your spot is
                    ready.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                    <div className="relative">
                      <input
                        ref={inputRef}
                        type="email"
                        required
                        placeholder="you@company.com"
                        autoComplete="email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (error) setError("")
                        }}
                        className={`w-full h-9 rounded-full bg-white/[0.05] border pl-9 pr-4 text-sm text-white placeholder:text-white/25 outline-none transition-colors ${error ? "border-red-500/50 focus:border-red-500/70" : "border-white/[0.08] focus:border-white/20"}`}
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                    </div>
                    {error && (
                      <p className="text-xs text-red-400/80 pl-4">{error}</p>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center rounded-full h-8 px-4 text-sm font-medium bg-white text-[#09090b] hover:bg-white/90 shadow-[0_0_0_0.5px_rgba(255,255,255,0.5),inset_0_0_0_1px_rgba(255,255,255,0.14)] transition-colors duration-150 disabled:opacity-50"
                    >
                      {isSubmitting ? "Submitting..." : "Get Early Access"}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    portalTarget,
  )
}
