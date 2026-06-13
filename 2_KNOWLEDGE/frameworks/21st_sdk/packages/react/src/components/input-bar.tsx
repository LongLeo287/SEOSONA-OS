import React, { memo, useState, useCallback, useRef, useEffect } from "react"
import type { ChatStatus } from "ai"
import type { ModelOption } from "../types"
import { cn } from "../utils/cn"
import { useThemeConfig } from "../theme-config"
import { SendButtonUnified } from "./input/send-button"
import { AttachmentButton } from "./input/attachment-button"
import { ModelPopover, ModelBadge } from "./input/model-selector"
import { ModeSelector } from "./input/mode-selector"
import { ContextItems, type AttachedImage, type AttachedFile } from "./input/context-items"
import { useInputTyping } from "./input/input-typing"

export type { AttachedImage, AttachedFile }

interface InputBarProps {
  onSend: (message: { role: "user"; content: string }) => void
  status: ChatStatus
  onStop: () => void
  placeholder?: string
  className?: string

  // Attachment support
  onAttach?: () => void
  attachedImages?: AttachedImage[]
  attachedFiles?: AttachedFile[]
  onRemoveImage?: (id: string) => void
  onRemoveFile?: (id: string) => void
  onPaste?: (e: React.ClipboardEvent) => void
  isDragOver?: boolean

  // Model selector
  modelSelector?: {
    models: ModelOption[]
    activeModelId?: string
    onModelChange?: (id: string) => void
    display?: "popover" | "badge"
    position?: "left" | "right"
  }

  // Mode selector
  modeSelector?: {
    modes: { id: string; label: string; icon?: React.ReactNode }[]
    activeMode?: string
    onModeChange?: (id: string) => void
    display?: "inline" | "popover"
  }

  // Controlled mode
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean

  // Typing animation
  typingAnimation?: {
    text: string
    duration: number
    image?: string
    isActive: boolean
    onComplete: () => void
  }
}

