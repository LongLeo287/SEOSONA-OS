---
name: ckm:elevenlabs
description: Generate speech, clone voices, create sound effects & music with ElevenLabs API. TTS, voice design, audio generation, conversational AI agents.
argument-hint: "[action: speak|clone|sfx] [text-or-file]"
metadata:
  author: claudekit
  version: "1.0.0"
---

# ElevenLabs

AI audio generation platform for text-to-speech, voice cloning, sound effects, music, and conversational AI agents.

## Quick Start

```bash
# Install SDK
pip install elevenlabs
npm install @elevenlabs/elevenlabs-js
```

```python
from elevenlabs import ElevenLabs
client = ElevenLabs(api_key="YOUR_API_KEY")

# Generate speech
audio = client.text_to_speech.convert(
    voice_id="JBFqnCBsd6RMkjVDRZzb",  # George
    text="Hello world!",
    model_id="eleven_multilingual_v2"
)
```

## Model Selection

Detailed list of available models can be found [here](references/available-models.md).

| Model | ID | Latency | Languages | Best For |
|-------|-----|---------|-----------|----------|
| **Multilingual v2** | `eleven_multilingual_v2` | ~500ms | 29 | Highest quality, audiobooks |
| **Flash v2.5** | `eleven_flash_v2_5` | ~75ms | 32 | Real-time, agents |
| **Turbo v2.5** | `eleven_turbo_v2_5` | ~250ms | 32 | Balanced quality/speed |
| **Eleven v3** | `eleven_v3` | Alpha | 70+ | Dramatic, emotional |

## Core Capabilities

### 1. Text-to-Speech
Convert text to lifelike audio. See `references/text-to-speech-guide.md` for:
- Voice settings (stability, similarity, speed)
- SSML tags for pauses/pronunciation
- Emotional control techniques
- Output formats & streaming

### 2. Voice Cloning
Clone voices instantly or professionally. See `references/voice-cloning-guide.md` for:
- Instant clone (1-2 min audio)
- Professional clone (30+ min audio)
- Recording best practices

### 3. Voice Design
Create voices from text prompts. See `references/voice-design-prompting-guide.md` for:
- Prompt templates & examples
- Attribute controls (age, accent, tone)

### 4. Sound Effects & Music
Generate audio from descriptions. See `references/sound-effects-and-music-generation-guide.md` for:
- Sound effect prompts (max 30s)
- Music composition (10s-5min)
- Looping audio

### 5. Conversational AI Agents
Build voice agents. See `references/conversational-ai-agents-guide.md` for:
- Python/JS SDK setup
- WebSocket streaming
- Phone integration (Twilio, SIP)

## Scripts

| Script | Purpose |
|--------|---------|
| `elevenlabs-text-to-speech-generator.py` | Text-to-speech generation |
| `elevenlabs-voice-manager.py` | List/manage voices |
| `elevenlabs-voice-cloner.py` | Voice cloning |
| `elevenlabs-sound-effects-generator.py` | Sound effects generation |

## Best Practices

**Quality**: Voice selection > Model > Settings
**Latency**: Use Flash v2.5 + streaming + global API endpoint
**Cost**: Cache repeated audio, use Flash models (0.5 credits/char)
**Pronunciation**: Use CMU Arpabet phonemes for English

## Resources

- [API Docs](https://elevenlabs.io/docs)
- [Voice Library](https://elevenlabs.io/voice-library)
- [Models Reference](https://elevenlabs.io/docs/overview/models)
