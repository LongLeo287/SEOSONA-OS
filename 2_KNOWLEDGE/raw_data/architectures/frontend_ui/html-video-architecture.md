# Architecture Extract: html-video

## Directory Structure
```text
html-video/
    .gitignore
    .npmrc
    ATTRIBUTIONS.md
    biome.json
    CLAUDE.md
    CONTRIBUTING.md
    LICENSE
    package.json
    pnpm-workspace.yaml
    README.md
    README.zh-CN.md
    tsconfig.base.json
    tsconfig.json
    assets/
    docs/
        assets/
            templates/
    notes/
        2026-05-26-foundation-decisions.md
        2026-06-04-provenance-audit.md
    packages/
        adapter-hyperframes/
            package.json
            tsconfig.json
            src/
                capabilities.ts
                index.ts
                render.ts
                validate.ts
        adapter-remotion/
            package.json
            tsconfig.json
            src/
                capabilities.ts
                index.ts
                render.ts
                validate.ts
                bridge/
                    entry.ts
                    HtmlFrameDriver.tsx
                    Root.tsx
                    public/
                        frame-index.html
            test/
                neutralize-resources.test.mjs
        cli/
            package.json
            tsconfig.json
            src/
                bin.ts
                context.ts
                fetch-source.ts
                index.ts
                media-config.ts
                output.ts
                smoke.ts
                studio-server.ts
                task-registry.ts
                commands/
                    doctor.ts
                    list-engines.ts
                    project.ts
                    templates.ts
            test/
                decode-upload-filename.test.ts
                parse-format-reply.test.ts
        content-graph/
            package.json
            README.md
            tsconfig.json
            src/
                index.ts
        core/
            package.json
            tsconfig.json
            src/
                asset-store.ts
                errors.ts
                index.ts
                minimax.ts
                project.ts
                registry.ts
                types/
                    index.ts
        project-studio/
            package.json
            public/
                app.js
                i18n.js
                index.html
                tokens.css
                agent-icons/
        runtime/
            package.json
            tsconfig.json
            src/
                acp-client.ts
                detect.ts
                index.ts
                registry.ts
                spawn.ts
                types.ts
                defs/
                    aider.ts
                    amr.ts
                    anthropic-api.ts
                    claude.ts
                    codex.ts
                    copilot.ts
                    cursor-agent.ts
                    gemini.ts
                    grok.ts
                    hermes.ts
                    opencode.ts
                    qwen.ts
                    trae-cli.ts
            test/
                spawn-utf8.test.ts
                trae-cli.test.mjs
        studio-next/
            .gitignore
            index.html
            package.json
            README.md
            SPIKE-REPORT.md
            tsconfig.json
            vite.config.ts
            src/
                App.tsx
                main.tsx
    research/
        2026-05-26-competitive-landscape.md
        2026-05-26-spec-01-engine-adapter.md
        2026-05-26-spec-02-template-metadata.md
        2026-05-26-spec-03-agent-skill.md
        2026-05-26-spec-04-storyboard-workflow.md
        2026-05-27-spec-05-project-centric.md
        2026-05-27-yabohe-hyperframes-takeaways.md
        2026-05-28-understand-anything-takeaways.md
        2026-06-04-spec-07-ppt-to-template.md
        2026-06-06-spec-08-remotion-adapter.md
        2026-06-06-spec-09-multi-engine-ux.md
        refs/
            mp.weixin.qq.com/
                hyperframes-mmbiz-qpic-cn-sz_mmbiz_png-xw7as806wyt/
                    hyperframes-mmbiz-qpic-cn-sz_mmbiz_png-xw7as806wyt-captured.html
                    hyperframes-mmbiz-qpic-cn-sz_mmbiz_png-xw7as806wyt.md
    templates/
        NOTICE.md
        frame-bold-poster/
            example.md
            package.json
            SKILL.md
            template.html-video.yaml
            source/
                index.html
        frame-bold-signal/
            example.md
            package.json
            SKILL.md
            template.html-video.yaml
            source/
                index.html
        frame-build-minimal/
            example.md
            package.json
            SKILL.md
            template.html-video.yaml
            source/
                index.html
        frame-creative-voltage/
            example.md
            package.json
            SKILL.md
            template.html-video.yaml
            source/
                index.html
        frame-data-chart-nyt/
            example.md
            package.json
            SKILL.md
            template.html-video.yaml
            source/
                index.html
        frame-data-rollup/
            example.md
            package.json
            SKILL.md
            template.html-video.yaml
            source/
                DataRollup.tsx
                entry.ts
                Root.tsx
        frame-decision-tree/
            index.html
            template.html-video.yaml
            compositions/
                decision_tree.html
        frame-electric-studio/
            example.md
            package.json
            SKILL.md
            template.html-video.yaml
            source/
                index.html
        frame-glitch-title/
            example.md
            package.json
            SKILL.md
            template.html-video.yaml
            source/
                index.html
        frame-kinetic-type/
            index.html
            template.html-video.yaml
            compositions/
                main-graphics.html
        frame-light-leak-cinema/
            example.md
            package.json
            SKILL.md
            template.html-video.yaml
            source/
                index.html
        frame-liquid-bg-hero/
            example.md
            package.json
            SKILL.md
            template.html-video.yaml
            source/
                index.html
        frame-logo-outro/
            example.md
            package.json
            SKILL.md
            template.html-video.yaml
            source/
                index.html
        frame-nyt-graph/
            index.html
            template.html-video.yaml
            compositions/
                nyt-chart.html
        frame-pentagram-stat/
            example.md
            package.json
            SKILL.md
            template.html-video.yaml
            source/
                index.html
        frame-play-mode/
            index.html
            template.html-video.yaml
            compositions/
                captions.html
                intro.html
                stats.html
        frame-product-promo/
            index.html
            template.html-video.yaml
            assets/
            compositions/
                scene1-logo-intro.html
                scene2-4-canvas.html
                scene5-logo-outro.html
        frame-product-promo-30s/
            index.html
            template.html-video.yaml
            assets/
            compositions/
                01-problem-type.html
                02-card-to-logo.html
                03-brand-reveal.html
                04-benefits-flowchart.html
                05-product-surfaces.html
                06-wheel-pillars.html
                07-foundation.html
                08-cta-outro.html
        frame-swiss-grid/
            index.html
            template.html-video.yaml
            assets/
            compositions/
                captions.html
                graphics.html
                intro.html
        frame-takram-organic/
            example.md
            package.json
            SKILL.md
            template.html-video.yaml
            source/
                index.html
        frame-vignelli/
            index.html
            template.html-video.yaml
            compositions/
                captions.html
                overlays.html
        frame-warm-grain/
            index.html
            template.html-video.yaml
            compositions/
                captions.html
                graphics.html
                intro.html
        vfx-text-cursor/
            example.md
            package.json
            SKILL.md
            template.html-video.yaml
            source/
                index.html
```

