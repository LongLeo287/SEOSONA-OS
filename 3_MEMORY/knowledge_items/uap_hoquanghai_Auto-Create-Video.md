# KI: hoquanghai/Auto-Create-Video

## Overview
Auto-generate Vietnamese 9:16 short news videos from URL/txt — Claude Code skill + HyperFrames + LucyLab/ElevenLabs TTS

## Tech Stack (from code)
- TypeScript (27 files)
- JavaScript (1 files)
- **Total:** 56 files, 23 directories
- **File types:** .ts: 27, .mp3: 8, .md: 5, .json: 4, .html: 3, .example: 1, .gitattributes: 1, .gitignore: 1

## Public API / Exports
- `TtsProvider` from `src\config.ts`
- `TiktokConfig` from `src\config.ts`
- `Config` from `src\config.ts`
- `loadConfig` from `src\config.ts`
- `runPipeline` from `src\pipeline.ts`

## Dependencies
### Dependencies (from package.json)
- `axios`: ^1.15.2
- `dotenv`: ^17.4.2
- `hyperframes`: ^0.4.34
- `p-limit`: ^7.3.0
- `zod`: ^4.3.6

### Dev Dependencies
- `@types/node`: ^25.6.0
- `@vitest/coverage-v8`: ^4.1.5
- `nock`: ^14.0.13
- `tsx`: ^4.21.0
- `typescript`: ^6.0.3
- `vitest`: ^4.1.5

## Imports Detected in Source
- `dotenv`
- `node:fs`
- `node:path`
- `node:url`
- `p-limit`
- `vitest`

## Available Commands
- `npm run test` -- `vitest run --passWithNoTests`
- `npm run test:watch` -- `vitest`
- `npm run pipeline` -- `tsx src/cli.ts`
- `npm run rerender` -- `tsx rerender.ts`
- `npm run typecheck` -- `tsc --noEmit`
- `npm run build` -- `tsc`
- `npm run sfx:download` -- `tsx scripts/download-sfx.ts`
- `npm run sfx:filter` -- `tsx scripts/filter-sfx.ts`

## File Structure
```
  .env.example
  .gitattributes
  .gitignore
  LICENSE
  README.md
  README.vi.md
  hyperframes.json
  package-lock.json
  package.json
  rerender.ts
  tsconfig.json
  vitest.config.ts
  .claude/
    skills/
      create-news-video/
        SKILL.md
  assets/
    avatar.png
    logo.svg
    sfx/
      alert/
        notification.mp3
      emphasis/
        chime.mp3
        ding.mp3
        tick.mp3
      outro/
        tada.mp3
      transition/
        pop.mp3
        swoosh.mp3
        whoosh-soft.mp3
  docs/
    superpowers/
      plans/
        2026-04-29-auto-news-video.md
      specs/
        2026-04-29-auto-news-video-design.md
  scripts/
    download-sfx.ts
    filter-sfx.ts
  src/
    cli.ts
    config.test.ts
    config.ts
    pipeline.ts
    assets/
      audio-tools.test.ts
      audio-tools.ts
      image-fetcher.test.ts
      image-fetcher.ts
      sfx-selector.test.ts
      sfx-selector.ts
    render/
      html-composer.test.ts
      html-composer.ts
      hyperframes-runner.ts
      script-schema.test.ts
      script-schema.ts
      blocks/
        tiktok-follow.html
        components/
          grain-overlay.html
          shimmer-sweep.html
      templates/
        animations.js
        base.html.tmpl
        styles.css
    tts/
      elevenlabs-client.test.ts
      elevenlabs-client.ts
      lucylab-client.test.ts
      lucylab-client.ts
      tts-client.ts
    utils/
      logger.ts
      slug.test.ts
      slug.ts
```

## Key Source Excerpts
### src\cli.ts
```typescript
#!/usr/bin/env node
import { config } from "dotenv";
config({ path: ".env.local" });

import { runPipeline } from "./pipeline.js";
import { log } from "./utils/logger.js";

async function main() {
  const scriptPath = process.argv[2];
  if (!scriptPath) {
    console.error("Usage: npm run pipeline -- <path/to/script.json>");
    process.exit(2);
  }
  try {
    await runPipeline(scriptPath);
  } catch (e) {
    log.error("Pipeline failed", e);
    process.exit(1);
  }
}

main();

```

