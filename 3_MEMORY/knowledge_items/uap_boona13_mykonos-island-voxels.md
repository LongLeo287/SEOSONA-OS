# KI: boona13/mykonos-island-voxels

## Overview
Repository with 151 files across 12 directories. Primary language: JavaScript (21 files).

## Tech Stack (from code)
- JavaScript (21 files)
- Python (1 files)
- **Total:** 151 files, 12 directories
- **File types:** .png: 113, .js: 21, .ogg: 8, .md: 2, .gitignore: 1, .html: 1, .mjs: 1, .toml: 1

## Public API / Exports
- `Camera` from `src\core\Camera.js`
- `Game` from `src\core\Game.js`
- `InputManager` from `src\core\InputManager.js`
- `CONFIG` from `src\config.js`

## File Structure
```
  .gitignore
  LICENSE
  README.md
  asets reference.png
  brick-stone.ogg
  fence-woodenDecorations.ogg
  full city.png
  index.html
  large-vegetations.ogg
  menu_select_lightbulb.ogg
  mykonos_voxel_builder_prompt.md
  netlify-build.mjs
  netlify.toml
  new-placement.ogg
  placement.ogg
  small-vegetations.ogg
  styles.css
  waterPlacement.ogg
  assets/
    agave.png
    altar.png
    archway.png
    banner.png
    bench.png
    blue_railing.png
    bougainvillea.png
    boulder.png
    corner_wall.png
    crate.png
    crop_patch.png
    cube_house.png
    cypress.png
    dry_grass.png
    flat_stone.png
    flower_pot.png
    garden_bed.png
    gate_fence.png
    grass.png
    hanging_lantern.png
    hay_bale.png
    house.png
    lantern_post.png
    large_rock.png
    low_wall.png
    main_chapel.png
    mossy_stone.png
    olive.png
    path.png
    pebbles.png
    pergola_house.png
    pottery_jar.png
    rocks.png
    sand.png
    sea_wall.png
    signpost.png
    small_bridge.png
    stairs.png
    stone.png
    stone_basin.png
    stone_lantern.png
    stone_pile.png
    storage_box.png
    terrace_house.png
    terracotta_pot.png
    tower_chapel.png
    two_story.png
    veg_garden.png
    villa.png
    water.png
    water_bucket.png
    well.png
    windmill.png
    wood_pile.png
    newAsset/
      Crop Patch.png
      Garden Bed.png
      Veg Garden.png
    raw/
      agave.png
      altar.png
      archway.png
      banner.png
      bench.png
      blue_railing.png
      bougainvillea.png
      boulder.png
      corner_wall.png
      crate.png
      crop_patch.png
      cube_house.png
      cypress.png
      dry_grass.png
      flat_stone.png
      flower_pot.png
      garden_bed.png
      gate_fence.png
      grass.png
      hanging_lantern.png
      hay_bale.png
      house.png
      lantern_post.png
      large_rock.png
      low_wall.png
      main_chapel.png
      mossy_stone.png
      olive.png
      path.png
      pebbles.png
      pergola_h
```

## Key Source Excerpts
### src\core\Camera.js
```javascript
/**
 * Camera.js
 *
 * A simple 2D camera with pan & zoom. The camera maps world (canvas) pixels
 * to screen pixels via an offset and a uniform zoom factor.
 */

import { CONFIG } from '../config.js';

export class Camera {
    constructor() {
        this.offsetX = 0;
        this.offsetY = 0;
        this.zoom = CONFIG.camera.defaultZoom;
        // Optional listener for mutations. The renderer subscribes to
        // this so it can flip its dirty flag without polling the camera.
        this._onChange = null;
    }

    onChange(cb) { this._onChange = cb; }
    _notify() { if (this._onChange) this._onChange(); }

    /** Compute world (pre-zoom) point under a screen pixel. */
    screenToWorld(sx, sy) {
        return {
            x: (sx - this.offsetX) / this.zoom,
            y: (sy - this.offsetY) / this.zoom,
        };
    }

    /** Compute screen pixel for a world point. */
    worldToScreen(wx, wy) {
        return {
            x: wx * this.zoom + this.offsetX,
            y: wy * this.zoom + this.offsetY,
        };
    }

    pan(dx, dy) {
        if (dx === 0 && dy === 0) return;
        this.offsetX += dx;
        this.offsetY += dy;
        this._notify();
    }

    zoomAt(screenX, screenY, factor) {
        const next = Math.max(CONFIG.camera.minZoom,
                     Math.min(CONFIG.camera.maxZoom, this.zoom * factor));
        if (next === this.zoom) return;
        // Keep the world point under the cursor anchored.
        const before = this.scre
```

