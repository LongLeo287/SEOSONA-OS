# Thumbnail Design Guide

Create high-converting video thumbnails for maximum click-through rates.

## Thumbnail Fundamentals

### Psychology

1. **Pattern Interrupt:** Stand out from surrounding content
2. **Curiosity Gap:** Hint at value without revealing everything
3. **Emotional Trigger:** Evoke response (surprise, curiosity, desire)
4. **Trust Signal:** Show faces, quality, authenticity

### Platform Specifications

| Platform | Size | Ratio | Safe Zone | Format |
|----------|------|-------|-----------|--------|
| YouTube | 1280×720 | 16:9 | Center 60% | JPG, PNG |
| TikTok | 1080×1920 | 9:16 | Top 30% | JPG, PNG |
| Instagram | 1080×1080 | 1:1 | Center | JPG, PNG |
| LinkedIn | 1200×627 | 1.91:1 | Full | JPG, PNG |

## Design Principles

### The 3-Second Test

Thumbnail must communicate value in < 3 seconds at small size.

**Test:** View at 150×84px (YouTube mobile size)
- Can you identify subject?
- Is text readable?
- Is emotion clear?

### Visual Hierarchy

```
1. FACE/EXPRESSION (if applicable)
    ↓
2. KEY OBJECT/PRODUCT
    ↓
3. TEXT (3-4 words max)
    ↓
4. BRAND ELEMENT
    ↓
5. BACKGROUND
```

### Color Strategy

**High Contrast:**
- Use complementary colors
- Avoid matching platform colors (avoid red on YouTube)
- Bright colors attract attention

**Recommended Palettes:**
- Yellow + Black (high visibility)
- Blue + Orange (complementary)
- White + Bold color (clean)
- Gradient backgrounds (depth)

## Thumbnail Types

### Face-Forward

Best for: Vlogs, tutorials, testimonials

```
Layout:
┌─────────────────────────┐
│  TEXT       [FACE]      │
│  HERE    (expression)   │
│           [Product]     │
└─────────────────────────┘
```

**Requirements:**
- Clear facial expression
- Eyes visible and engaging
- Emotion matches content
- Face in right 2/3

### Product Focus

Best for: Reviews, demos, unboxings

```
Layout:
┌─────────────────────────┐
│     BIG TEXT            │
│   [PRODUCT IMAGE]       │
│    hero placement       │
└─────────────────────────┘
```

**Requirements:**
- Product clearly visible
- High-quality image
- Contrast with background
- Supporting text

### Before/After

Best for: Transformations, tutorials, results

```
Layout:
┌────────────┬────────────┐
│   BEFORE   │   AFTER    │
│   (dull)   │  (bright)  │
│            │            │
└────────────┴────────────┘
```

**Requirements:**
- Clear visual difference
- Arrow or divider
- Dramatic contrast
- Transformation obvious

### List/Number

Best for: Tips, rankings, compilations

```
Layout:
┌─────────────────────────┐
│    5 WAYS TO...         │
│        [icons]          │
│    [visual elements]    │
└─────────────────────────┘
```

**Requirements:**
- Large, bold number
- Clear topic indicator
- Visual representations
- Numbered badge

### Curiosity Gap

Best for: Revealing content, mysteries, surprises

```
Layout:
┌─────────────────────────┐
│    THIS IS WHY...       │
│    [blurred/hidden]     │
│         ?               │
└─────────────────────────┘
```

**Requirements:**
- Something hidden/obscured
- Question element
- Intrigue without clickbait
- Promise of reveal

## Text Best Practices

### Typography Rules

| Element | Size | Style |
|---------|------|-------|
| Main text | 72-96pt | Bold, sans-serif |
| Secondary | 48-60pt | Semi-bold |
| Brand/logo | 24-36pt | Consistent |

### Word Count

- **Ideal:** 3-4 words
- **Maximum:** 6 words
- **No text:** Also valid (visual-only)

### Effective Text

**Do:**
- Use power words (FREE, NEW, SECRET, HACK)
- Create curiosity ("I tried..." "What happens when...")
- Include numbers ("5 Ways", "$1000")
- Use ALL CAPS sparingly

