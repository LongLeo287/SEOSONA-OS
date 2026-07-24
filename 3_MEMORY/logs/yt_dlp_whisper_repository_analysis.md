# yt-dlp and Whisper Repository Analysis

Date: 2026-06-11

## Scope

This report analyzes temporary local clones of the upstream repositories:

- `3_MEMORY/ingestion_zone/repo_analysis/yt-dlp`
- `3_MEMORY/ingestion_zone/repo_analysis/openai-whisper`

The repositories are used only as local research inputs. They must not be staged, committed, pushed, or retained after assimilation.

## Applied UAP/KIP Flow

1. Analyze:
   - Temporarily cloned the upstream repositories into `3_MEMORY/ingestion_zone/repo_analysis/`.
   - Read package metadata, entrypoints, CLI options, architecture modules, tests, and risk-relevant options.
2. Review:
   - Compared capabilities against existing `youtube`, `media-processing`, and video content skills.
   - Identified the missing unified pipeline: source media -> metadata -> subtitles/audio -> Whisper transcript -> SEO/content/KI outputs.
3. Learn:
   - Stored distilled knowledge in `2_KNOWLEDGE/raw_data/multimedia_ingestion/yt_dlp_whisper_snapshot.md`.
   - Stored this repository analysis report in `3_MEMORY/logs/yt_dlp_whisper_repository_analysis.md`.
4. Upgrade:
   - Created `2_KNOWLEDGE/frameworks/multimedia_production/video_audio_ingestion/SKILL.md`.
   - Updated KI, Master Index, and Skills Router.
5. Validate:
   - Verified `npm run status`.
   - Verified `npm run git:check`.
   - Verified cloned repositories are outside normal Git status.
6. Cleanup:
   - Cloned repositories were deleted after this report was finalized.

## Clone Verification

- `yt-dlp/yt-dlp`
  - Commit: `e47691215f75fe7e9684080d17fadf340c9a8450`
  - Date: `2026-06-10 23:00:05 +0000`
  - Subject: `Fix allow-unsafe-ext compat option (#16920)`
- `openai/whisper`
  - Commit: `04f449b8a437f1bbd3dba5c9f826aca972e7709a`
  - Date: `2026-04-15 09:32:15 -0700`
  - Subject: `Pin pre-commit hook revisions to immutable commits (#2760)`

The temporary clone folder is ignored by Git, but ignore status is not enough. UAP cleanup requires the cloned repositories to be deleted after analysis.

## yt-dlp Architecture

yt-dlp is a Python CLI and library for media extraction and download.

Observed repository facts:

- Python requirement: `>=3.10`
- Console entrypoint: `yt-dlp = "yt_dlp:main"`
- Module directories observed: `compat`, `dependencies`, `downloader`, `extractor`, `networking`, `postprocessor`, `utils`, `__pyinstaller`
- Extractor Python files observed: 940
- Test files observed in the main test directory: 38

Key modules:

- `yt_dlp/__init__.py`: CLI orchestration, option conversion, postprocessor assembly, main entrypoint.
- `yt_dlp/options.py`: command-line option definitions and compatibility flags.
- `yt_dlp/YoutubeDL.py`: primary controller class for extracting info, downloading files, running hooks, and post-processing.
- `yt_dlp/extractor/`: site-specific extractors.
- `yt_dlp/downloader/`: HTTP, HLS, DASH, fragment, external downloader implementations.
- `yt_dlp/postprocessor/`: ffmpeg, metadata, chapter, thumbnail, SponsorBlock, exec, and file-move processors.
- `yt_dlp/networking/`: network request handlers.
- `yt_dlp/plugins.py`: plugin loading.

Primary execution flow:

1. Parse CLI/config options.
2. Build `YoutubeDL` parameter dictionary.
3. Load extractors and plugins.
4. Resolve URL metadata with an extractor.
5. Select formats and subtitles.
6. Download media or metadata.
7. Run postprocessors.
8. Move final files and write artifacts.

Integration value for SEOSONA:

- Metadata probing without media download.
- Subtitle extraction before ASR.
- Audio extraction for Whisper.
- Playlist/channel ingestion with archive state.
- Deterministic output templates for reproducible pipelines.
- Hook points for progress and postprocessing telemetry.

## yt-dlp Operational Risks

- `--write-info-json` can contain personal information and must be treated as sensitive.
- `--cookies` and `--cookies-from-browser` can expose session data and must only run with explicit user authorization.
- `--compat-options allow-unsafe-ext` can enable unsafe file extension behavior and must be disallowed in SEOSONA automation.
- `--compat-options allow-unsafe-exec-expansion` can enable remote code execution if template values enter shell commands unsafely.
- Extracted metadata, titles, subtitles, filenames, and URLs are untrusted input.
- Playlist URLs must require explicit playlist mode to avoid accidental bulk ingestion.

