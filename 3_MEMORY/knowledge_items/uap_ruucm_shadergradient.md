# KI: ruucm/shadergradient

## Overview
Customizable 3D, moving gradient for React. The v2 package is lean: it only ships the `ShaderGradient` renderer (and its canvas helper), while the stateless UI pieces now live in the separate `@shadergradient/ui` package.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 122 files across 28 directories
- **File types:** .tsx: 56, .ts: 17, .json: 13, .otf: 12, .md: 4, .mts: 4, .yaml: 2
- **Dev dependencies:** @changesets/cli, eslint, eslint-config-custom, prettier, prettier-plugin-tailwindcss, turbo, typescript

## Documentation Sections
- Shader Gradient v2
- Table of contents
- Installation
- Figma
- Framer
- React
- with yarn
- with npm
- with pnpm
- Compatibility matrix
- Packages
- Usage
- Available Gradient Properties (Types)
- Examples
- Conference Talks
- Contributing
- Setup
- Start development
- Release
- Release to npm
- Release it as ES Module (Hosted by GitHub Pages)
- Future Plan
- License

## Available Commands
- `npm run build` -- turbo run build
- `npm run dev` -- turbo run dev --parallel
- `npm run dev:framer` -- turbo run dev:framer --parallel
- `npm run dev:email` -- turbo run dev:email --parallel
- `npm run dev:ui` -- turbo run dev:ui --parallel
- `npm run start` -- PORT=8000 turbo run start --parallel
- `npm run lint` -- turbo run lint
- `npm run clean` -- turbo run clean
- `npm run format` -- prettier --write "**/*.{ts,tsx,md}"
- `npm run changeset` -- changeset add
- `npm run version-packages` -- changeset version
- `npm run release` -- turbo run build --filter=@shadergradient/react && changeset publish

## Core Structure
```
  .gitignore
  .npmrc
  .prettierignore
  .prettierrc
  README.md
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  turbo.json
  .changeset/
    config.json
  .github/
    workflows/
      deploy.yml
  .vscode/
    settings.json
  apps/
    email-previews/
      package.json
      tsconfig.json
      .react-email/
        CHANGELOG.md
        index.mjs
        license.md
        module-punycode.d.ts
        next-env.d.ts
        next.config.mjs
        package-lock.json
        package.json
        postcss.config.js
        readme.md
        tailwind.config.ts
        tsconfig.json
        vitest.config.ts
        emails/
          .gitkeep
        jsx-runtime/
          jsx-dev-runtime.js
        scripts/
          build-preview-server.mts
          dev.mts
          fill-caniemail-data.mts
          seed.mts
          utils/
            default-seed/
              feedback-request.tsx
              auth/
                account-confirmation.tsx
                forgot-password.tsx
              communications/
                payment-overdue.tsx
                team-invite.tsx
                webhooks-failed.tsx
              marketing/
                changelog.tsx
        src/
          actions/
            export-single-template.ts
            get-email-path-from-slug.ts
            get-emails-directory-metadata-action.ts
            render-email-by-path.tsx
            safe-action.ts
            email-validation/
              caniemail-data.ts
              check-compatibility.ts
              check-images.spec.tsx
              check-images.ts
              check-links.spec.tsx
              check-links.ts
              get-code-location-from-ast-element.ts
              quick-fetch.ts
              __snapshots__/
                check-images.spec.tsx.snap
          animated-icons-data/
            help.json
            link.json
            load.json
            mail.json
          app/
            env.ts
            favicon.ico
            fonts.ts
            globals.css
            layout.tsx
            logo.png
            page.tsx
            fonts/
              SFMono/
                SFMonoBold.otf
                SFMonoBoldItalic.otf
                SFMonoHeavy.otf
                SFMonoHeavyItalic.otf
                SFMonoLight.otf
                SFMonoLightItalic.otf
                SFMonoMedium.otf
                SFMonoMediumItalic.otf
                SFMonoRegular.otf
                SFMonoRegularItalic.otf
                SF
```

## Quick Start
```bash
yarn add @shadergradient/react @react-three/fiber three three-stdlib camera-controls
yarn add -D @types/three
npm i @shadergradient/react @react-three/fiber three three-stdlib camera-controls
npm i -D @types/three
pnpm add @shadergradient/react @react-three/fiber three three-stdlib camera-controls
pnpm add -D @types/three
Load settings from a URL (for example, one copied from [shadergradient.co/customize](https://www.shadergradient.co/customize)):
`ShaderGradientCanvas` also accepts `pixelDensity`, `fov`, `envBasePath`, GL overrides (`preserveDrawingBuffer`, `powerPreference`), and lazy-load controls (`lazyLoad`, `threshold`, `rootMargin`).
- CRA Starter: [CodeSandbox](https://codesandbox.io/p/sandbox/github/ruucm/shadergradient/tree/main/apps/example-cra?file=%2Fsrc%2FApp.tsx)
- Next.js Starter (App Router): [CodeSandbox](https://codesandbox.io/p/sandbox/github/ruucm/shadergradient/tree/main/apps/example-nextjs-approuter)
```

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
