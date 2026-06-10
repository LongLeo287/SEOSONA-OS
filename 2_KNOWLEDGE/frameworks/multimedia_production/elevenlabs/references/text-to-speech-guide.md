# Text-to-Speech Guide

## API Endpoint

```
POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
```

## Voice Settings

| Setting | Range | Default | Purpose |
|---------|-------|---------|---------|
| `stability` | 0-1 | 0.5 | Higher = more consistent, lower = more expressive |
| `similarity_boost` | 0-1 | 0.75 | How closely to match original voice |
| `style` | 0-1 | 0 | Expressiveness (Multilingual v2 only) |
| `speed` | 0.7-1.2 | 1.0 | Playback speed multiplier |

## SSML Tags (English models only)

### Pauses
```xml
<break time="1.5s" />
```
- Max 3 seconds per break
- Too many breaks cause instability
- Eleven v3 doesn't support SSML; use punctuation instead

### Pronunciation (CMU Arpabet - recommended)
```xml
<phoneme alphabet="cmu-arpabet" ph="T OW M EY T OW">tomato</phoneme>
```

### Pronunciation (IPA)
```xml
<phoneme alphabet="ipa" ph="təˈmeɪtoʊ">tomato</phoneme>
```

**Stress markers are critical** - include them for accurate pronunciation.

### Alternative Pause Techniques
- Dash `-` or em-dash `—` for short pauses
- Ellipsis `...` for hesitant tone
- Comma for natural breath pauses

## Emotional Control

Models interpret emotion from context:
- Add descriptive phrases: "she said excitedly"
- Use punctuation: `!` for excitement, `?` for questioning
- Wrap in context: `[whispering]` or `[angrily]`

Match emotion tags to voice training data - professional voices may not respond to playful tags.

## Text Normalization

Expand for best results:
- `01/02/2023` → `January second, twenty twenty-three`
- `$50` → `fifty dollars`
- `Dr.` → `Doctor`

Set `apply_text_normalization: "on"` in API for auto-normalization.

## Streaming

Use streaming endpoint for reduced time-to-first-byte:
```
POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream
```

**Chunk sizes:**
- Minimum: 50 characters
- Recommended: 200-400 characters
- Maximum: 1,000 characters

## Output Formats

| Format | Quality | Size |
|--------|---------|------|
| `mp3_44100_128` | High | Medium |
| `mp3_22050_32` | Low | Small |
| `pcm_16000` | Raw | Large |
| `ulaw_8000` | Telephony | Small |

## Global API for Lower Latency

Replace `api.elevenlabs.io` with `api-global-preview.elevenlabs.io` for:
- Flash v2.5
- Turbo v2.5

Not recommended for Multilingual v2 (may increase latency).

## Python Example

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(api_key="YOUR_API_KEY")

audio = client.text_to_speech.convert(
    voice_id="JBFqnCBsd6RMkjVDRZzb",
    text="Hello! <break time='0.5s'/> How are you?",
    model_id="eleven_multilingual_v2",
    voice_settings={
        "stability": 0.5,
        "similarity_boost": 0.75,
        "style": 0.3,
        "speed": 1.0
    }
)

# Save to file
with open("output.mp3", "wb") as f:
    for chunk in audio:
        f.write(chunk)
```

## JavaScript Example

```javascript
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const client = new ElevenLabsClient({ apiKey: "YOUR_API_KEY" });

const audio = await client.textToSpeech.convert("JBFqnCBsd6RMkjVDRZzb", {
  text: "Hello world!",
  model_id: "eleven_multilingual_v2",
  voice_settings: {
    stability: 0.5,
    similarity_boost: 0.75,
  },
});
```
