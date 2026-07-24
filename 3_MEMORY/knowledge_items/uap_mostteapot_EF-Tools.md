# KI: mostteapot/EF-Tools

## Overview
Repository with 97 files across 4 directories. Primary language: Python (4 files).

## Tech Stack (from code)
- Python (4 files)
- **Total:** 97 files, 4 directories
- **File types:** .png: 89, .py: 4, .json: 2, .txt: 1

## Public API / Exports
- `ensure_png` from `main.py`
- `load_image` from `main.py`
- `scale_image` from `main.py`
- `combine` from `main.py`
- `load_items` from `item list maker.py`
- `save_items` from `item list maker.py`
- `main` from `item list maker.py`
- `ensure_png` from `item overlay maker v2.py`
- `load_image` from `item overlay maker v2.py`
- `scale_image` from `item overlay maker v2.py`
- `combine` from `item overlay maker v2.py`
- `get_rarity_key` from `item overlay maker v2.py`
- `generate` from `item overlay maker v2.py`

## Imports Detected in Source
- `PIL`
- `json`
- `main`
- `os`
- `tkinter`

## File Structure
```
  LICENSE
  README.txt
  item list maker.py
  item overlay maker v2.py
  main.py
  mass compiler.py
  rarity_preset.json
  rarity_preset_new.json
  backgrounds/
    item_copper_bottle_liquid.png
    item_gem_rarity_2.png
    item_gem_rarity_3.png
    item_gem_rarity_4.png
    item_gem_rarity_5.png
    item_glass_bottle_liquid.png
    item_glass_enr_bottle_liquid.png
    item_icon_bg_blueprint.png
    item_icon_bg_blueprint_blue.png
    item_icon_bg_blueprint_cyan.png
    item_icon_bg_blueprint_gray.png
    item_icon_bg_blueprint_green.png
    item_icon_bg_blueprint_orange.png
    item_icon_bg_blueprint_purple.png
    item_icon_bg_blueprint_yellow.png
    item_icon_bg_equip_qualitycolor_blue.png
    item_icon_bg_equip_qualitycolor_gold.png
    item_icon_bg_equip_qualitycolor_green.png
    item_icon_bg_equip_qualitycolor_grey.png
    item_icon_bg_equip_qualitycolor_purple.png
    item_icon_bg_food_qualitycolor_blue.png
    item_icon_bg_food_qualitycolor_gold.png
    item_icon_bg_food_qualitycolor_green.png
    item_icon_bg_food_qualitycolor_grey.png
    item_icon_bg_food_qualitycolor_purple.png
    item_icon_bg_medicine_qualitycolor_blue.png
    item_icon_bg_medicine_qualitycolor_gold.png
    item_icon_bg_medicine_qualitycolor_green.png
    item_icon_bg_medicine_qualitycolor_grey.png
    item_icon_bg_medicine_qualitycolor_purple.png
    item_iron_bottle_liquid.png
    item_iron_enr_bottle_liquid.png
    item_potential_4star.png
    item_potential_5star.png
    item_potential_6star.png
    Texture2D/
      item_icon_bg_liquid.png
      item_icon_bg_miner.png
      item_icon_bg_regionbuff_tundra.png
      item_icon_bg_regionbuff_wuling.png
      item_icon_bg_settlement.png
      item_icon_bg_upgrade.png
  composite/
    item_icon_mark_unlocked.png
    item_icon_mark_upgrade.png
    item_icon_subscript_add_1.png
    item_icon_subscript_add_10.png
    item_icon_subscript_add_100.png
    item_icon_subscript_add_1000.png
    item_icon_subscript_add_1100.png
    item_icon_su
```

