# KI: GargantuaX/gemini-watermark-remover

## Overview
Repository with 414 files across 33 directories. Primary language: JavaScript (246 files).

## Tech Stack (from code)
- JavaScript (246 files)
- TypeScript (9 files)
- **Total:** 414 files, 33 directories
- **File types:** .js: 246, .png: 44, .md: 36, .webp: 13, .zip: 13, .txt: 13, .ts: 9, .json: 7

## Public API / Exports
- `calculateAlphaMap` from `src\core\alphaMap.js`
- `removeWatermark` from `src\core\blendModes.js`
- `isNewMarginAlphaVariantTrial` from `src\core\candidateEvaluation.js`
- `isDefaultAlphaNewMarginTrial` from `src\core\candidateEvaluation.js`
- `canvasToBlob` from `src\core\canvasBlob.js`
- `EMBEDDED_OUTLINE_DARK_D4_INT16_BASE64` from `src\core\embeddedDarkOutlineAlphaMap.js`
- `EMBEDDED_OUTLINE_LIGHT_D4_INT16_BASE64` from `src\core\embeddedOutlineAlphaMap.js`

## Imports Detected in Source
- `onnxruntime-web`

## File Structure
```
  .env.example
  .gitignore
  AGENTS.md
  CHANGELOG.md
  CHANGELOG_zh.md
  LICENSE
  README.md
  README_zh.md
  RELEASE.md
  RELEASE_zh.md
  build.js
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  docs/
    1.webp
    2.webp
    3.webp
    4.webp
    5.webp
    complex-figure-verification-checklist.md
    core-watermark-removal-algorithm-research.zh.md
    demo-after.webp
    demo-before.webp
    image-watermark-pipeline-refactor-live.zh.md
    issue-103-vector-residual-investigation.zh.md
    lossless_diff.webp
    release-1.0.29-post-release.md
    unwatermarked_1.webp
    unwatermarked_2.webp
    unwatermarked_3.webp
    unwatermarked_4.webp
    unwatermarked_5.webp
    video-watermark-removal-progress.zh.md
    superpowers/
      plans/
        2026-07-16-same-anchor-96-imperfection-preference.md
        2026-07-16-same-anchor-clean-dominance.md
        2026-07-16-same-anchor-imperfection-candidate-review.md
        2026-07-16-scoped-release-quality-gate.md
        2026-07-16-strong-undersized-flat-fill.md
        2026-07-18-v1.0.31-release-and-issue-triage.md
      specs/
        2026-06-15-veo-small-text-watermark-design.md
        2026-07-07-issue99-small-preview-anchor-residual-design.md
        2026-07-16-same-anchor-96-imperfection-preference-design.md
        2026-07-16-same-anchor-clean-dominance-design.md
        2026-07-16-same-anchor-imperfection-candidate-review-design.md
        2026-07-16-scoped-release-quality-gate-design.md
        2026-07-16-strong-undersized-adaptive-cleanup-design.md
        2026-07-16-strong-undersized-flat-fill-design.md
        2026-07-18-bound-preview-fetch-fallback-design.md
        2026-07-18-clipboard-fallback-slot-design.md
        2026-07-18-issue111-new-margin-size-jitter-design.md
        2026-07-18-real-page-copy-download-probe-design.md
  public/
    dev-preview.css
    dev-preview.html
    index.html
    tampermonkey-worker-probe.html
    tampermonkey-worker-probe.user.js
    video-preview.html
    model
```

## Key Source Excerpts
### src\core\adaptiveDetector.js
```javascript
/**
 * Adaptive watermark detector
 * Uses coarse-to-fine template matching around bottom-right region.
 */

import { resolveGeminiWatermarkSearchConfigs } from './geminiSizeCatalog.js';

const DEFAULT_THRESHOLD = 0.35;
const EPSILON = 1e-8;
const REFERENCE_WATERMARK_SIZE = 96;
const MIN_COARSE_ADJUSTED_SCORE = 0.08;
const UNDERSIZED_SEARCH_MIN_BASE_SIZE = 80;
const UNDERSIZED_SEARCH_SIZES = [40];
const UNDERSIZED_MIN_SPATIAL_SCORE = 0.9;
const UNDERSIZED_MIN_GRADIENT_SCORE = 0.75;
const UNDERSIZED_MIN_CONFIDENCE_GAIN = 0.12;

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function meanAndVariance(values) {
    let sum = 0;
    for (let i = 0; i < values.length; i++) sum += values[i];
    const mean = sum / values.length;

    let sq = 0;
    for (let i = 0; i < values.length; i++) {
        const d = values[i] - mean;
        sq += d * d;
    }
    return { mean, variance: sq / values.length };
}

function normalizedCrossCorrelation(a, b) {
    if (a.length !== b.length || a.length === 0) return 0;

    const statsA = meanAndVariance(a);
    const statsB = meanAndVariance(b);
    const den = Math.sqrt(statsA.variance * statsB.variance) * a.length;

    if (den < EPSILON) return 0;

    let num = 0;
    for (let i = 0; i < a.length; i++) {
        num += (a[i] - statsA.mean) * (b[i] - statsB.mean);
    }
    return num / den;
}

function getRegion(data, width, x, y, size) {
    const out = new Float32Array(size * size);
    for (let row = 0; row < size; row+
```