## Core Logic Samples

### `biome.json`
```
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "files": {
    "ignore": ["**/dist/**", "**/node_modules/**", "**/.html-video/**", "**/templates/*/source/**"]
  },
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100,
    "lineEnding": "lf"
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": {
        "noNonNullAssertion": "warn"
      },
      "suspicious": {
        "noExplicitAny": "warn"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "all",
      "semicolons": "always",
      "arrowParentheses": "always"
    }
  }
}
```

### `package.json`
```
{
  "name": "html-video-monorepo",
  "version": "0.0.0",
  "private": true,
  "description": "HTML→Video meta-layer for coding agents",
  "license": "Apache-2.0",
  "homepage": "https://github.com/nexu-io/html-video",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/nexu-io/html-video.git"
  },
  "engines": {
    "node": ">=20",
    "pnpm": ">=9"
  },
  "packageManager": "pnpm@9.15.0",
  "workspaces": [
    "packages/*",
    "templates/*"
  ],
  "scripts": {
    "build": "pnpm -r build",
    "typecheck": "pnpm -r typecheck",
    "test": "pnpm -r test",
    "smoke": "pnpm --filter @html-video/cli smoke",
    "format": "biome format --write .",
    "lint": "biome lint ."
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.4",
    "@types/node": "^22.10.0",
    "typescript": "^5.7.2"
  },
  "dependencies": {
    "@remotion/bundler": "^4",
    "@remotion/renderer": "^4",
    "react": "^18",
    "react-dom": "^18",
    "remotion": "^4"
  }
}
```

