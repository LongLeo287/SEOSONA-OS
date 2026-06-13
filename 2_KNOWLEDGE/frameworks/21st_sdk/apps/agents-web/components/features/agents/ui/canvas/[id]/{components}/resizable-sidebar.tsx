"use client"

import { useAtom, type WritableAtom } from "jotai"
import { AnimatePresence, motion } from "motion/react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createPortal, flushSync } from "react-dom"
import { Kbd } from "./ui/kbd"

interface ResizableSidebarProps {
  isOpen: boolean
  onClose: () => void
  /** Controls width for left/right, height for bottom */
  widthAtom: WritableAtom<number, [number], void>
  /** Min dimension (width for left/right, height for bottom) */
  minWidth?: number
  /** Max dimension (width for left/right, height for bottom) */
  maxWidth?: number
  side: "left" | "right" | "bottom"
  closeHotkey?: string
  animationDuration?: number
  children: React.ReactNode
  className?: string
  /** Initial dimension for enter animation */
  initialWidth?: number | string
  /** Dimension for exit animation */
  exitWidth?: number | string
  /** Data attributes to spread onto the container */
  dataAttributes?: Record<string, string | boolean>
  /** Disable close on click without drag */
  disableClickToClose?: boolean
  /** Show resize tooltip (Close/Resize instructions) */
  showResizeTooltip?: boolean
  /** Custom styles for the sidebar container */
  style?: React.CSSProperties
  /** Keep children mounted when closed (hidden with width 0) to preserve state */
  keepMounted?: boolean
}

const DEFAULT_MIN_WIDTH = 200
const DEFAULT_MAX_WIDTH = 9999
const DEFAULT_ANIMATION_DURATION = 0
const EXTENDED_HOVER_AREA_WIDTH = 8

