# Audio Directive Guide

Audio generation for video production using Veo 3.1 native audio, Gemini TTS, and Lyria music.

## Audio Generation Options

| Source | Use Case | Quality | Control |
|--------|----------|---------|---------|
| Veo 3.1 Native | Sync'd dialogue/SFX | Good | Limited |
| Gemini TTS | Precise voiceover | High | Full voice control |
| Lyria Music | Background music | High | Real-time params |
| FFmpeg Mix | Final assembly | Lossless | Full mix control |

## Recommended Workflow

```
1. VOICEOVER (Gemini TTS) → Generate precise narration
2. MUSIC (Lyria) → Generate background track
3. VIDEO (Veo 3.1) → Generate with SFX directives only
4. MIX (FFmpeg) → Combine all audio layers
```

## Voiceover with Gemini TTS

### Voice Selection

| Voice | Character | Best For |
|-------|-----------|----------|
| Charon | Informative, clear | Product demos, explainers |
| Puck | Upbeat, energetic | Social media, tutorials |
| Kore | Firm, authoritative | Corporate, announcements |
| Aoede | Warm, nurturing | Testimonials, stories |
| Zephyr | Bright, cheerful | Lifestyle, casual |

### TTS Script Format

```python
from google import genai
from google.genai import types
import base64, wave

# Single speaker voiceover
response = client.models.generate_content(
    model='gemini-2.5-flash-preview-tts',
    contents='''
    Audio Profile: Professional narrator
    Director's Notes: Clear, measured pace, slight warmth
    Transcript: Welcome to our product demo. Watch how easy this is.
    ''',
    config=types.GenerateContentConfig(
        response_modalities=['AUDIO'],
        speech_config=types.SpeechConfig(
            voice_config=types.VoiceConfig(
                prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name='Charon')
            )
        )
    )
)

# Save for mixing
audio_data = base64.b64decode(response.candidates[0].content.parts[0].inline_data.data)
with wave.open('voiceover.wav', 'wb') as wav:
    wav.setnchannels(1)
    wav.setsampwidth(2)
    wav.setframerate(24000)
    wav.writeframes(audio_data)
```

### Style Control Prompts

```
# Professional/Corporate
Audio Profile: Professional presenter
Director's Notes: Authoritative yet approachable, steady pace
Transcript: {your_script}

# Energetic/Social
Audio Profile: Enthusiastic creator
Director's Notes: Quick pace, excitement building, punchy delivery
Transcript: {your_script}

# Emotional/Story
Audio Profile: Warm storyteller
Director's Notes: Gentle pace, emotional resonance, natural pauses
Transcript: {your_script}
```

## Music with Lyria

### Style Prompts by Video Type

```python
# Product Demo
prompts = [
    {"prompt": "Modern corporate, uplifting, professional", "weight": 0.9},
    {"prompt": "Subtle background, not distracting", "weight": 0.6}
]
config = {"bpm": 100, "brightness": 0.6, "density": 0.4}

# Social Media
prompts = [
    {"prompt": "Trending pop electronic, energetic", "weight": 0.9},
    {"prompt": "Catchy rhythm, bass-forward", "weight": 0.6}
]
config = {"bpm": 128, "brightness": 0.7, "density": 0.7}

# Testimonial
prompts = [
    {"prompt": "Warm acoustic, inspiring", "weight": 0.9},
    {"prompt": "Emotional, subtle", "weight": 0.5}
]
config = {"bpm": 70, "brightness": 0.4, "density": 0.3}
```

### Generate Background Track

```python
async def generate_background_music(duration_sec, mood):
    async with client.aio.live.music.connect() as session:
        await session.set_weighted_prompts([
            {"prompt": f"{mood} background music", "weight": 0.9},
            {"prompt": "Supportive underscore, non-distracting", "weight": 0.6}
        ])
        await session.set_music_generation_config(
            guidance=4.0, density=0.4, brightness=0.5
        )
        await session.play()
        
        audio = []
        chunks = duration_sec * 48000 // 512
        async for i, chunk in enumerate(session):
            audio.append(chunk.audio_data)
            if i >= chunks: break
        return b''.join(audio)
```

## Veo 3.1 SFX Directives

