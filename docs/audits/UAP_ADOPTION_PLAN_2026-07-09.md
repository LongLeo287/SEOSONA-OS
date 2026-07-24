# UAP Harvest — Adoption Plan (2026-07-09)

Thorough, evidence-based review of the 909-repo UAP run output: 22 champions + 110 project
upgrade proposals + 181 self-improve flags. Reviewed by isolated read-only sub-agents against each
repo's factual KI, then hand-verified.

**Meta-finding:** the auto-classifier's fit score is keyword-driven — **high fit ≠ real fit**. Most
fit-100 hits were false positives (a lone `component`/`pipeline`/`aria`/`motion` token); the genuine
wins mostly scored 33–49. Every pick below is verified against actual code/deps, not the score. This
is itself the top reason to do UAP self-improve #1 (embedding classifier).

Legend: **DONE** · **DO** (verified, worth integrating) · REF (keep KI only) · DUP (already in SEOSONA).

---

## OS core

- **DONE** — `penetration-tester` persona (antigravity-kit) → `4_AGENTS/personas/` (pairs with the 5 security repos just added). Rest of antigravity-kit personas = DUP of SEOSONA's 47.
- **DO** — `D4Vinci/Scrapling` → local high-perf scraper (`pip install scrapling` + wrapper). Complements the paid decodo-scraper.
- REF — `aaron-he-zhu/aaron-marketing-skills` (120 real marketing skills, incl. 16 seo-geo). High value BUT **bilingual Chinese-primary frontmatter** → breaks the English-only linter; needs a dedicated English-extraction pass before adopting. (The champion `seo-geo-claude-skills` itself is a deprecated signpost — all stubs.)
- REF — `giancarloerra/SocratiCode` (borrow `codebase_impact`/`codebase_flow` MCP tool ideas only — OS already runs codebase-memory).
- DUP — `alchaincyf/huashu-design` (already `.agents/skills/huashu-design`), `pnnbao97/VieNeu-TTS` (in Video).

## SEOSONA Video (VN ASR/TTS = the real new capability)