## Key Source Excerpts
### main.py
```python
from PIL import Image
import json
import os

bg_folder = "backgrounds" # itemiconcompositedecobig for the background images
itemicon_folder = "itemiconbig" # the item you want to make
composite_folder = "composite" # itemiconcompositedecobig for the small addon added last
output_folder = "output" # output folder

def ensure_png(name):
    if os.path.splitext(name)[1]:
        return name
    return name + ".png"

def load_image(folder, name):
    path = os.path.join(folder, ensure_png(name))
    return Image.open(path).convert("RGBA")

def scale_image(img, scale):
    if scale == 1:
        return img
    return img.resize(
        (int(img.width * scale), int(img.height * scale)),
        Image.LANCZOS
    )

# load config once
with open("rarity_preset.json") as f:
    CONFIG = json.load(f)

def combine(mode, overlay_name, output_name, rarity=None):

    mode = mode.capitalize()

    if mode not in ("Template", "Upgrade"):

        data = CONFIG[mode]

        base_name = data["rarities"][str(rarity)]
        x, y = data["offset"]
        scale = data["scale"]

        base = load_image(bg_folder, base_name)
        overlay = load_image(itemicon_folder, overlay_name)

        overlay = scale_image(overlay, scale)

        base.paste(overlay, (x, y), overlay)

        if data["unlock_icon"]:
            unlock = load_image(composite_folder, "item_icon_mark_unlocked")
            base.paste(unlock, (0, 0), unlock)

    elif mode == "Template":

        base = load_image(bg_fol
```

### item list maker.py
```python
import json
import os

OUTPUT_FILE = "item_list.json"

def load_items():
    if not os.path.exists(OUTPUT_FILE):
        return []
    with open(OUTPUT_FILE, "r") as f:
        return json.load(f)

def save_items(items):
    with open(OUTPUT_FILE, "w") as f:
        json.dump(items, f, indent=2)

def main():
    items = load_items()

    while True:
        print("\nEnter item (or type 'q' to quit)\n")
        print("Available Modes: Operator/Gear/Med/Food/Blueprint/Essence/Bottle")
        mode = input("Mode: ").strip()
        if mode.lower() == "q":
            break

        overlay = input("Overlay: ").strip()
        rarity = input("Rarity: ").strip()
        output = input("Output name: ").strip()

        item = {
            "mode": mode.capitalize(),
            "overlay": overlay,
            "output": output
        }

        item["rarity"] = int(rarity)

        items.append(item)

    save_items(items)
    print(f"\nSaved {len(items)} items.")

if __name__ == "__main__":
    main()

```

### item overlay maker v2.py
```python
from PIL import Image, ImageTk
import json
import os
import tkinter as tk
from tkinter import ttk, messagebox

# folders
bg_folder = "backgrounds"
itemicon_folder = "itemiconbig"
composite_folder = "composite"
output_folder = "output"

def ensure_png(name):
    if os.path.splitext(name)[1]:
        return name
    return name + ".png"

def load_image(folder, name):
    path = os.path.join(folder, ensure_png(name))
    
    if not os.path.exists(path):
        raise FileNotFoundError(f"Missing file: {path}")
    
    return Image.open(path).convert("RGBA")

def scale_image(img, scale):
    if scale == 1:
        return img
    return img.resize(
        (int(img.width * scale), int(img.height * scale)),
        Image.LANCZOS
    )

# load config
with open("rarity_preset_new.json") as f:
    CONFIG = json.load(f)

def combine(mode, overlay_name, output_name=None, rarity=None, preview=False):
    mode = mode.capitalize()

    if mode not in ("Template", "Upgrade"):
        data = CONFIG[mode]

        rarity_data = data["rarities"][rarity]
        base_name = rarity_data["file"]

        x, y = data["offset"]
        scale = data["scale"]

        base = load_image(bg_folder, base_name)
        overlay = load_image(itemicon_folder, overlay_name)

        overlay = scale_image(overlay, scale)
        base.paste(overlay, (x, y), overlay)

        if data["unlock_icon"]:
            unlock = load_image(composite_folder, "item_icon_mark_unlocked")
            base.paste(unlock, (0, 
```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 0/100 · **Auto-apply:** False
- **Evidence:** none (kept as reference)
- **All scores:** {'seosona-os': 0, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
