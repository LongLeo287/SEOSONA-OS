# Storyboard Format Guide

Create storyboards with START/END frames for Imagen 4 to Veo 3.1 pipeline with AI-powered validation.

## General Direction
- Express clear visual narrative flow, concept, and general art direction of the video (pick one from the available art directions in `./video-art-directions.md`)
- Describe the emotional arc and pacing of the video, including key emotional beats
- Define the overall tone and mood of the video
- Establish clear visual hierarchy and focal points
- Maintain consistent art direction throughout the storyboard
- Ensure clear visual storytelling with strong composition
- Plan for smooth transitions between frames
- Keep text annotations minimal but descriptive and focused on key elements
- Use consistent scale and perspective across all frames
- Maintain consistent character proportions and poses where applicable
- Ensure lighting and mood are consistent across frames
- Avoid major compositional changes between start and end frames

## Core Concept: Frame-Based Generation

Quality principle: Generate START and END frames with Imagen 4, then use Veo to create video between them.

```
START FRAME (Imagen 4) --> [REVIEW] --> VIDEO (Veo 3.1) --> [REVIEW] --> END FRAME (Imagen 4)
```

## Per-Scene Structure

Each scene requires:
- **Start Frame**: Imagen prompt (Art style: Colored Sketch + Handwriting Text Annotations) + validation criteria
- **End Frame**: Imagen prompt (Art style: Colored Sketch + Handwriting Text Annotations) + validation criteria
- **Audio**: Voiceover text (Include tone and pacing instructions), music cue, SFX (at exact timecodes)
- **Motion**: Veo directive
- **Review checklist**: Quality gates

## Frame Art Style
**Choose One Bold Aesthetic Direction (commit 100%)**
| Style Category              | Core Keywords (copy-paste ready)                                      | Color Palette Ideas                                      | Signature Effects & Details                                                                      |
|-----------------------------|----------------------------------------------------------------------|----------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| Colored Sketch + Notes      | colored pencil sketch, rough linework, storyboard, handwritten annotations, arrows, callouts, animatic style | warm neutrals + accent color (teal/red), off-white paper  | visible construction lines, margin notes, circled highlights, scribble arrows, paper texture     |
| Clean Line Art (Flat Color) | clean line art, vector-like outlines, flat colors, minimal shading, modern storyboard | neutral base + 1-2 brand accents, soft grays             | uniform stroke weight, crisp silhouettes, simple shadows, clear readability                       |
| Cinematic Film Still        | cinematic, film still, realistic lighting, depth of field, anamorphic bokeh, 35mm | moody teal & orange, deep blacks, subtle highlights      | lens flares, film grain, letterbox framing, dramatic key light + rim light                        |
| High-Contrast Noir          | noir, high contrast, chiaroscuro, hard shadows, dramatic composition, gritty | black/white + single accent (red or yellow)              | venetian blind shadows, rain streaks, silhouettes, smoky haze                                     |
| Comic Book Inked            | comic book, inked outlines, halftone, bold shadows, dynamic poses, panel-ready | primary colors, CMYK pop, off-white paper                | halftone dots, speed lines, speech bubble placeholders, thick inks                                |
| Anime / Manga               | anime style, manga linework, expressive faces, cel shading, clean highlights | pastel brights, high-saturation accents, soft gradients  | speed lines, stylized eyes, simplified backgrounds, impact frames                                 |
| Stylized 3D (Pixar-like)    | stylized 3d, soft global illumination, smooth shapes, friendly proportions, render | warm vibrant palette, soft bounce light                  | subsurface skin glow, soft rim light, clean materials, subtle depth fog                            |
| Watercolor Wash             | watercolor, loose brush, washed pigments, soft edges, hand-painted, artistic | muted pastels, earthy tones, cool blues                  | paint blooms, paper grain, imperfect edges, layered washes                                         |
| Minimal Monochrome          | minimalist, monochrome, grayscale, simple shapes, negative space, clean composition | grayscale ramp (charcoal to light gray)                  | strong staging, simplified props, value-based readability, diagram-like clarity                   |
| Retro 80s Synthwave         | synthwave, retro 80s, neon glow, vaporwave, grid horizon, futuristic | magenta/cyan/purple, neon highlights, dark navy          | chromatic aberration, glow bloom, scanlines, gradient skies                                        |

## Scene Template

```json
{
  "scene_num": 1,
  "timing": "0:00-0:02",
  "start_frame": {
    "prompt": "Wide shot of..., professional lighting, clean background",
    "style_tags": ["photorealistic", "4k", "professional"],
    "validation": {
      "required_elements": ["product", "background"],
      "forbidden": ["text", "watermarks"],
      "quality_threshold": 8
    }
  },
  "end_frame": {
    "prompt": "Same scene, product rotated 45 degrees...",
    "style_tags": ["photorealistic", "4k", "professional"],
    "validation": {
      "required_elements": ["product", "background"],
      "continuity_with_start": true,
      "quality_threshold": 8
    }
  },
  "motion": "smooth rotation, camera static",
  "audio": {
    "voiceover": "Introducing the all-new...",
    "music": "upbeat corporate, 120bpm",
    "sfx": []
  },
  "review_notes": "Check product visibility, no distortion"
}
```

## Shot Types

| Type | Framing | Start Shows | End Shows | Review Focus |
|------|---------|-------------|-----------|--------------|
| Wide | Full body + env | Context | Action result | Scene continuity |
| Medium | Chest up | Character | Emotional shift | Face accuracy |
| Close-up | Face/product | Detail | Impact | No artifacts |

