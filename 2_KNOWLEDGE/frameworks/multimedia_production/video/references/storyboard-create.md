Create video storyboards with START/END frame pairs for Nano Banana Flash to Veo 3.1 pipeline.

## Your Brief

<args>$ARGUMENTS</args>

## Instructions

1. **Activate skills**:
   - Load `video` skill with `references/storyboard-format.md`, `references/video-art-directions.md` and `references/quality-review-workflow.md`
   - Load `creativity` skill for style templates, color palettes, visual trends
   - Load `ai-artist` skill with `references/character-consistency.md` for character portrait workflow
   - Load `ai-multimodal` skill with `references/character-consistency-portrait-reference.md` for Nano Banana Pro multi-ref
   - Load `assets-organizing` skill for output path conventions
2. **Parse input**: Script file path OR text prompt describing video concept
3. **Determine platform**: YouTube (16:9), TikTok/Reels (9:16), or Square (1:1)

## Workflow

### Step 1: Analyze Input
- If script file: Extract scenes, timing, visual descriptions
- If prompt: Generate 4-scene structure (Hook → Problem → Solution → CTA)

### Step 2: Generate Character Portraits (if characters present)
If the script/brief contains human characters (actors, personas, mascots):

1. **Extract characters**: List all unique characters with their visual descriptions
2. **Generate portrait** for each character using Nano Banana Pro:
   ```bash
   .claude/skills/.venv/bin/python3 .claude/skills/ai-multimodal/scripts/gemini_batch_process.py \
     --task generate --model gemini-3-pro-image-preview \
     --prompt "Professional portrait photograph of [character_name]: [detailed description]. Canon EOS R5, 85mm f/1.4, soft studio lighting, neutral gray background, sharp focus, 4K." \
     --aspect-ratio 2:3 --size 4K --output assets/storyboards/{slug}/characters/{character_name}-portrait.png
   ```
3. **Review portraits** with `ai-multimodal` vision to validate facial features, clothing, accessories match descriptions
4. **Save portraits** to `assets/storyboards/{slug}/characters/` for reference in all subsequent frame generations

**IMPORTANT:** Character portraits MUST be generated BEFORE any scene frames. These portraits are the identity anchors for all subsequent frame generation.

### Step 3: Generate Storyboard
For each scene, create:
- **Start Frame**: Imagen prompt with style tags + validation criteria
- **End Frame**: Imagen prompt ensuring continuity + validation criteria
- **Motion**: Veo directive (static, dolly, pan)
- **Audio**: Voiceover text, music cue, SFX timestamps
- **Duration**: 2-3 seconds per scene

### Step 4: Generate Frames
Use `ai-multimodal` skill (referenced `image-generation.md`) to generate START and END frame images.

**If characters are present in the scene:**
Use Nano Banana Pro (`gemini-3-pro-image-preview`) with character portrait as `--files` reference:
```bash
.claude/skills/.venv/bin/python3 .claude/skills/ai-multimodal/scripts/gemini_batch_process.py \
  --task generate --model gemini-3-pro-image-preview \
  --files assets/storyboards/{slug}/characters/{character_name}-portrait.png \
  --prompt "Same person from reference image: [identity anchors]. Now [scene description]. Maintain EXACT facial features, hair, clothing. [style tags] [camera/composition]" \
  --aspect-ratio <ratio> --size 4K --output assets/storyboards/{slug}/scene-{N}-1-start.png
```

**If no characters in the scene:**
Use Nano Banana Flash for speed, or Pro for complex scenes.

If there are referenced images in the brief, use `Multi-Image Composition`.
Make sure the output frames do not contain any hex color codes.

### Step 5: Review Frames
Use `ai-multimodal` vision skill to analyze the generated frames and validate each frame pair before proceeding.
**DO NOT** use the default `Read` tool to read the frames unless `ai-multimodal` skill fails.
If there are any unacceptable issues: use `ai-multimodal` skill to modify or re-generate and re-check.

**Unacceptable issues:**
- Typo errors
- Hex color codes in the frames
- Duplicate text
- Blurry text
- Inconsistent style
- Meaningless content
- Unintended motion
- Unintended continuity
- Unintended cropping

## Output Structure

Create directory: `assets/storyboards/{date}-{slug}/` containing:
- `storyboard.md` - Full storyboard document
- `storyboard.json` - Machine-readable scene data
- `characters/` - Character portrait images (if characters present)
  - `{character-name}-portrait.png` - Reference portraits for each character
- `scene-{N}-1-start.png` - Start frame images
- `scene-{N}-2-end.png` - End frame images

## Output Format (`storyboard.md`)

```markdown
---
title: "{working title}"
slug: {kebab-case-topic}
type: {type}
platform: {platform}
aspect_ratio: {16:9|9:16|1:1}
target_length: "{e.g. 45s | 8-12 min}"
audience: "{who}"
goal: "{desired outcome}"
cta: "{cta}"
art_direction: "{selected style from video-art-directions}"
script: "{script file path or prompt}"
---

# Storyboard: {Title}

**Generated:** {date} | **Aspect:** {ratio} | **Duration:** {total}s

---

## Characters (if applicable)

| Character | Portrait | Description |
|-----------|----------|-------------|
| {name} | ![{name}](./characters/{name}-portrait.png) | {hair, eyes, clothing, accessories} |

**Identity Anchors** (repeat in every scene prompt):
- {name}: "{hair_color} {hair_style} hair, {eye_color} eyes, wearing {clothing}, {accessories}"

---

## Script
{script overview}
{script file path}

### Core Promise
{one sentence}

### Key Points
- {point}
- {point}
- {point}

### Angle
{what makes this different}

---

## Creative Direction

### Art Direction: {style name}
**Core Keywords:** {keywords from reference}
**Color Palette:** {hex codes + names}
**Signature Effects:** {effects from reference}

### Visual Style
{2-3 sentences describing the overall visual approach}

### Audio Style
**Music:** {genre, mood, BPM, instruments}
**Voiceover:** {style, tone, pacing}
**SFX:** {overall approach to sound design}

---

## Scene {N}: {Name}

| Property | Value |
|----------|-------|
| Timing | {start}-{end} |
| Duration | {N}s |
| Shot | {wide/medium/close-up} |
| Motion | {veo directive} |

### Start Frame
**Prompt:** {imagen prompt with style tags}
![Start](./scene-{N}-1-start.png)

### End Frame
**Prompt:** {imagen prompt with style tags}
![End](./scene-{N}-2-end.png)

### Video Prompts (Veo 3.1):
\`\`\`
[Start state → End state] [Motion description]
[Camera movement: pan/tilt/dolly/crane/tracking]
[Cinematography style from art direction]
[Scene transitions: cut/fade/dissolve]
\`\`\`

### Audio
- **VO:** "{voiceover text}"
- **Music:** {mood, bpm}
- **SFX:** {timestamp: sound}

#### Music Prompt (Lyria)
```
{Complete Lyria prompt: genre, mood, BPM, instruments, intensity curve}
```

### Review Notes
{validation criteria, continuity checks}

---
```

## Example Usage

```bash
# From script file
/video:storyboard:create scripts/product-demo.md

# From prompt
/video:storyboard:create "30-second TikTok ad for fitness app showing before/after transformation"
```
