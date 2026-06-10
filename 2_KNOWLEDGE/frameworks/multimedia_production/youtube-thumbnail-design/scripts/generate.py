#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
YouTube Thumbnail Generation Script using Gemini Nano Banana API
Generates complete, ready-to-use YouTube thumbnails at 1280x720 (16:9)
with text rendered directly in the image.

Models:
- Nano Banana Pro (default): gemini-3-pro-image-preview - 4K text rendering
- Nano Banana 2 (--flash): gemini-3.1-flash-image-preview - faster, lower quality text

Usage:
    python generate.py -p "AI tools that save 10 hours" --text "10X FASTER" --niche tech
    python generate.py -p "pasta recipe from scratch" --text "EASY PASTA" --style facecam --niche cooking
    python generate.py -p "weight loss journey" --text "30 DAYS" --style before-after --niche fitness --arrows

With reference face and brand:
    python generate.py -p "my cooking show" --text "SECRET RECIPE" --ref face.png --brand "ChefMike" --brand-colors "#FF6B35,#FFF3E0"
    python generate.py -p "tech review" --text "WORTH IT?" --ref headshot.jpg --brand "TechDaily" --niche tech

Quality levels:
    --quality fast    # Flash model (testing)
    --quality normal  # 2K, Pro model (default)
    --quality ultra   # 4K, Pro model (final assets)

Font tips (Google Fonts work best):
    --font "Bebas Neue"       # Condensed bold, great for thumbnails
    --font "Anton"            # Heavy impact style
    --font "Montserrat Black" # Modern bold
    --font "Oswald Bold"      # Condensed versatile
    --font "Bangers"          # Comic/fun style
