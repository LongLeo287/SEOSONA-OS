# SEOSONA Video (Python Factory) — Full Audit Report

**Date:** 2026-07-23 · **Auditor:** SEOSONA OS (5 parallel analysis agents + synthesis)
**Target:** `D:\SEOSONA AI\SEOSONA Video` · remote `LongLeo287/SEOSONA-Video-AI`
**Scope:** 2,215 tracked files · 267 Python files (~40k LOC) · 995 markdown · 75 test files
**Method:** read-only. Architecture, code health, tests/CI, security, and git/history/docs audited in
parallel by isolated agents, cross-verified against source. Nothing was edited during the audit.

---

## 0. Executive summary

SEOSONA Video is a **genuinely functional, actively-built, single-author autonomous Vietnamese
video-production factory**. It really does turn a topic/URL into a finished branded MP4 (voice +
karaoke captions + animated HyperFrames graphics + ducked BGM) with no human in the loop — the prior
internal audit measured 28/30 successful renders scoring 92–100. The engineering fundamentals are
**better than typical for a 5-week-old repo**: 323 hermetic tests pass in ~2s, security posture is
clean (no committed secrets, injection mitigated with a regression test), and the two 2026-07-14
"one engine each" consolidations were applied cleanly with no live orphan code.

> **UPDATE (2026-07-23, post-audit, user-confirmed):** the direction is decided. `seosona-video-os`
> is **SEOSONA Video AI V2**, a fresh JS/TS rebuild of the *orchestration layer*. Per V2's own README,
> **this Python repo (V1) is NOT discarded — it is V2's read-only "ENGINE HOST"**: V2 invokes V1's
> proven engines (OmniVoice voice router, PhoWhisper ASR router, ffmpeg-static, researcher.py) through
> adapters and never writes into it. So the framing below shifts from "decide V1's fate" to **"keep V1
> runnable as the engine host, harvest orchestration/QA lessons into V2."** §1 and §8-P0 are updated
> to reflect this.

The problems are **not correctness — they are focus and hygiene**:
1. V1 is now the **engine host under V2** (`seosona-video-os`). Its engines must stay runnable; its
   orchestration/QA layers are what V2 rebuilds. See §1.
2. Recent work is **thrashing** (adopt→revert cycles on ASR engines) rather than closing the three
   strategic blockers the 2026-07-11 audit already named — all **still open**.
3. **Repo hygiene debt**: a checked-in `.venv-omnivoice` (torch/CUDA) and ~600 stale duplicate files
   in `.claude/worktrees/` (256 MB) dominate the repo size; 273 untracked binary assets.

**Overall health: B / "solid engine, unresolved direction."** Nothing is broken; the risk is that a
large, working system is being neither finished nor cleanly retired.

| Dimension | Grade | One-line |
|---|---|---|
| Architecture | A− | Clean two-halves design, real local-first pipeline, sensible chokepoints |
| Correctness / tests | A− | 323 tests pass, real regression coverage — but render path untested |
| Security | A | No committed secrets, real secrets manager, injection mitigated+tested |
| Code health | B | Consolidations clean; debt is hygiene (worktrees, committed venv) not bugs |
| Activity / focus | C+ | Active but thrashing; prior audit's 3 blockers still open 2 weeks later |
| Docs accuracy | B− | Structure accurate; autonomy/publishing claims oversold |
| Strategic clarity | C | Coexists with a newer JS rewrite; role undecided |

---

## 1. Ecosystem context — the decision that frames the rest

There are **two Video repos** on disk, and they are different products:

| | **SEOSONA Video** (this audit) | **seosona-video-os** |
|---|---|---|
| Started | 2026-06-19 | **2026-07-15** (~1 month newer) |
| Stack | Python factory (267 py / 39 js) | JS/TS studio app (6 py / 386 js) |
| Commits | 169 | 160 (all within ~8 days) |
| Remote | `SEOSONA-Video-AI` | none (local only) |
| Has the ASR/TTS/render pipeline | **Yes** (`2_SKILLS`, `4_BRAIN`) | No `srt_maker` at all |

**Resolved (user-confirmed):** V2 (`seosona-video-os`) is a **fresh rebuild of the orchestration
layer**, and V1 (this repo) is its **read-only ENGINE HOST**. V2's README is explicit: it invokes
V1's Python engines through adapters and "nothing here ever writes into the legacy repo." So this is
not a repo to retire — it is a **live runtime dependency of V2**.

**What that means for V1:**
- **Keep runnable, don't freeze/delete.** The engines V2 calls (OmniVoice `voice_router`, PhoWhisper
  `asr_router`, ffmpeg-static, `researcher.py`) must keep working. Repo hygiene (§8-P2) is still worth
  doing, but "archive and forget" is wrong.
