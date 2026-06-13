"use client"

import { useState, useRef, useEffect, ReactNode, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { cn } from "@/lib/utils"

interface AnnouncementModalProps {
  storageKey: string
  className?: string
  children: ReactNode
  delay?: number
  size?: "sm" | "md" | "lg"
}

export function AnnouncementModal({
  storageKey,
  className,
  children,
  delay = 3000,
  size = "md",
}: AnnouncementModalProps) {
  const dismissedAtom = useMemo(
    () => atomWithStorage(`${storageKey}-dismissed`, false),
    [storageKey],
  )
  const [isDismissed, setIsDismissed] = useAtom(dismissedAtom)
  const [showModal, setShowModal] = useState(false)

  // Show modal after delay if not dismissed
  useEffect(() => {
    if (isDismissed) return

    const timer = setTimeout(() => {
      setShowModal(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [isDismissed, delay])

  if (isDismissed) return null

  const handleClose = () => {
    setShowModal(false)
    setTimeout(() => setIsDismissed(true), 300)
  }

  const sizeClasses = {
    sm: "w-80",
    md: "w-96",
    lg: "w-[24rem]",
  }

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 100, y: 100 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 100, y: 100 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.6,
          }}
          className={cn(
            "fixed bottom-6 right-6 z-[100] overflow-hidden rounded-2xl border border-border bg-background/95 backdrop-blur-lg shadow-2xl",
            sizeClasses[size],
            className,
          )}
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute top-3 right-3 z-10 h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-background/80"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Content */}
          <div className="relative h-full w-full p-4">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