Recommended SEOSONA guardrails:

- Always use `--ignore-config` for reproducible automation.
- Use metadata-only probing first.
- Use `--download-archive` for repeated jobs.
- Disable unsafe compatibility options.
- Avoid `--exec` in automated ingestion.
- Sanitize output templates and never interpolate untrusted fields into shell commands.
- Keep raw downloaded media and cookies outside tracked Git paths.

## Whisper Architecture

OpenAI Whisper is a local speech recognition package with both CLI and Python API.

Observed repository facts:

- Python requirement: `>=3.8`
- Console entrypoint: `scripts.whisper = "whisper.transcribe:cli"`
- Requirement list observed: `numba`, `numpy`, `torch`, `tqdm`, `more-itertools`, `tiktoken`, Linux x86_64 `triton>=2.0.0`
- Core module files observed: `audio.py`, `decoding.py`, `model.py`, `timing.py`, `tokenizer.py`, `transcribe.py`, `triton_ops.py`, `utils.py`, `version.py`, `__init__.py`, `__main__.py`
- Test files observed: 5

Key modules:

- `whisper/__init__.py`: model registry, model download/cache, `available_models()`, `load_model()`.
- `whisper/audio.py`: ffmpeg-backed audio loading and log-mel spectrogram generation.
- `whisper/transcribe.py`: high-level transcription loop, CLI, output writer orchestration.
- `whisper/decoding.py`: decoding options, beam/sampling behavior, token decoding.
- `whisper/timing.py`: word timestamp alignment.
- `whisper/tokenizer.py`: multilingual tokenizer.
- `whisper/utils.py`: output writers for TXT, VTT, SRT, TSV, and JSON.
- `whisper/normalizers/`: text normalization.

Primary execution flow:

1. Load audio through ffmpeg.
2. Resample to Whisper sample rate and convert to mono waveform.
3. Build log-mel spectrogram.
4. Detect or set language.
5. Decode audio windows into text segments.
6. Optionally align word timestamps.
7. Write transcript formats.

Integration value for SEOSONA:

- Offline transcript generation for audio/video assets.
- JSON segment outputs for knowledge indexing.
- SRT/VTT outputs for subtitle workflows.
- Word-level timestamping for clip, chapter, and highlight workflows.
- Translation to English with multilingual models.

## Whisper Operational Risks

- Requires `ffmpeg` in PATH.
- Model downloads can be large and should use a controlled model cache.
- CPU-only inference can be slow.
- `turbo` is good for fast transcription but not for translation-quality workflows.
- Word timestamps are useful but should be treated as approximate.
- Repetition and hallucination can happen on silence or difficult audio.

Recommended SEOSONA guardrails:

- Use `turbo` for fast same-language transcription.
- Use `medium`, `large`, or `large-v3` for translation workflows.
- Set `--language` when known.
- Use `--output_format all` when downstream SEO, subtitle, and indexing tasks all need artifacts.
- Use `--condition_on_previous_text False` when repetition or drift appears.
- Use `--word_timestamps True` only when timing precision is needed.
- Store model cache outside Git-tracked paths.

## Combined SEOSONA Workflow

Recommended pipeline:

1. Source intake:
   - Validate user authorization and content rights.
   - Store source URL and intended use.
2. Metadata probe:
   - Use yt-dlp metadata-only mode.
   - Inspect duration, language hints, uploader, title, description, chapters, and available subtitles.
3. Subtitle preference:
   - Prefer human captions.
   - Fall back to auto captions.
   - Use Whisper when captions are missing, poor, or source audio is user-provided.
4. Audio extraction:
   - Use yt-dlp and ffmpeg to create Whisper-friendly audio.
5. Transcription:
   - Generate TXT, JSON, SRT, VTT, and TSV.
6. Knowledge processing:
   - Create timestamped notes.
   - Extract entities, keywords, FAQ candidates, chapters, social snippets, and SEO brief.
7. Storage:
   - Keep raw clone/media/cache private and ignored.
   - Commit only distilled knowledge, skill docs, connectors, and safe metadata.

## Implementation Recommendation

Add a future connector script such as `1_CORE/scripts/connectors/media_ingestion_connector.py` with:

- `probe URL`
- `download-audio URL`
- `transcribe FILE`
- `ingest URL`
- `seo-brief TRANSCRIPT_JSON`

The connector should call tools through structured subprocess argument arrays, never shell-built strings.

## Verification Notes

- Temporary clones were created in `3_MEMORY/ingestion_zone/repo_analysis/`.
- Temporary clones were refreshed to remote HEAD before analysis.
- SEOSONA router already includes `seosona:video-audio-ingestion`.
- Final validation confirmed `5_RESEARCH/repositories/` does not exist.
- Final validation confirmed `3_MEMORY/ingestion_zone/repo_analysis/` does not exist after cleanup.

TASK COMPLETED
