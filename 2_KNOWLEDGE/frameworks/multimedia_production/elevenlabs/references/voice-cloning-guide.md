# Voice Cloning Guide

## Two Cloning Methods

| Method | Audio Required | Training Time | Quality |
|--------|---------------|---------------|---------|
| **Instant (IVC)** | 1-2 minutes | Instant | Good |
| **Professional (PVC)** | 30+ minutes | Hours | Excellent |

## Instant Voice Cloning

Fast, easy cloning for quick projects.

### Requirements
- 1-2 minutes of clear audio
- No background noise, reverb, or artifacts
- Consistent speaking style throughout
- **Don't exceed 3 minutes** - can reduce quality

### API Usage

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(api_key="YOUR_API_KEY")

voice = client.voices.add(
    name="My Voice Clone",
    files=["sample1.mp3", "sample2.mp3"],
    description="Voice clone for narration"
)

print(f"Voice ID: {voice.voice_id}")
```

## Professional Voice Cloning

High-fidelity cloning for production use.

### Requirements
- Minimum 30 minutes, ideally 2+ hours
- Recording style should match intended output
- Clean, studio-quality audio
- Consistent tone and pacing throughout

### Recording Guidelines

**Microphone Setup:**
- Distance: ~20cm (7-8 inches) from mic
- Use pop filter between mouth and mic
- Quiet room with minimal reverb

**Speaking Style:**
- Stay consistent - don't mix animated and subdued
- Keep same accent throughout
- Insert 1-1.5s silences between paragraphs
- Shorter pauses between sentences
- Avoid throat clearing, vocal fry (unless intentional)

### What NOT to Do
- Mix different energy levels
- Switch accents mid-recording
- Include long silences or dead air
- Record in noisy environments

## Voice Quality Tips

1. **Sample Diversity**: Include various emotions and pacing in samples
2. **Audio Quality**: 44.1kHz, 16-bit minimum
3. **Format**: WAV or high-bitrate MP3
4. **Content**: Natural speech, not reading robotically

## Managing Cloned Voices

```python
# List all voices
voices = client.voices.get_all()
for voice in voices.voices:
    print(f"{voice.name}: {voice.voice_id}")

# Delete a voice
client.voices.delete(voice_id="voice_id_here")

# Get voice details
voice = client.voices.get(voice_id="voice_id_here")
print(voice.settings)
```

## Sharing & Permissions

- Cloned voices are private by default
- Can be shared via Voice Library
- Enterprise: Cross-workspace sharing available
- Always verify you have rights to clone a voice
