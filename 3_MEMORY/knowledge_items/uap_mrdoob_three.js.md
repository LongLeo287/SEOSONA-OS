# KI: mrdoob/three.js

> Manually authored (2026-07-24), NOT via the UAP assimilator. HARD-flagged only because
> `devtools/panel/panel.js` contains **one** Unicode tag character (U+E00xx) next to an emoji — an
> emoji/flag-sequence artifact, not smuggled instructions (a single tag char can't encode a payload).
> Verified benign in this 100k-star, widely-audited library.

## Overview
three.js is the de-facto **JavaScript 3D library** — "easy-to-use, lightweight, cross-browser,
general-purpose 3D." Scene-graph API (scene, camera, geometry, material, mesh) rendered via **WebGL**
and **WebGPU** (SVG/CSS3D renderers available as addons). MIT, v0.185.x, distributed on npm as `three`.

## Tech Stack (from code)
- **JavaScript (ES modules)**, no framework; `build/` bundles (`three.module.js`, WebGPU build).
- WebGL + WebGPU renderers; huge `examples/` set; `editor/` (web scene editor); `devtools/` panel.
- Extensive `docs/` (threejs.org), `llms.txt` for LLM consumption.

## Relevance to SEOSONA
Reference for any **3D / visual** work in the video/UX ecosystem — product-video backgrounds, 2.5D
camera moves, WebGL scene composition. The `editor/` and node-based material graph are architecture
references. Not SEO-domain; kept as a capability reference for the visual/video satellites.
