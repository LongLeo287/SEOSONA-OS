---
description: 💡💡 Create a video using Veo 3.1
argument-hint: [script-file-or-storyboard-or-prompt]
---

Create a video with Veo 3.1 pipeline.

## Your Brief

<args>$ARGUMENTS</args>

## Required Skills (Priority Order)

1. **Activate `video-production`**
   - Load:
     - `references/production-workflow.md`
     - `references/storyboard-format.md`
     - `references/veo-prompt-guide.md`
     - `references/video-art-directions.md`
2. **Activate `creativity`**
   - Load for style templates, color psychology, voiceover styles, audio/music trends
3. **Activate `ai-multimodal`**
   - Use for Nano Banana Flash / Veo 3.1 generation and review gates.
4. **Activate `media-processing`**
   - Use for FFmpeg assembly + platform exports.
5. **Activate `assets-organizing`**
   - Use for standardized output paths and naming conventions.

## Parse Input

- If `$ARGUMENTS` is a file path:
  - If it looks like a **script** (e.g. `content/video/.../script.md`) → start at **Script**.
  - If it looks like a **storyboard** (e.g. `assets/storyboards/.../storyboard.md|storyboard.json`) → start at **Storyboard**.
- Otherwise treat `$ARGUMENTS` as a **text prompt** describing the video concept.

## Required Inputs (ask if missing)

- **Platform**: `youtube` (16:9) | `tiktok` (9:16) | `reels` (9:16) | `youtube-shorts` (9:16) | `instagram` (1:1) | `linkedin` (16:9)
- **Goal**: what should the viewer do/think/feel?
- **Audience**: who is this for?
- **CTA**: what action should the viewer take?

If the user provides only a prompt, infer defaults and ask only for missing items that materially change the video.

## Workflow

### Step 0: Preflight

1. Confirm `GEMINI_API_KEY` is set in the environment.
2. Confirm Python deps for `ai-multimodal` are installed (`google-genai`, `python-dotenv`, `pillow`).
3. Confirm `ffmpeg` is installed if you will export platform versions.
4. Determine:
   - **Slug** (kebab-case)
   - **Output platform** and **aspect ratio**
5. Create output directories:
   - `assets/videos/{date}-{slug}/`
   - `assets/storyboards/{date}-{slug}/`

### Step 1: Script (if starting from prompt)

If the input is a prompt (not a script file):

1. Execute:

```text
/video:script:create {type} "{prompt}"
```

2. Use the generated script output:
   - `content/video/{type}/{date}-{slug}/script.md`

### Step 2: Storyboard (if starting from prompt or script)

If the input is a prompt or a script (not a storyboard yet):

1. Execute:

```text
/video:storyboard:create {script-file-or-prompt}
```

Recommended handoff (when Step 1 was used):

```text
/video:storyboard:create content/video/{type}/{date}-{slug}/script.md
```

2. Use the generated storyboard output:
   - `assets/storyboards/{date}-{slug}/storyboard.md`
   - `assets/storyboards/{date}-{slug}/storyboard.json`

### Step 3: Generate START/END frames (Nano Banana Flash) + Review Gate

This step is handled by `/video:storyboard:create ...`.

Confirm the storyboard directory contains:
- `scene-{N}-start.png`
- `scene-{N}-end.png`

### Step 4: Generate Audio (Voiceover + Music) + Review Gates

Generate audio assets based on script/storyboard `audio` directives. This step can run in parallel with Step 5 (video clips). Each audio asset must pass review before proceeding.

#### 4a: Generate Voiceover (if script has narration)

Extract voiceover text from each scene and generate with Gemini TTS:

```bash
python .claude/skills/ai-multimodal/scripts/gemini_batch_process.py \
  --task generate-audio \
  --model gemini-2.5-flash-preview-tts \
  --voice "Charon" \
  --prompt "Audio Profile: Professional narrator. Director's Notes: Clear, measured pace. Transcript: {voiceover_text}" \
  --output "assets/videos/{date}-{slug}/voiceover-scene-01.wav"
```

Available voices: `Charon` (professional), `Puck` (energetic), `Kore` (authoritative), `Aoede` (warm), `Zephyr` (cheerful).

