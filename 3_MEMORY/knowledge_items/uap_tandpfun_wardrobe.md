# KI: tandpfun/wardrobe

## Overview
A local-first AI wardrobe gallery powered by OpenAI.

## Tech Stack (from code)
- JavaScript (React) (4 files)
- JavaScript (1 files)
- **Total:** 29 files, 14 directories
- **File types:** .md: 5, .mjs: 4, .jsx: 4, .json: 2, .yaml: 2, .png: 2, .css: 2, .example: 1

## Public API / Exports
- `OptimizedImage` from `src\OptimizedImage.jsx`

## Dependencies
### Dependencies (from package.json)
- `@fontsource-variable/instrument-sans`: ^5.2.8
- `@phosphor-icons/react`: ^2.1.10
- `@unpic/react`: ^1.0.2
- `@vitejs/plugin-react`: 5.0.4
- `ipx`: ^3.1.1
- `react`: 19.2.0
- `react-dom`: 19.2.0
- `sharp`: ^0.34.5
- `vite`: 6.4.3

## Imports Detected in Source
- `@phosphor-icons/react`
- `@unpic/react`
- `react`
- `react-dom`

## Available Commands
- `npm run dev` -- `vite`
- `npm run build` -- `vite build`
- `npm run preview` -- `vite preview`
- `npm run check` -- `npm run build`

## File Structure
```
  .env.example
  .gitignore
  .npmrc
  CONTRIBUTING.md
  LICENSE
  README.md
  index.html
  package-lock.json
  package.json
  vite.config.mjs
  .agents/
    skills/
      generate-outfits/
        SKILL.md
        agents/
          openai.yaml
        references/
          outfit-image-prompt.md
      import-clothes/
        SKILL.md
        agents/
          openai.yaml
        scripts/
          import-to-wardrobe.mjs
  docs/
    screenshots/
      editor.png
      gallery.png
  public/
    icon.svg
    manifest.webmanifest
    sw.js
  scripts/
    import-job-api.mjs
    responsive-image-api.mjs
  src/
    App.jsx
    OptimizedImage.jsx
    import-flow.css
    import-flow.jsx
    main.jsx
    styles.css
```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 28/100 · **Auto-apply:** False
- **Evidence:** `plugin`, `skill.md`
- **All scores:** {'seosona-os': 28, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 22, 'seosona-flow': 0}
