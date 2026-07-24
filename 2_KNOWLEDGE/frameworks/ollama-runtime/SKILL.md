---
name: ollama-runtime
description: "Local LLM runtime (ollama/ollama, MIT, 175k★) — runs open models (Gemma, Llama, Qwen) locally via a REST API on :11434. This is the RUNTIME that powers SEOSONA's local-LLM/gemma translation engine (SEOSONA_TRANSLATOR=ollama) and any self-hosted, private, no-per-token agent task. Use when standing up or hardening local inference."
license: MIT
metadata:
  type: llm-runtime
  source: https://github.com/ollama/ollama
  powers: SEOSONA_TRANSLATOR=ollama (Video translate_router) + local LLM tasks
---

# Ollama — the local LLM runtime (gemma dependency)

[ollama/ollama](https://github.com/ollama/ollama) (MIT, 175k★). Runs open LLMs locally
behind a REST API (`http://localhost:11434/api/generate`). This is NOT just a candidate —
it is the **runtime SEOSONA already depends on**: the `ollama` engine in Video's
`translate_router.py` and the `local-llm-gemma` adoption both call it.

## Setup (prerequisite for the local-LLM path)
```bash
# install ollama (ollama.com), then:
ollama pull gemma3            # or the model in SEOSONA_OLLAMA_MODEL
ollama serve                  # serves on :11434
```
Then `SEOSONA_TRANSLATOR=ollama` (Video) routes translation through local Gemma.

## Hardening (recommended)
- Health-check `:11434` before dispatch (the router already degrades gracefully on failure).
- Pin a minimum Ollama version; document the `ollama pull <model>` prerequisite in deploy.
- Reuse it as the local backend for koharu's translation hook too (one runtime, many consumers).

> Confirmed dependency from the full 1,434-repo triage (Tier-C, under-ranked by the inventory
> because it's general-purpose — but it's load-bearing for SEOSONA's local-LLM features).
