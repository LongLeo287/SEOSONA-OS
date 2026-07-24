# KI: Edge TTS Pipeline — Free Cloud TTS

_Source: [rany2/edge-tts](https://github.com/rany2/edge-tts) | Wave 5 (2026-06-25)_

## Core Concept

`edge-tts` is a Python module + CLI that uses Microsoft Edge's free online TTS service. No API key required. Generates MP3 audio + SRT subtitles simultaneously.

## Quick Start

```bash
# Install
pip install edge-tts

# Basic usage
edge-tts --text "Hello, world!" --write-media hello.mp3 --write-subtitles hello.srt

# List available voices
edge-tts --list-voices

# Use specific voice
edge-tts --voice "vi-VN-HoaiMyNeural" --text "Xin chào" --write-media output.mp3
```

## Vietnamese Voices

| Voice | Gender | Quality |
|---|---|---|
| `vi-VN-HoaiMyNeural` | Female | Good for narration |
| `vi-VN-NamMinhNeural` | Male | Good for narration |

## SEOSONA Video Integration

### As TTS Fallback Provider

```
Provider Priority:
1. HeyGen TTS (best quality, paid)
2. ElevenLabs (high quality, paid)
3. F5-TTS (offline, good quality)
4. Kokoro (local, fast)
5. edge-tts (free cloud, good quality, unlimited) ← NEW
```

### Key Advantage: Built-in SRT
- Generates `.srt` subtitle file alongside audio
- Direct input for embedded-captions pipeline
- No need for separate Whisper transcription step when using edge-tts

### Python API Usage

```python
import asyncio
import edge_tts

async def generate_tts(text, voice, output_file):
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_file)
    
asyncio.run(generate_tts("Xin chào", "vi-VN-HoaiMyNeural", "output.mp3"))
```

## Limitations

- Requires internet connection (cloud service)
- Rate limits may apply for very heavy usage
- Voice quality varies by language (English voices are strongest)
- Microsoft may change/restrict the service at any time (unofficial API)

## Integration Points

- `hyperframes-media` skill — add as TTS provider option
- `faceless-explainer` workflow — use for narration when paid TTS is unavailable
- `seosona-video-maker` — add edge-tts as default free provider
