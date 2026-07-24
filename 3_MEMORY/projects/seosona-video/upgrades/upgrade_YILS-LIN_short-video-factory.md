# Upgrade proposal: YILS-LIN/short-video-factory -> seosona-video / video-render

- **Fit score:** 44/100
- **Matched evidence:** ffmpeg, render
- **Source KI:** `knowledge_items/uap_YILS-LIN_short-video-factory.md`

## How this upgrades `video-render`
This repo's code (see the KI's Public API / Dependencies / Key Source Excerpts) maps to the `video-render` function of `seosona-video`. Adopt the exported functions/patterns listed in the KI; the KI is factual (code-evidence only, no README). Verify against the project's own tests before wiring in.
