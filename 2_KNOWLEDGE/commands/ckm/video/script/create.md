---
description: 💡💡 Create a production-ready video script with creative direction
argument-hint: [type] [topic]
---

Create a production-ready video script with creative direction, AI-ready prompts for visuals/audio, and strategic evaluation.

## Your Brief

<args>$ARGUMENTS</args>

## Video Types
- `youtube` - Long-form YouTube video (16:9)
- `reel` - Instagram Reels / TikTok (9:16)
- `short` - YouTube Shorts (9:16)
- `explainer` - Explainer (pick platform based on distribution goal)
- `tutorial` - Tutorial (pick platform based on distribution goal)
- `testimonial` - Testimonial (pick platform based on distribution goal)

## Required Inputs (ask if missing)
- **Goal**: what should the viewer do/think/feel after watching?
- **Audience**: who is this for (role, sophistication, pain level)?
- **Platform**: YouTube / Shorts / TikTok / Reels / LinkedIn
- **Length target**: seconds (short-form) or minutes (long-form)
- **CTA**: subscribe / comment / visit link / start free / book demo
- **Offer** (if any): what are you promoting (optional)
- **Art Direction**: use `AskUserQuestion` tool to suggest a few style preferences from video-art-directions reference of `video-production` skill, include "Feel free to suggest your own style" option.

**IMPORTANT:** Make sure you fully understand the brief and have all necessary context by using `AskUserQuestion` tool to ask 5-8 clarifying questions.

## Workflow

### 1. Parse Arguments & Art Direction Selection
- Extract video type from `$ARGUMENTS`.
- Extract topic/subject.
- Activate `video-production` skill and load:
  - `references/video-types-specs.md` - Platform specs
  - `references/video-art-directions.md` - Art direction options (Top 50)
- Determine defaults:
  - Platform, Aspect ratio, Ideal length, Posting times
- **Select Art Direction**: Based on brand/topic, recommend 1-3 art directions from the reference. Include:
  - Style category name
  - Core keywords
  - Color palette
  - Background music style
  - Voiceover style

