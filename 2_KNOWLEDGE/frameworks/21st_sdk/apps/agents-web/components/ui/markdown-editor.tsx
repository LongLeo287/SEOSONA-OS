"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatTimeAgo } from "@/lib/utils"

import { toast } from "sonner"
import { motion, AnimatePresence } from "motion/react"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  onSave: (value: string) => Promise<void>
  isLoading?: boolean
  className?: string
}

export function MarkdownEditor({
  value,
  onChange,
  onSave,
  isLoading = false,
  className,
}: MarkdownEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localValue, setLocalValue] = useState(value)
  const [hasChanges, setHasChanges] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value)
    setHasChanges(false)
  }, [value])

  // Auto-save after 2 seconds of no changes
  useEffect(() => {
    if (!hasChanges || !isEditing) return

    const timer = setTimeout(async () => {
      await handleSave()
    }, 2000)

    return () => clearTimeout(timer)
  }, [localValue, hasChanges, isEditing])

  const handleLocalChange = useCallback(
    (newValue: string) => {
      setLocalValue(newValue)
      setHasChanges(newValue !== value)
      onChange(newValue)
    },
    [value, onChange],
  )

  const handleSave = async () => {
    if (!hasChanges) return

    setIsSaving(true)
    try {
      await onSave(localValue)
      setHasChanges(false)
      setLastSaved(new Date())
      toast.success("Changes saved!")
    } catch (error) {
      toast.error("Failed to save changes")
      console.error("Save failed:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setLocalValue(value)
    setHasChanges(false)
    setIsEditing(false)
  }

  return (
    <Card className={`${className}`}>
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">UI Kit Markdown</h3>
          <AnimatePresence mode="wait">
            {hasChanges && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Badge variant="secondary" className="text-xs">
                  {isSaving ? "Saving..." : "Unsaved changes"}
                </Badge>
              </motion.div>
            )}
            {lastSaved && !hasChanges && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Badge
                  variant="outline"
                  className="text-xs text-muted-foreground"
                >
                  {lastSaved ? `Saved ${formatTimeAgo(lastSaved)}` : ""}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={localValue}
              onChange={(e) => handleLocalChange(e.target.value)}
              className="min-h-[400px] font-mono text-sm p-4 transition-colors duration-200"
              placeholder="Enter markdown content..."
              disabled={isLoading}
            />
            <div className="text-xs text-muted-foreground">
              Auto-saves after 2 seconds • {localValue.length} characters
            </div>
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <pre
              className="whitespace-pre-wrap font-mono text-sm bg-muted text-foreground p-4 rounded-md overflow-auto max-h-[400px] border border-border cursor-pointer hover:bg-accent transition-colors duration-200"
              onClick={() => setIsEditing(true)}
              title="Click to edit"
            >
              {localValue || "No content"}
            </pre>
          </div>
        )}
      </div>
    </Card>
  )
}