### `tsconfig.base.json`
```
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022", "DOM"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": false,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "incremental": true
  }
}
```

### `tsconfig.json`
```
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "noEmit": true
  },
  "include": ["packages/*/src/**/*", "packages/*/test/**/*"],
  "exclude": ["**/dist/**", "**/node_modules/**"]
}
```

### `packages\adapter-hyperframes\package.json`
```
{
  "name": "@html-video/adapter-hyperframes",
  "version": "0.1.0",
  "description": "Hyperframes adapter for html-video meta-layer",
  "license": "Apache-2.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist", "README.md"],
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "node --test test/"
  },
  "dependencies": {
    "@html-video/core": "workspace:*",
    "playwright": "^1.49.0"
  },
  "peerDependencies": {
    "hyperframes": "^0.4.0"
  },
  "peerDependenciesMeta": {
    "hyperframes": {
      "optional": true
    }
  },
  "devDependencies": {
    "typescript": "^5.7.2"
  }
}
```

### `packages\adapter-hyperframes\tsconfig.json`
```
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist",
    "noEmit": false
  },
  "include": ["src/**/*"]
}
```

### `packages\adapter-hyperframes\src\capabilities.ts`
```
import type { EngineCapabilities } from '@html-video/core';

/**
 * Static capability declaration for Hyperframes.
 * v0.1: hard-coded; v0.2 may detect upstream version and adjust.
 */
export const capabilities: EngineCapabilities = {
  paradigms: ['html-css-gsap'],
  outputFormats: ['mp4', 'webm', 'webm-alpha', 'png-sequence'],
  maxResolution: { width: 3840, height: 2160 },
  alpha: true,
  audio: 'multi',
  subtitles: ['burn-in', 'sidecar'],
  renderTarget: ['local-chromium', 'lambda'],
  licensing: 'free-osi',
  renderSpeedHint: {
    resolution: '1080p',
    durationSec: 10,
    fps: 60,
    estimatedRenderSec: 18,
  },
  bestFor: [
    'social-shorts',
    'product-marketing',
    'logo-reveal',
    'gsap-animations',
    'ken-burns',
    'text-card',
  ],
  weaknesses: ['no-react-ecosystem', 'limited-3d-without-three.js'],
};
```

### `packages\adapter-hyperframes\src\index.ts`
```
import type { EngineAdapter } from '@html-video/core';
import { capabilities } from './capabilities.js';
import { validate } from './validate.js';
import { render, renderToHtml } from './render.js';

const adapter: EngineAdapter = {
  id: 'hyperframes',
  name: 'Hyperframes',
  upstreamVersion: '0.4.x',
  capabilities,
  validate,
  render,
  renderToHtml,
};

export default adapter;
export { adapter };
```

