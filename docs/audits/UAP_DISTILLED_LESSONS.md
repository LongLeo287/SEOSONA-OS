# UAP distilled lessons — patterns worth learning from repos we did NOT adopt

Reference ≠ dead storage. A repo can be redundant/heavy/license-incompatible (so we don't vendor its
code) yet still teach a **pattern** worth applying to our own systems. This file distills those
patterns into actionable roadmap notes, each routed to the system it informs. Source KIs are in
`3_MEMORY/knowledge_items/` (queryable via the `seosona-knowledge` MCP).

---

## OS — memory retrieval (from MemMachine, mem0)

**What they do:** MemMachine layers memory into **episodic / profile / working** tiers and retrieves
with a **hybrid** of dense vectors (pgvector) + graph (Neo4j) + lexical (BM25). mem0 does similar
tiered add/search with scoring.

**Our reality:** OS retrieval is TF-IDF cosine (`core/vector_memory.py`) OR the codebase-memory graph
— two separate, un-fused signals. TF-IDF alone is lexical-ish; it misses paraphrase.

**Actionable (do NOT dump the stack — just the pattern):**
- Add **BM25 + reciprocal-rank fusion** on top of the existing TF-IDF index — cheap (rank-bm25 is a
  pure-Python dep), no embedding model, and closes most of the paraphrase gap.
- Treat the codebase-memory graph as the "graph tier" already present; fuse its hits with KI hits at
  query time rather than keeping them siloed.
- Only consider dense embeddings (the heavier MemMachine path) if BM25+TF-IDF fusion proves
  insufficient — matches the frugality doctrine.

## SEOSONA Video — ASR front/back stages (from audio.cpp, whisperX analysis)

**What they do:** audio.cpp runs **VAD + speech-enhancement as pre-ASR stages** and supports
**streaming** transcription; whisperX adds **forced alignment** (wav2vec2) for tighter word times.

**Our reality:** Video ASR is single-engine PhoWhisper (word_timestamps native). No VAD pre-pass, no
streaming, no separate enhancement.

**Actionable:**
- If long/noisy footage hurts WER, add a **VAD pre-segmentation** stage (silero-vad, permissive
  license) before PhoWhisper — cheaper and license-clean, no C++ build.
- Streaming ASR only if a live-caption use case appears; not now.
- **Do NOT** use whisperX's forced aligner — its VN alignment model is **CC-BY-NC** (non-commercial).
  If tighter alignment is ever needed, use a permissively-licensed aligner.

## SEOSONA Workflow (Flow) — explainer pipeline shape (from vox-* skills)

**What they do:** the Vox paper-collage skills run a fixed **stage pipeline**:
`script → keyframe (collage) → motion graphics → voice → music → captions`.

**Our reality:** Flow's stickman explainer has its own WorkflowExecutor; different visual style, but
the **stage decomposition** is the transferable idea.

**Actionable:** treat the 6-stage shape as a **template** for any new explainer style — each stage a
swappable module (keyframe generator, motion, TTS, music, caption). The cloud image APIs the vox
skills use (Muapi/Atlas) are the part to skip; the stage contract is the part to keep.

## OS — pentest/recon (from Aliens_eye)

**What it does:** async **fan-out username OSINT** across 800+ platforms (aiohttp concurrency).

**Actionable:** a pointer/pattern for the `penetration-tester` persona toolkit — async fan-out recon
over a platform list. Reference only (authorized testing); nothing vendored.

---

*Generated 2026-07-23 from the 4 user-added repos + the 15-repo Ollama batch. These are roadmap
notes, not committed work — each fires only when its use case actually appears.*
