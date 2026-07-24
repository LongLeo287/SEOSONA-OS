# 📁 Project Memory: seosona-video

**[English]**
Isolated memory namespace for the **SEOSONA Video** project — the autonomous Vietnamese
multimedia production factory (Python + FFmpeg + Whisper/PhoWhisper + VieNeu-TTS, rendered
via HyperFrames). Holds contextual state, logs, decisions, audits, and memory nodes.

**[Tiếng Việt]**
Vùng bộ nhớ cách ly cho dự án **SEOSONA Video** — nhà máy sản xuất đa phương tiện tiếng Việt
tự động. Lưu trạng thái ngữ cảnh, nhật ký, quyết định, audit.

## 🗂️ Layout
- `audits/` · `changelog/events.jsonl` · `decisions/` · `issues/` · `knowledge_items/` · `test-runs/`

## 🔗 Connection
- Manifest: `seosona.project.json` · Namespace: `seosona-video` · Autonomy: `project_edit`
- OS anchor: `~/.seosona` · Health: `npm run seosona:resolve` / `npm run seosona:doctor`

> ⚠️ This namespace lives in the SEOSONA OS repo. If you run `git clean`/reset in the OS repo,
> commit this folder first or it will be wiped (it was, once, on 2026-06-25 — then restored).
