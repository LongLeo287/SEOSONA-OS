# ElevenLabs Skill

AI audio generation platform for text-to-speech, voice cloning, sound effects, music, and conversational AI agents.

## Installation

```bash
pip install elevenlabs
```

Set your API key in `.env`:
```
ELEVENLABS_API_KEY=your_key_here
```

## Quick Start

```python
from elevenlabs import ElevenLabs
client = ElevenLabs(api_key="YOUR_API_KEY")

audio = client.text_to_speech.convert(
    voice_id="JBFqnCBsd6RMkjVDRZzb",
    text="Hello world!",
    model_id="eleven_multilingual_v2"
)
```

## Scripts

| Script | Usage |
|--------|-------|
| `elevenlabs-text-to-speech-generator.py` | `python scripts/elevenlabs-text-to-speech-generator.py "Hello" -o out.mp3` |
| `elevenlabs-voice-manager.py` | `python scripts/elevenlabs-voice-manager.py list` |
| `elevenlabs-voice-cloner.py` | `python scripts/elevenlabs-voice-cloner.py "Name" sample.mp3` |
| `elevenlabs-sound-effects-generator.py` | `python scripts/elevenlabs-sound-effects-generator.py "Thunder" -o sfx.mp3` |

## Models

| Model | ID | Best For |
|-------|-----|----------|
| Multilingual v2 | `eleven_multilingual_v2` | Highest quality |
| Flash v2.5 | `eleven_flash_v2_5` | Real-time (~75ms) |
| Turbo v2.5 | `eleven_turbo_v2_5` | Balanced |

## References

- `references/text-to-speech-guide.md` - TTS, SSML, streaming
- `references/voice-cloning-guide.md` - Clone voices
- `references/voice-design-prompting-guide.md` - Create voices from prompts
- `references/sound-effects-and-music-generation-guide.md` - SFX & music
- `references/conversational-ai-agents-guide.md` - Voice agents

## Links

- [ElevenLabs Docs](https://elevenlabs.io/docs)
- [Voice Library](https://elevenlabs.io/voice-library)