**Review Gate**: Analyze voiceover and regenerate up to **2** times if it fails:

```bash
python .claude/skills/ai-multimodal/scripts/gemini_batch_process.py \
  --task analyze-audio \
  --files "assets/videos/{date}-{slug}/voiceover-scene-01.wav" \
  --prompt "Review this voiceover for video narration. Check:
    1. Speech clarity (1-10) - words clearly pronounced?
    2. Pacing (1-10) - appropriate speed for video duration?
    3. Tone match (1-10) - matches requested style?
    4. Audio quality (1-10) - no artifacts, distortion, clipping?
    5. Timing - approximate duration in seconds?
    Return JSON: {passed: bool, scores: {...}, issues: [...], suggestions: [...]}"
```

Pass criteria: All scores >= 7, no critical issues.

Reference: `.claude/skills/video-production/references/audio-directive-guide.md`

#### 4b: Generate Background Music (Lyria)

Generate background music matching video mood and duration:

```bash
python .claude/skills/ai-multimodal/scripts/gemini_batch_process.py \
  --task generate-music \
  --duration {total_video_seconds} \
  --prompts '[{"prompt": "{mood} background music for video", "weight": 0.9}, {"prompt": "Non-distracting underscore", "weight": 0.6}]' \
  --config '{"bpm": 100, "brightness": 0.5, "density": 0.4}' \
  --output "assets/videos/{date}-{slug}/music.wav"
```

Mood presets from storyboard:
- **Corporate/Product Demo**: `bpm: 100, brightness: 0.6, density: 0.4`
- **Social Media/TikTok**: `bpm: 128, brightness: 0.7, density: 0.7`
- **Testimonial/Emotional**: `bpm: 70, brightness: 0.4, density: 0.3`

**Review Gate**: Analyze music and regenerate up to **2** times if it fails:

```bash
python .claude/skills/ai-multimodal/scripts/gemini_batch_process.py \
  --task analyze-audio \
  --files "assets/videos/{date}-{slug}/music.wav" \
  --prompt "Review this background music for video. Check:
    1. Mood match (1-10) - matches requested style/mood?
    2. Energy level (1-10) - appropriate for video type?
    3. Production quality (1-10) - clean, no artifacts?
    4. Loop-ability (1-10) - smooth transitions, no jarring endings?
    5. Background suitability (1-10) - non-distracting, supports content?
    6. Duration - matches expected video length?
    Return JSON: {passed: bool, scores: {...}, issues: [...], suggestions: [...]}"
```

Pass criteria: All scores >= 7, duration within 10% of target.

Reference: `.claude/skills/ai-multimodal/references/music-generation.md`

### Step 5: Generate Veo clips (image-to-video) + Review Gate

For each scene:

1. Generate a Veo clip using the scene’s motion/camera directive and reference frames:
   - `assets/videos/{date}-{slug}/scene-{NN}.mp4`
2. Review the clip using Gemini video understanding and regenerate up to **2** times if it fails:
   - Motion smoothness
   - Temporal consistency (no object drift/morphing)
   - Start/end frames match

Recommended CLI pattern (repeat per scene):

```bash
python .claude/skills/ai-multimodal/scripts/gemini_batch_process.py \
  --task generate-video \
  --model veo-3.1-generate-preview \
  --aspect-ratio "{16:9|9:16|1:1}" \
  --resolution "1080p" \
  --reference-images \
    "assets/storyboards/{date}-{slug}/scene-01-start.png" \
    "assets/storyboards/{date}-{slug}/scene-01-end.png" \
  --prompt "{veo prompt: style + camera + motion + constraints}" \
  --output "assets/videos/{date}-{slug}/scene-01.mp4"
```

Optional quality review (recommended):

```bash
node .claude/skills/video-production/scripts/analyze-video.cjs \
  --video "assets/videos/{date}-{slug}/scene-01.mp4" \
  --task quality \
  --format markdown \
  --output "assets/videos/{date}-{slug}/scene-01.quality.md"
```

### Step 6: Assemble master video with audio (FFmpeg)

1. Create a concat file at `assets/videos/{date}-{slug}/concat.txt`:
   - `file 'scene-01.mp4'`
   - `file 'scene-02.mp4'`
   - ...

2. Concatenate video clips (silent):