### 2. Brief + Research (lightweight, fast)
- Use multiple `researcher` subagents with activated `research` skill for a quick scope definition (Max 3 tool calls per agent).
- Produce a short **Video Brief**:
  - Primary promise (what you'll deliver)
  - 3-5 key points
  - Likely objections/misconceptions
  - Unique angle (what's different vs obvious content)
- Activate `content-marketing` skill to map:
  - Funnel stage (awareness/consideration/decision)
  - Content pillar
  - 1-2 related follow-up videos to create a series

### 3. Brand Alignment
- If `docs/brand-guidelines.md` doesn't exist, use `AskUserQuestion` to ask some questions to understand the brand guidelines.
- Activate `brand-guidelines` skill.
- If relevant, run `node .claude/skills/brand-guidelines/scripts/inject-brand-context.cjs --json` and incorporate:
  - Tone of voice
  - Key messaging constraints
  - Forbidden phrases / claims to avoid
  - Naming conventions (product name, features)

### 4. Script Creation with AI-Artist Prompts
- Use `planner` agent to choose appropriate structure.
- Use `content-creator` agent to draft the script.
- Use `copywriter` agent to punch up:
  - Hook (first 3 seconds)
  - Pattern interrupts
  - CTA(s)
- Activate `video-production` skill and load:
  - `references/script-templates.md`
  - `references/audio-directive-guide.md`
- **Activate `ai-artist` skill** and load:
  - `references/image-prompting.md` - For Imagen/Veo frame prompts
  - `references/nano-banana.md` - For Gemini-specific prompting
  - `references/character-consistency.md` - For character portrait workflow
- **Activate `ai-multimodal` skill** and load:
  - `references/character-consistency-portrait-reference.md` - For Nano Banana Pro multi-ref
- Script requirements:
  - Hook is explicit and occurs immediately.
  - For short-form, use **4-scene structure** (Hook → Problem → Solution → CTA) unless brief demands otherwise.
  - Include **on-screen text** (sound-off friendly).
  - Include **b-roll / overlay** suggestions.
  - Include **camera** + **motion** notes.
  - Keep pacing within guide: <= 6 words/second for VO.

### 5. Character Profiles (if characters present)

If the script features human characters (actors, personas, presenters, mascots):

1. **Define character profiles** with detailed visual descriptions for each unique character:
   - Name, gender, age range, ethnicity/skin tone
   - Hair: color, style, length
   - Eyes: color, shape
   - Face: shape, distinguishing features
   - Clothing: specific items, colors, materials
   - Accessories: glasses, jewelry, etc.
   - Build: body type

2. **Create identity anchors** - short descriptors to repeat in EVERY scene prompt:
   ```
   "{name}: {hair_color} {hair_style} hair, {eye_color} eyes, wearing {clothing}, {accessories}"
   ```

3. **Add portrait generation prompts** to the script output for use in storyboard phase:
   ```
   Portrait Prompt ({name}): Professional portrait photograph of {name}: {full description}.
   Canon EOS R5, 85mm f/1.4, soft studio lighting, neutral gray background, sharp focus, 4K.
   ```

**IMPORTANT:** Character portraits will be generated during `/video:storyboard:create` phase using Nano Banana Pro. These portraits serve as identity references for all scene frame generation.

### 6. AI Prompt Generation (ai-artist)
For each scene, generate production-ready prompts:

**For scenes WITH characters - use Nano Banana Pro with portrait reference:**
```
[Identity anchor: "Same person from reference: {identity_anchor}"]
[Action/Pose in Setting/Environment]
[Style/Medium from art direction] [Lighting from art direction]
[Camera/Lens] [Composition] [Quality Modifiers] [Aspect Ratio]
Maintain EXACT facial features, hair, and clothing from reference.
```

**For scenes WITHOUT characters - use Nano Banana Flash:**
```
[Subject + Details] [Action/Pose] [Setting/Environment]
[Style/Medium from art direction] [Lighting from art direction]
[Camera/Lens] [Composition] [Quality Modifiers] [Aspect Ratio]
```

**Video Prompts (Veo 3.1)**:
```
[Start state → End state] [Motion description]
[Camera movement: pan/tilt/dolly/crane/tracking]
[Cinematography style from art direction]
[Scene transitions: cut/fade/dissolve]
```

**Music Prompts (Lyria)**:
```
[Genre + mood from art direction] [BPM range]
[Intensity curve: intro/build/sustain/resolve]
[Instruments: specific mentions]
[Negative: what to avoid]
```

**SFX Prompts (Veo native)**:
```
SFX: {description} as {trigger action} at {timestamp}
Ambient: {element 1}, {element 2}
```

### 7. Platform Optimization Pack
- Use `video-production` skill references:
  - `references/video-optimization.md`
  - `references/video-seo-optimization.md`
- Generate:
  - **Title options** (YouTube/LinkedIn)
  - **Description** (YouTube, includes chapters for long-form)
  - **Tags** (YouTube)
  - **Caption** (TikTok/Reels/Shorts)
  - **Hashtags** (per platform strategy)
  - **Best posting times** (from platform specs)
  - **Thumbnail concept** (1-3 variants, text <= 4 words)

### 8. Quality Gate (script-only)
- Apply Gate 1 from `video-production/references/quality-review-workflow.md`:
  - Grammar/typos
  - Hook strength
  - CTA clarity
  - Timing feasibility
  - Brand voice consistency
  - **AI prompt completeness**
- If any check fails, revise once and re-check.

### 9. Strategic Evaluation
Generate comprehensive evaluation:
- **Pros**: Strengths of this script approach
- **Cons**: Potential weaknesses or risks
- **Recommendations**: Optimization suggestions
- **Why It Should Work**: Evidence-based reasoning
- **Challenges**: Production or creative challenges
- **Unresolved Questions**: Decisions for client/team

## Agents Used
- `researcher` - Lightweight research/angle discovery
- `planner` - Structure selection
- `content-creator` - Script drafting
- `copywriter` - Hook/CTA polish

## Skills Used
- `video-production` - Script templates, pacing, platform specs, art directions
- `creativity` - Creative direction, style templates, color psychology, voiceover styles
- `ai-artist` - AI-ready prompts for frames, video, music, SFX
- `brand-guidelines` - Voice and messaging constraints
- `research` - Lightweight research/angle discovery
- `content-marketing` - Funnel stage + series planning
- `assets-organizing` - Output path conventions

## Output
- Script pack → `content/video/{type}/{date}-{slug}/script.md`

## Next Steps
- Storyboard → `/video:storyboard:create content/video/{type}/{date}-{slug}/script.md`

## Output Format (`script.md`)
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
---

# Video Brief

## Core Promise
{one sentence}

## Key Points
- {point}
- {point}
- {point}

## Angle
{what makes this different}

---

# Creative Direction

## Art Direction: {style name}
**Core Keywords:** {keywords from reference}
**Color Palette:** {hex codes + names}
**Signature Effects:** {effects from reference}

## Visual Style
{2-3 sentences describing the overall visual approach}

## Audio Style
**Music:** {genre, mood, BPM, instruments}
**Voiceover:** {style, tone, pacing}
**SFX:** {overall approach to sound design}

---

# Characters (if applicable)

## Character Profiles

### {Character Name}
**Description:** {gender}, {age}, {ethnicity/skin tone}, {hair: color, style, length}, {eye color}, {face shape, features}, {build}
**Clothing:** {detailed clothing description}
**Accessories:** {glasses, jewelry, etc.}
**Identity Anchor:** "{hair_color} {hair_style} hair, {eye_color} eyes, wearing {clothing}, {accessories}"

**Portrait Prompt (Nano Banana Pro):**
```
Professional portrait photograph of {name}: {full description}.
Canon EOS R5, 85mm f/1.4, soft studio lighting, neutral gray background, sharp focus, 4K.
```

---

# Script

## Scene 1: {name}
**Time:** {MM:SS}-{MM:SS} ({duration}s)

### Visual
**Shot/Camera:** {wide/medium/close + movement}
**Start Frame:** {exact visual description}
**End Frame:** {exact visual description}
**Motion:** {what changes between frames}
**B-roll/Overlay:** {ideas}

### AI Prompts

**IMPORTANT**:
- DO NOT include any color hex codes in the prompts.
- If characters present: Use Nano Banana Pro with portrait reference. Include identity anchor in prompt.
- If no characters: Use Nano Banana Flash for speed.

#### Start Frame (Nano Banana Pro if characters, Flash if no characters)
```
{If characters: "Same person from reference: [identity anchor]. "}
{Complete prompt with style, lighting, composition, aspect ratio}
{If characters: "Maintain EXACT facial features, hair, and clothing from reference."}
```

#### End Frame (Nano Banana Pro if characters, Flash if no characters)
```
{If characters: "Same person from reference: [identity anchor]. "}
{Complete prompt maintaining visual continuity}
{If characters: "Maintain EXACT facial features, hair, and clothing from reference."}
```

#### Video Generation (Veo 3.1)
```
{Complete Veo prompt: start→end state, motion, camera, cinematography}
```

### On-Screen Text
- {short caption (<= 4-6 words)}

### Audio
**Voiceover:** "{line}" (TTS: {Voice}, {Style})
**Music:** {mood/bpm/intensity}
**SFX:** {timestamp}: {sound description}

#### Music Prompt (Lyria)
```
{Complete Lyria prompt: genre, mood, BPM, instruments, intensity curve}
```

---

{Repeat for each scene...}

---

# Platform Optimization

## Titles (pick 1)
1. {title}
2. {title}
3. {title}

## YouTube Description (if applicable)
{template w/ chapters}

## Tags (YouTube)
- {tag}

## Caption + Hashtags (Short-form)
{caption}

## Posting Times
{best days/times}

## Thumbnail Concepts
- {concept with visual description}

---

# Strategic Evaluation

## Pros
- {strength 1}
- {strength 2}
- {strength 3}

## Cons
- {weakness/risk 1}
- {weakness/risk 2}

## Recommendations
1. {actionable recommendation}
2. {actionable recommendation}
3. {actionable recommendation}

## Why It Should Work
{2-3 paragraphs explaining the strategic reasoning: audience alignment, hook effectiveness, platform optimization, competitive differentiation}

## Challenges
| Challenge | Mitigation |
|-----------|------------|
| {challenge 1} | {how to address} |
| {challenge 2} | {how to address} |

## Unresolved Questions
- [ ] {question for client/team decision}
- [ ] {question for client/team decision}
```

## Examples
```
/video:script:create youtube "complete guide to Claude Code"
/video:script:create reel "3 marketing automation tips"
/video:script:create explainer "product onboarding flow"
/video:script:create tutorial "setting up email campaigns"
/video:script:create short "ClaudeKit intro" --art-direction "Modern Tech Futurism"
```
