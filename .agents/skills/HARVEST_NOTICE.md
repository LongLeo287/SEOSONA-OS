# Harvested Skills — Attribution & License

Skills harvested (2026-07-24) from third-party MIT-licensed repositories during a UAP ingest wave,
redistributed here under the MIT License with the original copyright/permission notice retained.

## Curated harvest — quality/craft skills (2026-07-24)
Hand-picked subsets, chosen because they are **domain-neutral** (the bulk of each upstream repo was
left behind on purpose — see below).

**From `github.com/wanshuiyin/Auto-claude-code-research-in-sleep` (ARIS) — MIT.**
Only 3 of its ~85 skills are not coupled to academic research (arXiv/LaTeX/patents/experiments):
- `mermaid-diagram` — generate flowcharts / sequence / ER diagrams (incl. KaTeX math)
- `web-debug-search` — search GitHub, Stack Exchange, official docs when debugging
- `system-profile` — profile a script/process for performance
The other ~82 (paper-write, overleaf-sync, proof-checker, grant-proposal, …) are academic and were
deliberately NOT vendored — ARIS's real value to SEOSONA is its *methodology*, captured in the KI
`3_MEMORY/knowledge_items/uap_wanshuiyin_Auto-claude-code-research-in-sleep.md`.

**From `github.com/heygen-com/hyperframes` — Apache-2.0.**
Its `.agents/skills/` video-craft set, minus `changelog-video` (18 MB of demo mp4/mp3 assets + a
dependency on the HyperFrames CLI):
- `motion-doctrine` (+ `scripts/seam-gate.mjs`, `seam-stamp.mjs`) · `cut-the-curve` ·
  `seam-craft` · `captions-overlay` · `oversized-cursor`
Note: `motion-doctrine`'s two `.mjs` scripts drive headless Chrome to verify a HyperFrames film; they
are inert without a HyperFrames project and, being vendored code, run through the OS skill sandbox.

## Auto-vendored by the UAP creator (2026-07 wave 5)
The UAP pipeline installs a repo's `SKILL.md` skill when it ingests one. These four came in that way;
all are permissively licensed (verified against each repo's LICENSE). Redistributed here under their
respective licenses, attribution below:

- `book-to-skill` — `github.com/virgiliojr94/book-to-skill` (MIT)
- `seedance-2.0` — `github.com/Emily2040/seedance-2.0` (MIT)
- `vox-director` — `github.com/Alisa0808/vox-director` (MIT)
- `video-shotcraft` — `github.com/Vincentwei1021/video-shotcraft` (**Apache-2.0** — see that repo's
  LICENSE/NOTICE upstream; this is a redistribution, modified only by extraction into this tree)

## Vietnamese writing skills (in this directory)
From `github.com/longhang2004/vietnamese-humanizer` (MIT).
Skills: `grammar-checker-vi`, `humanizer-vi`, `style-guide-vi`, `translationese-cleaner-vi`.

```
MIT License

Copyright (c) 2026 Vietnamese Writing Skills contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Digital marketing / SEO plugin (vendored as a framework)
The full `github.com/indranilbanerjee/digital-marketing-pro` plugin (MIT) — all 158 skills + 89
engine scripts — is vendored at `2_KNOWLEDGE/frameworks/digital-marketing-pro/`. Its upstream
`LICENSE` (MIT, Copyright (c) 2026 Digital Marketing Pro) ships inside that directory and governs it.
See that folder's `SOURCE.md` for provenance and runtime notes (`CLAUDE_PLUGIN_ROOT`).