"""

import argparse
import os
import sys
from pathlib import Path
from datetime import datetime


SKILL_NAME = "youtube-thumbnail-design"
CLAUDE_ROOT = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(CLAUDE_ROOT / 'scripts'))

try:
    from resolve_env import resolve_env
    _CENTRALIZED = True
except ImportError:
    _CENTRALIZED = False


def _find_api_key():
    """Find GEMINI_API_KEY using centralized resolver or fallback."""
    if _CENTRALIZED:
        return resolve_env('GEMINI_API_KEY', skill=SKILL_NAME)

    # Fallback: check env, then .env files in priority order
    key = os.getenv('GEMINI_API_KEY')
    if key:
        return key

    for env_path in [
        Path(__file__).parent.parent / ".env",
        CLAUDE_ROOT / "skills" / ".env",
        CLAUDE_ROOT / ".env",
        Path.home() / ".claude" / "skills" / ".env",
        Path.home() / ".claude" / ".env",
    ]:
        if env_path.exists():
            with open(env_path) as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and line.startswith('GEMINI_API_KEY='):
                        return line.split('=', 1)[1].strip('"\'')
    return None


try:
    from google import genai
    from google.genai import types
except ImportError:
    print("Error: google-genai package not installed.")
    print("Install with: pip install google-genai")
    sys.exit(1)


# ============ CONFIGURATION ============
GEMINI_API_KEY = _find_api_key()
GEMINI_FLASH = "gemini-3.1-flash-image-preview"
GEMINI_PRO = "gemini-3-pro-image-preview"
ASPECT_RATIO = "16:9"
DEFAULT_FONT = "Bebas Neue"

QUALITY_PRESETS = {
    "fast": {"model": GEMINI_FLASH, "size": None, "label": "Flash (fast)"},
    "normal": {"model": GEMINI_PRO, "size": "2K", "label": "Pro (2K)"},
    "ultra": {"model": GEMINI_PRO, "size": "4K", "label": "Pro (4K)"},
}

SAFETY_SETTINGS = [
    types.SafetySetting(category=cat, threshold="BLOCK_LOW_AND_ABOVE")
    for cat in [
        "HARM_CATEGORY_HATE_SPEECH",
        "HARM_CATEGORY_DANGEROUS_CONTENT",
        "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "HARM_CATEGORY_HARASSMENT",
    ]
]

STYLE_PROMPTS = {
    "facecam": {
        "layout": "Person's expressive face (surprised/excited expression) on the left third of the frame. Right two-thirds has bold text overlay on a vibrant solid or gradient background.",
        "text_position": "right side, vertically centered",
        "text_color": "#FFFFFF with dark stroke outline",
    },
    "before-after": {
        "layout": "Split composition: left half shows 'before' state (dull, broken, old), right half shows 'after' state (bright, fixed, new). Clear visual contrast between halves with a lightning bolt or arrow divider in the center.",
        "text_position": "top center, spanning both halves",
        "text_color": "#FFFFFF with black stroke outline",
    },
    "listicle": {
        "layout": "Large bold number as the hero element taking up 40% of the frame on the left. Right side has a small grid or collage preview of items. Clean gradient background.",
        "text_position": "left side, the number IS the text",
        "text_color": "#FFFFFF or bright accent color",
    },
    "tutorial": {
        "layout": "Clean educational composition. Subject or tool centered with a result preview. Light or dark professional background. Step-by-step feel.",
        "text_position": "top or bottom, full width",
        "text_color": "#FFFFFF on dark bg, or #1A1A1A on light bg",
    },
    "reaction": {
        "layout": "Shocked/amazed face with wide eyes and open mouth on left. The subject being reacted to on the right side. Energetic bright background color.",
        "text_position": "top center, large and bold",
        "text_color": "#FFFF00 with red stroke outline",
    },
    "cinematic": {
        "layout": "Full-bleed dramatic widescreen photo. Moody lighting, cinematic color grading (teal-orange or dark blue). Letterbox black bars optional. Minimal text.",
        "text_position": "bottom center or lower third",
        "text_color": "#FFFFFF with subtle shadow",
    },
    "bold-text": {
        "layout": "Text fills 60-70% of the frame as the primary element. Simple gradient or solid color background. Minimal imagery — only a small icon or face as accent.",
        "text_position": "center, filling most of the frame",
        "text_color": "#FFFFFF or bright contrasting color",
    },
    "mystery": {
        "layout": "Dark atmospheric scene with a subject partially hidden by gaussian blur or shadow. Red circle highlighting a mysterious detail. Red arrow pointing at something. Question mark.",
        "text_position": "top or bottom, teaser text",
        "text_color": "#FF0000 or #FFFFFF",
    },
    "product-showcase": {
        "layout": "Product hero shot centered on a clean gradient background (dark to light). Product at a slight 3/4 angle with dramatic shadow. Premium minimalist feel.",
        "text_position": "top or bottom, product name + verdict",
        "text_color": "#FFFFFF with subtle shadow",
    },
    "dark-dramatic": {
        "layout": "Dark black or deep blue background. Subject with neon rim lighting and glow effects. Dramatic shadows, light rays, particles. Gaming/thriller aesthetic.",
        "text_position": "top or right side",
        "text_color": "neon cyan #00FFFF or magenta #FF00FF with glow",
    },
    "diagram": {
        "layout": "Whiteboard or canvas background showing a hand-drawn style diagram, flowchart, system architecture, or mind map sketched in Excalidraw style (rough hand-drawn lines, rounded rectangles, simple arrows connecting nodes, handwritten labels). The diagram fills the right two-thirds of the frame. Optionally a person's face/upper body on the left third, gesturing at or pointing toward the diagram. The diagram should look authentic — like someone actually sketched it, not a polished vector graphic.",
        "text_position": "top-left or bottom, overlaid on the whiteboard area",
        "text_color": "#1A1A1A or #FFFFFF with contrasting stroke, depending on background brightness",
    },
    "whiteboard": {
        "layout": "Clean white or light gray whiteboard background filling the entire frame. Colorful hand-drawn sketches, icons, arrows, and annotations scattered across the board in marker style (blue, red, green, black markers). A system diagram, process flow, or concept map is the main visual. Bold text overlaid in one corner. Feels like a real whiteboard session captured mid-explanation.",
        "text_position": "top-left corner or bottom center",
        "text_color": "#222222 with white stroke, or #FFFFFF with dark stroke if on dark area",
    },
}

NICHE_AESTHETICS = {
    "tech": "futuristic technology aesthetic, digital elements, circuit patterns, blue-purple-cyan palette, clean modern feel",
    "gaming": "gaming atmosphere, neon RGB lights, dark background, epic intense mood, glowing accents",
    "education": "bright clean educational look, trustworthy, blue-green-white palette, clear and readable",
    "cooking": "warm appetizing food photography, rich colors, kitchen warmth, orange-red-golden tones",
    "fitness": "dynamic athletic energy, high contrast, bold reds and blacks, powerful motivating",
    "business": "professional authoritative, navy-gold-white, clean corporate, data-driven feel",
    "travel": "stunning landscape, vibrant natural colors, wanderlust epic scenic, golden hour lighting",
    "beauty": "soft glamorous lighting, elegant pink-purple palette, luxurious clean feel",
    "entertainment": "fun energetic bright colors, exciting high-energy pop culture, bold and loud",
    "music": "artistic moody lighting, concert stage feel, purple-blue dramatic tones",
    "diy": "creative maker aesthetic, warm workshop tones, hands-on crafting, earthy natural colors",
    "finance": "professional trustworthy, green-navy palette, charts growth arrows, clean modern",
}

# Preferred order for batch generation
BATCH_STYLE_ORDER = [
    "bold-text", "facecam", "dark-dramatic", "mystery", "reaction",
    "before-after", "product-showcase", "diagram", "cinematic",
    "whiteboard", "listicle", "tutorial",
]


def build_prompt(topic, text, style=None, niche=None, font=None,
                 brand=None, brand_colors=None, arrows=False, ref_path=None):
    """Build a complete thumbnail generation prompt"""
    font_name = font or DEFAULT_FONT
    style_info = STYLE_PROMPTS.get(style, STYLE_PROMPTS["bold-text"])
    niche_aesthetic = NICHE_AESTHETICS.get(niche, "")

    sections = []

    if brand or brand_colors:
        parts = ["BRAND IDENTITY:"]
        if brand:
            parts.append(f'- Channel/brand name: "{brand}" — include small logo/watermark in top-left corner.')
        if brand_colors:
            parts.append(f"- Brand color palette: {brand_colors}. Use these as primary colors throughout the design.")
        sections.append("\n".join(parts))

    if ref_path:
        sections.append("FACE REFERENCE: Use the provided reference face photo as the person in this thumbnail. Keep their likeness accurate. Match their appearance exactly.")

    if arrows:
        sections.append("ARROWS: Include bold graphic arrows (red or bright yellow) pointing at the key subject or text to draw the viewer's eye. Arrows should be hand-drawn style or thick graphic arrows, highly visible.")

    extra = ("\n\n" + "\n\n".join(sections)) if sections else ""

    return f"""Create a professional YouTube thumbnail image (1280x720, 16:9 landscape).

