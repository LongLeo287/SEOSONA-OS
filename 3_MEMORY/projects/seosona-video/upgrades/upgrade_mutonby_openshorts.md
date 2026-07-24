# Upgrade proposal: mutonby/openshorts -> seosona-video / asr

- **Fit score:** 66/100
- **Matched evidence:** whisper, faster-whisper, transcri
- **Source KI:** `knowledge_items/uap_mutonby_openshorts.md`

## How this upgrades `asr`
This repo's code (see the KI's Public API / Dependencies / Key Source Excerpts) maps to the `asr` function of `seosona-video`. Adopt the exported functions/patterns listed in the KI; the KI is factual (code-evidence only, no README). Verify against the project's own tests before wiring in.
