# Creative Asset Generation for Ads

## AI Image Generation Workflow

### Step 1: Search Prompt Database
```bash
python3 .claude/skills/ai-artist/scripts/search.py "product shot ad" --domain examples
python3 .claude/skills/ai-artist/scripts/search.py "lifestyle marketing" --domain style
```

### Step 2: Generate Images

**Standard (Flash)** — fast iterations, search-based prompts:
```bash
.claude/skills/.venv/bin/python3 .claude/skills/ai-multimodal/scripts/gemini_batch_process.py \
  --task generate --model gemini-2.5-flash-image \
  --prompt "<prompt>" --aspect-ratio <ratio> --size 2K --output <path>
```

**Creative (Pro)** — unique art direction, complex scenes:
```bash
.claude/skills/.venv/bin/python3 .claude/skills/ai-multimodal/scripts/gemini_batch_process.py \
  --task generate --model gemini-3-pro-image-preview \
  --prompt "<prompt>" --aspect-ratio <ratio> --size 4K --output <path>
```

### Aspect Ratios by Platform
| Platform/Placement | Ratio | Resolution |
|-------------------|-------|------------|
| Meta Feed | 1:1 | 1080x1080 |
| Meta Feed (tall) | 4:5 | 1080x1350 |
| Meta Stories/Reels | 9:16 | 1080x1920 |
| Google Display | 16:9 | 1200x628 |
| Google Display (square) | 1:1 | 1200x1200 |
| LinkedIn Sponsored | 16:9 | 1200x628 |
| TikTok In-Feed | 9:16 | 1080x1920 |

### Ad Image Prompt Patterns
```
Product shot: "Studio photo of [product] on [surface], soft shadow, white background,
  commercial photography, 4K, no text"

Lifestyle: "Young professional using [product] in [setting], natural light,
  warm tones, candid, 4K"

Before/After: "Split image: left side [problem state], right side [solution state],
  clean divider, commercial style"

Social proof: "Flat lay of [product] surrounded by 5-star review cards,
  modern minimalist, overhead shot"
```

### Brand Consistency
- Define style prompt once: `"dark academia, muted tones, film grain"` — reuse across all creatives
- Use same seed number for cohesive campaign variations
- Upload brand color hex + logo reference for color accuracy

## AI Video Generation (Veo 3.1)

### Generate Ad Videos
```bash
.claude/skills/.venv/bin/python3 .claude/skills/ai-multimodal/scripts/gemini_batch_process.py \
  --task generate-video --model veo-3.1-generate-preview \
  --prompt "<video_prompt>" --output <path>
```

### Video Ad Formats
| Length | Use Case | Platform |
|--------|----------|----------|
| 6s | Bumper / brand recall | YouTube |
| 15s | Awareness, product intro | All |
| 21-34s | UGC / performance | TikTok, Reels |
| 30-60s | Demo, testimonial | YouTube, Meta Feed |

### Video Prompt Patterns
```
Product demo: "15-second video: hands unboxing [product], close-up details,
  placing on desk, using it. Warm lighting, modern office. Native audio."

UGC-style: "Casual selfie-style video: person talking to camera about [product],
  natural lighting, authentic feel, subtle background music."

Before/after: "Split-screen video: left shows [problem], right shows [solution with product].
  Smooth transition. Professional but approachable."
```

### Hook Strategies (First 3 Seconds)
- **Problem hook**: "Struggling with [pain point]?"
- **Curiosity**: "You won't believe what this does..."
- **Social proof**: "10,000 customers switched to this"
- **Visual break**: Bold text overlay, unexpected motion
- **Direct address**: "Hey [audience], stop scrolling"

## Creative Testing Framework

### Testing Hierarchy
1. **Hook** — same body, 3 different openers; measure 3s hold rate
2. **Format** — static vs video vs carousel for same offer
3. **Angle** — benefit, social proof, fear, urgency

### Fatigue Detection
- CPM rising + CTR falling + frequency >3 = fatigue
- Refresh creatives every 2-4 weeks
- Always have 2-3 new variants in pipeline

### Winning Patterns (2025-2026)
- UGC/lo-fi outperforms polished brand ads
- Vertical 9:16 outperforms 1:1 on mobile
- First-frame text overlay boosts hold rate 15-20%
- Real faces > stock/AI avatars for trust
