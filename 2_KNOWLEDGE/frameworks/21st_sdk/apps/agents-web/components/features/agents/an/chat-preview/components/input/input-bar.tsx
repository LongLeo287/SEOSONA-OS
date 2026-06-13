"use client"

import { motion, AnimatePresence } from "motion/react"
import { useTheme } from "next-themes"
import type { TimelineStep } from "../../types/timeline"
import type { VisualConfig } from "../../types/theme"
import { resolveColor } from "../../../types/visual"
import { useInputTyping } from "../../hooks"
import { AttachmentButton } from "./attachment-button"
import { SettingsPopover } from "./settings-popover"
import { InlineModeSelector } from "./inline-mode-selector"
import { ModelPopover, ModelBadge } from "./model-popover"
import { SendButtonUnified } from "./send-button"

export function UnifiedInputBar({
  activeInputStep,
  onStepComplete,
  isStreaming,
  vc,
  previewConfig,
}: {
  activeInputStep: Extract<TimelineStep, { type: "input-typing" }> | null
  onStepComplete: (id: string) => void
  isStreaming: boolean
  vc: VisualConfig
  previewConfig?: {
    attachmentsEnabled?: boolean
    allowedModels?: { id: string; name: string; version?: string }[]
    activeModelId?: string
    availableModes?: string[]
    defaultMode?: string
  }
}) {
  const { resolvedTheme } = useTheme()
  const mode = (resolvedTheme === "dark" ? "dark" : "light") as "light" | "dark"

  const { displayedText, showImage } = useInputTyping(
    activeInputStep?.content ?? "",
    activeInputStep?.duration ?? 0,
    !!activeInputStep,
    () => activeInputStep && onStepComplete(activeInputStep.id),
  )

  const hasImage = activeInputStep?.image
  const isTyping = !!activeInputStep
  const showAttach = previewConfig?.attachmentsEnabled && vc.attachmentButtonStyle !== "hidden"
  const modelCount = previewConfig?.allowedModels?.length ?? 0
  const showModelSelector = modelCount >= 1 && vc.modelSelectorPosition !== "hidden"
  const attachRight = vc.attachButtonRight
  const modelLeft = vc.modelSelectorLeft
  const outerRadius = parseInt(vc.inputBarBorderRadius) || 12

  // Nested border-radius: inner = max(MIN, outer - gap)
  // https://www.30secondsofcode.org/css/s/nested-border-radius/
  // Min 6px so buttons always look rounded even when outer radius is small
  const toolbarGap = 8
  const imageGap = 12
  const minButtonRadius = 6
  const minImageRadius = 4
  const innerRadius = outerRadius > 0 ? Math.max(minButtonRadius, outerRadius - toolbarGap) : 0
  const imageRadius = outerRadius > 0 ? Math.max(minImageRadius, outerRadius - imageGap) : 0

  const containerClass = [
    vc.inputBarFill ? "bg-foreground/[0.07]" : "bg-foreground/[0.02]",
    vc.inputBarShadow
      ? "shadow-[0_1px_6px_rgba(0,0,0,0.06)] border border-foreground/[0.06]"
      : "border border-foreground/[0.08]",
  ].join(" ")

  const buttonColor = resolveColor(vc, "sendButtonColor", mode) || resolveColor(vc, "primaryColor", mode)

  return (
    <div className="shrink-0 px-3 pb-3">
      <div className="mx-auto" style={{ maxWidth: "420px" }}>
        <div
          className={containerClass}
          style={{ borderRadius: vc.inputBarBorderRadius }}
        >
          <AnimatePresence>
            {hasImage && showImage && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.15 }}>
                <div className="px-3 pt-3 pb-0">
                  <div className="relative w-16 h-16 overflow-hidden shadow-[0_0_0_1px_rgba(128,128,128,0.12)] shrink-0" style={{ borderRadius: `${imageRadius}px` }}>
                    <img src={activeInputStep!.image!} alt="attachment" className="w-full h-full object-cover" />
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/50 flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="white" className="opacity-80">
                        <path d="M12.642 3.358a.625.625 0 0 0-.884 0L8 7.116 4.242 3.358a.625.625 0 1 0-.884.884L7.116 8l-3.758 3.758a.625.625 0 0 0 .884.884L8 8.884l3.758 3.758a.625.625 0 1 0 .884-.884L8.884 8l3.758-3.758a.625.625 0 0 0 0-.884" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="px-3.5 pt-3 pb-0 min-h-[56px] text-[14px] leading-5">
            {isTyping && displayedText ? (
              <span className="text-foreground/70">
                {displayedText}
                <motion.span className="inline-block w-[1.5px] h-[1em] bg-foreground/50 ml-px align-text-bottom" animate={{ opacity: [1, 0] }} transition={{ duration: 0.53, repeat: Infinity }} />
              </span>
            ) : (
              <span className="text-foreground/20">{vc.inputBarPlaceholder}</span>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 px-2 py-2">
            <div className="flex items-center gap-0.5">
              {!attachRight && showAttach && <AttachmentButton style={vc.attachmentButtonStyle} innerRadius={innerRadius} />}
              {vc.modesSelectorPosition === "popover" && <SettingsPopover vc={vc} previewConfig={previewConfig} innerRadius={innerRadius} />}
              {vc.modesSelectorPosition === "inline" && <InlineModeSelector previewConfig={previewConfig} innerRadius={innerRadius} />}
              {modelLeft && showModelSelector && vc.modelSelectorPosition === "input-bar" && (
                modelCount > 1
                  ? <ModelPopover models={previewConfig!.allowedModels!} activeModelId={previewConfig!.activeModelId} innerRadius={innerRadius} />
                  : <ModelBadge models={previewConfig!.allowedModels!} activeModelId={previewConfig!.activeModelId} innerRadius={innerRadius} />
              )}
            </div>
            <div className="flex items-center gap-0.5">
              {!modelLeft && showModelSelector && vc.modelSelectorPosition === "input-bar" && (
                modelCount > 1
                  ? <ModelPopover models={previewConfig!.allowedModels!} activeModelId={previewConfig!.activeModelId} innerRadius={innerRadius} />
                  : <ModelBadge models={previewConfig!.allowedModels!} activeModelId={previewConfig!.activeModelId} innerRadius={innerRadius} />
              )}
              {attachRight && showAttach && <AttachmentButton style={vc.attachmentButtonStyle} innerRadius={innerRadius} />}
              <SendButtonUnified style={vc.sendButtonStyle} stopStyle={vc.stopButtonStyle} color={buttonColor} isTyping={isTyping} isStreaming={isStreaming} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
