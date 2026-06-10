# Quality Review Workflow

AI-powered quality gates at every stage using ai-multimodal skill for automated review.

Activate `ai-multimodal` skill.

## Review Philosophy

Every production step requires validation before proceeding. Catches:
- Typos and grammar errors
- Visual inconsistencies
- Abnormal AI-generated actions
- Audio/video sync issues
- Brand guideline violations

## Review Gates Overview

```
SCRIPT → [Review 1] → STORYBOARD → [Review 2] → FRAMES → [Review 3] → VIDEO → [Review 4] → FINAL
   ↑         ↓              ↑           ↓           ↑          ↓          ↑          ↓
   └── Fix ──┘              └── Fix ────┘           └── Fix ───┘          └── Fix ───┘
```

## Gate 1: Script Review

**When**: After script generation, before storyboard
**Tool**: Gemini 2.5 text analysis

### Checklist

| Check | Description | Auto-Fix |
|-------|-------------|----------|
| Grammar | Typos, punctuation | Yes |
| Timing | Scene duration feasibility | No |
| Brand voice | Tone consistency | No |
| CTA clarity | Call-to-action strength | No |
| Hooks | First 3 seconds impact | No |

### Implementation

```python
def review_script(script_text: str) -> dict:
    """Review script for issues before storyboard"""
    prompt = """Review this video script for:
    1. Grammar/typos - list all errors with corrections
    2. Timing issues - flag scenes that exceed 8 seconds
    3. Brand voice consistency - check professional tone
    4. CTA effectiveness - rate 1-10
    5. Hook strength (first 3 sec) - rate 1-10

    Return JSON:
    {
      "passed": bool,
      "grammar_errors": [{line: int, error: str, fix: str}],
      "timing_issues": [{scene: int, duration: str, issue: str}],
      "brand_score": int,
      "cta_score": int,
      "hook_score": int,
      "recommendations": [str]
    }
    """
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=[prompt, script_text],
        config=genai.types.GenerateContentConfig(
            response_mime_type='application/json'
        )
    )
    return json.loads(response.text)
```

### Pass Criteria

- Zero grammar errors
- All scenes ≤ 8 seconds
- Brand score ≥ 7
- CTA score ≥ 7
- Hook score ≥ 7

## Gate 2: Storyboard Review

**When**: After storyboard/frame prompt generation, before Imagen 4
**Tool**: Gemini 2.5 text analysis

### Checklist

| Check | Description | Auto-Fix |
|-------|-------------|----------|
| Prompt clarity | Unambiguous descriptions | No |
| Visual continuity | End frame N = Start frame N+1 | No |
| Style consistency | Same visual language | Yes |
| Shot variety | Mix of wide/medium/close | No |
| Frame feasibility | Can Imagen generate this? | No |

### Implementation

```python
def review_storyboard(storyboard: list) -> dict:
    """Review storyboard prompts for Imagen generation"""
    prompt = """Review these storyboard frame descriptions:
    1. Prompt clarity - rate each 1-10
    2. Visual continuity - check end frames match next start frames
    3. Style tags - ensure consistent style across all prompts
    4. Shot variety - analyze shot type distribution
    5. Imagen feasibility - flag prompts likely to fail

    Return JSON:
    {
      "passed": bool,
      "scenes": [{
        "scene_num": int,
        "start_clarity": int,
        "end_clarity": int,
        "continuity_issue": str | null,
        "missing_style_tags": [str]
      }],
      "shot_distribution": {wide: int, medium: int, close: int},
      "feasibility_issues": [{scene: int, prompt: str, issue: str}],
      "recommendations": [str]
    }
    """
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=[prompt, json.dumps(storyboard)],
        config=genai.types.GenerateContentConfig(
            response_mime_type='application/json'
        )
    )
    return json.loads(response.text)
```

### Pass Criteria

- All prompt clarity scores ≥ 8
- Zero continuity issues
- Consistent style tags across scenes
- At least 2 shot types used
- Zero feasibility warnings

## Gate 3: Frame Review

**When**: After Imagen 4 frame generation, before Veo
**Tool**: Gemini 2.5 vision understanding

