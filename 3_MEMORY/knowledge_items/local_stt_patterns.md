# KI: Local STT Patterns (Handy)

_Source: [cjpais/handy](https://github.com/cjpais/handy) | Wave 5 (2026-06-25)_

## Core Concept

Handy is an open-source, offline speech-to-text desktop app built with Tauri + Rust. It uses Whisper and Parakeet V3 models for local transcription with VAD (Voice Activity Detection) and GPU acceleration.

## Architecture

```
Frontend: React + TypeScript + Tailwind CSS
Backend: Rust (Tauri)
    ├── whisper-rs    — Whisper model inference
    ├── transcribe-rs — Parakeet V3 CPU-optimized inference
    ├── cpal          — Cross-platform audio I/O
    ├── vad-rs        — Voice Activity Detection (Silero)
    ├── rdev          — Global keyboard shortcuts
    └── rubato        — Audio resampling
```

## Key Features

1. **Push-to-talk or toggle mode** — configurable keyboard shortcuts
2. **Multiple models**: Whisper Small/Medium/Turbo/Large + Parakeet V3
3. **VAD filtering**: Silero-based silence detection — only processes speech
4. **GPU acceleration**: When available, uses GPU for faster inference
5. **Auto-paste**: Transcribed text pasted directly into active app

## Workflow

```
[Keyboard Shortcut] → Record Audio → VAD Filter → Whisper/Parakeet → Paste Text
```

## SEOSONA Synergy

### Combined with edge-tts = Full Voice I/O
```
Voice Input (Handy/STT) → SEOSONA Agent → Text Output → edge-tts (TTS) → Audio
```

### Use Cases
1. **Agent voice commands**: Dictate tasks to SEOSONA OS
2. **Content dictation**: Dictate blog posts, scripts, social media content
3. **Video narration workflow**: Record narration → auto-transcribe → sync with video
4. **Meeting notes**: Transcribe live meetings for content pipeline

### Comparison with Existing Tools

| Tool | Type | Offline | Speed | Vietnamese |
|---|---|---|---|---|
| **Handy** | Desktop app | ✅ | Fast (GPU) | Via Whisper |
| **Whisper CLI** | CLI | ✅ | Medium | ✅ Good |
| **PhoWhisper** | CLI | ✅ | Medium | ✅ Best |
| **Google STT** | Cloud API | ❌ | Fast | ✅ Good |

## SEOSONA Integration Points

- Voice input for `autonomy:intake` — dictate tasks instead of typing
- Narration recording for `faceless-explainer` and `seosona-video-maker`
- Meeting transcription for content pipeline
- Compare architecture patterns with Pake (also Tauri + Rust)