### src\config.test.ts
```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { loadConfig } from "./config.js";

const ENV_KEYS = [
  "TTS_PROVIDER",
  "VIETNAMESE_API_KEY",
  "VIETNAMESE_VOICEID",
  "LUCYLAB_ENDPOINT",
  "LUCYLAB_POLL_INTERVAL_MS",
  "LUCYLAB_POLL_TIMEOUT_MS",
  "ELEVENLABS_API_KEY",
  "ELEVENLABS_VOICE_ID",
  "ELEVENLABS_MODEL_ID",
  "ELEVENLABS_ENDPOINT",
  "TTS_CONCURRENCY",
];

describe("loadConfig", () => {
  let saved: Record<string, string | undefined>;

  beforeEach(() => {
    saved = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]));
    ENV_KEYS.forEach((k) => delete process.env[k]);
  });

  afterEach(() => {
    Object.entries(saved).forEach(([k, v]) => {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    });
  });

  describe("LucyLab provider (default)", () => {
    it("reads LucyLab env vars when no provider specified", () => {
      process.env.VIETNAMESE_API_KEY = "sk_test_abc";
      process.env.VIETNAMESE_VOICEID = "voice123";
      const cfg = loadConfig();
      expect(cfg.ttsProvider).toBe("lucylab");
      expect(cfg.lucylabApiKey).toBe("sk_test_abc");
      expect(cfg.lucylabVoiceId).toBe("voice123");
    });

    it("throws when VIETNAMESE_API_KEY missing", () => {
      process.env.VIETNAMESE_VOICEID = "voice123";
      expect(() => loadConfig()).toThrow(/VIETNAMESE_API_KEY/);
    });

    it("uses sensible defaults for optional vars", () => {
      process.env.VIETNAMESE_API_KEY = "k";

```

### src\config.ts
```typescript
import "dotenv/config";

export type TtsProvider = "lucylab" | "elevenlabs";

export interface TiktokConfig {
  displayName: string;
  handle: string;
  followers: string;
  /** URL to download avatar JPG. If undefined, the bundled `assets/avatar.jpg` is used. */
  avatarUrl?: string;
}

export interface Config {
  ttsProvider: TtsProvider;

  // LucyLab
  lucylabApiKey?: string;
  lucylabVoiceId?: string;
  lucylabEndpoint: string;
  lucylabPollIntervalMs: number;
  lucylabPollTimeoutMs: number;

  // ElevenLabs
  elevenlabsApiKey?: string;
  elevenlabsVoiceId?: string;
  elevenlabsModelId: string;
  elevenlabsEndpoint: string;

  // TikTok follow card (outro)
  tiktok: TiktokConfig;

  ttsConcurrency: number;
}

function intDefault(name: string, def: number): number {
  const v = process.env[name];
  if (!v) return def;
  const n = parseInt(v, 10);
  if (isNaN(n)) throw new Error(`Env var ${name} must be integer, got "${v}"`);
  return n;
}

export function loadConfig(): Config {
  const provider = (process.env.TTS_PROVIDER ?? "lucylab") as TtsProvider;
  if (provider !== "lucylab" && provider !== "elevenlabs") {
    throw new Error(`TTS_PROVIDER must be "lucylab" or "elevenlabs", got "${provider}"`);
  }

  // Validate provider-specific required vars
  if (provider === "lucylab") {
    if (!process.env.VIETNAMESE_API_KEY || process.env.VIETNAMESE_API_KEY.trim() === "") {
      throw new Error(
        `Missing VIETNAMESE_API_KEY (required when TTS_PROVIDER=lucylab). ` +
  
```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `video-render` · **Fit:** 44/100 · **Auto-apply:** True
- **Evidence:** `render`, `hyperframe`
- **All scores:** {'seosona-os': 22, 'seosona-video': 44, 'seosona-content': 0, 'seosona-ux-ui': 6, 'seosona-flow': 22}