### Checklist

| Check | Description | Auto-Fix |
|-------|-------------|----------|
| Visual quality | Resolution, artifacts | Re-gen |
| Text accuracy | Any text readable/correct | Re-gen |
| Prompt adherence | Matches description | Re-gen |
| Continuity | Start/end pairs consistent | Re-gen |
| Abnormalities | Extra limbs, faces, etc. | Re-gen |

### Implementation

```python
def review_frames(start_frame_path: str, end_frame_path: str, scene_prompt: dict) -> dict:
    """Review generated frames using vision analysis"""
    with open(start_frame_path, 'rb') as f:
        start_bytes = f.read()
    with open(end_frame_path, 'rb') as f:
        end_bytes = f.read()

    prompt = f"""Analyze these START and END frames for video generation.

    Expected START: {scene_prompt['start_frame']}
    Expected END: {scene_prompt['end_frame']}

    Check for:
    1. Visual quality issues (artifacts, blur, noise)
    2. Text accuracy if any visible text
    3. Does each frame match its description?
    4. Continuity - could these transition smoothly?
    5. AI abnormalities (wrong anatomy, impossible physics, extra limbs)
    6. Brand consistency if brand elements present

    Return JSON:
    {{
      "passed": bool,
      "start_frame": {{
        "quality_score": int,
        "matches_prompt": bool,
        "issues": [str],
        "text_errors": [str],
        "abnormalities": [str]
      }},
      "end_frame": {{
        "quality_score": int,
        "matches_prompt": bool,
        "issues": [str],
        "text_errors": [str],
        "abnormalities": [str]
      }},
      "continuity_score": int,
      "regenerate_start": bool,
      "regenerate_end": bool,
      "recommendations": [str]
    }}
    """

    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=[
            prompt,
            genai.types.Part.from_bytes(data=start_bytes, mime_type='image/png'),
            genai.types.Part.from_bytes(data=end_bytes, mime_type='image/png')
        ],
        config=genai.types.GenerateContentConfig(
            response_mime_type='application/json'
        )
    )
    return json.loads(response.text)
```

### Pass Criteria

- Quality scores ≥ 8 for both frames
- Both frames match prompts
- Zero abnormalities detected
- Continuity score ≥ 7
- No regeneration recommended

## Gate 4: Video Clip Review

**When**: After Veo generation, before mixing
**Tool**: Gemini 2.5 video analysis

### Checklist

| Check | Description | Auto-Fix |
|-------|-------------|----------|
| Motion quality | Smooth, natural | Re-gen |
| Frame adherence | Starts/ends as expected | Re-gen |
| Action accuracy | Movement matches script | Re-gen |
| Duration | Correct scene length | Trim |
| Abnormalities | Morphing, jitter, artifacts | Re-gen |

### Implementation

```python
def review_video_clip(video_path: str, scene: dict) -> dict:
    """Review generated video clip using video analysis"""
    myfile = client.files.upload(file=video_path)

    # Wait for processing
    while myfile.state.name == 'PROCESSING':
        time.sleep(1)
        myfile = client.files.get(name=myfile.name)

    prompt = f"""Analyze this AI-generated video clip.

    Expected start frame: {scene['start_frame']}
    Expected end frame: {scene['end_frame']}
    Expected motion: {scene.get('motion', 'smooth transition')}
    Expected duration: {scene.get('duration', '2-3 seconds')}

    Check for:
    1. Motion quality - smooth, natural, no jitter
    2. Does start frame match expected?
    3. Does end frame match expected?
    4. Is the action/motion as described?
    5. AI artifacts - morphing faces, disappearing objects, physics errors
    6. Temporal consistency - objects stay consistent throughout

    Return JSON:
    {{
      "passed": bool,
      "motion_quality": int,
      "start_match": bool,
      "end_match": bool,
      "action_accuracy": int,
      "duration_seconds": float,
      "artifacts": [{{timestamp: str, description: str}}],
      "abnormalities": [{{timestamp: str, description: str}}],
      "regenerate": bool,
      "recommendations": [str]
    }}
    """

    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=[prompt, myfile],
        config=genai.types.GenerateContentConfig(
            response_mime_type='application/json'
        )
    )

    client.files.delete(name=myfile.name)
    return json.loads(response.text)
```