### src\core\allenkFdncnnDenoise.js
```javascript
const ALLENK_FDNCNN_MODEL = Object.freeze({
    name: 'FDnCNN Color FP16',
    upstream: 'allenk/GeminiWatermarkTool',
    license: 'MIT',
    runtime: 'NCNN',
    inputBlob: 0,
    outputBlob: 20,
    inputLayout: '[R, G, B, sigma] CHW float32',
    outputLayout: '[R, G, B] CHW float32',
    defaultSigma: 25,
    defaultStrength: 0.85,
    defaultPadding: 16,
    maxSigma: 150,
    maxStrength: 3
});

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function reflect101(index, length) {
    if (length <= 1) return 0;
    let value = Math.round(index);
    while (value < 0 || value >= length) {
        value = value < 0 ? -value : (length * 2 - value - 2);
    }
    return value;
}

function createGaussianKernel(sigma, radius = Math.ceil(sigma * 3)) {
    const safeSigma = Math.max(0.01, sigma);
    const safeRadius = Math.max(1, Math.round(radius));
    const kernel = new Float32Array(safeRadius * 2 + 1);
    let sum = 0;

    for (let i = -safeRadius; i <= safeRadius; i++) {
        const value = Math.exp(-(i * i) / (2 * safeSigma * safeSigma));
        kernel[i + safeRadius] = value;
        sum += value;
    }

    for (let i = 0; i < kernel.length; i++) {
        kernel[i] /= sum;
    }

    return { kernel, radius: safeRadius };
}

function gaussianBlurFloatMap(source, width, height, sigma, radius = Math.ceil(sigma * 3)) {
    if (!source || width <= 0 || height <= 0 || !Number.isFinite(sigma) || sigma <= 0) {
        return new Float3
```

### src\core\allenkFdncnnNcnnModel.js
```javascript
const NCNN_BINARY_PARAM_MAGIC = 7767517;
const NCNN_LAYER_TYPES = Object.freeze({
    6: 'Convolution',
    16: 'Input'
});
const NCNN_WEIGHT_FP16_STORAGE_TAG = 0x01306b47;

function readInt32LE(buffer, offset) {
    if (offset + 4 > buffer.length) {
        throw new Error(`Unexpected end of NCNN param at byte ${offset}`);
    }
    return buffer.readInt32LE
        ? buffer.readInt32LE(offset)
        : new DataView(buffer.buffer, buffer.byteOffset + offset, 4).getInt32(0, true);
}

function readUInt32LE(buffer, offset) {
    if (offset + 4 > buffer.length) {
        throw new Error(`Unexpected end of NCNN bin at byte ${offset}`);
    }
    return buffer.readUInt32LE
        ? buffer.readUInt32LE(offset)
        : new DataView(buffer.buffer, buffer.byteOffset + offset, 4).getUint32(0, true);
}

function normalizeBuffer(buffer) {
    if (buffer instanceof Uint8Array) return buffer;
    return new Uint8Array(buffer);
}

function parseParamPairs(buffer, cursor) {
    const params = {};
    let offset = cursor;

    while (offset < buffer.length) {
        const key = readInt32LE(buffer, offset);
        offset += 4;
        if (key === -233) {
            return { params, offset };
        }

        const value = readInt32LE(buffer, offset);
        offset += 4;
        params[key] = value;
    }

    throw new Error('NCNN layer params were not terminated by -233');
}

function getNcnnLayerTypeName(typeIndex) {
    return NCNN_LAYER_TYPES[typeIndex] || `LayerType${typeIndex}`
```

## Agent Configuration
### AGENTS.md
# AGENTS.md

## Debug Workflow

### Allenk Upstream Reference

- The local fork of allenk/GeminiWatermarkTool is at `${GWR_ALLENK_ROOT}`.
- Local-only path variables are configured in `.env`; use `.env.example` as the public template.
- When learning or comparing upstream watermark catalog specs, alpha maps, video rules, FDnCNN behavior, or CLI behavior, prefer this local fork over temporary clones or remote README-only assumptions.
- Treat upstream specs as candidate priors until they are verified against this repo's sample scoring, crop sheets, and output residual gates.

### Data-Driven Watermark Investigation

- When user-provided samples show obvious watermarks being skipped or poorly removed, treat the first task as pattern discovery, not threshold tuning.
- Derive the watermark geometry and rendering rules from the samples before changing removal heuristics:
  - exact anchor position (`x/y`, right/bottom margins)
  - watermark size and aspect
  - subpixel offset / scale drift
  - alpha map shape and alpha strength
  - background-dependent compositing behavior
- Build batch reports and visual artifacts from the sample set:
  - full image list with dimensions and scores
  - bottom-right crop sheets
  - candidate-position overlays when debugging detection
  - before/after crops for every changed strategy
- Prefer improving candidate localization and alpha estimation over loosening safety/protection gates.
- Safety gates are a final fallback. If a visible watermark is skip

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 28/100 · **Auto-apply:** False
- **Evidence:** `gemini`, `vector`
- **All scores:** {'seosona-os': 28, 'seosona-video': 6, 'seosona-content': 28, 'seosona-ux-ui': 6, 'seosona-flow': 22}
