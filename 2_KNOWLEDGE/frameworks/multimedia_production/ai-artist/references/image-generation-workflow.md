# Image Generation Workflow

Two-option workflow for generating images with Nano Banana models.

## Quick Reference

| Option | Model | Use Case | Speed | Quality |
|--------|-------|----------|-------|---------|
| **Standard** | `gemini-2.5-flash-image` | Search-based prompts, fast iteration | Fast | Good |
| **Creative** | `gemini-3-pro-image-preview` | Out-of-box art direction, complex scenes | Slower | Best |

## Standard Option (Search-Based)

1. Search for relevant prompts from 6000+ examples
2. Adapt found prompt to user requirements
3. Generate with Flash model for speed

```bash
# Step 1: Find similar prompts
python3 .opencode/skills/ai-artist/scripts/search.py "<keywords>" --domain examples --max-results 3

# Step 2: Generate with Flash
.opencode/skills/.venv/bin/python3 .opencode/skills/ai-multimodal/scripts/gemini_batch_process.py \
  --task generate \
  --model gemini-2.5-flash-image \
  --prompt "<adapted_prompt>" \
  --aspect-ratio <ratio> \
  --size 2K \
  --output <output_path>
```

## Creative Option (Art Direction)

1. Craft original prompt with unique art direction
2. Apply advanced techniques (narrative, emphasis, constraints)
3. Generate with Pro model for best quality

```bash
# Generate with Pro model
.opencode/skills/.venv/bin/python3 .opencode/skills/ai-multimodal/scripts/gemini_batch_process.py \
  --task generate \
  --model gemini-3-pro-image-preview \
  --prompt "<creative_prompt>" \
  --aspect-ratio <ratio> \
  --size 4K \
  --output <output_path>
```

## Arguments Reference

| Argument | Values | Description |
|----------|--------|-------------|
| `--model` | `gemini-2.5-flash-image`, `gemini-3-pro-image-preview` | Model selection |
| `--aspect-ratio` | `1:1`, `16:9`, `9:16`, `3:4`, `4:3`, etc. | Output dimensions |
| `--size` | `1K`, `2K`, `4K` | Resolution (4K only with Pro) |
| `--num-images` | `1-4` | Number of variations |
| `--output` | path | Output file path |

## Art Direction Styles (Creative Option)

When using Creative option, apply one of these styles:

| Style | Description | Key Elements |
|-------|-------------|--------------|
| **Cyberpunk Neon** | Blade Runner aesthetic | Holographic, neon, rain, cityscape, Japanese text |
| **Vaporwave** | 80s/90s retro | Greek statues, sunset grid, chrome, Windows 95 |
| **Isometric 3D** | Miniature diorama | Tilt-shift, floating island, cute buildings |
| **Bento Grid** | Apple liquid glass | Transparent cards, gradient glow, modular layout |
| **Editorial** | Magazine style | Clean white, bold typography, professional |
| **Cinematic** | Film still | Dramatic lighting, wide aspect, lens effects |

## Prompt Structure by Style

### Standard (Flash)
```
[Subject] in [setting]. [Style keywords]. [Quality modifiers]. [Aspect ratio context].
```

### Creative (Pro)
```
Create a [art_direction_style] [content_type] titled '[TITLE]'.
Style: [detailed_aesthetic_description].
Layout: [composition_details].

Main visual: [central_element_description].

Elements/Modules:
• [element_1]: [description]
• [element_2]: [description]
...

Style details: [colors, effects, typography].
Footer: [attribution].
[Quality descriptors].
```

## Example Workflows

### Infographic (Standard)
```bash
# Search for similar
python3 .opencode/skills/ai-artist/scripts/search.py "bento grid infographic" --domain examples

# Generate
.opencode/skills/.venv/bin/python3 .opencode/skills/ai-multimodal/scripts/gemini_batch_process.py \
  --task generate --model gemini-2.5-flash-image \
  --prompt "Premium bento grid infographic titled 'Marketing Trends'. 8 modules with stats. Purple gradient background." \
  --aspect-ratio 16:9 --size 2K --output output/infographic.png
```

### Infographic (Creative - Cyberpunk)
```bash
.opencode/skills/.venv/bin/python3 .opencode/skills/ai-multimodal/scripts/gemini_batch_process.py \
  --task generate --model gemini-3-pro-image-preview \
  --prompt "Create a cyberpunk neon holographic infographic titled 'MARKETING TRENDS 2026'. Style: Blade Runner meets Ghost in Shell, dark cityscape with rain and neon reflections. Main visual: Giant holographic AI head made of data streams. 10 floating data cards with neon glow around the AI head. Footer: 'KANTAR // 2026' in futuristic font." \
  --aspect-ratio 1:1 --size 4K --output output/infographic-cyberpunk.png
```

## Tips

1. **Standard**: Best for known formats (quote cards, thumbnails, product shots)
2. **Creative**: Best for unique visuals, brand differentiation, social media impact
3. **Combine**: Use Standard to explore, Creative for final polish
4. **Batch**: Generate multiple variations with `--num-images 4`
