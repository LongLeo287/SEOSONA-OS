# VieNeu-TTS: Vietnamese Neural TTS with Voice Cloning

_Source: https://github.com/pnnbao97/VieNeu-TTS (1.8k stars, 543 forks)_

## Summary

On-device Vietnamese TTS with instant voice cloning. 10,000+ hours bilingual (En-Vi) training. 48kHz audio quality. CPU inference via ONNX.

## Key Capabilities

| Feature | Detail |
|:--------|:-------|
| Voice Cloning | 3-5 seconds of reference audio |
| Audio Quality | 48kHz (v3 Turbo) / 24kHz (v2) |
| CPU Inference | ONNX Runtime, no GPU required |
| Bilingual | Vietnamese + English code-switching via sea-g2p |
| Emotion Cues | `[cuoi]`, `[tho dai]`, `[hang giong]` (experimental) |
| Podcast Mode | Multi-speaker dialogue with character detection |
| Built-in Voices | Multiple preset Vietnamese voices |
| Install | `pip install vieneu` or `uv sync` |

## Integration Pattern for SEOSONA Video

```python
from vieneu import Vieneu

tts = Vieneu()  # Defaults to v3 Turbo

# 1. Default voice (no reference needed)
audio = tts.infer("Text here")
tts.save(audio, "output.wav")

# 2. Voice cloning from reference
audio = tts.infer("Text", ref_audio="chiquyet_sample_30s.wav")
tts.save(audio, "cloned_output.wav")

# 3. Built-in voice by name
audio = tts.infer("Text", voice="Xuan Vinh")

# 4. Emotion cues
audio = tts.infer("[cuoi] Noi dung vui ve [hang giong] tiep tuc...")

# 5. List available voices
for label, voice_id in tts.list_preset_voices():
    print(f"{label} ({voice_id})")
```

## Architecture

- Backbone: Custom codec (MOSS-Audio-Tokenizer-Nano)
- Phonemizer: sea-g2p (Southeast Asian grapheme-to-phoneme)
- Modes: v3 Turbo (ONNX, CPU), v2 (PyTorch, GPU), v1 (Legacy)

## SEOSONA Video Relevance

- **Solves**: Flat tone, unnatural prosody, bad English pronunciation
- **CQA Voice Clone**: Use chiquyet_sample_30s.wav as ref_audio
- **SEOSONA Voice**: Use built-in Vietnamese female preset
- **Priority**: P0 — Replace Edge-TTS as primary engine
