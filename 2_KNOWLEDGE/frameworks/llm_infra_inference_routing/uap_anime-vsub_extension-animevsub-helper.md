# KI: anime-vsub/extension-animevsub-helper

## Overview
Repository with 88 files across 20 directories. Primary language: TypeScript (55 files).

## Tech Stack (from code)
- TypeScript (55 files)
- **Total:** 88 files, 20 directories
- **File types:** .ts: 55, .json: 11, .svg: 6, .yaml: 3, .md: 3, .eslintignore: 1, .eslintrc: 1, .gitignore: 1

## Public API / Exports
- `isFirefox` from `lib\env.ts`
- `HASH` from `lib\env.ts`
- `EXTRA` from `lib\env.ts`
- `ProtocolMap` from `shim.d.ts`

## Dependencies
### Dependencies (from package.json)
- `bumpp`: ^10.1.0

### Dev Dependencies
- `@ffflorian/jszip-cli`: ^3.4.1
- `@tachibana-shin/eslint-config`: ^1.1.1
- `@types/chrome`: ^0.0.248
- `@types/node`: ^20.8.7
- `@types/semver`: ^7.5.4
- `chokidar`: ^3.5.3
- `cross-env`: ^7.0.3
- `crx`: ^5.0.1
- `eslint`: ^8.51.0
- `jsdom`: ^22.1.0
- `kolorist`: ^1.8.0
- `npm-run-all`: ^4.1.5
- `prettier`: ^3.0.3
- `rimraf`: ^4.4.1
- `tsx`: ^3.14.0

## Imports Detected in Source
- `webext-bridge`

## Available Commands
- `npm run lint` -- `eslint lib/ --ext ts`
- `npm run format` -- `prettier -w lib/`
- `npm run test` -- `pnpm -r test`
- `npm run build` -- `pnpm -r build`
- `npm run pack` -- `pnpm build && pnpm -r run pack`
- `npm run release:mv2` -- `cd manifest-v2 && pnpm release`
- `npm run release:mv3` -- `cd manifest-v3 && pnpm release`
- `npm run npm` -- `cd npm && pnpm publish`
- `npm run release` -- `bumpp package.json manifest-v2/package.json manifest-v3/package.json npm/package`

## File Structure
```
  .eslintignore
  .eslintrc
  .gitignore
  .hintrc
  .npmrc
  .prettierrc
  .whitesource
  LICENSE
  README.md
  allowlist.yaml
  install-on-chrome.md
  map-referer.json
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  shim.d.ts
  tsconfig.json
  lib/
    env.ts
    global.ts
    package.json
    shims-yaml.d.ts
    tsconfig.json
    assets/
      icon-512.png
      icon.svg
    background/
      index.ts
      logic/
        create-rule.ts
        get-referrers.ts
        install-referers.ts
        install-rules.ts
    contentScripts/
      index.ts
      inject.ts
      inject2.ts
    logic/
      arrayBufferToBase64.spec.ts
      arrayBufferToBase64.ts
      base64ToArrayBuffer.spec.ts
      base64ToArrayBuffer.ts
      encoder-detail.ts
      modify-header.ts
      randomUUID.spec.ts
      randomUUID.ts
  logos/
    brave.svg
    chrome.svg
    edge.svg
    firefox.svg
    opera.svg
  manifest-v2/
    package.json
    tsconfig.json
    vite.config.content-inject.ts
    vite.config.content-inject2.ts
    vite.config.content.ts
    vite.config.ts
    scripts/
      manifest.ts
      prepare.ts
      utils.ts
    src/
      env.ts
      global.d.ts
      manifest.ts
      background/
        contentScriptHMR.ts
        index.html
        main.ts
      contentScripts/
        index.ts
        inject.ts
        inject2.ts
  manifest-v3/
    package.json
    tsconfig.json
    tsup.config.ts
    vite-mv3-hmr.ts
    vite.config.content-inject.ts
    vite.config.content-inject2.ts
    vite.config.content.ts
    vite.config.share.ts
    scripts/
      client.ts
      manifest.ts
      prepare.ts
      utils.ts
    src/
      env.ts
      global.d.ts
      manifest.ts
      background/
        index.ts
      contentScripts/
        index.ts
        inject.ts
        inject2.ts
  npm/
    README.md
    package.json
    tsconfig.json
    tsup.config.ts
    src/
      global.ts
      index.ts
```

## Key Source Excerpts
### lib\env.ts
```typescript
export const isFirefox = // eslint-disable-next-line no-undef
  typeof navigator !== "undefined" && navigator?.userAgent.includes("Firefox")

export const HASH = "#"
export const EXTRA = "_extra"

```

### lib\global.ts
```typescript
// eslint-disable-next-line functional/no-let, no-unused-vars, @typescript-eslint/no-unused-vars
declare let __MV3__: boolean
// eslint-disable-next-line functional/no-let, no-unused-vars, @typescript-eslint/no-unused-vars
declare let __DEV__: boolean

```

### lib\shims-yaml.d.ts
```typescript
declare module "*.yaml" {
  const value: any
  export default value
}

```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 0/100 · **Auto-apply:** False
- **Evidence:** none (kept as reference)
- **All scores:** {'seosona-os': 0, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
