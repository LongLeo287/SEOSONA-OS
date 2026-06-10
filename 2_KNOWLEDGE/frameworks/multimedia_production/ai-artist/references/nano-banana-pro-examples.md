# Nano Banana Pro Prompt Examples

6,000+ curated prompts searchable via `--domain examples`. Source: [YouMind Gallery](https://youmind.com/en-US/nano-banana-pro-prompts)

## Categories

### Use Cases
| Category | Search Keywords |
|----------|----------------|
| Profile/Avatar | avatar, profile pic, headshot, linkedin |
| Social Media Post | instagram, twitter, social post |
| Infographic | infographic, edu visual, diagram, chart |
| YouTube Thumbnail | thumbnail, youtube, cover image |
| Comic/Storyboard | comic, storyboard, panel, manga |
| Product Marketing | product shot, marketing, hero image |
| E-commerce | product main image, listing, catalog |
| Game Asset | game asset, sprite, icon, character |
| Poster/Flyer | poster, flyer, event, announcement |
| App/Web Design | ui mockup, app screen, web design |

### Styles
| Style | Search Keywords |
|-------|----------------|
| Photography | photo, realistic, camera, lens |
| Cinematic | film still, movie, cinematic |
| Anime/Manga | anime, manga, japanese style |
| Illustration | illustration, digital art, hand-drawn |
| 3D Render | 3d, render, blender, c4d |
| Chibi/Q-Style | chibi, cute, q-style, kawaii |
| Isometric | isometric, 3d flat, diorama |
| Pixel Art | pixel, 8-bit, retro game |
| Oil Painting | oil painting, classical, brush |
| Watercolor | watercolor, aquarelle, soft edges |
| Ink/Chinese | ink wash, chinese painting, sumi-e |
| Retro/Vintage | vintage, retro, 80s, 90s |
| Cyberpunk | cyberpunk, neon, sci-fi |
| Minimalism | minimal, clean, simple |

### Subjects
| Subject | Search Keywords |
|---------|----------------|
| Portrait/Selfie | portrait, selfie, face, headshot |
| Character | character, hero, protagonist |
| Product | product, item, object |
| Food/Drink | food, drink, cuisine, beverage |
| Animal | animal, pet, creature, wildlife |
| Architecture | building, interior, architecture |
| Landscape | landscape, nature, scenery |
| Text/Typography | text, typography, lettering, font |

## Search Examples

```bash
# Find quote card examples
python3 .opencode/skills/ai-artist/scripts/search.py "quote card" --domain examples

# Find avatar/profile prompts
python3 .opencode/skills/ai-artist/scripts/search.py "avatar profile" --domain examples

# Find infographic templates
python3 .opencode/skills/ai-artist/scripts/search.py "bento grid infographic" --domain examples

# Find YouTube thumbnail ideas
python3 .opencode/skills/ai-artist/scripts/search.py "youtube thumbnail" --domain examples

# Find product photography prompts
python3 .opencode/skills/ai-artist/scripts/search.py "product marketing" --domain examples
```

## Featured Prompt Patterns

### Quote Card Pattern
```
A [wide/square] quote card featuring [subject], with [background color] background
and [font color] [font style] font for the quote: "[QUOTE]" and smaller text:
"—[AUTHOR]." [Layout description]. [Visual effects].
```

### Bento Grid Infographic Pattern
```
Create a premium [style] Bento grid product infographic with [N] modules.
Product: [name]. Language: [lang].
M1 — Hero: Product displayed as [style]
M2 — Core Benefits: [N] benefits + icons
M3 — How to Use: [N] methods + icons
M4 — Key Metrics: [exact data points]
[Additional modules...]
Output: 1 image, 16:9 landscape.
```

### Mirror Selfie Scene Pattern
```
### Scene
[Environment description]
### Subject
* Gender/Age/Ethnicity
* Body type/Skin tone
* Hairstyle details
* Pose description
* Clothing details
### Environment
* Furnishings list
* Color palette
### Lighting
* Source, quality, white balance
### Camera
* Mode, focal length, aperture
```

### Professional Headshot Pattern
```
Turn this [source] into a professional [platform] headshot.
Background: [description]. Style: [clean/realistic/retouched].
Lighting: [type]. Constraints: [preservation requirements].
```

## Raycast Snippet Syntax

Dynamic arguments for reusable prompts:
```
{argument name="quote" default="Stay hungry, stay foolish"}
{argument name="author" default="Steve Jobs"}
{argument name="product" default="INVENTION"}
```

## Tips from Community

1. **Specificity wins** — Describe exact layouts, colors, positions
2. **Use modules** — Break complex scenes into numbered sections
3. **Reference real styles** — "Apple/Braun aesthetic", "Pixar-style"
4. **Camera settings** — Include lens, aperture, lighting for realism
5. **Constraint lists** — Use bullet points for multiple requirements