**Don't:**
- Full sentences
- Small text
- Script/decorative fonts
- Text over busy areas

### Text Placement

```
Safe zones:
┌─────────────────────────┐
│ [TEXT]              [X] │  ← Avoid corners (UI elements)
│                         │
│    BEST PLACEMENT       │  ← Center-left works well
│                         │
│                [TIME]   │  ← Avoid bottom-right
└─────────────────────────┘
```

## Element Guidelines

### Faces

**Expression Types:**
- Surprised (mouth open, wide eyes)
- Excited (big smile)
- Thoughtful (raised eyebrow)
- Curious (slight head tilt)

**Technical:**
- High resolution
- Good lighting on face
- Eyes visible
- Clean background behind face

### Products

**Photography:**
- Hero angle
- Studio lighting or bright natural
- Shadow for depth
- Multiple angles for context

**Composition:**
- Product fills 40-60% of frame
- Clear space around product
- Consistent style with brand

### Graphics/Icons

**Usage:**
- Arrows (pointing to key element)
- Circles/highlights (drawing attention)
- Badges (NEW, FREE, etc.)
- Emoji (sparingly, if brand-appropriate)

## Platform-Specific Tips

### YouTube

- Time stamp visible in corner (avoid)
- Mobile-first design
- A/B test different versions
- Update underperforming thumbnails

### TikTok

- First frame often becomes thumbnail
- Can upload custom cover
- Vertical format priority
- Bold, simple designs

### Instagram Reels

- Taken from video or custom
- Matches feed aesthetic
- Profile image overlay consideration
- Caption may appear

### LinkedIn

- Professional aesthetic
- Less flashy, more credible
- Face photos work well
- Corporate color schemes

## Imagen 4 Thumbnail Prompts

### Face-Forward Thumbnail

```
Professional YouTube thumbnail:
Person: {description}, {expression}
Composition: Face prominent right side
Background: Clean gradient, {color}
Text overlay space: Left third
Style: High contrast, professional
Lighting: Studio quality, flattering
```

### Product Thumbnail

```
Product marketing thumbnail:
Product: {product_name}, hero angle
Background: Clean {color}, subtle gradient
Lighting: Professional studio
Composition: Product centered, text space above
Style: Premium, high-end
Quality: Sharp, high resolution
```

### Before/After Thumbnail

```
Split comparison thumbnail:
Left side: "Before" {condition}
Right side: "After" {result}
Divider: Arrow or slash in center
Colors: Muted left, vibrant right
Text: BEFORE/AFTER labels
Style: Clear transformation visual
```

## Checklist

### Pre-Design

- [ ] Understand video content
- [ ] Identify key emotion/message
- [ ] Choose thumbnail type
- [ ] Select color scheme
- [ ] Plan text (3-4 words)

### Design

- [ ] Create at correct size
- [ ] Apply visual hierarchy
- [ ] Add face/product prominently
- [ ] Include minimal, bold text
- [ ] Ensure high contrast

### Quality Check

- [ ] Test at mobile size (150×84px)
- [ ] Verify text readability
- [ ] Check face/emotion clarity
- [ ] Confirm no corner conflicts
- [ ] Match brand guidelines

### A/B Testing

- [ ] Create 2-3 variations
- [ ] Test different expressions
- [ ] Try different text
- [ ] Compare color schemes
- [ ] Track CTR by version

## Tools Integration

### Imagen 4 Generation

Use `ai-multimodal` skill:
```bash
python scripts/gemini_batch_process.py \
  --task generate \
  --prompt "YouTube thumbnail: {description}" \
  --aspect-ratio 16:9 \
  --output thumbnail.png
```

### FFmpeg Thumbnail Extraction

```bash
# Extract frame from video
ffmpeg -i video.mp4 -ss 00:00:02 -vframes 1 thumbnail.png

# Resize to YouTube specs
ffmpeg -i thumbnail.png -vf "scale=1280:720" youtube_thumb.png
```

## Resources

- [Video Optimization](./video-optimization.md)
- [Platform Specs](./video-types-specs.md)
- [Image Generation](../../ai-multimodal/references/image-generation.md)
