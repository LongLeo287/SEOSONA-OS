---
source_type: repository_ingestion
domain: multimedia_ingestion
repositories:
  - name: yt-dlp
    url: https://github.com/yt-dlp/yt-dlp
    ingestion_mode: temporary_clone_deleted_after_analysis
    commit: e47691215f75fe7e9684080d17fadf340c9a8450
    commit_date: 2026-06-10 23:00:05 +0000
    license: Unlicense
  - name: openai-whisper
    url: https://github.com/openai/whisper
    ingestion_mode: temporary_clone_deleted_after_analysis
    commit: 04f449b8a437f1bbd3dba5c9f826aca972e7709a
    commit_date: 2026-04-15 09:32:15 -0700
    license: MIT
ingested_at: 2026-06-11
---

# yt-dlp + OpenAI Whisper Repository Snapshot

## Purpose

This snapshot records the operational knowledge extracted from the public `yt-dlp/yt-dlp` and `openai/whisper` repositories for SEOSONA OS multimedia ingestion workflows.

The upstream repositories were cloned only as temporary analysis inputs. The cloned repositories are not system artifacts and must be deleted after assimilation.

The intended workflow is:

1. Fetch media and metadata with `yt-dlp`.
2. Preserve source metadata, subtitles, and download archives for idempotence.
3. Extract or normalize audio with `ffmpeg`.
4. Transcribe or translate speech with OpenAI Whisper.
5. Emit transcript artifacts for SEO, content repurposing, chaptering, subtitles, and knowledge indexing.

## yt-dlp Operational Notes

- Package: `yt-dlp`
- Python requirement: `>=3.10`
- Console entrypoint: `yt-dlp = "yt_dlp:main"`
- Core role: feature-rich command-line audio/video downloader.
- Default install has no mandatory runtime dependencies in `pyproject.toml`; optional feature groups add packages such as `brotli`, `certifi`, `mutagen`, `pycryptodomex`, `requests`, `urllib3`, `websockets`, and `yt-dlp-ejs`.
- It supports CLI mode, Python integration through `YoutubeDL`, extractor plugins, postprocessor plugins, output templates, archive files, subtitles, metadata JSON, cookies/authentication, and format selection.
- Important ingestion options:
  - `--download-archive FILE`: make playlist/channel jobs idempotent and avoid reprocessing.
  - `--write-info-json`: persist source metadata, with privacy caution because metadata can contain personal information.
  - `--write-subs` and `--write-auto-subs`: capture human or generated subtitles when available.
  - `--sub-langs LANGS`: constrain subtitle languages.
  - `-x` / `--extract-audio`: convert to audio-only output through ffmpeg.
  - `--audio-format FORMAT`: normalize audio format when extracting.
  - `-f` / `--format`: select media format.
  - `-S` / `--format-sort`: express quality, codec, and size preferences.
  - `--paths` and `-o`: control output paths and naming templates.
  - `--ignore-config`: avoid accidental global config influence in reproducible automation.
  - `--no-playlist` or playlist-aware archive rules: prevent accidental bulk ingestion.
- Security note: avoid unsafe `--exec` patterns and do not enable compatibility options that relax shell-escaping restrictions. Treat downloaded metadata and filenames as untrusted input.
- Compliance note: only ingest content when the user has rights, permission, or a lawful basis. Store source URL, title, channel, date, and chosen reason for ingestion.

## Whisper Operational Notes

- Package: `openai-whisper`
- Python requirement: `>=3.8`
- Console entrypoint: `whisper = "whisper.transcribe:cli"`
- Dependencies: `more-itertools`, `numba`, `numpy`, `tiktoken`, `torch`, `tqdm`, and Linux x86_64 `triton>=2`.
- System dependency: `ffmpeg`.
- Default CLI model: `turbo`.
- Available model families include `tiny`, `base`, `small`, `medium`, `large`, `large-v1`, `large-v2`, `large-v3`, `large-v3-turbo`, and `turbo`, plus English-only `.en` variants for smaller models.
- Important transcription options:
  - `--model`: choose speed/accuracy tradeoff.
  - `--model_dir`: control model cache location.
  - `--device`: select `cuda` or `cpu`.
  - `--output_dir`: write transcript outputs to a controlled directory.
  - `--output_format`: choose `txt`, `vtt`, `srt`, `tsv`, `json`, or `all`.
  - `--task`: `transcribe` for same-language recognition or `translate` for speech-to-English.
  - `--language`: specify language or allow detection.
  - `--word_timestamps`: enable word-level timing when needed.
  - `--condition_on_previous_text False`: useful when repeated loops or timestamp drift appear.
  - `--hallucination_silence_threshold`: useful with word timestamps to skip long silent periods when hallucination is suspected.
  - `--threads`: tune CPU inference.
- Translation note: `turbo` is not trained for translation tasks; use multilingual models such as `medium`, `large`, or `large-v3` for speech-to-English translation.
- Quality note: capture JSON output for downstream confidence checks, segment timing, hallucination detection, and content extraction.

## Recommended SEOSONA Pipeline

1. Intake:
   - Validate URL and rights.
   - Resolve media metadata with `yt-dlp --dump-single-json` before download.
   - Choose playlist mode explicitly.
2. Download:
   - Use deterministic output templates.
   - Use `--download-archive`.
   - Save `.info.json`.
   - Prefer subtitles when available.
3. Audio normalization:
   - Use ffmpeg through `yt-dlp -x`.
   - Prefer `m4a`, `mp3`, or `wav` depending on downstream requirements.
4. Transcription:
   - Use Whisper `turbo` for fast same-language transcription.
   - Use `medium`, `large`, or `large-v3` for translation or higher-quality multilingual work.
   - Emit `json`, `srt`, `vtt`, and `txt` for broad reuse.
5. Post-processing:
   - Normalize transcript text.
   - Preserve segment timestamps.
   - Generate chapters, content brief, keyword candidates, FAQ candidates, and source citations.
6. Indexing:
   - Store raw media metadata under project exports.
   - Store transcript-derived knowledge as memory/KI artifacts.
   - Record source commit versions from this snapshot for reproducibility.

## Falsifiability Checks

- Given a small public test URL, `yt-dlp --dump-single-json` must produce valid JSON without downloading media.
- Given a media URL with subtitles, the workflow must prefer available subtitles before running ASR, unless ASR is explicitly requested.
- Given an audio fixture, Whisper must produce `.json`, `.srt`, `.vtt`, and `.txt` outputs when `--output_format all` is requested.
- Given a playlist URL, the workflow must require explicit playlist mode and must use a download archive.
- Given untrusted metadata with shell metacharacters in title fields, the workflow must not execute shell-expanded filename or title values.
- After repository analysis, no cloned upstream repository may remain under `3_MEMORY/ingestion_zone/` or `5_RESEARCH/repositories/`.
