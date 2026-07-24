# SEOSONA OS — Roadmap & Recommendations

Prioritized from the 2026-07-24 full audit ([audits/OS_AUDIT_2026-07-24.md](audits/OS_AUDIT_2026-07-24.md))
and the system's architecture. Ordered by return-on-investment. Status: ✅ done · 🚧 in progress · ⬜ open.

## Tier 1 — Foundation (highest ROI)

- ✅ **CI gate** — `.github/workflows/ci.yml` runs lint + capability-bridge validate + JS/Python syntax
  + hooks tests + security-critical pytest on every push/PR. This is the gate that would have caught
  the CLI-syntax regression.
- ✅ **Pytest for security-critical code** — `tests/test_security_critical.py` covers the UAP security
  guard (HARD/SOFT), the dispatcher side-effect + path-confinement guard, and the vector-memory brain.
  Expand coverage to the classifier and connectors next.
- ✅ **`_extract_domain` TLD fix** — audit dispatch no longer mistakes version numbers ("2.0") for domains.
- ⬜ **Remaining OPEN bug fixes** — `setup-hooks.js` clobbering existing hooks; `seosona setup` not
  creating the `~/.seosona` junction; ~~assimilator sqlite leak~~ (✅ fixed).

## Tier 2 — Security hardening

- ⬜ **SSRF: pin-and-connect + no-redirect** — `url_guard.assert_safe_url` re-resolves DNS at fetch
  (rebinding) and follows 3xx to private hosts; 3 connectors skip the guard entirely. Resolve once,
  connect to the validated IP, disable auto-redirect + re-validate each hop.
- ⬜ **Dispatcher guard → allowlist** — the denylist is now broad, but a backstop should be
  allowlist-based (only names/paths explicitly marked safe auto-run).
- ⬜ **Sandbox vendored-skill execution** — `.agents/skills` + `2_KNOWLEDGE/frameworks` are third-party
  code (the real attack surface). Anything that *runs* a skill should sandbox it (restricted subprocess,
  no network by default).

## Tier 3 — Intelligence / architecture

- ✅ **Dense retrieval for the knowledge brain** — TF-IDF misses paraphrase. DONE — added
  **BM25 + reciprocal-rank fusion** over the existing index (pure-Python, no model). Stronger:
  Ollama `nomic-embed-text` for real semantic recall. (This was UAP self-improve #1, deferred.)
- ⬜ **Exercise the shared brain** — the `seosona-knowledge` MCP + the 4-satellite wiring go live from a
  fresh session; use `knowledge_search` in real workflows to prove and habituate the cross-project loop.

## Tier 4 — Strategic / ecosystem

- ⬜ **Split OS code from the vendored vault** — to get real SAST (CodeQL), separate `1_CORE`+`cli` into
  a package scanned on its own; the KI/skill vault stays a separate repo/branch. Resolves the
  "vendor-everything vs security-scan" conflict at the root.
- ⬜ **V1 → V2 harvest** — `seosona-video-os` (V2) is the future; V1 (`SEOSONA Video`) is its read-only
  engine host. Build the Phase 4 (qa) / Phase 5 (publish/analytics) workers per V2's own phase gates —
  don't build ahead. V1 is the reference + cautionary spec.
- ⬜ **Dependabot** — replaces the removed CodeQL for dependency-vuln coverage (npm + python).

## Tier 5 — Process

- ⬜ **Docs sync** — `docs/00_master_architecture.md` still describes the old Excel-driven UAP model;
  rewrite its UAP section to match `docs/03` + the live pipeline. Consider generating structure docs
  from code to stop drift.
- ⬜ **`seosona doctor` health command** — one command: lint + bridge + tests + a knowledge-brain smoke
  query → an OS health report.

---

*Recommended next three (if choosing): the OPEN Tier-1 bug fixes, then Tier-2 SSRF hardening, then
Tier-3 BM25 fusion — foundation solid, then safe, then smarter.*
