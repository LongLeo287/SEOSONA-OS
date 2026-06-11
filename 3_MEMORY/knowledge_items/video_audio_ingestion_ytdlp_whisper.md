---
type: knowledge_item
domain: multimedia_ingestion
status: active
created_at: 2026-06-11
sources:
  - 2_KNOWLEDGE/raw_data/multimedia_ingestion/yt_dlp_whisper_snapshot.md
  - 2_KNOWLEDGE/frameworks/multimedia_production/video_audio_ingestion/SKILL.md
  - 3_MEMORY/logs/yt_dlp_whisper_repository_analysis.md
---

# KI: Video Audio Ingestion with yt-dlp and Whisper

SEOSONA OS now has a native workflow for compliant video/audio ingestion:

1. Probe metadata with `yt-dlp --dump-single-json`.
2. Prefer subtitles before ASR when captions exist.
3. Extract audio through `yt-dlp` and `ffmpeg`.
4. Transcribe or translate with OpenAI Whisper.
5. Emit transcript, subtitle, JSON segment, SEO brief, and knowledge-index artifacts.

## Tool Baseline

- `yt-dlp` reference commit: `e47691215f75fe7e9684080d17fadf340c9a8450`.
- `openai-whisper` reference commit: `04f449b8a437f1bbd3dba5c9f826aca972e7709a`.
- Skill path: `2_KNOWLEDGE/frameworks/multimedia_production/video_audio_ingestion/`.
- Raw snapshot path: `2_KNOWLEDGE/raw_data/multimedia_ingestion/yt_dlp_whisper_snapshot.md`.
- Repository analysis report: `3_MEMORY/logs/yt_dlp_whisper_repository_analysis.md`.

## Routing Terms

Use this KI for:

- video download
- YouTube transcript
- audio transcription
- Whisper
- yt-dlp
- subtitle extraction
- speech-to-text
- video-to-blog
- media-to-SEO brief
- podcast ingestion

## Operational Rule

Always run a compliance and rights check before downloading media. For unknown URLs, start with metadata-only probing. For playlists or channels, require explicit playlist intent and use a download archive.

Temporary upstream clones are analysis buffers only. After extracting knowledge, delete the cloned repositories and keep only distilled SEOSONA artifacts.