- **Harvest the orchestration/QA layer, not the engines.** V2 is rebuilding routing/QA/pipeline in
  typed TS. The valuable transfer is the *lessons* baked into V1's `4_BRAIN` (native_composer render
  recipe, quality_scorer, the craft rules) and the three open blockers below — so V2 doesn't re-open
  them. A dedicated V1→V2 harvest map is the right next artifact.
- **The session's ASR fixes live here** (branch `session/audit-and-shared-brain-2026-07-23`, tag
  `v1-preaudit-2026-07-23`) — preserved off the detached HEAD so they aren't lost.

---

## 2. Architecture & pipeline

**Purpose.** Autonomous VN video factory: topic / website / YouTube URL / existing MP4+SRT →
finished branded MP4 + thumbnail + QA score. Organized as **two halves in one codebase**
(`ARCHITECTURE.md:7-28`): *the System* (ingestion, agents, memory, routing, dashboards) and *the
Factory* (render pipeline). Design bias is **local/keyless**; paid cloud is gated behind explicit keys.

**Pipeline (verified, stage → module):**
- **Entry/route** — `4_BRAIN/video_engine.py` `run_pipeline()`; input auto-detect (`:56-80`) →
  create / scrape / download / repurpose. Dispatch in `4_BRAIN/workflow_router.py:55`.
- **Script/content** — `4_BRAIN/scene_composer.py`, `scene_writer.py`, `script_writer.py`; VN quality
  gate `news_video_standards.py`.
- **Voice/TTS** — `2_SKILLS/voice_cloner/voice_router.py:20` → `omnivoice_engine.py` (OmniVoice, local,
  isolated `.venv-omnivoice`). Single engine, returns `None` on failure (no fake audio).
- **ASR/captions** — `2_SKILLS/srt_maker/asr_router.py` → PhoWhisper CT2 (faster-whisper) primary +
  generic faster-whisper backup; word-level timing; segmentation in `whisper_engine.py`.
- **Render/mix** — `4_BRAIN/native_composer.py` builds a HyperFrames composition, renders via Node CLI
  subprocess (`:2943-2961`), then ffmpeg mixes voice + sidechain-ducked BGM + SFX with loudnorm.
- **Output** — `8_WORKSPACE/` MP4/SRT/PNG; thumbnail `2_SKILLS/thumbnail_maker/`; QA `quality_scorer.py`.

**Render backends.** Primary **HyperFrames 0.7.24** (headless-Chrome, optional NVENC) + **ffmpeg-static**
for all mux/mix — both local. **Seedance 2.0** (`4_BRAIN/seedance_engine.py`) is opt-in cloud via
fal.ai/Replicate but **not wired into the main router**; the first-party BytePlus adapter is a labeled
stub; the local **LTX-Video** lane was removed 2026-07-14.

**Entry points** — `npm run` via `scripts/seosona-python.cjs`: `video:run`, `make:video`, `video:news`,
`thumbnail:create`; autonomy loops `start:queue`, `daily`, `factory`.

*Honest flag:* implemented & wired = HyperFrames, OmniVoice, PhoWhisper, ffmpeg, yt-dlp, thumbnail,
QA gate. Aspirational/standalone = Seedance cloud (not in default path). README capability counts
("7 skills / 10 agents") are marketing framing, not literal.

---

## 3. Code health & tech debt

