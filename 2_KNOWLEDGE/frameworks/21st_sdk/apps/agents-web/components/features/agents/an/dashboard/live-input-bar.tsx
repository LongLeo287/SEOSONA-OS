"use client"

import { useRef, useEffect, useCallback } from "react"
import { useTheme } from "next-themes"
import type { VisualConfig } from "../types"
import { resolveColor } from "../types/visual"
import {
  SendButtonUnified,
  AttachmentButton,
  SettingsPopover,
  InlineModeSelector,
  ModelPopover,
  ModelBadge,
} from "../chat-preview/components/input"
import { LiveContextItems, type AttachedImage, type AttachedFile } from "./live-context-items"

interface LiveInputBarProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onStop: () => void
  isStreaming: boolean
  disabled?: boolean
  vc: VisualConfig
  previewConfig?: {
    attachmentsEnabled?: boolean
    allowedModels?: { id: string; name: string; version?: string }[]
    activeModelId?: string
    availableModes?: string[]
    defaultMode?: string
  }
  attachedImages?: AttachedImage[]
  attachedFiles?: AttachedFile[]
  onRemoveImage?: (id: string) => void
  onRemoveFile?: (id: string) => void
  onAttachClick?: () => void
  onPaste?: (e: React.ClipboardEvent) => void
  isDragOver?: boolean
}

export function LiveInputBar({
  value,
  onChange,
  onSend,
  onStop,
  isStreaming,
  disabled,
  vc,
  previewConfig,
  attachedImages = [],
  attachedFiles = [],
  onRemoveImage,
  onRemoveFile,
  onAttachClick,
  onPaste,
  isDragOver,
}: LiveInputBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const showAttach =
    previewConfig?.attachmentsEnabled && vc.attachmentButtonStyle !== "hidden"
  const modelCount = previewConfig?.allowedModels?.length ?? 0
  const showModelSelector =
    modelCount >= 1 && vc.modelSelectorPosition !== "hidden"
  const hasMultipleModes = (previewConfig?.availableModes?.length ?? 0) > 1
  const attachRight = vc.attachButtonRight
  const modelLeft = vc.modelSelectorLeft
  const outerRadius = parseInt(vc.inputBarBorderRadius) || 12

  const toolbarGap = 8
  const minButtonRadius = 6
  const innerRadius =
    outerRadius > 0 ? Math.max(minButtonRadius, outerRadius - toolbarGap) : 0

  const { resolvedTheme } = useTheme()
  const mode = (resolvedTheme === "dark" ? "dark" : "light") as "light" | "dark"

  const containerClass = [
    vc.inputBarFill ? "bg-foreground/[0.07]" : "bg-foreground/[0.02]",
    vc.inputBarShadow
      ? "shadow-[0_1px_6px_rgba(0,0,0,0.06)] border border-foreground/[0.06]"
      : "border border-foreground/[0.08]",
  ].join(" ")

  const buttonColor = resolveColor(vc, "sendButtonColor", mode) || resolveColor(vc, "primaryColor", mode)

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "0"
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [value])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        if (!isStreaming && value.trim()) onSend()
      }
    },
    [isStreaming, value, onSend],
  )

  const hasInput = value.trim().length > 0
  const hasContextItems = attachedImages.length > 0 || attachedFiles.length > 0

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    if (
      e.target === e.currentTarget ||
      !(e.target as HTMLElement).closest("button, textarea")
    ) {
      textareaRef.current?.focus()
    }
  }, [])

  return (
    <div className="shrink-0 px-3 pb-3">
      <div className="mx-auto" style={{ maxWidth: "420px" }}>
        <div
          className={`${containerClass} cursor-text transition-[border-color,box-shadow] duration-150 ${isDragOver ? "ring-2 ring-primary/50 border-primary/50" : ""}`}
          style={{
            borderRadius: vc.inputBarBorderRadius,
          }}
          onClick={handleContainerClick}
        >
          {/* Context items */}
          <div
            className="grid transition-[grid-template-rows] duration-200 ease-out"
            style={{
              gridTemplateRows: hasContextItems && vc.attachmentPreviewStyle !== "hidden" ? "1fr" : "0fr",
            }}
          >
            <div className="overflow-hidden">
              <div className="px-3 pt-2.5 pb-0">
                <LiveContextItems
                  images={attachedImages}
                  files={attachedFiles}
                  previewStyle={vc.attachmentPreviewStyle}
                  innerRadius={innerRadius}
                  onRemoveImage={onRemoveImage}
                  onRemoveFile={onRemoveFile}
                />
              </div>
            </div>
          </div>

          {/* Text input */}
          <div className="px-3.5 pt-3 pb-0 min-h-[44px] text-[14px] leading-5">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={onPaste}
              placeholder={vc.inputBarPlaceholder}
              disabled={disabled}
              rows={1}
              className="w-full resize-none bg-transparent text-foreground/70 placeholder:text-foreground/20 outline-none text-[14px] leading-5"
            />
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 px-2 py-2">
            <div className="flex items-center gap-0.5">
              {!attachRight && showAttach && (
                <div onClick={onAttachClick}>
                  <AttachmentButton
                    style={vc.attachmentButtonStyle}
                    innerRadius={innerRadius}
                  />
                </div>
              )}
              {hasMultipleModes && vc.modesSelectorPosition === "popover" && (
                <SettingsPopover
                  vc={vc}
                  previewConfig={previewConfig}
                  innerRadius={innerRadius}
                />
              )}
              {hasMultipleModes && vc.modesSelectorPosition === "inline" && (
                <InlineModeSelector
                  previewConfig={previewConfig}
                  innerRadius={innerRadius}
                />
              )}
              {modelLeft &&
                showModelSelector &&
                vc.modelSelectorPosition === "input-bar" &&
                (modelCount > 1 ? (
                  <ModelPopover
                    models={previewConfig!.allowedModels!}
                    activeModelId={previewConfig!.activeModelId}
                    innerRadius={innerRadius}
                  />
                ) : (
                  <ModelBadge
                    models={previewConfig!.allowedModels!}
                    activeModelId={previewConfig!.activeModelId}
                    innerRadius={innerRadius}
                  />
                ))}
            </div>
            <div className="flex items-center gap-0.5">
              {!modelLeft &&
                showModelSelector &&
                vc.modelSelectorPosition === "input-bar" &&
                (modelCount > 1 ? (
                  <ModelPopover
                    models={previewConfig!.allowedModels!}
                    activeModelId={previewConfig!.activeModelId}
                    innerRadius={innerRadius}
                  />
                ) : (
                  <ModelBadge
                    models={previewConfig!.allowedModels!}
                    activeModelId={previewConfig!.activeModelId}
                    innerRadius={innerRadius}
                  />
                ))}
              {attachRight && showAttach && (
                <div onClick={onAttachClick}>
                  <AttachmentButton
                    style={vc.attachmentButtonStyle}
                    innerRadius={innerRadius}
                  />
                </div>
              )}
              {/* Send / Stop button */}
              <div
                onClick={() => {
                  if (isStreaming) {
                    onStop()
                  } else if (hasInput) {
                    onSend()
                  }
                }}
                className="cursor-pointer"
              >
                <SendButtonUnified
                  style={vc.sendButtonStyle}
                  stopStyle={vc.stopButtonStyle}
                  color={buttonColor}
                  isTyping={hasInput}
                  isStreaming={isStreaming}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