### Pass Criteria

- Motion quality ≥ 8
- Start and end frames match
- Action accuracy ≥ 7
- Zero critical artifacts/abnormalities
- Duration within ±0.5s of expected

## Gate 5: Audio Review

**When**: After TTS/music generation, before mixing
**Tool**: Gemini 2.5 audio analysis

### Checklist

| Check | Description | Auto-Fix |
|-------|-------------|----------|
| Speech clarity | Intelligible narration | Re-gen |
| Pronunciation | Correct word pronunciation | Re-gen |
| Pacing | Matches script timing | Re-gen |
| Music mood | Fits video tone | Re-gen |
| Volume levels | Balanced VO/music | Adjust |

### Implementation

```python
def review_audio(voiceover_path: str, music_path: str, script: str) -> dict:
    """Review generated audio components"""
    vo_file = client.files.upload(file=voiceover_path)
    music_file = client.files.upload(file=music_path)

    prompt = f"""Analyze these audio tracks for video production.

    Script text: {script}

    For VOICEOVER, check:
    1. Speech clarity and intelligibility
    2. Pronunciation accuracy
    3. Pacing - matches natural reading of script?
    4. Tone consistency

    For MUSIC, check:
    1. Mood appropriateness
    2. Energy level
    3. Any jarring elements

    Return JSON:
    {{
      "passed": bool,
      "voiceover": {{
        "clarity_score": int,
        "pronunciation_issues": [str],
        "pacing_score": int,
        "tone_match": bool,
        "regenerate": bool
      }},
      "music": {{
        "mood_match": bool,
        "energy_appropriate": bool,
        "issues": [str],
        "regenerate": bool
      }},
      "recommendations": [str]
    }}
    """

    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=[prompt, vo_file, music_file],
        config=genai.types.GenerateContentConfig(
            response_mime_type='application/json'
        )
    )

    client.files.delete(name=vo_file.name)
    client.files.delete(name=music_file.name)
    return json.loads(response.text)
```

### Pass Criteria

- Clarity score ≥ 8
- Zero pronunciation issues
- Pacing score ≥ 7
- Tone matches script intent
- Music mood matches video tone

## Gate 6: Final Assembly Review

**When**: After FFmpeg mixing, before export
**Tool**: Gemini 2.5 video analysis

### Checklist

| Check | Description | Auto-Fix |
|-------|-------------|----------|
| A/V sync | Audio matches video | Re-mix |
| Transitions | Scene cuts smooth | Re-mix |
| Overall flow | Narrative coherent | No |
| Captions | Text accurate and timed | Fix |
| Duration | Total length correct | Trim |

### Implementation

```python
def review_final_video(video_path: str, script: str) -> dict:
    """Final quality review of assembled video"""
    myfile = client.files.upload(file=video_path)

    while myfile.state.name == 'PROCESSING':
        time.sleep(2)
        myfile = client.files.get(name=myfile.name)

    prompt = f"""Final quality review of this video.

    Original script: {script}

    Check:
    1. Audio/video synchronization throughout
    2. Scene transitions - smooth? jarring?
    3. Overall narrative flow - does story work?
    4. Any visible text - typos or timing issues?
    5. Hook effectiveness (first 3 seconds)
    6. CTA clarity (final seconds)
    7. Professional polish rating

    Return JSON:
    {{
      "passed": bool,
      "av_sync": bool,
      "sync_issues": [{{timestamp: str, description: str}}],
      "transitions_score": int,
      "narrative_score": int,
      "text_issues": [{{timestamp: str, text: str, issue: str}}],
      "hook_score": int,
      "cta_score": int,
      "polish_score": int,
      "overall_score": int,
      "publish_ready": bool,
      "recommendations": [str]
    }}
    """

    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=[prompt, myfile],
        config=genai.types.GenerateContentConfig(
            response_mime_type='application/json'
        )
    )

    client.files.delete(name=myfile.name)
    return json.loads(response.text)
```