CRITICAL: Do NOT include any video duration timestamp, time counter, time badge, progress bar, or play button anywhere in the image. No "16:09", no "0:32:31", no time overlays of any kind. The image must be a clean thumbnail with ZERO UI elements from YouTube.

Topic: {topic}

TEXT TO RENDER: "{text}"
Font: {font_name}, extra bold, uppercase.
Text color: {style_info['text_color']}.
Text position: {style_info['text_position']}.
Text must have a thick stroke/outline for readability at small sizes.
Text must be sharp, crisp, and perfectly readable.
The ONLY text in the image should be "{text}" and optionally a brand name. No other text, timestamps, or numbers that look like durations.

LAYOUT: {style_info['layout']}

STYLE: {niche_aesthetic}
{extra}
REQUIREMENTS:
- Ultra high resolution, razor sharp, no blur whatsoever
- Bold high-contrast colors that pop against white and dark backgrounds
- The text "{text}" must be the most prominent readable element
- Maximum visual impact — this must grab attention in 0.5 seconds
- Professional YouTube thumbnail quality, not a stock photo
- 3 visual elements maximum: subject + text + one accent graphic"""


def load_ref_image(ref_path):
    """Load reference image for face consistency"""
    path = Path(ref_path)
    if not path.exists():
        print(f"Warning: Reference image not found: {ref_path}")
        return None

    mime_map = {".png": "image/png", ".jpg": "image/jpeg",
                ".jpeg": "image/jpeg", ".webp": "image/webp"}
    mime = mime_map.get(path.suffix.lower(), "image/png")

    with open(path, "rb") as f:
        data = f.read()

    return types.Part.from_bytes(data=data, mime_type=mime)


def generate_thumbnail(topic, text, style=None, niche=None, font=None,
                       output_path=None, quality="normal",
                       brand=None, brand_colors=None, arrows=False,
                       ref_path=None):
    """Generate a complete YouTube thumbnail with text using Gemini"""
    if not GEMINI_API_KEY:
        print("Error: GEMINI_API_KEY not set. Set with: export GEMINI_API_KEY='your-key'")
        return None

    preset = QUALITY_PRESETS.get(quality, QUALITY_PRESETS["normal"])

    print(f"Generating thumbnail with {preset['label']}...")
    print(f"Style: {style or 'bold-text'} | Niche: {niche or 'general'} | Text: \"{text}\" | Font: {font or DEFAULT_FONT}")
    if brand:
        print(f"Brand: {brand}" + (f" | Colors: {brand_colors}" if brand_colors else ""))
    print()

    image_config_kwargs = {"aspect_ratio": ASPECT_RATIO}
    if preset["size"]:
        image_config_kwargs["image_size"] = preset["size"]

    contents = []
    if ref_path:
        ref_part = load_ref_image(ref_path)
        if ref_part:
            contents.append(ref_part)
    contents.append(build_prompt(topic, text, style, niche, font,
                                 brand, brand_colors, arrows, ref_path))

    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        response = client.models.generate_content(
            model=preset["model"],
            contents=contents,
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE", "TEXT"],
                image_config=types.ImageConfig(**image_config_kwargs),
                safety_settings=SAFETY_SETTINGS,
            )
        )

        image_data = None
        for part in response.candidates[0].content.parts:
            if hasattr(part, 'inline_data') and part.inline_data:
                if part.inline_data.mime_type.startswith('image/'):
                    image_data = part.inline_data.data
                    break

        if not image_data:
            print("No image generated. Try a different prompt or text.")
            return None

        if output_path is None:
            style_slug = style or "bold-text"
            output_path = f"thumb_{style_slug}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"

        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "wb") as f:
            f.write(image_data)

        print(f"Thumbnail saved to: {output_path}")
        return output_path

    except Exception as e:
        print(f"Error generating thumbnail: {e}")
        return None


def generate_batch(topic, text, count, output_dir, niche=None,
                   font=None, quality="normal", brand=None,
                   brand_colors=None, arrows=False, ref_path=None):
    """Generate multiple thumbnail variants with different styles"""
    os.makedirs(output_dir, exist_ok=True)
    preset = QUALITY_PRESETS.get(quality, QUALITY_PRESETS["normal"])
    styles = BATCH_STYLE_ORDER[:count]

    print(f"\n{'='*60}")
    print(f"  BATCH THUMBNAIL GENERATION")
    print(f"  Model: {preset['label']} | Text: \"{text}\" | Font: {font or DEFAULT_FONT}")
    if brand:
        print(f"  Brand: {brand}" + (f" | Colors: {brand_colors}" if brand_colors else ""))
    print(f"  Niche: {niche or 'general'} | Arrows: {'yes' if arrows else 'no'} | Variants: {count}")
    print(f"  Output: {output_dir}")
    print(f"{'='*60}\n")

    results = []
    for i, style_key in enumerate(styles):
        filename = f"thumb_{style_key}_{i+1:02d}.png"
        output_path = os.path.join(output_dir, filename)

        print(f"[{i+1}/{count}] Generating {style_key}...")
        result = generate_thumbnail(
            topic=topic, text=text, style=style_key, niche=niche,
            font=font, output_path=output_path, quality=quality,
            brand=brand, brand_colors=brand_colors, arrows=arrows,
            ref_path=ref_path
        )

        if result:
            results.append(result)
            print(f"  Saved: {filename}\n")
        else:
            print(f"  Failed: {style_key}\n")

    print(f"\n{'='*60}")
    print(f"  BATCH COMPLETE: {len(results)}/{count} thumbnails generated")
    print(f"{'='*60}\n")
    return results


def main():
    parser = argparse.ArgumentParser(
        description="Generate ready-to-use YouTube thumbnails with text using Gemini")
    parser.add_argument("--prompt", "-p", type=str,
                        help="Video topic / thumbnail description")
    parser.add_argument("--text", "-t", type=str,
                        help="Bold text to render (1-3 words, max 25 chars)")
    parser.add_argument("--style", "-s", choices=list(STYLE_PROMPTS.keys()),
                        help="Thumbnail style")
    parser.add_argument("--niche", "-n", choices=list(NICHE_AESTHETICS.keys()),
                        help="Content niche")
    parser.add_argument("--font", "-f", type=str, default=DEFAULT_FONT,
                        help=f"Google Font name (default: {DEFAULT_FONT})")
    parser.add_argument("--quality", "-q", choices=list(QUALITY_PRESETS.keys()),
                        default="normal", help="Quality preset (default: normal)")
    parser.add_argument("--brand", "-b", type=str,
                        help="Brand/channel name for watermark")
    parser.add_argument("--brand-colors", type=str,
                        help="Brand colors as comma-separated hex codes")
    parser.add_argument("--arrows", action="store_true",
                        help="Add bold arrows pointing at key subject")
    parser.add_argument("--ref", type=str,
                        help="Reference face image path")
    parser.add_argument("--output", "-o", type=str, help="Output file path")
    parser.add_argument("--output-dir", type=str, help="Output directory for batch")
    parser.add_argument("--batch", type=int, help="Number of variants (batch mode)")
    parser.add_argument("--list-styles", action="store_true", help="List styles")
    parser.add_argument("--list-niches", action="store_true", help="List niches")

    args = parser.parse_args()

    if args.list_styles:
        for style, info in STYLE_PROMPTS.items():
            print(f"  {style}: {info['layout'][:70]}...")
        return

    if args.list_niches:
        for niche, desc in NICHE_AESTHETICS.items():
            print(f"  {niche}: {desc[:60]}...")
        return

    if not args.prompt or not args.text:
        parser.error("--prompt and --text are required")

    if len(args.text) > 25:
        print(f"Warning: Text is {len(args.text)} chars. Optimal: ≤25 chars.")

    if args.batch:
        generate_batch(
            topic=args.prompt, text=args.text, count=args.batch,
            output_dir=args.output_dir or "./thumbnails",
            niche=args.niche, font=args.font, quality=args.quality,
            brand=args.brand, brand_colors=args.brand_colors,
            arrows=args.arrows, ref_path=args.ref
        )
    else:
        generate_thumbnail(
            topic=args.prompt, text=args.text, style=args.style,
            niche=args.niche, font=args.font, output_path=args.output,
            quality=args.quality, brand=args.brand,
            brand_colors=args.brand_colors, arrows=args.arrows,
            ref_path=args.ref
        )


if __name__ == "__main__":
    main()
