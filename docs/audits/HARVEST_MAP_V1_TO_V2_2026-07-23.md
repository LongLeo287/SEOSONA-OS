# SEOSONA Video — V1 → V2 Harvest Map + V2 State Audit

**Date:** 2026-07-23 · **Method:** 2 parallel agents on V2 + the earlier 5-agent V1 audit, synthesized.
**V1** = `D:\SEOSONA AI\SEOSONA Video` (Python factory, remote SEOSONA-Video-AI, v1.0.0) — **engine host**.
**V2** = `D:\SEOSONA AI\seosona-video-os` (SEOSONA Video AI V2, TS monorepo) — **orchestration rebuild**.

---

## Part A — V2 current state (the audit)

**Verdict: A− — a healthy, well-architected, test-first 8-day-old rebuild.** Far past skeleton.

- **Architecture:** strict-TS monorepo. Hard boundary **OS-commands / Factory-executes**: the OS plans a
  `ProductionCommand` (validated `TimelineIR` + brand/render + run dir) and calls an *injected*
  `FactoryApp.produce()` — the orchestrator never imports the render engine (seam enforced by the
  dependency graph, `packages/contracts/src/production_command.ts`). Parallel **core-vs-engine** split:
  contracts / TimelineIR / content-addressed storage / event ledger stay in core; all heavy media work
  sits behind adapters in `packages/engines`.
- **Build status (self-reported + verified):** **BUILT 23 · PARTIAL 5 · SCAFFOLD 5** (~70% built).
  221 non-test source files; only 30 `NotImplementedError` sites across 23 files (~13%, mostly partial).
- **Tests:** Vitest, **1743/1745 pass (99.9%)**, 4,270 assertions, 2,185 blocks — real, not scaffold.
  `tsc --noEmit` = **0 type errors** (strict). The 2 failures = one self-consistency meta-test with a
  single trivial cause: `packages/engines/src/mcpServer.ts` built but not re-exported from
  `engines/src/index.ts` — **a one-line fix**.
- **Engine seam is wired & real:** V2 spawns V1's venv Python (`packages/engines/src/legacyPaths.ts:9-13`,
  `DEFAULT_LEGACY_ROOT = D:\SEOSONA AI\SEOSONA Video`, override `SEOSONA_LEGACY_ROOT`) and calls:
  OmniVoice TTS (`ttsAdapter.ts`), PhoWhisper ASR (`asrAdapter.ts`), `native_composer` render
  (`renderAdapter.ts`), `researcher.py` (`legacyBridge.ts`), pinned ffmpeg-static.
- **Honest-seam discipline:** unbuilt legs throw `NotImplementedError({module,contract,phase})`; a
  missing engine host records `blocked_on: "factoryApp"` instead of faking; `timeline-ir` surfaces the
  motion/mix gap via `motionFeatures()` rather than pretending to animate.
- **Weaknesses:** (1) **no CI** (`.github/` absent) — nothing enforces the green suite/typecheck on push;
  (2) V1↔V2 **live-gate integration tests are excluded** from the default vitest run, so the Python
  engine boundary is validated only opt-in — the green suite does **not** prove end-to-end rendering;
  (3) the one-line re-export red test.

---

## Part B — The harvest map

The model: **V1 stays the engine host; V2 is where orchestration/QA is rebuilt correctly.** Most engine
harvesting is *already done* via adapters. What remains is (1) porting the render/QA *craft knowledge*
locked in V1's `4_BRAIN`, and (2) building — in V2, honestly — the loops V1 never closed.

### B1. Already harvested — confirm, do NOT redo
| V1 asset | V2 wiring | Status |
|---|---|---|
| OmniVoice `voice_router.synthesize_voice` | `engines/ttsAdapter.ts` (consent-gated, fail on None) | ✅ wired |
| PhoWhisper `asr_router.transcribe_words` | `engines/asrAdapter.ts` (empty[] ≠ down) | ✅ wired |
| `native_composer.make_video` (render) | `engines/renderAdapter.ts` (throws if artifact absent) | ✅ wired (runtime) |
| `researcher.research` | `services/workers/legacyBridge.ts` | ✅ wired |
| ffmpeg/ffprobe-static | pinned from V1 `node_modules` | ✅ wired |