export const InputBar = memo(function InputBar({
  onSend,
  status,
  onStop,
  placeholder,
  className,
  onAttach,
  attachedImages = [],
  attachedFiles = [],
  onRemoveImage,
  onRemoveFile,
  onPaste,
  isDragOver,
  value: controlledValue,
  onChange: controlledOnChange,
  disabled,
  modelSelector,
  modeSelector,
  typingAnimation,
}: InputBarProps) {
  const [internalInput, setInternalInput] = useState("")
  const isControlled = controlledValue !== undefined
  const input = isControlled ? controlledValue : internalInput
  const setInput = isControlled ? (v: string) => controlledOnChange?.(v) : setInternalInput
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const config = useThemeConfig()

  const isStreaming = status === "streaming" || status === "submitted"
  const isTyping = typingAnimation?.isActive ?? false

  const { displayedText, showImage } = useInputTyping(
    typingAnimation?.text ?? "",
    typingAnimation?.duration ?? 2000,
    isTyping,
    typingAnimation?.onComplete ?? (() => {}),
  )

  const effectivePlaceholder = placeholder ?? config.inputBarPlaceholder

  // Attachment visibility from config
  const showAttach = config.attachmentButtonStyle !== "hidden"
  const attachRight = config.attachmentButtonPosition === "right"

  // Model selector visibility from config
  const modelCount = modelSelector?.models?.length ?? 0
  const showModelSelector = modelCount >= 1 && config.modelSelectorPosition !== "hidden"
  const modelLeft = config.modelSelectorSide === "left"

  // Mode selector visibility from config
  const hasModes = (modeSelector?.modes?.length ?? 0) > 1

  // Calculate inner radius for toolbar buttons based on container's actual border-radius.
  // The container uses `var(--an-input-border-radius)` which is set by applyTheme() on .an-root.
  // We observe .an-root for style changes so innerRadius updates when the theme changes.
  const containerElRef = useRef<HTMLDivElement>(null)
  const [outerRadius, setOuterRadius] = useState(16) // match CSS default
  const toolbarGap = 8
  const minButtonRadius = 6
  const innerRadius = outerRadius > 0 ? Math.max(minButtonRadius, outerRadius - toolbarGap) : 0

  useEffect(() => {
    const el = containerElRef.current
    if (!el) return
    const readRadius = () => {
      const computed = getComputedStyle(el)
      const raw = computed.borderRadius
      const r = parseFloat(raw)
      if (!isNaN(r)) setOuterRadius(r)
    }
    requestAnimationFrame(readRadius)
    const anRoot = el.closest(".an-root")
    if (anRoot) {
      const observer = new MutationObserver(() => requestAnimationFrame(readRadius))
      observer.observe(anRoot, { attributes: true, attributeFilter: ["style"] })
      return () => observer.disconnect()
    }
  }, [])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "0"
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [input])

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed || isStreaming || disabled) return
    onSend({ role: "user", content: trimmed })
    setInput("")
  }, [input, isStreaming, onSend])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit],
  )

  const hasInput = input.trim().length > 0
  const hasContextItems = attachedImages.length > 0 || attachedFiles.length > 0

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    if (
      e.target === e.currentTarget ||
      !(e.target as HTMLElement).closest("button, textarea")
    ) {
      textareaRef.current?.focus()
    }
  }, [])

  // Container styles based on config
  const containerClass = [
    config.inputFill ? "bg-foreground/[0.07]" : "bg-foreground/[0.02]",
    config.inputShadow
      ? "shadow-[0_1px_6px_rgba(0,0,0,0.06)] border border-foreground/[0.06]"
      : "border border-foreground/[0.08]",
  ].join(" ")

  return (
    <div className={cn("an-input-bar shrink-0 px-3 pb-3", className)}>
      <div className="mx-auto" style={{ maxWidth: "var(--an-max-width, 420px)" }}>
        <div
          ref={containerElRef}
          className={`${containerClass} cursor-text transition-[border-color,box-shadow] duration-150 ${isDragOver ? "ring-2 ring-primary/50 border-primary/50" : ""}`}
          style={{ borderRadius: "var(--an-input-border-radius, 16px)" }}
          onClick={handleContainerClick}
        >
          {/* Context items (attached images/files) */}
          <div
            className="grid transition-[grid-template-rows] duration-200 ease-out"
            style={{
              gridTemplateRows: hasContextItems && config.attachmentPreviewStyle !== "hidden" ? "1fr" : "0fr",
            }}
          >
            <div className="overflow-hidden">
              <div className="px-3 pt-2.5 pb-0">
                <ContextItems
                  images={attachedImages}
                  files={attachedFiles}
                  previewStyle={config.attachmentPreviewStyle}
                  innerRadius={innerRadius}
                  onRemoveImage={onRemoveImage}
                  onRemoveFile={onRemoveFile}
                />
              </div>
            </div>
          </div>

          {/* Typing animation image */}
          {isTyping && typingAnimation?.image && showImage && (
            <div className="flex gap-2 flex-wrap px-3 pt-3">
              <div
                className="relative overflow-hidden shrink-0"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 8,
                  boxShadow: "0 0 0 1px rgba(128,128,128,0.12)",
                }}
              >
                <img src={typingAnimation.image} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* Text input or typing animation text */}
          <div className="px-3.5 pt-3 pb-0 min-h-[44px] text-[14px] leading-5">
            {isTyping ? (
              <div className="w-full text-foreground/70 text-[14px] leading-5">
                <span>{displayedText}</span>
                <span
                  className="an-typing-cursor"
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: "1em",
                    marginLeft: 1,
                    verticalAlign: "text-bottom",
                    background: "var(--an-foreground, #1a1a1a)",
                    animation: "an-blink 1s step-end infinite",
                  }}
                />
                <style>{`@keyframes an-blink { 50% { opacity: 0; } }`}</style>
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={onPaste}
                placeholder={effectivePlaceholder}
                disabled={disabled}
                rows={1}
                className={`w-full resize-none bg-transparent text-foreground/70 placeholder:text-foreground/20 outline-none text-[14px] leading-5 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              />
            )}
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 px-2 py-2">
            <div className="flex items-center gap-0.5">
              {!attachRight && showAttach && onAttach && (
                <AttachmentButton
                  style={config.attachmentButtonStyle}
                  borderRadius={innerRadius}
                  onClick={onAttach}
                />
              )}
              {hasModes && modeSelector && config.modeSelectorPosition !== "hidden" && (
                <ModeSelector
                  modes={modeSelector.modes}
                  activeMode={modeSelector.activeMode}
                  onModeChange={modeSelector.onModeChange}
                  display={config.modeSelectorPosition === "popover" ? "popover" : "inline"}
                  innerRadius={innerRadius}
                />
              )}
              {modelLeft && showModelSelector && modelSelector && (
                modelCount > 1 ? (
                  <ModelPopover
                    models={modelSelector.models}
                    activeModelId={modelSelector.activeModelId}
                    onModelChange={modelSelector.onModelChange}
                    innerRadius={innerRadius}
                  />
                ) : (
                  <ModelBadge
                    models={modelSelector.models}
                    activeModelId={modelSelector.activeModelId}
                    innerRadius={innerRadius}
                  />
                )
              )}
            </div>
            <div className="flex items-center gap-0.5">
              {!modelLeft && showModelSelector && modelSelector && (
                modelCount > 1 ? (
                  <ModelPopover
                    models={modelSelector.models}
                    activeModelId={modelSelector.activeModelId}
                    onModelChange={modelSelector.onModelChange}
                    innerRadius={innerRadius}
                  />
                ) : (
                  <ModelBadge
                    models={modelSelector.models}
                    activeModelId={modelSelector.activeModelId}
                    innerRadius={innerRadius}
                  />
                )
              )}
              {attachRight && showAttach && onAttach && (
                <AttachmentButton
                  style={config.attachmentButtonStyle}
                  borderRadius={innerRadius}
                  onClick={onAttach}
                />
              )}
              {/* Send / Stop button */}
              <div
                onClick={() => {
                  if (isStreaming) {
                    onStop()
                  } else if (hasInput) {
                    handleSubmit()
                  }
                }}
                className="cursor-pointer"
              >
                <SendButtonUnified
                  style={config.sendButtonStyle}
                  stopStyle={config.stopButtonStyle}
                  isTyping={hasInput && !disabled}
                  isStreaming={isStreaming}
                  color="var(--an-send-button-bg)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
