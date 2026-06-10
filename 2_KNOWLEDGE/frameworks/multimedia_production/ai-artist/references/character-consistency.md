# Character Consistency in Image Generation

Generate multiple images of the same character across different scenes, poses, and contexts while maintaining visual identity.

## When to Use

- Video storyboards with recurring characters
- Marketing campaigns with brand mascots/personas
- Comic/illustration series with same characters
- Product demos featuring consistent human subjects

## Workflow: Portrait-First Approach

### Step 1: Generate Character Portrait

Create a detailed reference portrait first. Use Nano Banana Pro for best quality.

```bash
# Generate character portrait with Pro model
.opencode/skills/.venv/bin/python3 .opencode/skills/ai-multimodal/scripts/gemini_batch_process.py \
  --task generate --model gemini-3-pro-image-preview \
  --prompt "<character_portrait_prompt>" \
  --aspect-ratio 2:3 --size 4K --output <character_name>-portrait.png
```

**Portrait Prompt Template:**
```
Professional portrait photograph of [character_name]: [gender], [age range],
[ethnicity/skin tone], [hair: color, style, length], [eye color],
[facial features: shape, distinguishing marks], [expression],
[clothing: detailed description], [accessories].
Shot on Canon EOS R5, 85mm f/1.4 lens, soft studio lighting,
neutral gray background, sharp focus on face, 4K resolution.
```

**Critical Details to Lock:**
- Hair: exact color, style, length
- Eyes: color, shape
- Face: shape, distinguishing features
- Clothing: specific items, colors, materials
- Build: body type, height impression
- Accessories: glasses, jewelry, etc.

### Step 2: Use Portrait as Reference for Scene Frames

Pass the portrait image as reference when generating subsequent frames.

**Method A: CLI with --files (single reference)**
```bash
# Generate scene with character reference
.opencode/skills/.venv/bin/python3 .opencode/skills/ai-multimodal/scripts/gemini_batch_process.py \
  --task generate --model gemini-3-pro-image-preview \
  --files <character_name>-portrait.png \
  --prompt "Same person from the reference image, now [scene_description]. Maintain exact facial features, hair, and clothing." \
  --aspect-ratio 16:9 --size 4K --output scene-01.png
```

**Method B: Python API (multiple references)**
```python
from google import genai
from google.genai import types
from PIL import Image

client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))
portrait = Image.open('character-portrait.png')

response = client.models.generate_content(
    model='gemini-3-pro-image-preview',
    contents=[
        'Same person from the reference photo, now standing in a modern office. '
        'Maintain exact same facial features, hair color/style, eye color, and clothing. '
        'Medium shot, natural office lighting, 16:9 cinematic composition.',
        portrait
    ],
    config=types.GenerateContentConfig(
        response_modalities=['IMAGE'],
        image_config=types.ImageConfig(aspect_ratio='16:9')
    )
)
```

### Step 3: Multi-Character Scenes

For scenes with multiple characters, pass all character portraits as references.

```python
# Up to 5 human references in Pro model
char_a = Image.open('character-a-portrait.png')
char_b = Image.open('character-b-portrait.png')

response = client.models.generate_content(
    model='gemini-3-pro-image-preview',
    contents=[
        'Two people from the reference photos having a conversation in a cafe. '
        'Person 1 (first reference) sits on the left, Person 2 (second reference) on the right. '
        'Maintain exact facial features, hair, clothing for both characters. '
        'Wide shot, warm cafe lighting.',
        char_a, char_b
    ],
    config=types.GenerateContentConfig(
        response_modalities=['IMAGE'],
        image_config=types.ImageConfig(aspect_ratio='16:9')
    )
)
```

## Prompt Engineering for Consistency

### Identity Anchors (include in EVERY prompt)

Always repeat key identity descriptors to anchor the character:

```
Same person from the reference: [hair color] [hair style] hair,
[eye color] eyes, [clothing description], [key accessories].
```

### Scene Variation Prompt Template

```
[Identity anchor from reference image].
Now [action/pose] in [environment/setting].
[Lighting description]. [Camera angle and lens].
[Mood/atmosphere]. Maintain character identity perfectly.
```

### Anti-Drift Techniques

| Technique | Example |
|-----------|---------|
| Repeat identity | "Same silver-haired woman with neon visor" in every prompt |
| Lock clothing | "Wearing the EXACT same red leather coat from reference" |
| Specify unchanged | "Face, hair, and build MUST match reference exactly" |
| Anchor features | Put identity descriptors FIRST in prompt |
| Use ALL CAPS | "SAME person, IDENTICAL features" for emphasis |

## Model Selection

| Model | Character Consistency | Max Human Refs | Best For |
|-------|----------------------|----------------|----------|
| `gemini-3-pro-image-preview` | Excellent | 5 | Final production frames |
| `gemini-2.5-flash-image` | Good | 3 | Quick iterations, drafts |

**Always use Pro model** for character-consistent storyboard frames.

## Limitations

- Max 5 human reference images per request (Pro model)
- Clothing changes possible but reduce consistency
- Extreme pose changes may affect facial similarity
- Style changes (photorealistic → cartoon) reduce identity preservation
- No deterministic seed control in Nano Banana API

## Tips

1. **Portrait quality matters** - higher quality reference = better consistency
2. **Neutral expression first** - generate neutral portrait, then add expressions
3. **Same style throughout** - keep art style consistent across all frames
4. **Front-facing portrait** - 3/4 angle works best as reference
5. **Describe, don't assume** - always describe the character explicitly, don't rely on "same person" alone