## Camera Movements

| Movement | Start Frame | End Frame | Veo Directive | Review Focus |
|----------|-------------|-----------|---------------|--------------|
| Static | Scene A | Scene A (slight change) | static shot | Minimal drift |
| Dolly In | Wide view | Close view | camera moves forward | Smooth zoom |
| Dolly Out | Close view | Wide view | camera pulls back | No jitter |
| Pan L/R | Left composition | Right composition | camera pans | Fluid motion |

## Timing Template

- Scene 1 Hook: 0:00-0:02 (grab attention)
- Scene 2 Problem: 0:02-0:04 (pain point)
- Scene 3 Solution: 0:04-0:06 (product intro)
- Scene 4 CTA: 0:06-0:08 (call to action)

## Frame Validation Requirements

### Before Veo Generation

Each start/end frame pair must pass AI review:

| Check | Pass Criteria | Tool |
|-------|---------------|------|
| Quality | Score >= 8/10 | Gemini vision |
| Prompt match | All required elements present | Gemini vision |
| Abnormalities | No extra limbs, distorted faces | Gemini vision |
| Text accuracy | Any text spelled correctly | Gemini vision |
| Continuity | End frame N matches start frame N+1 | Gemini vision compare |
| Style | Consistent visual language | Gemini vision |

### Frame Review Prompt

```python
def review_frame(frame_path: str, prompt: dict) -> dict:
    """AI review of generated frame"""
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=[
            f"""Review this generated frame.
            Expected: {prompt['prompt']}
            Required elements: {prompt['validation']['required_elements']}
            Forbidden: {prompt['validation'].get('forbidden', [])}

            Check for:
            1. Quality (1-10)
            2. All required elements present?
            3. Any forbidden elements?
            4. AI abnormalities (extra limbs, distorted features)?
            5. Text accuracy if any visible text?

            Return JSON with passed/failed and issues.""",
            genai.types.Part.from_bytes(data=frame_bytes, mime_type='image/png')
        ]
    )
    return json.loads(response.text)
```

### Video Clip Review Prompt

```python
def review_video_clip(clip_path: str, scene: dict) -> dict:
    """AI review of generated video clip"""
    myfile = client.files.upload(file=clip_path)

    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=[
            f"""Review this AI-generated video clip.
            Expected motion: {scene['motion']}
            Start frame: {scene['start_frame']['prompt']}
            End frame: {scene['end_frame']['prompt']}

            Check for:
            1. Motion smoothness (1-10)
            2. Start/end frames match descriptions?
            3. Morphing artifacts?
            4. Temporal consistency (objects don't disappear)?
            5. Physics errors?

            Return JSON with passed/failed and timestamps of issues.""",
            myfile
        ]
    )
    return json.loads(response.text)
```

## Continuity Rules

1. **Visual continuity**: End frame N = Start frame N+1 (same composition)
2. **Style continuity**: Same tags across all prompts
3. **Color continuity**: Consistent palette throughout
4. **Lighting continuity**: Same lighting setup
5. **Character continuity**: Same clothing, position, expression flow

## Continuity Review

```python
def review_continuity(end_frame: str, next_start_frame: str) -> dict:
    """Check frame pair for continuity"""
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=[
            """Compare these two frames for video continuity.
            Frame 1 is the END of Scene N.
            Frame 2 is the START of Scene N+1.

            Check:
            1. Same scene/location?
            2. Objects in same position?
            3. Lighting consistent?
            4. Colors match?
            5. Would a cut between these be jarring?

            Return continuity_score (1-10) and issues.""",
            genai.types.Part.from_bytes(data=end_bytes, mime_type='image/png'),
            genai.types.Part.from_bytes(data=start_bytes, mime_type='image/png')
        ]
    )
    return json.loads(response.text)
```

## Best Practices

1. **Validate before proceeding**: Never skip review gates
2. **Specificity wins**: Include expressions, colors, lighting in prompts
3. **Style tags**: Apply consistently across ALL frame prompts
4. **Simple motion**: One movement per 2s scene for best results
5. **Audio sync**: Plan SFX timestamps during storyboard phase
6. **Regeneration budget**: Allow 2 retries per frame/clip

## Common Issues & Fixes

| Issue | Detection | Fix |
|-------|-----------|-----|
| Extra limbs | Vision review | Regenerate with "anatomically correct" |
| Face distortion | Vision review | Add "natural face, symmetrical" |
| Object morphing | Video review | Simplify motion, shorter duration |
| Style drift | Compare frames | Enforce identical style tags |
| Text errors | OCR review | Regenerate or post-process |

## Output Structure

Create directory: `assets/storyboards/{date}-{slug}/` containing:
- `storyboard.md` - Full storyboard document
- `storyboard.json` - Machine-readable scene data
- `scene-{N}-start.png` - Start frame images
- `scene-{N}-end.png` - End frame images

## `storyboard.md` Format

```markdown
# Storyboard: {Title}

**Generated:** {date} | **Aspect:** {ratio} | **Duration:** {total}s

## Resources

- Quality Review Workflow: `./quality-review-workflow.md`
- Script Templates: `./script-templates.md`
- Veo Prompt Guide: `./veo-prompt-guide.md`
- Vision Understanding: `../../ai-multimodal/references/vision-understanding.md`
- Video Analysis: `../../ai-multimodal/references/video-analysis.md`
