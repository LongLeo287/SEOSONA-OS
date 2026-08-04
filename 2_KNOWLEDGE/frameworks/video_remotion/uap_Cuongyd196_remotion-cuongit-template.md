# KI: Cuongyd196/remotion-cuongit-template

## Overview
My Remotion video

## Tech Stack (from code)
- TypeScript (React) (26 files)
- TypeScript (3 files)
- **Total:** 40 files, 6 directories
- **File types:** .tsx: 26, .json: 3, .ts: 3, .mjs: 2, .md: 2, .gitignore: 1, .prettierrc: 1, .png: 1

## Public API / Exports
- `myCompSchema` from `src\HelloWorld.tsx`
- `HelloWorld` from `src\HelloWorld.tsx`
- `RemotionRoot` from `src\Root.tsx`

## Dependencies
### Dependencies (from package.json)
- `@remotion/cli`: 4.0.407
- `@remotion/zod-types`: 4.0.407
- `react`: 19.2.3
- `react-dom`: 19.2.3
- `remotion`: 4.0.407
- `zod`: 3.22.3
- `@remotion/tailwind-v4`: 4.0.407
- `tailwindcss`: 4.0.0

### Dev Dependencies
- `@remotion/eslint-config-flat`: 4.0.407
- `@types/react`: 19.2.7
- `@types/web`: 0.0.166
- `eslint`: 9.19.0
- `prettier`: 3.6.0
- `typescript`: 5.9.3

## Imports Detected in Source
- `@remotion/cli`
- `@remotion/tailwind-v4`
- `@remotion/zod-types`
- `remotion`
- `zod`

## Available Commands
- `npm run dev` -- `remotion studio`
- `npm run build` -- `remotion bundle`
- `npm run upgrade` -- `remotion upgrade`
- `npm run lint` -- `eslint src && tsc`

## File Structure
```
  .gitignore
  .prettierrc
  README.md
  README_ENG.md
  eslint.config.mjs
  package-lock.json
  package.json
  postcss.config.mjs
  remotion.config.ts
  tsconfig.json
  assets/
    studio.png
  src/
    HelloWorld.tsx
    Root.tsx
    index.css
    index.ts
    DockerIntro/
      DockerCompose.tsx
      DockerContainer.tsx
      DockerEngine.tsx
      DockerImage.tsx
      DockerIntro.tsx
      DockerRegistry.tsx
      DockerfileComponent.tsx
      IntroSlide.tsx
      OutroSlide.tsx
    HelloWorld/
      Arc.tsx
      Atom.tsx
      Logo.tsx
      Subtitle.tsx
      Title.tsx
      constants.ts
    LinuxFileSystem/
      BinEtcSlide.tsx
      BootDevSlide.tsx
      HomeSlide.tsx
      IntroSlide.tsx
      LinuxFileSystem.tsx
      OutroSlide.tsx
      OverviewSlide.tsx
      RootLibSlide.tsx
      RootSlide.tsx
      VarTmpSlide.tsx
```

## Key Source Excerpts
### src/index.ts
```typescript
// This is your entry file! Refer to it when you render:
// npx remotion render <entry-file> HelloWorld out/video.mp4

import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);

```

### src\index.ts
```typescript
// This is your entry file! Refer to it when you render:
// npx remotion render <entry-file> HelloWorld out/video.mp4

import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);

```

### remotion.config.ts
```typescript
// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: When using the Node.JS APIs, the config file doesn't apply. Instead, pass options directly to the APIs

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig(enableTailwind);

```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `reference` · **Fit:** 22/100 · **Auto-apply:** False
- **Evidence:** `remotion`
- **All scores:** {'seosona-os': 0, 'seosona-video': 22, 'seosona-content': 22, 'seosona-ux-ui': 22, 'seosona-flow': 0}
