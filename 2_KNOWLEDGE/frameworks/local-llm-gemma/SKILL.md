---
name: local-llm-gemma
description: "Self-hosted multimodal LLM option for SEOSONA — Google Gemma 4 31B-it (~30.7B, text+image in, 256K context, 140+ languages incl. Vietnamese, Dense + MoE). Use when routing high-volume / data-private / no-per-token tasks off hosted models, or as a local translation backend for both the OS and the Video localize/dub + koharu pipelines. Runs via vLLM/Ollama/Transformers; GGUF/NVFP4 quants exist."
license: Apache-2.0 reported — VERIFY the repo LICENSE (Gemma weights usually ship under Google's Gemma Terms of Use) before commercial use
metadata:
  type: local-llm
  source: https://huggingface.co/google/gemma-4-31B-it
  wire_into: the LLM router (4_BRAIN/llm_engine.py on Video; OS llm layer)
---

# Gemma 4 31B-it — self-hosted multimodal LLM

Google Gemma 4 31B instruction-tuned: multimodal (text+image→text), 256K context,
140+ languages **including Vietnamese**, Dense + MoE variants. Strong local option vs.
the current hosted-LLM lean.

## Why adopt
- **Local + private + no per-token cost** for high-volume agent/translation work.
- **Vietnamese-capable** → can serve as the translation backend for SEOSONA Video's
  `translator/translate_router.py` (LLM tier) AND as **koharu's** local translation hook —
  one model, multiple consumers.
- Multimodal → image understanding for OS agents.

## Integration action
1. Stand up a quantized 31B (NVFP4 or GGUF) via **vLLM/Ollama**.
2. Add it as a selectable engine behind the existing LLM router (OS) and
   `SEOSONA_TRANSLATOR`/`llm_engine` (Video) — benchmark Vietnamese translation vs the
   current hosted model before cutover.
3. **⚠️ Confirm the LICENSE file first** — Gemma weights normally ship under Google's
   Gemma Terms of Use, not pure Apache-2.0; clear commercial use before relying on it.
