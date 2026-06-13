"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useIsMobile } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

export interface NewsArticle {
  href: string
  title: string
  summary: string
  image?: string
  imageComponent?: React.ReactNode
}

const OFFSET_FACTOR = 4
const SCALE_FACTOR = 0.03
const OPACITY_FACTOR = 0.1

const DISMISSED_NEWS_COOKIE = "dismissed-news"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

export function News({
  articles,
  initialDismissed = [],
}: {
  articles: NewsArticle[]
  initialDismissed?: string[]
}) {
  const [dismissedNews, setDismissedNews] = React.useState<string[]>(() => {
    if (typeof window === "undefined") return initialDismissed
    try {
      const stored = JSON.parse(
        localStorage.getItem("dismissed-news") || "[]",
      )
      // Merge localStorage with cookie-based initial state
      const merged = Array.from(new Set([...stored, ...initialDismissed]))
      return merged
    } catch {
      return initialDismissed
    }
  })

  // Track whether all articles were already dismissed on mount
  const [allDismissedOnMount] = React.useState(() => {
    if (typeof window === "undefined") {
      return articles.every(({ href }) => initialDismissed.includes(href))
    }
    try {
      const dismissed: string[] = JSON.parse(
        localStorage.getItem("dismissed-news") || "[]",
      )
      const merged = Array.from(new Set([...dismissed, ...initialDismissed]))
      return articles.every(({ href }) => merged.includes(href))
    } catch {
      return articles.every(({ href }) => initialDismissed.includes(href))
    }
  })

  // On first mount, sync localStorage dismissed state to cookie (migration for existing users)
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("dismissed-news")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          document.cookie = `${DISMISSED_NEWS_COOKIE}=${encodeURIComponent(JSON.stringify(parsed))}; path=/; max-age=${COOKIE_MAX_AGE}`
        }
      }
    } catch {}
  }, [])

  const cards = articles.filter(({ href }) => !dismissedNews.includes(href))
  const cardCount = cards.length
  const [collapsing, setCollapsing] = React.useState(false)
  const [hidden, setHidden] = React.useState(false)

  React.useEffect(() => {
    if (cardCount === 0 && !hidden && !allDismissedOnMount) {
      // Show "all caught up" for a moment, then collapse
      const collapseTimer = setTimeout(() => setCollapsing(true), 1800)
      const hideTimer = setTimeout(() => setHidden(true), 2400)
      return () => {
        clearTimeout(collapseTimer)
        clearTimeout(hideTimer)
      }
    }
  }, [cardCount, hidden, allDismissedOnMount])

  // Don't render anything if all articles were already dismissed before this session
  if (allDismissedOnMount) return null
  if (hidden) return null

  return (
    <div
      className={cn(
        "group overflow-hidden transition-all duration-500 ease-in-out",
        collapsing
          ? "max-h-0 opacity-0 pb-0 pt-0 px-3"
          : "max-h-[500px] opacity-100 px-3 pb-3 pt-8",
      )}
      data-active={cardCount !== 0}
    >
      <div className="relative size-full">
        {cards.toReversed().map(({ href, title, summary, image, imageComponent }, idx) => (
          <div
            key={href}
            className={cn(
              "absolute left-0 top-0 size-full scale-[var(--scale)] transition-[opacity,transform] duration-200",
              cardCount - idx > 3
                ? [
                    "opacity-0 sm:group-hover:translate-y-[var(--y)] sm:group-hover:opacity-[var(--opacity)]",
                    "sm:group-has-[*[data-dragging=true]]:translate-y-[var(--y)] sm:group-has-[*[data-dragging=true]]:opacity-[var(--opacity)]",
                  ]
                : "translate-y-[var(--y)] opacity-[var(--opacity)]",
            )}
            style={
              {
                "--y": `-${(cardCount - (idx + 1)) * OFFSET_FACTOR}%`,
                "--scale": 1 - (cardCount - (idx + 1)) * SCALE_FACTOR,
                "--opacity":
                  cardCount - (idx + 1) >= 6
                    ? 0
                    : 1 - (cardCount - (idx + 1)) * OPACITY_FACTOR,
              } as React.CSSProperties
            }
            aria-hidden={idx !== cardCount - 1}
          >
            <NewsCard
              title={title}
              description={summary}
              image={image}
              imageComponent={imageComponent}
              href={href}
              hideContent={cardCount - idx > 2}
              active={idx === cardCount - 1}
              onDismiss={() => {
                const next = [href, ...dismissedNews.slice(0, 50)]
                setDismissedNews(next)
                try {
                  localStorage.setItem("dismissed-news", JSON.stringify(next))
                  document.cookie = `${DISMISSED_NEWS_COOKIE}=${encodeURIComponent(JSON.stringify(next))}; path=/; max-age=${COOKIE_MAX_AGE}`
                } catch {}
              }}
            />
          </div>
        ))}
        <div className="pointer-events-none invisible" aria-hidden>
          <NewsCard title="Title" description="Description" />
        </div>
        {!cardCount && !collapsing && (
          <div
            className="animate-slide-up-fade absolute inset-0 flex size-full flex-col items-center justify-center gap-3 [animation-duration:1s]"
            style={{ "--offset": "10px" } as React.CSSProperties}
          >
            <div className="absolute inset-0 rounded-lg border border-neutral-300" />
            <span className="text-xs font-medium text-muted-foreground">
              You&apos;re all caught up!
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function NewsCard({
  title,
  description,
  image,
  imageComponent,
  onDismiss,
  hideContent,
  href,
  active,
}: {
  title: string
  description: string
  image?: string
  imageComponent?: React.ReactNode
  onDismiss?: () => void
  hideContent?: boolean
  href?: string
  active?: boolean
}) {
  const isMobile = useIsMobile()

  const ref = React.useRef<HTMLDivElement>(null)
  const drag = React.useRef<{
    start: number
    delta: number
    startTime: number
    maxDelta: number
  }>({
    start: 0,
    delta: 0,
    startTime: 0,
    maxDelta: 0,
  })
  const animation = React.useRef<Animation | null>(null)
  const [dragging, setDragging] = React.useState(false)

  const onDragMove = (e: PointerEvent) => {
    if (!ref.current) return
    const { clientX } = e
    const dx = clientX - drag.current.start
    drag.current.delta = dx
    drag.current.maxDelta = Math.max(drag.current.maxDelta, Math.abs(dx))
    ref.current.style.setProperty("--dx", dx.toString())
  }

  const dismiss = () => {
    if (!ref.current) return

    const cardWidth = ref.current.getBoundingClientRect().width
    const translateX = Math.sign(drag.current.delta) * cardWidth

    animation.current = ref.current.animate(
      { opacity: 0, transform: `translateX(${translateX}px)` },
      { duration: 150, easing: "ease-in-out", fill: "forwards" },
    )
    animation.current.onfinish = () => onDismiss?.()
  }

  const stopDragging = (cancelled: boolean) => {
    if (!ref.current) return
    unbindListeners()
    setDragging(false)

    const dx = drag.current.delta
    if (Math.abs(dx) > ref.current.clientWidth / (cancelled ? 2 : 3)) {
      dismiss()
      return
    }

    animation.current = ref.current.animate(
      { transform: "translateX(0)" },
      { duration: 150, easing: "ease-in-out" },
    )
    animation.current.onfinish = () =>
      ref.current?.style.setProperty("--dx", "0")

    drag.current = { start: 0, delta: 0, startTime: 0, maxDelta: 0 }
  }

  const onDragEnd = () => stopDragging(false)
  const onDragCancel = () => stopDragging(true)

  const onPointerDown = (e: React.PointerEvent) => {
    if (!active || !ref.current || animation.current?.playState === "running")
      return

    bindListeners()
    setDragging(true)
    drag.current.start = e.clientX
    drag.current.startTime = Date.now()
    drag.current.delta = 0
    ref.current.style.setProperty("--w", ref.current.clientWidth.toString())
  }

  const onClick = () => {
    if (!ref.current) return
    if (
      isMobile &&
      drag.current.maxDelta < ref.current.clientWidth / 10 &&
      (!drag.current.startTime || Date.now() - drag.current.startTime < 250)
    ) {
      window.open(href, "_blank")
    }
  }

  const bindListeners = () => {
    document.addEventListener("pointermove", onDragMove)
    document.addEventListener("pointerup", onDragEnd)
    document.addEventListener("pointercancel", onDragCancel)
  }

  const unbindListeners = () => {
    document.removeEventListener("pointermove", onDragMove)
    document.removeEventListener("pointerup", onDragEnd)
    document.removeEventListener("pointercancel", onDragCancel)
  }

  return (
    <Card
      ref={ref}
      className={cn(
        "relative select-none gap-2 p-3 text-[0.8125rem]",
        "translate-x-[calc(var(--dx)*1px)] rotate-[calc(var(--dx)*0.05deg)] opacity-[calc(1-max(var(--dx),-1*var(--dx))/var(--w)/2)]",
        "transition-shadow data-[dragging=true]:shadow-md",
      )}
      data-dragging={dragging}
      onPointerDown={onPointerDown}
      onClick={onClick}
    >
      <div className={cn(hideContent && "invisible")}>
        <div className="flex flex-col gap-1">
          <span className="line-clamp-1 font-medium text-foreground">
            {title}
          </span>
          <p className="line-clamp-2 h-10 leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
        <Link
          href={href || "#"}
          target="_blank"
          className="relative mt-3 aspect-[16/9] w-full shrink-0 overflow-hidden rounded border bg-muted block"
        >
          {imageComponent ? (
            imageComponent
          ) : image ? (
            <Image
              src={image}
              alt=""
              fill
              sizes="10vw"
              className="rounded object-cover object-center"
              draggable={false}
            />
          ) : null}
        </Link>
        <div
          className={cn(
            "h-0 overflow-hidden opacity-0 transition-[height,opacity] duration-200",
            "sm:group-has-[*[data-dragging=true]]:h-7 sm:group-has-[*[data-dragging=true]]:opacity-100 sm:group-hover:group-data-[active=true]:h-7 sm:group-hover:group-data-[active=true]:opacity-100",
          )}
        >
          <div className="flex items-center justify-between pt-3 text-xs">
            <Link
              href={href || "#"}
              target="_blank"
              className="font-medium text-muted-foreground transition-colors duration-75 hover:text-foreground"
            >
              Read more
            </Link>
            <button
              type="button"
              onClick={dismiss}
              className="text-muted-foreground transition-colors duration-75 hover:text-foreground"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}

