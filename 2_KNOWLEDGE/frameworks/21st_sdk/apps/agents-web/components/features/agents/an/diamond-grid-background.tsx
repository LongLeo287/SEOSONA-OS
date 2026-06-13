"use client"

import { useRef, useEffect } from "react"

/* ── Grid ── */
const SP = 10
const HALF = SP / 2
const TAU = Math.PI * 2

/* ── Mouse ── */
const MOUSE_R = 140
const MOUSE_R_SQ = MOUSE_R * MOUSE_R
const INV_MOUSE_R = 1 / MOUSE_R
const MOUSE_OPACITY_BOOST = 3.5
const MOUSE_SPEED_EXTRA = 1.5 // cursor area at 2.5× global → 25× effective

/* ── Trail ── */
const TRAIL_LEN = 28
const TRAIL_FADE = 700
const INV_TRAIL_FADE = 1 / TRAIL_FADE

/* ── Lines ── */
const LINE_W = 0.5
const LINE_SHIM_MAX = 0.02

/* ── Dots ── */
const DOT_R = 0.8
const DOT_SHIM_MAX = 0.18
const MIN_ALPHA = 0.003

/* ── Speed ── */
const BASE_SPEED = 25

/* ── Fade-in ── */
const FADE_DELAY = 2500
const FADE_DURATION = 1500

/* ── Performance ── */
const MAX_DPR = 2 // cap retina to avoid 3× overhead
const SLOW_FRAME_MS = 18 // adaptive 30fps threshold

/* ── Colors (flat Uint8Array — cache-friendly) ── */
const DOT_COLORS_DARK = new Uint8Array([
  255, 255, 255, // white
  255, 255, 255, // white
  255, 255, 255, // white
  96, 165, 250, // blue
  167, 139, 250, // violet
  52, 211, 153, // emerald
  251, 191, 36, // amber
  255, 100, 100, // soft red
])

const DOT_COLORS_LIGHT = new Uint8Array([
  0, 0, 0, // black
  0, 0, 0, // black
  0, 0, 0, // black
  37, 99, 235, // blue-600
  124, 58, 237, // violet-600
  16, 185, 129, // emerald-500
  217, 119, 6, // amber-600
  220, 38, 38, // red-600
])

const COLOR_COUNT = DOT_COLORS_DARK.length / 3

/* ── Fast seeded hash (GLSL-style) ── */
function hash(n: number): number {
  const x = Math.sin(n * 12.9898 + n * 78.233) * 43758.5453
  return x - Math.floor(x)
}

/* ── Shimmer (split line/dot — no branch per call) ── */
function shimmerLine(seed: number, t: number): number {
  const w1 = Math.sin(
    t * (0.4 + hash(seed + 7) * 0.8) * 0.001 + hash(seed) * TAU,
  )
  const w2 = Math.sin(
    t * (0.15 + hash(seed + 11) * 0.3) * 0.001 + hash(seed + 3) * TAU,
  )
  return ((w1 * 0.7 + w2 * 0.3) * 0.5 + 0.5) * LINE_SHIM_MAX
}

function shimmerDot(seed: number, t: number): number {
  const w1 = Math.sin(
    t * (0.08 + hash(seed + 7) * 0.15) * 0.001 + hash(seed) * TAU,
  )
  const w2 = Math.sin(
    t * (0.03 + hash(seed + 11) * 0.08) * 0.001 + hash(seed + 3) * TAU,
  )
  let c = (w1 * 0.7 + w2 * 0.3) * 0.5 + 0.5
  c = c * c * c * c * c // sparsity bias — quintic for sparser colored dots
  return c * DOT_SHIM_MAX
}

/* ── Dot size: fillRect is faster than arc at sub-pixel sizes ── */
const DOT_D = DOT_R * 2

function isDarkMode(): boolean {
  return document.documentElement.classList.contains("dark")
}