### src\core\Game.js
```javascript
/**
 * Game.js
 *
 * Top-level game controller. Owns the world (TileMap), camera, renderer,
 * input manager, placement system, and UI. Exposes a small intent API
 * (setTool, selectAsset, save, reset, …) consumed by the UI.
 */

import { CONFIG } from '../config.js';
import { Camera } from './Camera.js';
import { Renderer } from './Renderer.js';
import { InputManager } from './InputManager.js';
import { TileMap } from '../grid/TileMap.js';
import { PlacementSystem } from '../building/PlacementSystem.js';
import { ASSET_INDEX, ASSET_MANIFEST } from '../assets/assetManifest.js';
import { SaveSystem } from '../storage/SaveSystem.js';
import { cellToScreen } from '../grid/IsoGrid.js';
import { playPlacementFor } from '../ui/Audio.js';

export class Game {
    constructor(canvas, ui = null) {
        this.canvas = canvas;
        this.tileMap = new TileMap();
        this.camera = new Camera();
        this.renderer = new Renderer(canvas, this.camera, this.tileMap);
        this.placement = new PlacementSystem(this.tileMap);
        this.input = new InputManager(canvas, this.camera, this);

        // Any camera mutation (pan/zoom/recenter) needs the next frame
        // re-rendered. The renderer itself is otherwise idle.
        this.camera.onChange(() => this.renderer.markDirty());

        // Default selection
        this.tool = 'place';                  // 'place' | 'erase' | 'pan'
        this.category = 'terrain';
        this.selectedAssetId = ASSET_MANIFEST.find(a => a.
```

### src\core\InputManager.js
```javascript
/**
 * InputManager.js
 *
 * Handles mouse, touch, and keyboard input on the game canvas, translating
 * it to game-level events (place, erase, hover, pan, zoom).
 *
 * Touch model (mirrors the desktop mouse/keyboard model as closely as a
 * fingers-only device allows):
 *
 *   • Single-finger tap            → primary click (place / erase, depending on tool)
 *   • Single-finger long-press     → secondary click (erase) — the "right click" stand-in
 *   • Single-finger drag (place)   → brush-place across cells
 *   • Single-finger drag (erase)   → brush-erase across cells
 *   • Single-finger drag (pan)     → pan camera
 *   • Two-finger pinch             → zoom in / out, anchored at the gesture midpoint
 *   • Two-finger drag              → pan (always works, regardless of active tool)
 */

import { CONFIG } from '../config.js';
import { screenToCell } from '../grid/IsoGrid.js';
import { playUiClick } from '../ui/Audio.js';

// How long a stationary single-finger touch must be held before we
// treat it as the "erase" gesture. Tuned to feel responsive but not
// trip while panning slowly.
const LONG_PRESS_MS = 420;
// Pixel distance the finger may drift before we cancel the long-press
// timer and reclassify the gesture as a drag.
const TOUCH_MOVE_THRESHOLD = 8;
// Max pixels a finger may drift and still register as a tap on release.
const TAP_SLOP = 10;
// Max ms a touch may stay down and still register as a tap on release.
const TAP_MAX_MS = 350;

export class InputManager 
```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 22/100 · **Auto-apply:** False
- **Evidence:** `rag`
- **All scores:** {'seosona-os': 22, 'seosona-video': 22, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