```bash
ffmpeg -y -f concat -safe 0 -i "assets/videos/{date}-{slug}/concat.txt" -c copy "assets/videos/{date}-{slug}/video-only.mp4"
```

3. Concatenate voiceovers (if multiple):

```bash
ffmpeg -y -i "concat:voiceover-scene-01.wav|voiceover-scene-02.wav|..." -c copy "assets/videos/{date}-{slug}/voiceover-full.wav"
```

4. Mix audio layers (voiceover + music + Veo SFX):

```bash
ffmpeg -y \
  -i "assets/videos/{date}-{slug}/video-only.mp4" \
  -i "assets/videos/{date}-{slug}/voiceover-full.wav" \
  -i "assets/videos/{date}-{slug}/music.wav" \
  -filter_complex "
    [1:a]volume=1.0[vo];
    [2:a]volume=0.3[music];
    [vo][music]amix=inputs=2:duration=first[aout]
  " \
  -map 0:v -map "[aout]" -c:v copy -c:a aac \
  "assets/videos/{date}-{slug}/master.mp4"
```

Volume guidelines:
- **Voiceover**: 1.0 (primary, always audible)
- **Music**: 0.2-0.4 (background, atmosphere)
- **SFX**: 0.7-0.8 (supporting, impactful)

Optional: Add ducking (auto-lower music under voice):

```bash
ffmpeg -y \
  -i "assets/videos/{date}-{slug}/video-only.mp4" \
  -i "assets/videos/{date}-{slug}/voiceover-full.wav" \
  -i "assets/videos/{date}-{slug}/music.wav" \
  -filter_complex "
    [2:a]sidechaincompress=threshold=0.01:ratio=4:attack=10:release=100[ducked];
    [1:a][ducked]amix=inputs=2[aout]
  " \
  -map 0:v -map "[aout]" -c:v copy -c:a aac \
  "assets/videos/{date}-{slug}/master.mp4"
```

Reference: `.claude/skills/video-production/references/audio-directive-guide.md`

### Step 7: Export platform versions (optional)

If the user wants multiple platforms, create optimized exports:

```bash
node .claude/skills/video-production/scripts/optimize-for-platform.cjs \
  --video "assets/videos/{date}-{slug}/master.mp4" \
  --all
```

### Step 8: Captions (optional)

Generate captions/subtitles:

```bash
node .claude/skills/video-production/scripts/extract-captions.cjs \
  --video "assets/videos/{date}-{slug}/master.mp4" \
  --format srt \
  --output "assets/videos/{date}-{slug}/captions.srt"
```

### Step 9: Final Quality + Marketing Review (recommended)

Save publish readiness checks:

```bash
node .claude/skills/video-production/scripts/analyze-video.cjs \
  --video "assets/videos/{date}-{slug}/master.mp4" \
  --task marketing \
  --format markdown \
  --output "assets/videos/{date}-{slug}/analysis-marketing.md"
```

## Output Structure

- Video:
  - `assets/videos/{date}-{slug}/master.mp4`
  - `assets/videos/{date}-{slug}/scene-01.mp4` (and other scenes)
  - `assets/videos/{date}-{slug}/captions.srt` (optional)
  - `assets/videos/{date}-{slug}/analysis-marketing.md` (recommended)
- Audio:
  - `assets/videos/{date}-{slug}/voiceover-scene-01.wav` (per scene, if narration)
  - `assets/videos/{date}-{slug}/voiceover-full.wav` (concatenated)
  - `assets/videos/{date}-{slug}/music.wav` (background track)
- Storyboard:
  - `assets/storyboards/{date}-{slug}/storyboard.md`
  - `assets/storyboards/{date}-{slug}/storyboard.json`
  - `assets/storyboards/{date}-{slug}/scene-01-start.png`
  - `assets/storyboards/{date}-{slug}/scene-01-end.png`
- Script (if created):
  - `content/video/{type}/{date}-{slug}/script.md`

## Examples

```text
/video:create "30-second TikTok ad for ClaudeKit showing: problem -> workflow -> aha moment -> CTA"
/video:create content/video/reel/claudekit-workflow/script.md
/video:create assets/storyboards/claudekit-workflow/storyboard.json
```