### B2. To harvest — V1 *knowledge* → V2 *build* (the real work)
| V1 source | What's valuable | V2 target | Action |
|---|---|---|---|
| `4_BRAIN/native_composer.py` (3,277 LOC): SFX keyword tables, ffmpeg filter graphs, sidechain ducking, loudnorm, layered typography | The **render craft** | — | **CORRECTED (2026-07-23):** V2 already built its own render layer — `nativeRenderAdapter.ts` (2,999 LOC) + `compositorRenderAdapter.ts`/`motionRender.ts`/`soundDesign.ts` (which already indexes V1's SFX library with its own tier system). The timeline-ir motion/mix "gap" is an **INTENTIONAL Phase-E seam** (documented "descriptive contract + honest seam"), not an oversight. So a native_composer port is **redundant and would override V2's phasing**. Reframed: keep native_composer as a **Phase-E reference spec** (proven ffmpeg/ducking/loudnorm params) for WHEN the V2 team wires motion/mix into nativeRenderAdapter — not a code port to do now. |
| `4_BRAIN/quality_scorer.py` + `news_video_standards.py` (WPM/craft rules) | The **QA craft rubric** (incl. the WPM 130–180 band V1's prior audit demanded but never landed) | V2 `services/workers` **qaWorker (PARTIAL)** | Build the craft-aware QA gate here — V1 shows exactly what to check (and that a lenient self-referential gate is the trap to avoid). |
| V1's 323 regression tests (ASR drops one None-timestamp word not the whole transcript; voice degrades to None, never fakes) | **Invariants** proven by past bugs | V2 adapter tests (`ttsAdapter`/`asrAdapter` already assert some) | Cross-check every V1 invariant has a V2 adapter test — don't re-learn V1's bugs. |
| V1 `learn_flywheel.py` / `factory_metrics.py` | Learning-loop shape | V2 `packages/knowledge` (learningFlywheel, BUILT) | Compare designs; port any metric V2's flywheel lacks. |

### B3. The loops V1 left open = V2's already-planned Phase 4-5 (do NOT build ahead of the gates)
**CONFIRMED (2026-07-23) via `docs/ARCHITECTURE.md` phase column + PHASE*_GATE docs:** V2 is a
phase-gated build, currently at **Phase 3b** (render lane, just gated with live evidence). The three
V1 blockers map to V2's **explicitly numbered future phases**, and the team is **already executing
Phase 4** (commit "build analyzeWorker and the Phase-4 qa gate"). These are deliberate deferrals with
honest `NotImplementedError` seams — NOT gaps to fill now. Building them ahead of the gates would
collide with in-progress work.
| Blocker (open in V1) | V2 worker | Status · Phase |
|---|---|---|
| Lenient/self-referential QA gate | `qaWorker` | PARTIAL · **Phase 4** (in progress) |
| Feedback loop hollow (`performance_ingest.py`=`return None`) | `analyticsWorker`→`learningFlywheel` | SCAFFOLD/PARTIAL · **Phase 5** |
| (publish) never really shipped | `publishWorker` | SCAFFOLD · **Phase 5** |
| Premium engines built-but-unwired | V2 prefers own `nativeRenderAdapter`; legacy footage opt-in | (handled in engine layer) |

**V1's role for these phases:** reference + cautionary spec. When the V2 team builds the Phase-4 qa
gate, V1's `quality_scorer.py`/`news_video_standards.py` (and the lesson that a lenient self-scoring
gate is the trap) is the input. When they build Phase-5 analytics, V1's hollow `performance_ingest.py`
is the "don't ship it as a stub that returns None and claim you learn" cautionary tale.

### B4. Leave in V1 — keep runnable, do not move
The **engines themselves** (OmniVoice + its `.venv-omnivoice`, PhoWhisper models, `native_composer`
runtime + its render venv, ffmpeg-static, `researcher`). V2 depends on these at runtime. **Keep V1
launchable.** Any V1 hygiene cleanup (§ below) must not break the venvs V2 spawns.

### B5. Do NOT carry to V2
V1's hygiene debt (256 MB `.claude/worktrees/`, committed `.venv-omnivoice`), the README autonomy
oversell, and the adopt→revert thrashing pattern. V2 already avoids these (honest seams, typed contracts).

---

## Part C — Seam risks to fix (cheap, high-leverage)
1. **Hardcoded legacy path** — `legacyPaths.ts:9` `DEFAULT_LEGACY_ROOT = D:\SEOSONA AI\SEOSONA Video`.
   If V1 ever moves, V2 breaks unless `SEOSONA_LEGACY_ROOT` is set. Document/pin this dependency.
2. **V1 must stay runnable** — when cleaning V1 hygiene, **untrack `.venv-omnivoice` from git but do NOT
   delete the on-disk venv** (V2's render/TTS adapters spawn it).
3. **Live-gate tests excluded from V2's default run** — the green suite doesn't prove the Python engines
   work end-to-end. Add a CI job (or a documented manual gate) that runs the `*-live-gate` scripts
   against a present engine host before shipping.
4. **No CI in V2** — add a workflow: `tsc --noEmit` + `vitest run` + dependency-cruiser. V2 already has
   the green suite; it just isn't enforced.
5. **One-line red test** — re-export `mcpServer.ts` from `engines/src/index.ts` to make V2 100% green.

---

## Part D — Recommended sequence
1. **V2 quick wins (hours):** the mcpServer re-export (C5) → 100% green; add CI (C4); pin the legacy-root
   dependency (C1).
2. ~~Port native_composer's render recipe into V2~~ **— CORRECTED: do NOT.** V2 already has its own
   2,999-LOC native renderer + compositor/motion/sound layer; the motion/mix gap is an intentional
   Phase-E seam. Instead, keep native_composer as a **reference spec** for the V2 team's own Phase-E
   wiring. No code port.
3. ~~Close the loops in V2~~ **— these ARE V2's Phase 4-5 roadmap (qa=4, publish/analytics=5), already
   in progress.** Do not build ahead of the phase gates. V1 serves as the reference/cautionary spec for
   the V2 team when they reach each phase.
4. **V1 hygiene (safe, anytime):** prune worktrees, untrack the venv (keep on disk), commit-or-discard the
   273 untracked assets — without breaking the engine host.
5. **Keep V1 green as a host:** a smoke check that OmniVoice/PhoWhisper/native_composer still answer.

**Bottom line:** V2 is a genuinely strong rebuild that already reuses V1's proven engines the right way.
The remaining value in V1 is **craft knowledge** (render recipe + QA rubric) and **cautionary lessons**
(the 3 unclosed loops) — harvest those into V2, keep V1 runnable as the engine host, and don't carry
V1's hygiene/doc debt across.

---

*Generated by SEOSONA OS multi-agent analysis (V2 architecture + V2 health agents + the V1 audit),
synthesized 2026-07-23. Read-only; no V1 or V2 code was modified.*