- **DO** — `welcomyou/sherpa-vietnamese-asr` → offline VN ASR (sherpa-onnx) + **diarization** + **punctuation restore** (Whisper lacks these). Top pick.
- **DO** — `undertheseanlp/underthesea` → VN NLP: text normalization/tokenization/NER as the **TTS text front-end** (numbers/dates/abbrev) + subtitle line-splitter.
- **DO** — `kaixxx/noScribe` → cleanest path to `faster-whisper` (~4× via CTranslate2) + pyannote diarization.
- **DO** — `nexu-io/html-video` → EngineAdapter/Registry wrapping **HyperFrames + Remotion** (render backend abstraction).
- **DO** — `hoquanghai/Auto-Create-Video` + `huytranvan2010/AI-auto-generate-video` → sibling VN HyperFrames pipelines (lift `runPipeline` + script.json zod schema + SFX; huytranvan already wired to local OmniVoice TTS).
- **DO** — `k2-fsa/OmniVoice` → 2nd local zero-shot TTS engine (foreign/non-VN names VieNeu can't).
- REF — VieNeu v3 Turbo (verify current build first), ShortGPT/OpenMontage (mine patterns only).

## SEOSONA Content (feeders)

- **DO** — `microsoft/markitdown` → `pip markitdown`: PDF/DOCX/PPTX/HTML/YouTube/audio → clean Markdown (best universal feeder).
- **DO** — `chidiwilliams/buzz` → faster-whisper + yt-dlp → SRT/VTT (auto VN subtitles).
- **DO** — `rany2/edge-tts` → light pip TTS with VN voices + SubMaker timed-SRT output.
- (~15 others DROP — keyword-only matches: winget/naotab matched `manifest.json`, cosmos matched `caption`, etc.)

## SEOSONA UX-UI (motion + design tokens)

- **DO** — `nextlevelbuilder/ui-ux-pro-max-skill` → drop-in design-intelligence skill (palette/type/style DBs + `search.py` + design dials). Already skill-shaped.
- **DO** — `dembrandt/dembrandt` → design-token extraction from live sites (DTCG + drift audit, MCP-ready).
- REF — `motiondivision/motion` / `greensock/GSAP` / `juliangarnier/anime`: the real engines, but UX-UI already declares the two motion stores (GSAP + Anime.js) in SOUL — adopt as CDN/deps only when a component needs them, don't bulk-add.
- REF — `DavidHDev/react-bits`, `imskyleen/animate-ui` (animated component libs — pull specific components on demand).

## SEOSONA Flow

- **DO** — `openclaw/lobster` → real schema-validated pipeline engine (`parsePipeline`/`runPipeline`, approval gates, resume) — the only genuine orchestration engine in the set.
- REF — `levz0r/markdown-printer`, `GoogleChromeLabs/picture-in-picture-chrome-extension` (extension scaffold references).
- (ai-image function had **zero** genuine matches; most flow proposals were ML-training repos matching `pipeline`.)

## UAP self-improvement (highest leverage — fixes the classifier noise above)

1. **`zilliztech/claude-context`** — tree-sitter AST chunking + embeddings + vector search; `synchronizer` = incremental Merkle re-index. Replaces regex extraction + keyword classifier. **Biggest single upgrade.**
2. `Houseofmvps/codesight` — framework-aware structural summarization (routes/schemas/components via WASM AST) → richer KIs.
3. `coderamp-labs/gitingest` — gitignore-aware + **tiktoken token-budgeted** digest → stop wasting LLM context on lockfiles/assets.
4. `abhigyanpatwari/GitNexus` — AST → code graph → **auto skill-generation**.
5. `github/codeql` — per-language extractor → shared IR (`shared/tree-sitter-extractor`): multi-language layer instead of per-language regex.
6. `ooples/token-optimizer-mcp` — file-level **delta re-analysis** + caching (vs UAP's all-or-nothing commit-SHA dedup).
7. `topoteretes/cognee` — entity-resolution graph merge = semantic dedup (merge near-duplicate repos, not just exact commit).
8. `tang-vu/ContribAI` — Rust multi-grammar tree-sitter + sandboxed analysis.

---

## Execution order (recommended)

1. **UAP self-improve #1 + #3** (embedding classifier + token-budget) — fixes the noise that inflated 300 items, makes the next run trustworthy. Highest leverage.
2. **Video VN-ASR/TTS batch** (sherpa-vietnamese-asr, underthesea, noScribe, OmniVoice) — biggest genuine new capability.
3. **Content feeders** (markitdown, buzz, edge-tts) — quick pip installs, real value.
4. **Flow** lobster engine · **UX-UI** ui-ux-pro-max + dembrandt.
5. OS Scrapling · aaron-marketing-skills English-extraction pass (deferred — needs Chinese handling).

---

## FINAL EXECUTION STATUS (2026-07-09)

**Done (committed):**
- OS: `penetration-tester` persona · classifier evidence-tiering (kill keyword noise) · `Scrapling` connector (SSRF-guarded) · **16 aaron seo-geo SEO/GEO skills** (English-extracted, 221→237 routable) — all pushed.
- Video: `sherpa_vn_engine` (offline VN ASR, wired into asr_router) + `vn_text_frontend` (underthesea normalize/subtitle-split) — local commit `d8b2a4c` (not pushed, Video policy).
- UX-UI: `4_LIBRARY/design-intelligence` (ui-ux-pro-max design DBs + search.py) — pushed.
- Content: `scripts/companion/tts_preview.py` (edge-tts) + companion-tools doc (buzz, markitdown) — pushed.

**Redundant / friction (documented, not adopted — honest):**
- Flow `openclaw/lobster` — REDUNDANT: Flow already ships its own `WorkflowExecutor`/`PromptQueue` engine.
- Video `nexu-io/html-video` — OPTIONAL: Video already renders via HyperFrames; this only adds a Remotion fallback (adopt later if a Remotion path is needed).
- Content `buzz`/`markitdown` — Python tools, can't embed in the JS extension → shipped as companions/docs, not wired.
- aaron-marketing-skills remaining 104 (ad/email/social/influencer/launch/narrative) — deferred: same English-extraction pass applies when those domains are needed.
- UAP self-improve #1 embeddings (claude-context) — deferred: needs an embedding model; the evidence-tiering fix already removed most classifier noise without it.

---

## 15-repo Ollama batch review (2026-07-23) — 8 auto-apply flags → ALL reference

Reviewed the 8 `auto_apply=true` classification flags from the Ollama-analyzed 15-repo batch against
each repo's KI. **Zero genuine adoptions** — every flag was classifier over-eagerness on a partial
match (the noise the user flagged: "UAP phải phân tích repo chứ, đâu phải đưa toàn bộ vào hệ thống").
The pipeline never edits project code; these were routing flags, not applied changes.

- REF — `m-bain/whisperX` (Video/asr) — **do NOT restore.** Video ASR was deliberately consolidated
  to ONE engine (PhoWhisper-large) on 2026-07-14, and WhisperX was removed then because its VN
  aligner is **CC-BY-NC** (non-commercial → license-incompatible). A whisperX engine was mistakenly
  re-added here and immediately reverted (Video `8804f27` reverts `cd439fe`).
- REF — `mutonby/openshorts`, `lcy362/agnes-video-generator` — standalone shorts/video generator
  apps (own API/CLI), not libraries to integrate.
- REF — `Bomx/super-video-maker-skill` — cloud agent skill (Heygen/Replicate/ElevenLabs); conflicts
  with Video's local/self-hosted mandate (VieNeu + HyperFrames).
- REF — `Anil-matcha/vox-ai-motion-graphics-generator`, `Alisa0808/vox-director` — two variants of
  the same cloud-bound (Muapi/Atlas) Vox paper-collage explainer skill; different visual style from
  Flow's stickman identity, and Flow already ships its own WorkflowExecutor engine. Overlap → neither
  vendored (no champion worth the cloud dep).
- REF — `CK42BB/vox-explainer-skill`, `MegaTroll222/VOX-COLLAGE-BROLL` — documentation only, no
  executable code.
