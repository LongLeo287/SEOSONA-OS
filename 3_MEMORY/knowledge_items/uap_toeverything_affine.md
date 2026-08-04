# KI: toeverything/affine

> Manually authored (2026-07-24), NOT via the UAP assimilator. HARD-flagged only because the vendored
> Yarn release `.yarn/releases/yarn-4.13.0.cjs` (Yarn's own bundled package manager) contains an AWS
> example key inside Yarn's internals — third-party tooling, not AFFiNE's code. Verified benign.

## Overview
AFFiNE ("Write, Draw and Plan All at Once") is a **privacy-focused, local-first, open-source**
alternative to Notion + Miro — one platform fusing docs, whiteboard/edgeless canvas, and databases.
Local-first sync, self-hostable. Large TypeScript + Rust monorepo (`@affine/monorepo`).

## Tech Stack (from code)
- **TypeScript** front end (BlockSuite editor framework) + **Rust** native/sync layer.
- Yarn 4 workspaces monorepo; Electron desktop + web + mobile targets.
- Local-first CRDT sync; self-hostable server.

## Relevance to SEOSONA
Architecture reference for **local-first knowledge management** — how AFFiNE fuses documents +
canvas + structured data with offline-first CRDT sync is directly relevant to how the OS structures
its own knowledge base and could inform a local-first memory/whiteboard surface. Reference tier
(large general-purpose app, not a drop-in skill).
