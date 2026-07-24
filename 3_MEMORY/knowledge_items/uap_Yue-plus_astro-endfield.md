# KI: Yue-plus/astro-endfield

## Overview
Repository with 54 files across 15 directories. Primary language: TypeScript (6 files).

## Tech Stack (from code)
- TypeScript (6 files)
- **Total:** 54 files, 15 directories
- **File types:** .astro: 12, .md: 11, .ts: 6, .png: 4, .json: 3, .svg: 3, .jpg: 2, .woff2: 2

## Dependencies
### Dependencies (from package.json)
- `@astrojs/react`: ^2.1.1
- `@astrojs/tailwind`: ^3.1.1
- `@nanostores/react`: ^0.4.1
- `@types/react`: ^18.2.0
- `@types/react-dom`: ^18.2.1
- `astro`: ^2.3.1
- `nanostores`: ^0.7.4
- `react`: ^18.2.0
- `react-dom`: ^18.2.0
- `sass`: ^1.62.1
- `shiki`: ^0.14.1
- `tailwindcss`: ^3.3.2

### Dev Dependencies
- `prettier`: ^2.8.8
- `prettier-plugin-astro`: ^0.8.0

## Imports Detected in Source
- `@astrojs/react`
- `@astrojs/tailwind`
- `astro`

## Available Commands
- `npm run dev` -- `astro dev`
- `npm run start` -- `astro dev`
- `npm run build` -- `astro build`
- `npm run preview` -- `astro preview`
- `npm run astro` -- `astro`
- `npm run prettier` -- `prettier --write --plugin-search-dir=. .`

## File Structure
```
  .gitignore
  .prettierignore
  .prettierrc.json
  LICENSE
  README.en.md
  README.ja.md
  README.md
  astro.config.ts
  endfield.config.ts
  package.json
  pnpm-lock.yaml
  tailwind.config.cjs
  tsconfig.json
  yarn.lock
  public/
    CNAME
    favicon.svg
    assets/
      img/
        astro-endfield-logo.svg
        base_bg.jpg
        base_bg_light.jpg
        endfield-industries.svg
        footer_bg.png
        footer_bg_light.png
        wave_texture.png
        wave_texture_light.png
    fonts/
      JetBrainsMono-Regular.woff2
      JovannyLemonad-Bender.otf
      Morro-Regular.woff2
      Orbitron-VariableFont_wght.ttf
  src/
    env.d.ts
    components/
      Card.astro
      Colors.ts
      EndfieldUserConfig.ts
      Fonts.astro
      Footer.astro
      Header.astro
      PostStyle.scss
      ThemeSwitch.tsx
      types/
        CommentSystem.ts
    content/
      blog/
        helloworld.md
        kotlin-basic-types.md
        longindex.md
        longtext.md
        markdown.md
        nihonngo.md
        unixtime.md
      docs/
        start.md
    layouts/
      Layout.astro
      PostSlugPage.astro
    pages/
      404.astro
      index.astro
      blog/
        [...slug].astro
        index.astro
      docs/
        [...slug].astro
        index.astro
```

## Key Source Excerpts
### src\env.d.ts
```typescript
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

```

### astro.config.ts
```typescript
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
// https://docs.astro.build/zh-cn/reference/configuration-reference/
export default defineConfig({
  site: "https://astro.endfield.icu/",
  markdown: {
    shikiConfig: {
      theme: "slack-dark"
    },
  },
  integrations: [react(), tailwind()],
});

```

### endfield.config.ts
```typescript
import { defineEndfieldConfig } from "./src/components/EndfieldUserConfig";

export default defineEndfieldConfig({
  background: {
    image:
      "https://web.hycdn.cn/endfield/official/pre/assets/img/base_bg.e1790f.jpg",
  },
  footer: {
    icp: "赣ICP备19008355号",
  },
});

```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `plugin`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