For Veo-native audio, only include SFX (voiceover via TTS, music via Lyria):

### Directive Syntax

```
SFX: {description} as {trigger action}
Ambient: {element 1}, {element 2}
```

### Examples

```
SFX: Satisfying click as button pressed
SFX: Whoosh as product slides in
SFX: Notification chime as message appears
SFX: Soft pop as feature animates

Ambient: Office typing, distant conversation
Ambient: Coffee shop murmur, espresso machine
```

### Rules

- Max 2-3 SFX per 8-second video
- Tie SFX to specific visual action
- Max 2 ambient elements
- No dialogue/music directives (use TTS/Lyria)

## Audio Mixing with FFmpeg

### Final Assembly Pipeline

```bash
# 1. Convert TTS to match video format
ffmpeg -i voiceover.wav -ar 48000 -ac 2 voiceover_48k.wav

# 2. Convert music to match (if needed)
ffmpeg -f s16le -ar 48000 -ac 2 -i music.pcm music.wav

# 3. Extract video audio (SFX only from Veo)
ffmpeg -i video.mp4 -vn -c:a pcm_s16le sfx.wav

# 4. Mix all layers with volume control
ffmpeg -i video.mp4 -i voiceover_48k.wav -i music.wav -i sfx.wav \
    -filter_complex "
        [1:a]volume=1.0[vo];
        [2:a]volume=0.3[music];
        [3:a]volume=0.8[sfx];
        [vo][music][sfx]amix=inputs=3:duration=first[aout]
    " \
    -map 0:v -map "[aout]" -c:v copy -c:a aac output.mp4
```

### Volume Guidelines

| Layer | Volume | Purpose |
|-------|--------|---------|
| Voiceover | 1.0 | Primary, always audible |
| SFX | 0.7-0.8 | Supporting, impactful |
| Music | 0.2-0.4 | Background, atmosphere |
| Ambient | 0.1-0.2 | Subtle environment |

### Ducking (Auto-lower music under voice)

```bash
ffmpeg -i video.mp4 -i voiceover.wav -i music.wav \
    -filter_complex "
        [2:a]sidechaincompress=threshold=0.01:ratio=4:attack=10:release=100[ducked];
        [1:a][ducked]amix=inputs=2[aout]
    " \
    -map 0:v -map "[aout]" output.mp4
```

## Timing Sync

### Voiceover Pacing

| Duration | Max Words | Style |
|----------|-----------|-------|
| 2s | 4-6 | Punchy |
| 4s | 8-12 | Normal |
| 6s | 12-18 | Detailed |
| 8s | 15-24 | Full |

### SFX Timing Template

```
[0:00.0] - Video starts
[0:00.5] - SFX: Hook sound
[0:02.2] - SFX: Transition
[0:04.3] - SFX: Action click
[0:05.5] - SFX: Success chime
[0:07.0] - SFX: CTA whoosh
```

### Music Arc

```
[0:00-0:02] - Intro, building anticipation
[0:02-0:06] - Stable, under content (ducked for VO)
[0:06-0:08] - Resolve, conclusion
```

## Platform Considerations

### YouTube (Full Audio)
- All layers: VO + Music + SFX
- Professional broadcast quality
- Full dynamic range

### TikTok/Reels (Music Forward)
- Minimal VO, punchy SFX
- Trending music style prominent
- Mobile-optimized levels

### LinkedIn (Speech Priority)
- Clear VO dominant
- Subtle music (0.15-0.2)
- Minimal SFX
- Business appropriate

## Troubleshooting

| Issue | Solution |
|-------|----------|
| VO unclear | Increase VO volume, add ducking |
| Music too loud | Reduce to 0.2-0.3, add sidechaincompress |
| SFX missing | Add explicit timing in Veo prompt |
| Audio sync off | Check sample rates match (48kHz) |

## Resources

- [Gemini TTS Docs](https://ai.google.dev/gemini-api/docs/speech-generation)
- [Lyria Music Docs](https://ai.google.dev/gemini-api/docs/music-generation)
- [FFmpeg Filters](https://ffmpeg.org/ffmpeg-filters.html)
- [media-processing skill](../../media-processing/SKILL.md)