### Pass Criteria

- A/V perfectly synced
- Transitions score ≥ 7
- Narrative score ≥ 7
- Zero text/caption issues
- Hook score ≥ 7
- CTA score ≥ 7
- Overall score ≥ 8
- Publish ready = true

## Quick Review Commands

```bash
# Review script
python scripts/review-content.py --type script --file script.md

# Review storyboard
python scripts/review-content.py --type storyboard --file storyboard.json

# Review generated frames
python scripts/review-content.py --type frames --start frame-start.png --end frame-end.png --scene scene.json

# Review video clip
python scripts/review-content.py --type video --file clip.mp4 --scene scene.json

# Review audio
python scripts/review-content.py --type audio --voiceover vo.wav --music bg.mp3 --script script.md

# Final video review
python scripts/review-content.py --type final --file video.mp4 --script script.md
```

## Automated Pipeline with Reviews

```python
def produce_video_with_reviews(brief: dict) -> str:
    """Full pipeline with quality gates"""

    # Gate 1: Script
    script = generate_script(brief)
    script_review = review_script(script)
    if not script_review['passed']:
        script = fix_script(script, script_review)
        script_review = review_script(script)
        assert script_review['passed'], "Script review failed twice"

    # Gate 2: Storyboard
    storyboard = generate_storyboard(script)
    storyboard_review = review_storyboard(storyboard)
    if not storyboard_review['passed']:
        storyboard = fix_storyboard(storyboard, storyboard_review)
        storyboard_review = review_storyboard(storyboard)
        assert storyboard_review['passed'], "Storyboard review failed twice"

    # Gate 3-4: Frames and Video per scene
    clips = []
    for scene in storyboard['scenes']:
        # Generate and review frames
        start_frame, end_frame = generate_frames(scene)
        frame_review = review_frames(start_frame, end_frame, scene)
        while not frame_review['passed']:
            if frame_review['regenerate_start']:
                start_frame = regenerate_frame(scene['start_frame'])
            if frame_review['regenerate_end']:
                end_frame = regenerate_frame(scene['end_frame'])
            frame_review = review_frames(start_frame, end_frame, scene)

        # Generate and review video
        clip = generate_video(start_frame, end_frame, scene)
        video_review = review_video_clip(clip, scene)
        while not video_review['passed']:
            clip = generate_video(start_frame, end_frame, scene)
            video_review = review_video_clip(clip, scene)

        clips.append(clip)

    # Gate 5: Audio
    voiceover = generate_tts(script)
    music = generate_music(brief['mood'])
    audio_review = review_audio(voiceover, music, script)
    if not audio_review['passed']:
        if audio_review['voiceover']['regenerate']:
            voiceover = generate_tts(script)
        if audio_review['music']['regenerate']:
            music = generate_music(brief['mood'])

    # Assemble
    final_video = mix_video(clips, voiceover, music)

    # Gate 6: Final review
    final_review = review_final_video(final_video, script)
    if not final_review['passed']:
        # Apply fixes and re-review
        final_video = apply_fixes(final_video, final_review)
        final_review = review_final_video(final_video, script)

    return final_video if final_review['publish_ready'] else None
```

## Cost Estimation with Reviews

| Gate | Tool | Est. Tokens | Cost |
|------|------|-------------|------|
| Script | Text | 2,000 | $0.002 |
| Storyboard | Text | 3,000 | $0.003 |
| Frames (×4) | Vision | 4,000 | $0.004 |
| Video clips (×4) | Video | 72,000 | $0.07 |
| Audio | Audio | 4,000 | $0.004 |
| Final | Video | 36,000 | $0.04 |
| **Total** | | ~120,000 | **~$0.12** |

Reviews add ~$0.12 per video for quality assurance.

## Resources

- Vision Understanding: `../../ai-multimodal/references/vision-understanding.md`
- Video Analysis: `../../ai-multimodal/references/video-analysis.md`
- Audio Processing: `../../ai-multimodal/references/audio-processing.md`
