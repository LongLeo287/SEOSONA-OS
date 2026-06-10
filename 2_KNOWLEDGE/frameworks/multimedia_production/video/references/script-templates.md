# Video Script Templates

Scripts with precise timing for AI video generation (Imagen 4 + Veo 3.1).

## Frame-Based Script Structure

Each scene defines START and END frames for Imagen 4 generation:

```markdown
## Scene {N}: {Title}
**Time:** {MM:SS}-{MM:SS} ({duration}s)

### Visual
**Start Frame:** {Exact visual for Imagen 4 - first frame}
**End Frame:** {Exact visual for Imagen 4 - last frame}
**Motion:** {What changes between frames}
**Camera:** {Shot type + movement}

### Audio
**Voiceover:** "{Script}" (TTS: {Voice}, {Style})
**Music:** {Prompt: Genre, intensity}
**SFX:** {Prompt: Sound} at {timestamp}

### Imagen Prompts
**Start:** {Complete Imagen 4 prompt}
**End:** {Complete Imagen 4 prompt}
```

## 8-Second Product Demo

```markdown
## Scene 1: Hook (0:00-0:02)
**Start Frame:** Frustrated professional at cluttered desk, head in hands
**End Frame:** Same person, head lifting, hint of curiosity
**Motion:** Subtle head movement toward off-screen
**Camera:** Medium shot, static

**Voiceover:** "Tired of this?" (TTS: Charon, sympathetic)
**Music:** Tense corporate, subtle | **SFX:** Paper shuffle at 0:00.5

## Scene 2: Solution (0:02-0:04)
**Start Frame:** Professional upright, smartphone in hand, screen glowing
**End Frame:** Leaning forward, engaged smile, phone showing app
**Camera:** Medium shot, slight dolly in

**Voiceover:** "Meet {Product}." (TTS: Charon, confident)
**Music:** Uplifting, building | **SFX:** Chime at 0:02.2

## Scene 3: Demo (0:04-0:06)
**Start Frame:** Close-up phone, cluttered interface, finger near button
**End Frame:** Organized interface, success state
**Camera:** Close-up, static

**Music:** Full energy | **SFX:** Click at 0:04.3, chime at 0:05.5

## Scene 4: CTA (0:06-0:08)
**Start Frame:** Professional at clean desk, smiling, holding phone
**End Frame:** Same with logo/URL overlay
**Camera:** Medium, slight dolly out

**Voiceover:** "Start free today." (TTS: Charon, inviting)
```

## Timing Reference

| Duration | Frames (24fps) | Max Words |
|----------|----------------|-----------|
| 1s | 24 | 2-3 |
| 2s | 48 | 4-6 |
| 4s | 96 | 8-12 |
| 8s | 192 | 15-24 |

## Frame Requirements

**Start Frame:** Subject position, expression, environment, lighting, composition
**End Frame:** Final state, changed elements, emotional resolution, transition setup

## Motion Notation

- Head down → Head up = Lift motion
- Empty → Filled = Appear motion
- Far → Close = Dolly in
- Left → Right = Pan motion

## Hook Formulas

| Formula | Duration | Start → End |
|---------|----------|-------------|
| "Stop [mistake]" | 1-2s | Bold text → Problem visual |
| "What if...?" | 2s | Question → Aspiration |
| "POV: [discovery]" | 2s | First-person → Reveal |
| "[Number] ways..." | 2s | Number graphic → Grid |

## Best Practices

1. **Specific frames**: "Navy blazer, confident smile" not "person"
2. **Continuity**: End frame N ≈ Start frame N+1
3. **Simple motion**: One movement per 2s segment
4. **Voice timing**: Max 6 words/second
5. **SFX precision**: Exact timestamps for sync
6. **Style tags**: Include "professional storyboard frame" in Imagen prompts

## Resources

- [Storyboard Format](./storyboard-format.md) - Frame generation
- [Veo Prompt Guide](./veo-prompt-guide.md) - Video from frames
- [Audio Directive Guide](./audio-directive-guide.md) - TTS/music