### `packages\adapter-hyperframes\src\render.ts`
```
/**
 * Hyperframes render() — real recording via Playwright + ffmpeg.
 *
 * Per-frame strategy (orchestrator already loops per node and concats):
 *   1. Launch chromium headless at the configured resolution
 *   2. recordVideo into a tmp dir
 *   3. file:// load the frame HTML
 *   4. wait `durationSec` so any opening animation completes + plays
 *   5. close → playwright dumps a webm
 *   6. ffmpeg transmux/encode the webm to mp4 at `outputPath`
 *
 * Upstream Hyperframes was never required at runtime for this adapter —
 * our generated HTML is plain inline-CSS+JS, chromium runs it as-is.
 */

import { copyFile, mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { existsSync, readdirSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import type {
  HtmlSceneOutput,
  RenderContext,
  RenderInput,
  RenderOutput,
} from '@html-video/core';
import { HtmlVideoError } from '@html-video/core';

const ADAPTER_VERSION = '0.2.0-playwright';

/** Real render: chromium records the page, ffmpeg transcodes to MP4. */
export async function render(input: RenderInput, ctx: RenderContext): Promise<RenderOutput> {
  const t0 = Date.now();
  ctx.onProgress?.(5, 'preparing');
  const outDir = dirname(input.config.outputPath);
  await mkdir(outDir, { recursive: true });
  if (ctx.signal?.aborted) throw new HtmlVideoError('cancelled', 'Aborted');

  // Resolve the source HTML path. Templates pass an absolute path already;
  // multi-frame `core` calls pass the per-frame HTML path the same way.
  if (!existsSync(input.template.sourcePath)) {
    throw new HtmlVideoError(
      'template-invalid',
      `Source HTML not found: ${input.template.sourcePath}`,
    );
  }

  let totalDuration =
    input.config.duration === 'auto' ? 5 : Math.max(0.5, Number(input.config.duration));
  const { width, height } = input.config.resolution;
  const fps = input.config.fps || 30;

  // Lazy-load playwright so the import cost only hits actual exports.
  ctx.onProgress?.(15, 'launching browser');
  const playwright = await import('playwright').catch((err) => {
    throw new HtmlVideoError(
      'render-failed',
      `playwright not installed (run \`pnpm install\` from the monorepo root). ${err instanceof Error ? err.message : err}`,
    );
  });

  const recordDir = await mkdtemp(join(tmpdir(), 'hv-render-'));
  let browser: import('playwright').Browser | undefined;
  let webmPath: string | undefined;
  let cleanupSrc: (() => Promise<void>) | undefined;
  // Wall-clock offset (ms) from when the webm starts recording to when we
  // actually start the animation, so ffmpeg can trim the dead opening lead-in.
  let leadInMs = 0;
  try {
    browser = await playwright.chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-blink-features=AutomationControlled'],
    });
    // recordVideo starts capturing the moment the context exists, so this is
    // the webm's t=0 reference.
    const tWebmStart = Date.now();
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
      recordVideo: { dir: recordDir, size: { width, height } },
    });
    const page = await context.newPage();

    // Freeze all CSS/SMIL animations the instant the document starts parsing,
    // BEFORE any @keyframes can begin counting down. Single-file templates are
    // pure CSS `animation: … forwards` timelines with no JS trigger — they
    // start running on the wall clock the moment the element is styled, i.e.
    // right after goto(). Meanwhile we then spend ~2–3s waiting for the Google
    // Fonts faces (Shrikhand et al.) to download. Without this freeze the whole
    // opening (text fading in while the real face is still downloading, then
    // the swap) plays out during that font wait and gets recorded. Pausing all
    // animations up front lets us hold the timeline at frame 0 until fonts are
    // ready, then release it so capture and motion start together — the same
    // shape as the multi-composition paused→drive path below.
    await page.addInitScript(() => {
      const style = document.createElement('style');
      style.id = '__hv_freeze';
      style.textContent =
        '*, *::before, *::after { animation-play-state: paused !important;' +
        ' -webkit-animation-play-state: paused !important; }';
      const attach = () => (document.head || document.documentElement).appendChild(style);
      if (document.head || document.documentElement) attach();
      else document.addEventListener('DOMContentLoaded', attach, { once: true });
      (window as unknown as { __hvUnfreeze?: () => void }).__hvUnfreeze = () => {
        document.getElementById('__hv_freeze')?.remove();
      };
    });

    ctx.onProgress?.(30, 'loading frame');
    // Multi-composition templates ship an entry index.html that only stitches
    // sub-scenes via `data-composition-src="compositions/x.html"`; loaded raw
    // over file:// the scenes never appear (chromium blocks file:// fetch, so
    // the studio's client-side fetch player can't run here). Inline the
    // composition files into the HTML up front so chromium records real motion
    // instead of an empty shell. Single-file templates pass through untouched.
    const prepared = await prepareSourceHtml(input.template.sourcePath);
    cleanupSrc = prepared.cleanup;
    const fileUrl = pathToFileURL(prepared.loadPath).href;
    // Wait only for the DOM + same-document scripts (GSAP, the inline player),
    // NOT `load` — `load` blocks on every external asset, and some templates
    // reference a cross-origin A-Roll video (e.g. an S3 mp4 with no CORS
    // header) that chromium retries for ~4s before giving up. Under `load`
    // those ~4s get recorded into the webm as a frozen first scene before the
    // timeline ever plays, so the clip opens on several dead seconds. Fonts are
    // awaited separately below (document.fonts.ready); GSAP is a synchronous
    // <head> script so it's ready at DOMContentLoaded.
    await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });

    // Wait for all web fonts to finish loading BEFORE recording. Templates
    // pull display faces (Shrikhand, Libre Baskerville, Archivo Black, …) from
    // Google Fonts with `font-display: swap`, which paints text in a fallback
    // system font immediately and swaps in the real face once it downloads.
    // If we start recording before the swap, the video shows a visible flash:
    // the text renders in the fallback for the first frames, then the glyphs,
    // widths and weights snap to the intended font mid-clip.
    //
    // `document.fonts.ready` alone is NOT enough here, and this was the bug in
    // the first cut of this fix. We load the page with `domcontentloaded` (so a
    // CORS-blocked A-Roll video can't freeze the opening — see above), which
    // means at this point the Google Fonts <link> stylesheet has usually not
    // come back yet. Until that CSS arrives, its @font-face rules are not in
    // `document.fonts` at all, so `fonts.ready` sees an empty set and resolves
    // INSTANTLY — recording starts, then the CSS lands, the faces download, and
    // the swap happens mid-clip anyway. So we must, in order:
    //   1. wait for every stylesheet <link> to load (or error) — this is what
    //      actually registers the @font-face rules into document.fonts;
    //   2. explicitly fonts.load() each registered face — `display: swap` does
    //      NOT auto-download a face until something paints with it, and our
    //      off-screen/pre-animation text may not have triggered that yet;
    //   3. then await fonts.ready, plus one rAF, so layout settles on the real
    //      glyph metrics before frame 0.
    // Everything is capped so a slow/blocked font CDN can't stall forever —
    // worst case we fall back to the previous behavior for that one frame.
    ctx.onProgress?.(32, 'loading fonts');
    await page
      .evaluate(
        () =>
          new Promise<void>((resolve) => {
            const doc = document as Document & { fonts?: FontFaceSet };
            const fonts = doc.fonts;
            if (!fonts || typeof fonts.ready?.then !== 'function') {
              resolve();
              return;
            }

            let settled = false;
            const finish = () => {
              if (settled) return;
              settled = true;
              // One more frame so the relayout on the real face is painted.
              requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
            };
            // Hard cap: a blocked CDN must never stall the render.
            const cap = setTimeout(finish, 8000);

            // 1. Wait for stylesheet <link>s to load (registers @font-face).
            const links = Array.from(
              document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
            );
            const linkDone = links.map((link) => {
              // An already-loaded sheet exposes cssRules without throwing.
              try {
                if (link.sheet && link.sheet.cssRules) return Promise.resolve();
              } catch {
                /* not ready yet — fall through to event wait */
              }
              return new Promise<void>((r) => {
                const done = () => r();
                link.addEventListener('load', done, { once: true });
                link.addEventListener('error', done, { once: true });
                // Per-link safety so one wedged link can't hold the batch.
                setTimeout(done, 6000);
              });
            });

            Promise.all(linkDone)
              .then(() => {
                // 2. Force every registered face to actually download. Under
                // `display: swap` the browser otherwise defers the fetch.

... [TRUNCATED] ...
```

### `packages\adapter-hyperframes\src\validate.ts`
```
import { existsSync } from 'node:fs';
import type { TemplateRef, ValidationError, ValidationResult } from '@html-video/core';
import { capabilities } from './capabilities.js';

/**
 * Validate a template against the Hyperframes adapter capabilities.
 * Cheap & read-only per RFC-01.
 */
export function validate(template: TemplateRef): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (template.engine !== 'hyperframes') {
    errors.push({
      code: 'engine-mismatch',
      message: `Template engine "${template.engine}" is not "hyperframes"`,
      fix: `Use the @html-video/adapter-${template.engine} adapter instead`,
    });
    return { ok: false, errors, warnings };
  }

  if (!template.sourcePath) {
    errors.push({
      code: 'missing-source',
      message: 'Template has no sourcePath',
    });
  } else if (!existsSync(template.sourcePath)) {
    errors.push({
      code: 'source-not-found',
      message: `Template source not found: ${template.sourcePath}`,
      fix: 'Check that the template directory contains the file declared in source_entry',
    });
  }

  // Sanity: max resolution from caps
  const cap = capabilities;
  if (cap.maxResolution.width < 1920) {
    warnings.push({
      code: 'low-max-resolution',
      message: `Adapter max resolution is ${cap.maxResolution.width}x${cap.maxResolution.height}`,
    });
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  };
}
```
