---
name: video_audio_ingestion
description: Build compliant video/audio ingestion pipelines with yt-dlp, ffmpeg, and OpenAI Whisper for transcripts, subtitles, SEO briefs, chaptering, and knowledge indexing.
argument-hint: "[url|file] [transcribe|translate|metadata|seo-brief]"
metadata:
  author: seosona
  version: "1.0.0"
  source_repositories:
    - http~/.seosona/path/
    - http~/.seosona/path/
---

# Video Audio Ingestion

Use this skill when a task requires downloading or inspecting online media, extracting audio, collecting subtitles, transcribing speech, translating speech to English, generating subtitle files, or turning media into SEO/content knowledge.

## Core Tools

- `yt-dlp`: source metadata extraction, media download, subtitles, audio extraction, idempotent archives, output templates.
- `ffmpeg`: audio/video normalization and post-processing backend.
- `openai-whisper`: local speech recognition, translation, segment JSON, SRT, VTT, TSV, and TXT outputs.

## Safety and Compliance Gate

Before media ingestion:

1. Confirm the media source is user-provided or otherwise authorized for the task.
2. Avoid bypassing access controls, paywalls, private accounts, or DRM.
3. Treat titles, metadata, subtitles, and filenames as untrusted input.
4. Do not pass untrusted metadata into shell commands.
5. Prefer metadata-only inspection before full media download.
6. Use a download archive for recurring playlist/channel jobs.
7. Store source URL, retrieval time, tool versions, and selected mode.

## Standard Workflow

1. Metadata probe:
   - Run `yt-dlp --ignore-config --dump-single-json URL`.
   - Persist the JSON metadata for reproducibility.
   - Decide whether existing subtitles are sufficient.
2. Subtitle-first extraction:
   - Prefer `--write-subs` for human captions.
   - Use `--write-auto-subs` only when human captions are unavailable or the task accepts auto-caption quality.
   - Use `--sub-langs` to constrain languages.
3. Audio extraction:
   - Use `yt-dlp --ignore-config -x --audio-format m4a` for Whisper-friendly audio extraction.
   - Use deterministic `-o` templates and `--paths`.
   - Use `--download-archive` for repeated jobs.
4. Transcription:
   - Use `whisper AUDIO --model turbo --output_format all --output_dir OUTPUT_DIR` for fast same-language transcription.
   - Use `--language` when known.
   - Use `--word_timestamps True` when chaptering, clips, subtitles, or highlight timing matters.
   - Use `--condition_on_previous_text False` if the model repeats text or drifts.
5. Translation:
   - Use `--task translate` only with multilingual models such as `medium`, `large`, or `large-v3`.
   - Do not use `turbo` for translation-quality workflows.
6. Knowledge conversion:
   - Convert JSON segments to timestamped notes.
   - Generate chapter candidates, summary, action items, SEO keyword candidates, FAQ candidates, and quote-safe excerpts.
   - Store derived artifacts under the relevant project export or memory folder.

## Recommended Commands

Metadata probe:

```bash
yt-dlp --ignore-config --dump-single-json URL
```

Audio extraction with metadata and archive:

```bash
yt-dlp --ignore-config --no-playlist --write-info-json --write-subs --write-auto-subs --sub-langs "en,vi" --download-archive ARCHIVE_FILE -x --audio-format m4a -o "%(title).120B [%(id)s].%(ext)s" URL
```

Fast transcription:

```bash
whisper AUDIO_FILE --model turbo --language LANGUAGE --output_format all --output_dir OUTPUT_DIR
```

Translation to English:

```bash
whisper AUDIO_FILE --model large-v3 --language LANGUAGE --task translate --output_format all --output_dir OUTPUT_DIR
```

Word timestamp transcription:

```bash
whisper AUDIO_FILE --model turbo --word_timestamps True --hallucination_silence_threshold 2 --output_format all --output_dir OUTPUT_DIR
```

## Output Contract

A complete ingestion run should produce:

- Source metadata JSON.
- Download archive entry when media is downloaded.
- Audio file or subtitle file.
- Transcript TXT.
- Transcript JSON with segments.
- SRT and VTT if subtitles are needed.
- Derived content brief or SEO brief when requested.
- Run log with source URL, tool versions, model, language, and output paths.

## Failure Modes

- Missing `ffmpeg`: install or expose ffmpeg in PATH before audio extraction or Whisper preprocessing.
- Whisper install fails on `tiktoken`: install Rust or `setuptools-rust` when no prebuilt wheel is available.
- CPU-only transcription is slow: switch to a smaller model, set `--threads`, or use CUDA.
- Repetition/hallucination: set `--condition_on_previous_text False`, enable word timestamps, and tune hallucination silence threshold.
- Playlist over-ingestion: require explicit playlist mode and a download archive.
- Private/authenticated media: use user-approved cookies or credentials only for authorized tasks.

## References

- Raw snapshot: `2_KNOWLEDGE/raw_data/multimedia_ingestion/yt_dlp_whisper_snapshot.md`
- Repository analysis: `3_MEMORY/logs/yt_dlp_whisper_repository_analysis.md`
- Upstream yt-dlp repository: `http~/.seosona/path/`
- Upstream Whisper repository: `http~/.seosona/path/`
