# Voice Design Prompting Guide

Create custom voices from text descriptions when Voice Library doesn't have what you need.

## Prompt Structure

### Five Core Attributes

1. **Age**: adolescent, young adult, middle-aged, elderly
2. **Gender**: male, female, neutral, or pitch descriptors
3. **Tone/Timbre**: deep, smooth, gravelly, warm, breathy, tinny
4. **Accent**: use "thick" or "slight" + specific accent
5. **Pacing**: fast, slow, deliberate, conversational, rhythmic

## Prompt Quality Spectrum

### Detailed Prompts (Most Accurate)
```
A high-energy female sports commentator with a thick British accent,
passionately delivering play-by-play coverage of a football match
at a very quick pace.
```

### Simple Prompts (Good for Neutral)
```
A calm male narrator
```

## Example Prompts by Use Case

### Audiobook Narrator
```
A warm, middle-aged male voice with a slight British accent.
Calm, measured pacing perfect for long-form narration.
Studio-quality recording with rich, deep tones.
```

### Energetic Podcast Host
```
A young, enthusiastic female voice with an American accent.
Quick, dynamic delivery with natural energy and warmth.
Conversational tone, perfect audio quality.
```

### Documentary Narrator
```
An authoritative, deep male voice. Middle-aged with gravelly undertones.
Slow, deliberate pacing. Serious and informative tone.
```

### Character Voice (Pirate)
```
A gruff, weathered old man with a thick West Country English accent.
Raspy voice, speaking slowly with dramatic pauses.
Sounds like years at sea.
```

### Tech Product Demo
```
A friendly, professional young female voice. Slight uptalk pattern.
Clear enunciation, moderate pace. Approachable and modern.
Perfect audio quality.
```

## Quality Modifiers

### For High Quality
Add: "perfect audio quality" or "studio-quality recording"

### For Creative Lo-Fi
- "low-fidelity audio"
- "sounds like a voicemail"
- "muffled and distant"
- "over a phone line"

## Parameters

| Parameter | Effect |
|-----------|--------|
| **Loudness** | Volume of generated voice |
| **Guidance Scale** | 20-40% for most cases. Higher = stricter prompt adherence but may reduce quality |

## Tips

1. **Be specific**: "thick French accent" > "foreign accent"
2. **Combine traits**: Layer multiple descriptors for unique voices
3. **Match preview text**: Use text that complements your voice description
4. **Longer previews**: Produce more stable, expressive results
5. **Iterate**: Generate multiple versions and pick the best

## What to Avoid

- Vague terms: "exotic", "foreign", "interesting"
- Contradictory descriptors in same prompt
- Extremely specific celebrity impersonations
- Overly long prompts (diminishing returns)
