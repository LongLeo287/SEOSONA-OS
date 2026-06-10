# Sound Effects & Music Generation Guide

## Sound Effects API

### Endpoint
```
POST https://api.elevenlabs.io/v1/sound-generation
```

### Limits
- Max duration: 30 seconds
- Output format: MP3 (48kHz WAV available for non-looping)
- Looping: Supported for seamless repeating audio

### Prompt Tips

**Be Descriptive:**
```
A heavy wooden door creaking open slowly in an old mansion,
with echoing hinges and dust settling
```

**Specify Duration:**
```
5 second thunderclap with rolling rumble
```

**Request Loops:**
```
Looping ambient forest sounds with birds chirping and wind through leaves
```

### Example Prompts

| Category | Prompt |
|----------|--------|
| **Cinematic** | "Deep, ominous drone building tension, 10 seconds" |
| **UI** | "Short, crisp notification ping, friendly tone" |
| **Game** | "8-bit coin collection sound, retro arcade style" |
| **Foley** | "Footsteps on gravel, slow walking pace, outdoor" |
| **Ambient** | "Looping coffee shop ambience with quiet chatter and espresso machine" |

### Python Example

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(api_key="YOUR_API_KEY")

audio = client.sound_effects.generate(
    text="Thunder rumbling in the distance with light rain",
    duration_seconds=10.0
)

with open("thunder.mp3", "wb") as f:
    for chunk in audio:
        f.write(chunk)
```

## Music Generation (Eleven Music)

### Requirements
- Paid plan required
- Duration: 10 seconds to 5 minutes
- Commercially licensed (additional license for ads/film/TV/games)

### Endpoint
```
POST https://api.elevenlabs.io/v1/music/compose
```

### Basic Prompt

```python
music = client.music.compose(
    prompt="Upbeat electronic track with driving beat,
            perfect for tech product video",
    duration_seconds=60
)
```

### Composition Plans (Advanced)

For granular control, use a composition plan:

```python
plan = {
    "sections": [
        {
            "name": "intro",
            "duration": 15,
            "style": "ambient, building"
        },
        {
            "name": "main",
            "duration": 30,
            "style": "energetic, full instrumentation"
        },
        {
            "name": "outro",
            "duration": 15,
            "style": "fadeout, ambient"
        }
    ]
}

music = client.music.compose_detailed(plan=plan)
```

### Prompt Examples

| Use Case | Prompt |
|----------|--------|
| **Podcast Intro** | "30 second upbeat acoustic guitar melody, warm and welcoming" |
| **Game Background** | "Looping orchestral adventure theme, epic fantasy style" |
| **Corporate Video** | "Professional, inspiring corporate track with piano and strings" |
| **Social Media** | "15 second trendy lo-fi hip hop beat, chill vibes" |

### Tips

1. **Specify genre clearly**: "jazz", "electronic", "orchestral"
2. **Include mood**: "energetic", "melancholic", "triumphant"
3. **Mention instruments** if specific ones needed
4. **Request vocals or instrumental**: Default is usually instrumental
5. **Duration affects structure**: Longer tracks need more detailed prompts

## Billing

- Sound effects: Per generation
- Music: Per generation
- Both count against monthly quota on paid plans