export function ResizableSidebar({
  isOpen,
  onClose,
  widthAtom,
  minWidth = DEFAULT_MIN_WIDTH,
  maxWidth = DEFAULT_MAX_WIDTH,
  side,
  closeHotkey,
  animationDuration = DEFAULT_ANIMATION_DURATION,
  children,
  className = "",
  initialWidth = 0,
  exitWidth = 0,
  dataAttributes,
  disableClickToClose = false,
  showResizeTooltip = false,
  style,
  keepMounted = false,
}: ResizableSidebarProps) {
  const [sidebarWidth, setSidebarWidth] = useAtom(widthAtom)
  const isVertical = side === "bottom"

  const hasOpenedOnce = useRef(false)
  const wasOpenRef = useRef(false)
  const [shouldAnimate, setShouldAnimate] = useState(!isOpen)

  const [isResizing, setIsResizing] = useState(false)
  const [isHoveringResizeHandle, setIsHoveringResizeHandle] = useState(false)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
  const [isTooltipDismissed, setIsTooltipDismissed] = useState(false)
  const resizeHandleRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [localWidth, setLocalWidth] = useState<number | null>(null)

  const currentWidth = localWidth ?? sidebarWidth

  const tooltipPosition = useMemo(() => {
    if (!tooltipPos || !sidebarRef.current) return null
    const rect = sidebarRef.current.getBoundingClientRect()
    if (isVertical) {
      return { x: tooltipPos.x, y: rect.top - 8 }
    }
    const x = side === "left" ? rect.right + 8 : rect.left - 8
    return { x, y: tooltipPos.y }
  }, [tooltipPos, currentWidth, side, isVertical])

  useEffect(() => {
    if (!isOpen && wasOpenRef.current) {
      hasOpenedOnce.current = false
      setShouldAnimate(true)
      setLocalWidth(null)
    }
    if (isOpen) {
      setIsTooltipDismissed(false)
    }
    wasOpenRef.current = isOpen

    if (isOpen && !hasOpenedOnce.current) {
      const timer = setTimeout(
        () => {
          hasOpenedOnce.current = true
          setShouldAnimate(false)
        },
        animationDuration * 1000 + 50,
      )
      return () => clearTimeout(timer)
    } else if (isOpen && hasOpenedOnce.current) {
      setShouldAnimate(false)
    }
  }, [isOpen, animationDuration])

  const handleClose = useCallback(() => {
    if (isHoveringResizeHandle && !isTooltipDismissed) {
      flushSync(() => {
        setIsTooltipDismissed(true)
      })
    }
    flushSync(() => {
      if (isResizing) {
        setIsResizing(false)
      }
      if (localWidth !== null) {
        setLocalWidth(null)
      }
    })
    setShouldAnimate(true)
    onClose()
    setIsHoveringResizeHandle(false)
    setTooltipPos(null)
  }, [
    onClose,
    isOpen,
    shouldAnimate,
    isResizing,
    localWidth,
    isHoveringResizeHandle,
    isTooltipDismissed,
  ])

  useEffect(() => {
    if (!isOpen) {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current)
        tooltipTimeoutRef.current = null
      }
      setIsHoveringResizeHandle(false)
      setTooltipPos(null)
    }
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current)
        tooltipTimeoutRef.current = null
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !isHoveringResizeHandle || isTooltipDismissed) {
      return
    }

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const tooltipElement = target.closest('[data-tooltip="true"]')
      const isClickOnTooltip =
        tooltipElement ||
        (tooltipRef.current && tooltipRef.current.contains(target))

      if (isClickOnTooltip) {
        e.preventDefault()
        e.stopPropagation()
        flushSync(() => {
          setIsTooltipDismissed(true)
        })
        handleClose()
      }
    }

    document.addEventListener("click", handleDocumentClick, true)
    document.addEventListener("pointerdown", handleDocumentClick, true)

    return () => {
      document.removeEventListener("click", handleDocumentClick, true)
      document.removeEventListener("pointerdown", handleDocumentClick, true)
    }
  }, [isOpen, isHoveringResizeHandle, isTooltipDismissed, handleClose])

  const handleResizePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      const startPos = isVertical ? event.clientY : event.clientX
      const startWidth = sidebarWidth
      const pointerId = event.pointerId
      let hasMoved = false
      let currentLocalWidth: number | null = null

      const handleElement =
        resizeHandleRef.current ?? (event.currentTarget as HTMLElement)

      const clampWidth = (width: number) =>
        Math.max(minWidth, Math.min(maxWidth, width))

      handleElement.setPointerCapture?.(pointerId)
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current)
        tooltipTimeoutRef.current = null
      }
      setIsResizing(true)
      setIsHoveringResizeHandle(false)

      const updateSize = (clientPos: number) => {
        // For bottom: moving up increases height; for right: moving left increases width
        const delta = isVertical
          ? startPos - clientPos
          : side === "left"
            ? clientPos - startPos
            : startPos - clientPos
        const newWidth = clampWidth(startWidth + delta)
        currentLocalWidth = newWidth
        setLocalWidth(newWidth)
      }

      const handlePointerMove = (pointerEvent: PointerEvent) => {
        const currentPos = isVertical ? pointerEvent.clientY : pointerEvent.clientX
        const delta = Math.abs(currentPos - startPos)
        if (!hasMoved && delta >= 3) {
          hasMoved = true
        }

        if (hasMoved) {
          updateSize(currentPos)
        }
      }

      const finishResize = (pointerEvent?: PointerEvent) => {
        if (handleElement.hasPointerCapture?.(pointerId)) {
          handleElement.releasePointerCapture(pointerId)
        }

        document.removeEventListener("pointermove", handlePointerMove)
        document.removeEventListener("pointerup", handlePointerUp)
        document.removeEventListener("pointercancel", handlePointerCancel)
        setIsResizing(false)

        if (!hasMoved && pointerEvent && !disableClickToClose) {
          handleClose()
        } else if (hasMoved && pointerEvent) {
          const currentPos = isVertical ? pointerEvent.clientY : pointerEvent.clientX
          const delta = isVertical
            ? startPos - currentPos
            : side === "left"
              ? currentPos - startPos
              : startPos - currentPos
          const finalWidth = clampWidth(startWidth + delta)
          setSidebarWidth(finalWidth)
          setLocalWidth(null)
        } else {
          if (currentLocalWidth !== null) {
            setSidebarWidth(currentLocalWidth)
            setLocalWidth(null)
          }
        }
      }

      const handlePointerUp = (pointerEvent: PointerEvent) => {
        finishResize(pointerEvent)
      }

      const handlePointerCancel = () => {
        finishResize()
      }

      document.addEventListener("pointermove", handlePointerMove)
      document.addEventListener("pointerup", handlePointerUp, { once: true })
      document.addEventListener("pointercancel", handlePointerCancel, {
        once: true,
      })
    },
    [sidebarWidth, setSidebarWidth, handleClose, minWidth, maxWidth, side, disableClickToClose, isVertical],
  )

  const resizeHandleStyle = useMemo(() => {
    if (isVertical) {
      return {
        top: "0px",
        height: "4px",
        marginTop: "-2px",
        paddingTop: "2px",
        paddingBottom: "2px",
      }
    }
    if (side === "left") {
      return {
        right: "0px",
        width: "4px",
        marginRight: "-2px",
        paddingLeft: "2px",
        paddingRight: "2px",
      }
    }
    return {
      left: "0px",
      width: "4px",
      marginLeft: "-2px",
      paddingLeft: "2px",
      paddingRight: "2px",
    }
  }, [side, isVertical])

  const extendedHoverAreaStyle = useMemo(() => {
    if (isVertical) {
      return {
        height: `${EXTENDED_HOVER_AREA_WIDTH}px`,
        top: "0px",
        left: "0px",
        right: "0px",
      }
    }
    if (side === "left") {
      return {
        width: `${EXTENDED_HOVER_AREA_WIDTH}px`,
        right: "0px",
      }
    }
    return {
      width: `${EXTENDED_HOVER_AREA_WIDTH}px`,
      left: "0px",
    }
  }, [side, isVertical])

  const cursorClass = isVertical ? "cursor-row-resize" : "cursor-col-resize"

  const handleHoverEnter = useCallback((e: React.MouseEvent) => {
    if (isResizing) return
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current)
    }
    if (!tooltipPos) {
      setTooltipPos({ x: e.clientX, y: e.clientY })
    }
    tooltipTimeoutRef.current = setTimeout(() => {
      setIsHoveringResizeHandle(true)
    }, 300)
  }, [isResizing, tooltipPos])

  const handleHoverLeave = useCallback((e: React.MouseEvent, checkTarget: (target: HTMLElement) => boolean) => {
    if (isResizing) return
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current)
      tooltipTimeoutRef.current = null
    }
    const relatedTarget = e.relatedTarget as HTMLElement
    if (relatedTarget && checkTarget(relatedTarget)) {
      return
    }
    setIsHoveringResizeHandle(false)
    setTooltipPos(null)
    setIsTooltipDismissed(false)
  }, [isResizing])

  const sizeProp = isVertical ? "height" : "width"
  const showSidebar = keepMounted ? true : isOpen

  const motionInitial = !shouldAnimate
    ? { [sizeProp]: isOpen ? currentWidth : 0, opacity: isOpen ? 1 : 0 }
    : { [sizeProp]: initialWidth, opacity: 0 }
  const motionAnimate = { [sizeProp]: isOpen ? currentWidth : 0, opacity: isOpen ? 1 : 0 }
  const motionExit = { [sizeProp]: exitWidth, opacity: 0 }

  const containerClassName = isVertical
    ? `bg-transparent flex flex-col text-xs w-full shrink-0 relative ${className}`
    : `bg-transparent flex flex-col text-xs h-full shrink-0 relative ${className}`

  const containerStyle: React.CSSProperties = isVertical
    ? { minHeight: 0, overflow: "hidden", ...style }
    : { minWidth: 0, overflow: "hidden", maxWidth: "calc(100% - 350px)", ...style }

  const tooltipTransform = isVertical
    ? "translateX(-50%) translateY(-100%)"
    : side === "left"
      ? "translateY(-50%)"
      : "translateX(-100%) translateY(-50%)"

  const tooltipOrigin = isVertical
    ? "center bottom"
    : side === "left"
      ? "left center"
      : "right center"

  return (
    <>
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            ref={sidebarRef}
            initial={motionInitial}
            animate={motionAnimate}
            exit={motionExit}
            transition={{
              duration: isResizing ? 0 : animationDuration,
              ease: [0.4, 0, 0.2, 1],
            }}
            className={containerClassName}
            style={containerStyle}
            {...(dataAttributes ? Object.fromEntries(
              Object.entries(dataAttributes).map(([key, value]) => [`data-${key}`, value])
            ) : {})}
          >
            {/* Extended hover area */}
            <div
              data-extended-hover-area
              className={`absolute ${cursorClass} ${isVertical ? "left-0 right-0" : "top-0 bottom-0"}`}
              style={{
                ...extendedHoverAreaStyle,
                pointerEvents: isResizing ? "none" : "auto",
                zIndex: isResizing ? 5 : 10,
              }}
              onPointerDown={handleResizePointerDown}
              onMouseEnter={handleHoverEnter}
              onMouseLeave={(e) => handleHoverLeave(e, (target) =>
                !!(resizeHandleRef.current?.contains(target) || resizeHandleRef.current === target)
              )}
            />

            {/* Resize Handle */}
            <div
              ref={resizeHandleRef}
              onPointerDown={handleResizePointerDown}
              onMouseEnter={handleHoverEnter}
              onMouseLeave={(e) => handleHoverLeave(e, (target) =>
                !!target.closest("[data-extended-hover-area]")
              )}
              className={`absolute ${cursorClass} z-10 ${isVertical ? "left-0 right-0" : "top-0 bottom-0"}`}
              style={resizeHandleStyle}
            />

            {/* Hover Tooltip */}
            {showResizeTooltip &&
              isHoveringResizeHandle &&
              !isResizing &&
              !isTooltipDismissed &&
              tooltipPosition &&
              typeof window !== "undefined" &&
              createPortal(
                <AnimatePresence>
                  {tooltipPosition && (
                    <motion.div
                      key="tooltip"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.05, ease: "easeOut" }}
                      className="fixed z-10"
                      style={{
                        left: `${tooltipPosition.x}px`,
                        top: `${tooltipPosition.y}px`,
                        transform: tooltipTransform,
                        transformOrigin: tooltipOrigin,
                        pointerEvents: "none",
                      }}
                    >
                      <div
                        ref={tooltipRef}
                        role="dialog"
                        data-tooltip="true"
                        className="relative rounded-[12px] bg-popover px-2 py-1 min-h-7 flex flex-col items-start gap-1 text-xs text-popover-foreground dark pointer-events-auto"
                        onPointerDown={(e) => {
                          e.stopPropagation()
                          if (e.button === 0) {
                            flushSync(() => {
                              setIsTooltipDismissed(true)
                            })
                            handleClose()
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          flushSync(() => {
                            setIsTooltipDismissed(true)
                          })
                          handleClose()
                        }}
                      >
                        {!disableClickToClose && (
                          <div className="flex items-center gap-1 text-xs">
                            Close
                            <span className="text-muted-foreground text-xs">
                              Click
                              {closeHotkey && (
                                <>
                                  {" or "}
                                  <Kbd
                                    className="inline-flex align-middle"
                                    size="xs"
                                    roundedFull={false}
                                  >
                                    {closeHotkey}
                                  </Kbd>
                                </>
                              )}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs">
                          Resize
                          <span className="text-muted-foreground text-xs">
                            Drag
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>,
                document.body,
              )}

            {/* Children content */}
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