**Consolidations are clean.** The 2026-07-14 single-engine decisions are consistently applied in
docstring **and** code — no live orphan imports:
- `asr_router.py` lists only `phowhisper` + `faster_whisper` (both pip-backed). sherpa/openai_whisper
  refs removed; only a "do NOT re-add" note remains (`:12-15`). *(This is the state after this
  session's fix `f52fb49`.)*
- `voice_router.py` imports only `omnivoice_engine`; VieNeu/F5/edge-tts references are comments only.
- `seedance_engine.py` — LTX lane cleanly excised.

**Markers are low for ~40k LOC:** 26 TODO, 3 REMOVED, 2 XXX, 2 FIXME, 1 HACK in code. The scary raw
counts (123 LEGACY / 39 DEPRECATED) are almost entirely in `2_KNOWLEDGE/` and docs, **not code**.

**The real debt is hygiene, not bugs:**
- **`.claude/worktrees/` — ~600 stale `.py` (2.3× the live tree), 256 MB.** Four worktrees frozen
  Jun 30–Jul 11 still contain the *deleted* engines (`vieneu_engine.py`, `sherpa_vn_engine.py`, old
  `whisper_engine`). Every orphan-grep hit outside the historical harness lives here. → `git worktree prune`.
- **Committed venv:** `7_ASSETS/voice/.venv-omnivoice/Lib/site-packages/` (torch/pandas/scipy) is in
  git — dominates repo size. → move to `.gitignore`, untrack.
- **One real orphan:** `scripts/bench_asr_tts_vi.py:114` `from vieneu import Vieneu` (module gone) —
  will crash if invoked, but is a labeled `HISTORICAL HARNESS`. Low priority; delete or fix.

**Complexity hotspot:** `4_BRAIN/native_composer.py` — **3,277 LOC, 54 top-level defs** (render
orchestration + SFX tables + ffmpeg graphs + verification). The maintenance risk; a decomposition
candidate. Runners-up: `llm_engine.py` (1,175), `talking_head_edit.py` (1,026), `make_video.py` (991).

---

## 4. Tests & CI

- **75 test files, 384 tests** (`unittest`-style; pytest is only the runner). `tests/` holds 323;
  the rest are domain-skill tooling tests.
- **Full run: `323 passed in 2.16s`, 0 fail / 0 error / 0 skip.** 562 assert lines. Tests are
  **hermetic** — engines/models monkeypatched, no real TTS/ASR/ffmpeg — and are **real regression
  tests** (each docstring pins the exact bug, e.g. ASR `_collect_fw` must drop one `None`-timestamp
  word not the whole transcript; voice router must degrade a raising engine to `None`). Not stubs.
- **CI** (`.github/workflows/ci.yml`, py3.11): `py_compile` gate + `pytest tests/ -q`. Meaningful but
  narrow — **no lint, no coverage, no type-check**, and project deps install with `|| true`, so a
  broken heavy-dep import **degrades to a skip instead of a red build** (CI can pass while the render
  pipeline is broken).
- **Biggest untested risk:** the **actual render/encode path** (node/HyperFrames → ffmpeg → mux) — the
  factory's core value — has **no automated coverage**; only the pure planner surface is tested. Real
  model inference (Whisper/OmniVoice) is stub-tested only. `packages/cli` has no tests.

---

## 5. Security & dependencies

**Posture: clean (A).**
- **No committed secrets.** Format scans (`AIza`, `sk-`, `ghp_`, `AKIA`, `xoxb`, PEM…) across tracked
  files and light history = zero. `.env` and `1_CONFIG/.env` are correctly gitignored (`.gitignore:32`);
  only empty `*.example.json` templates are tracked.
- **Real secrets manager** `1_CONFIG/credentials_manager.py` (env → `credentials/<platform>.json` →
  None; never crashes). Integrations: OpenAI, Gemini (rotated keys), Anthropic, Z.ai, NVIDIA NIM,
  Ollama, Pexels/Pixabay, Firecrawl/Crawl4AI/Browserbase, HF/GitHub, YouTube/TikTok/FB/GDrive,
  Telegram, AWS, PageSpeed. File+env based (reasonable at this scale; no KMS/Vault).
- **Command injection mitigated:** the 4 `shell=True` sites in `9_DASHBOARD/server.py` use fixed
  arg-lists or a `re.fullmatch` allowlist + `..` rejection, with a regression test
  (`tests/test_dashboard_preview_security.py`). No `os.system`/`eval`/`pickle.load`/unsafe `yaml.load`.
- **Two non-critical actionables:**
  1. **`underthesea >= 6.8.0` is GPL-3.0** (core reqs) — a genuine copyleft concern for a commercial
     product; needs a licensing decision. *(Note: this is the same VN NLP lib used for TTS text
     front-end; if it's a problem, a permissive tokenizer would be needed.)*
  2. **Core `requirements.txt` uses unpinned `>=` floors** — reproducibility risk (the heavy
     `omnivoice.txt` IS fully pinned, incl. `torch==2.8.0+cu128`, and carries `wandb`/`sentry-sdk`
     telemetry deps worth noting).
- **SSRF:** operator/CLI-driven scrapers (`scraper_agent`, `image_sourcer`, `discovery.py`) fetch
  arbitrary URLs with no private-IP allowlist. Low risk (not remote-exposed), but no egress filter if
  a URL ever comes from untrusted content.
- **WhisperX CC-BY-NC:** *not* a dependency (absent from all requirements); only a stale code comment
  in `scripts/course_video.py:384`. No license exposure.

---

## 6. Activity, history & prior-audit status

- **169 commits, 100% "SEOSONA Bot"** (autonomous single identity), entire history ~5 weeks
  (2026-06-19 → today), 141 commits/30d — **very active but single-author**.
- **Thrashing signal:** the last ~15 commits are dominated by **adopt→revert pairs** (WhisperX
  cd439fe→8804f27; shared-brain MCP efaafea→ebbe5f2) and ASR-engine churn — experimentation, not
  steady feature delivery.
- **Heat map:** HOT = `2_SKILLS`, `4_BRAIN` (today/this week). COLD/frozen at 2026-07-08 = `1_AGENTS`,
  `6_SOP`, `docs/`, `5_FRAMEWORK`. The render brain + ASR/voice are the live front; agents/SOPs/docs
  are two weeks stale.
- **Prior audit (`audit_video_factory_20260711_1958/`, 2026-07-11)** verdict: *"the factory is not
  broken — it demonstrably produces valid videos"* (28/30 renders, 92–100). It named **three
  blockers, ALL STILL OPEN today:**
  1. **Open feedback loop** — `1_AGENTS/analytics_feedback_agent/performance_ingest.py:41-49` still
     `return None  # TODO: wire YouTube Analytics`. Publishing has only ever run dry-run.
  2. **Lenient/self-referential QA gate** — `4_BRAIN/quality_scorer.py` still has no WPM band logic
     (narration measured 212–228 WPM vs 130–180 healthy).
  3. **Premium engines built but unwired** — talking-head / LTX / Seedance b-roll not in the auto path.

  Post-audit effort went to **maintenance/ASR churn, not these strategic fixes.**
- **Working tree is dirty** (daemon self-edits: ~40 modified, staged deletions of already-removed
  engines) + **273 untracked binary assets** (fonts, brand SVGs, mascot PNGs). No single huge file,
  but a lot of unversioned binaries. *(The dirty state is pre-existing daemon behavior, not this audit.)*

---

## 7. Docs accuracy

- **Accurate:** the tier 0→9 directory map, HyperFrames engine, Flask dashboard, and the `4_BRAIN`
  render chokepoint all match reality (`STRUCTURE.md`).
- **Oversold:** README bills a "100% autonomous" factory that *publishes to YouTube/TikTok and learns*
  — but publishing is dry-run only and analytics ingest returns `None`. Capability/status claims are
  aspirational; structural docs are trustworthy. Fixed counts ("7 skills") froze 2026-07-08 while the
  skills changed after.

---

## 8. Prioritized recommendations

**P0 — Direction is decided: V1 = engine host for V2. Act on that.**
- Do NOT retire/freeze V1 — V2 depends on its engines at runtime. Instead: (a) verify the exact
  engines V2 invokes (voice_router, asr_router, ffmpeg, researcher) stay green, (b) build the
  **V1→V2 harvest map** (which orchestration/QA logic to port to V2, which engines to leave in V1),
  (c) point new *orchestration* work at V2, keep V1 changes limited to engine stability + the harvest.

**P1 — Close the loop the prior audit scoped — decide per layer whether it belongs in V1 or V2.**
The 3 blockers below are orchestration/QA concerns → likely V2's job to build correctly this time,
using V1 as the cautionary reference. Don't rebuild them in V1 unless V1 must ship independently.
- Implement analytics ingest (`performance_ingest.py`) or explicitly mark the loop open in the README
  (stop claiming "learns"). Honesty first.
- Add the WPM/craft band to `quality_scorer.py` (the named HIGH-1 fix).
- Either wire the premium engines (talking-head/Seedance b-roll) into the auto path or document them
  as manual-only — remove the "built but unwired" ambiguity.

**P2 — Hygiene (do regardless, cheap, big size win).**
- `git worktree prune` + remove the 4 stale worktrees (256 MB, 600 dup files with deleted engines).
- Untrack `7_ASSETS/voice/.venv-omnivoice/` → `.gitignore`.
- Commit or discard the 273 untracked assets deliberately (don't let the daemon leave them floating).
- Delete or fix the one real orphan `scripts/bench_asr_tts_vi.py`.

**P3 — Quality hardening.**
- CI: drop `|| true` on core deps (or split a "lite" test job that must be green), add lint; consider
  one smoke test that renders a 2-second clip end-to-end (covers the untested core).
- Pin core `requirements.txt`.
- Make the licensing call on `underthesea` (GPL-3.0).
- Plan a decomposition of `native_composer.py` (3,277 LOC) if the repo lives on.

---

## 9. Bottom line

This is a **capable, well-tested, secure system that actually ships videos** — impressive for five
weeks of autonomous single-author work. It is **not failing; it is undirected.** The engineering
quality (tests, security, clean consolidations) is real; the liabilities are a possible strategic
pivot to a newer repo, a prior audit whose three real fixes were never landed, and accumulated repo
hygiene. **Make the §1 call first** — every other recommendation's value depends on whether this
factory is the future or the foundation being harvested.

---

*Generated by SEOSONA OS multi-agent audit (architecture · code-health · tests/CI · security ·
history/docs), synthesized 2026-07-23. All findings verified against source; read-only.*