export function DiamondGridBackground({
  immediate,
}: { immediate?: boolean } = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)
  const mx = useRef(-1e4)
  const my = useRef(-1e4)
  const sw = useRef(0)
  const sh = useRef(0)
  const skipFade = useRef(!!immediate)
  const darkRef = useRef(true)
  const dotColorsRef = useRef(DOT_COLORS_DARK)
  // Base RGB for lines & mouse-proximity blend target
  const baseR = useRef(255)
  const baseG = useRef(255)
  const baseB = useRef(255)

  useEffect(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext("2d")
    if (!ctx) return
    const parent = cvs.parentElement
    if (!parent) return

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    /* ── Theme detection ── */
    const updateTheme = () => {
      const dark = isDarkMode()
      darkRef.current = dark
      dotColorsRef.current = dark ? DOT_COLORS_DARK : DOT_COLORS_LIGHT
      if (dark) {
        baseR.current = 255; baseG.current = 255; baseB.current = 255
      } else {
        baseR.current = 0; baseG.current = 0; baseB.current = 0
      }
    }
    updateTheme()

    const themeObs = new MutationObserver(updateTheme)
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    /* ── Resize (DPR capped) ── */
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, MAX_DPR)
      const w = parent.clientWidth
      const h = parent.clientHeight
      cvs.width = w * dpr
      cvs.height = h * dpr
      cvs.style.width = `${w}px`
      cvs.style.height = `${h}px`
      sw.current = w
      sh.current = h
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(parent)

    /* ── Visibility — pause when scrolled out of view ── */
    let visible = true
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry?.isIntersecting
      },
      { threshold: 0 },
    )
    io.observe(cvs)

    /* ── Mouse ── */
    const onMove = (e: MouseEvent) => {
      const r = cvs.getBoundingClientRect()
      mx.current = e.clientX - r.left
      my.current = e.clientY - r.top
    }
    const onLeave = () => {
      mx.current = -1e4
      my.current = -1e4
    }
    parent.addEventListener("mousemove", onMove, { passive: true })
    parent.addEventListener("mouseleave", onLeave, { passive: true })

    /* ── Trail ring buffer ── */
    const trailX = new Float32Array(TRAIL_LEN)
    const trailY = new Float32Array(TRAIL_LEN)
    const trailT = new Float64Array(TRAIL_LEN)
    let trailHead = 0
    let trailSize = 0

    // Active trail snapshot (rebuilt per frame)
    const atX = new Float32Array(TRAIL_LEN)
    const atY = new Float32Array(TRAIL_LEN)
    const atDecay = new Float32Array(TRAIL_LEN)

    /* ── Loop state ── */
    let vt = 0
    let prev = 0
    let elapsed = 0
    let dropNext = false // adaptive frame skip

    /* ── prefers-reduced-motion: render one static frame ── */
    if (reduced) {
      const drawStatic = () => {
        const dpr = Math.min(devicePixelRatio || 1, MAX_DPR)
        const w = sw.current
        const h = sh.current
        if (w === 0 || h === 0) return

        const DOT_COLORS = dotColorsRef.current

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, w, h)
        ctx.globalAlpha = 1
        ctx.lineWidth = LINE_W
        ctx.lineCap = "round"

        const buf = SP * 2
        const rStart = Math.floor(-buf / HALF)
        const rEnd = Math.ceil((h + buf) / HALF)

        // Draw dots at their t=0 state (no animation, no mouse)
        for (let row = rStart; row <= rEnd; row++) {
          const xOff = (row & 1) === 0 ? 0 : HALF
          const y = row * HALF
          if (y < -SP || y > h + SP) continue
          const cStart = Math.floor((-SP - xOff) / SP)
          const cEnd = Math.ceil((w + SP - xOff) / SP)
          for (let col = cStart; col <= cEnd; col++) {
            const x = col * SP + xOff
            const seed = row * 10000 + col + 50000
            const op = shimmerDot(seed, 0)
            if (op > MIN_ALPHA) {
              const ci = (Math.floor(hash(seed + 99) * COLOR_COUNT) * 3) | 0
              ctx.fillStyle = `rgba(${DOT_COLORS[ci]},${DOT_COLORS[ci + 1]},${DOT_COLORS[ci + 2]},${op})`
              ctx.fillRect(x - DOT_R, y - DOT_R, DOT_D, DOT_D)
            }
          }
        }
        ctx.globalAlpha = 1
      }
      drawStatic()
      return () => {
        ro.disconnect()
        io.disconnect()
        themeObs.disconnect()
        parent.removeEventListener("mousemove", onMove)
        parent.removeEventListener("mouseleave", onLeave)
      }
    }

    /* ── Animation frame ── */
    const frame = (ts: number) => {
      const dt = prev ? ts - prev : 0
      prev = ts

      // Pause when off-screen — reset prev to avoid time jump on re-entry
      if (!visible) {
        prev = 0
        rafRef.current = requestAnimationFrame(frame)
        return
      }

      // Adaptive: skip this frame if previous was slow
      if (dropNext) {
        dropNext = false
        rafRef.current = requestAnimationFrame(frame)
        return
      }

      const t0 = performance.now()

      elapsed += dt
      vt += dt * BASE_SPEED

      const dpr = Math.min(devicePixelRatio || 1, MAX_DPR)
      const w = sw.current
      const h = sh.current
      if (w === 0 || h === 0) {
        rafRef.current = requestAnimationFrame(frame)
        return
      }

      // Fade-in
      const fadeRaw = skipFade.current
        ? 1
        : Math.min(1, Math.max(0, (elapsed - FADE_DELAY) / FADE_DURATION))
      const fadeAlpha = fadeRaw * fadeRaw * (3 - 2 * fadeRaw)
      if (fadeAlpha < 0.001) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, w, h)
        rafRef.current = requestAnimationFrame(frame)
        return
      }

      const curX = mx.current
      const curY = my.current
      const time = vt

      // Read theme-dependent values from refs (updated by MutationObserver)
      const lineR = baseR.current
      const lineG = baseG.current
      const lineB = baseB.current
      const DOT_COLORS = dotColorsRef.current

      /* ── Push mouse into trail ── */
      if (curX > -1000) {
        trailX[trailHead] = curX
        trailY[trailHead] = curY
        trailT[trailHead] = elapsed
        trailHead = (trailHead + 1) % TRAIL_LEN
        if (trailSize < TRAIL_LEN) trailSize++
      }

      /* ── Build active trail snapshot + bounding box ── */
      let atLen = 0
      let bxMin = 1e9
      let bxMax = -1e9
      let byMin = 1e9
      let byMax = -1e9
      for (let i = 0; i < trailSize; i++) {
        const idx = (trailHead - 1 - i + TRAIL_LEN) % TRAIL_LEN
        const decay = 1 - (elapsed - trailT[idx]!) * INV_TRAIL_FADE
        if (decay <= 0) continue
        const tx = trailX[idx]!
        const ty = trailY[idx]!
        atX[atLen] = tx
        atY[atLen] = ty
        atDecay[atLen] = decay
        atLen++
        if (tx < bxMin) bxMin = tx
        if (tx > bxMax) bxMax = tx
        if (ty < byMin) byMin = ty
        if (ty > byMax) byMax = ty
      }
      bxMin -= MOUSE_R
      bxMax += MOUSE_R
      byMin -= MOUSE_R
      byMax += MOUSE_R

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.globalAlpha = fadeAlpha
      ctx.lineWidth = LINE_W
      ctx.lineCap = "round"

      const buf = SP * 2
      const rStart = Math.floor(-buf / HALF)
      const rEnd = Math.ceil((h + buf) / HALF)

      /* ── Lines ── */
      for (let row = rStart; row <= rEnd; row++) {
        const xOff = (row & 1) === 0 ? 0 : HALF
        const y1 = row * HALF
        const y2 = y1 + HALF

        if (y2 < -SP || y1 > h + SP) continue

        const rowMidY = (y1 + y2) * 0.5
        const rowInBbox = atLen > 0 && rowMidY >= byMin && rowMidY <= byMax

        const cStart = Math.floor((-buf - xOff) / SP)
        const cEnd = Math.ceil((w + buf - xOff) / SP)

        for (let col = cStart; col <= cEnd; col++) {
          const x = col * SP + xOff
          const seed = row * 10000 + col

          // ── Lower-right ──
          const xr = x + HALF
          const midXr = (x + xr) * 0.5
          let inf2r = 0
          let localTimeR = time
          if (rowInBbox && midXr >= bxMin && midXr <= bxMax) {
            let bestInf = 0
            for (let t = 0; t < atLen; t++) {
              const dxt = midXr - atX[t]!
              const dyt = rowMidY - atY[t]!
              const dSq = dxt * dxt + dyt * dyt
              if (dSq >= MOUSE_R_SQ) continue
              const inf = (1 - Math.sqrt(dSq) * INV_MOUSE_R) * atDecay[t]!
              if (inf > bestInf) bestInf = inf
            }
            inf2r = bestInf * bestInf
            localTimeR = time * (1 + inf2r * MOUSE_SPEED_EXTRA)
          }
          const opR =
            shimmerLine(seed * 2, localTimeR) *
            (1 + inf2r * MOUSE_OPACITY_BOOST)
          if (opR > MIN_ALPHA) {
            ctx.strokeStyle = `rgba(${lineR},${lineG},${lineB},${opR})`
            ctx.beginPath()
            ctx.moveTo(x, y1)
            ctx.lineTo(xr, y2)
            ctx.stroke()
          }

          // ── Lower-left ──
          const xl = x - HALF
          const midXl = (x + xl) * 0.5
          let inf2l = 0
          let localTimeL = time
          if (rowInBbox && midXl >= bxMin && midXl <= bxMax) {
            let bestInf = 0
            for (let t = 0; t < atLen; t++) {
              const dxt = midXl - atX[t]!
              const dyt = rowMidY - atY[t]!
              const dSq = dxt * dxt + dyt * dyt
              if (dSq >= MOUSE_R_SQ) continue
              const inf = (1 - Math.sqrt(dSq) * INV_MOUSE_R) * atDecay[t]!
              if (inf > bestInf) bestInf = inf
            }
            inf2l = bestInf * bestInf
            localTimeL = time * (1 + inf2l * MOUSE_SPEED_EXTRA)
          }
          const opL =
            shimmerLine(seed * 2 + 1, localTimeL) *
            (1 + inf2l * MOUSE_OPACITY_BOOST)
          if (opL > MIN_ALPHA) {
            ctx.strokeStyle = `rgba(${lineR},${lineG},${lineB},${opL})`
            ctx.beginPath()
            ctx.moveTo(x, y1)
            ctx.lineTo(xl, y2)
            ctx.stroke()
          }
        }
      }

      /* ── Dots (fillRect instead of arc — faster at sub-pixel sizes) ── */
      for (let row = rStart; row <= rEnd; row++) {
        const xOff = (row & 1) === 0 ? 0 : HALF
        const y = row * HALF

        if (y < -SP || y > h + SP) continue

        const rowInBbox = atLen > 0 && y >= byMin && y <= byMax

        const cStart = Math.floor((-SP - xOff) / SP)
        const cEnd = Math.ceil((w + SP - xOff) / SP)

        for (let col = cStart; col <= cEnd; col++) {
          const x = col * SP + xOff
          const seed = row * 10000 + col + 50000

          let inf2 = 0
          let localTime = time
          if (rowInBbox && x >= bxMin && x <= bxMax) {
            let bestInf = 0
            for (let t = 0; t < atLen; t++) {
              const dxt = x - atX[t]!
              const dyt = y - atY[t]!
              const dSq = dxt * dxt + dyt * dyt
              if (dSq >= MOUSE_R_SQ) continue
              const inf = (1 - Math.sqrt(dSq) * INV_MOUSE_R) * atDecay[t]!
              if (inf > bestInf) bestInf = inf
            }
            inf2 = bestInf * bestInf
            localTime = time * (1 + inf2 * MOUSE_SPEED_EXTRA)
          }

          const op =
            shimmerDot(seed, localTime) * (1 + inf2 * MOUSE_OPACITY_BOOST)
          if (op > MIN_ALPHA) {
            const ci = (Math.floor(hash(seed + 99) * COLOR_COUNT) * 3) | 0
            const cr = DOT_COLORS[ci]!
            const cg = DOT_COLORS[ci + 1]!
            const cb = DOT_COLORS[ci + 2]!
            const r = (cr + (lineR - cr) * inf2) | 0
            const g = (cg + (lineG - cg) * inf2) | 0
            const b = (cb + (lineB - cb) * inf2) | 0
            ctx.fillStyle = `rgba(${r},${g},${b},${op})`
            ctx.fillRect(x - DOT_R, y - DOT_R, DOT_D, DOT_D)
          }
        }
      }

      ctx.globalAlpha = 1

      // Adaptive: if this frame was slow, skip next to maintain ~30fps minimum
      if (performance.now() - t0 > SLOW_FRAME_MS) dropNext = true

      rafRef.current = requestAnimationFrame(frame)
    }

    rafRef.current = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      io.disconnect()
      themeObs.disconnect()
      parent.removeEventListener("mousemove", onMove)
      parent.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}
