# KI: heygen-com/hyperframes

> Manually authored (2026-07-24), NOT via the UAP assimilator. HARD-flagged only because a test file
> (`packages/cli/src/telemetry/agent_runtime.test.ts`) embeds AWS's official *documentation example*
> access-key id (the well-known `...EXAMPLE` fixture) — not a real secret. Verified benign; the literal
> string is intentionally omitted here so this KI stays clean of secret-scanner patterns.

## Overview
HyperFrames (by HeyGen) — **"Write HTML. Render video. Built for agents."** A toolchain that turns
HTML/CSS into rendered video, designed to be driven by AI agents rather than hand-authored timelines:
an agent emits HTML frames, HyperFrames renders them to video. Published on npm as `hyperframes`.
Apache-2.0, Node ≥ 22.

## Tech Stack (from code)
- **TypeScript monorepo** (`hyperframes-monorepo`, `packages/*`) with a `cli` package.
- **Node.js ≥ 22**; npm-distributed (`hyperframes`).
- HTML/CSS → video rendering pipeline; telemetry module in the CLI.
- Ships a `Dockerfile.test`, agent-facing docs (`AGENTS.md`, `CLAUDE.md`, `DESIGN.md`).

## Relevance to SEOSONA
Directly adjacent to **SEOSONA Video**: an agent-native "HTML-as-video-source" renderer is an
alternative to the Remotion/React approach the video OS already uses. Worth studying as a lighter,
agent-first rendering path (describe frames in HTML → get video) and for its telemetry/CLI structure.
