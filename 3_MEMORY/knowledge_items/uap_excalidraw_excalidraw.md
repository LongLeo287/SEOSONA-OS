# KI: excalidraw/excalidraw

## Overview
yarn add react react-dom @excalidraw/excalidraw ```

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 116 files across 30 directories
- **File types:** .mdx: 33, .yml: 14, .js: 10, .png: 10, .json: 9, .md: 8, .svg: 7

## Core Capabilities
The Excalidraw editor (npm package) supports:

- 💯&nbsp;Free & open-source.
- 🎨&nbsp;Infinite, canvas-based whiteboard.
- ✍️&nbsp;Hand-drawn like style.
- 🌓&nbsp;Dark mode.
- 🏗️&nbsp;Customizable.
- 📷&nbsp;Image support.
- 😀&nbsp;Shape libraries support.
- 🌐&nbsp;Localization (i18n) support.
- 🖼️&nbsp;Export to PNG, SVG & clipboard.
- 💾&nbsp;Open format - export drawings as an `.excalidraw` json file.
- ⚒️&nbsp;Wide range of tools - rectangle, circle, diamond, arrow, line, free-draw, eraser...
- ➡️&nbsp;Arrow-binding & labeled arrows.
- 🔙&nbsp;Undo / Redo.
- 🔍&nbsp;Zoom and panning support.

## Documentation Sections
- Features
- Excalidraw.com
- Quick start
- or
- Contributing
- Integrations
- Who's integrating Excalidraw
- Sponsors & support
- Thank you for supporting Excalidraw

## Core Structure
```
  .dockerignore
  .editorconfig
  .env.development
  .env.production
  .env.test
  .eslintignore
  .eslintrc.json
  .gitattributes
  .gitignore
  .lintstagedrc.js
  .npmrc
  .prettierignore
  .watchmanconfig
  CLAUDE.md
  CONTRIBUTING.md
  Dockerfile
  LICENSE
  README.md
  crowdin.yml
  docker-compose.yml
  package.json
  setupTests.ts
  tsconfig.json
  vercel.json
  vitest.config.mts
  yarn.lock
  .codesandbox/
    Dockerfile
    tasks.json
  .github/
    FUNDING.yml
    copilot-instructions.md
    assets/
      crowdin.svg
      sentry.svg
      vercel.svg
    workflows/
      autorelease-excalidraw.yml
      build-docker.yml
      cancel.yml
      lint.yml
      locales-coverage.yml
      publish-docker.yml
      semantic-pr-title.yml
      sentry-production.yml
      size-limit.yml
      test-coverage-pr.yml
      test.yml
  .husky/
    pre-commit
  dev-docs/
    .gitignore
    README.md
    babel.config.js
    docusaurus.config.js
    package.json
    sidebars.js
    tsconfig.json
    vercel.json
    yarn.lock
    docs/
      @excalidraw/
        excalidraw/
          customizing-styles.mdx
          development.mdx
          faq.mdx
          installation.mdx
          integration.mdx
          api/
            api-intro.mdx
            constants.mdx
            excalidraw-element-skeleton.mdx
            children-components/
              children-components-intro.mdx
              footer.mdx
              live-collaboration-trigger.mdx
              main-menu.mdx
              sidebar.mdx
              welcome-screen.mdx
            props/
              excalidraw-api.mdx
              initialdata.mdx
              props.mdx
              render-props.mdx
              ui-options.mdx
            utils/
              export.mdx
              restore.mdx
              utils-intro.md
        mermaid-to-excalidraw/
          api.mdx
          development.mdx
          installation.mdx
          codebase/
            codebase.mdx
            new-diagram-type.mdx
            parser/
              flowchart.mdx
              parser.mdx
      assets/
        aggressive-block-fingerprint.png
        block-fingerprint.png
        brave-shield.png
        nerd-stats.png
      codebase/
        frames.mdx
        json-schema.mdx
      introduction/
        contributing.mdx
        development.mdx
        get-started.mdx
    src/
      initialData.js
      components/
        Highlight.js
        Homepage/
          index.js
          index.tsx
          style
```

## Quick Start
```bash
npm install react react-dom @excalidraw/excalidraw
yarn add react react-dom @excalidraw/excalidraw
```

## Agent Configuration

--- CLAUDE.md ---
# CLAUDE.md

## Project Structure

Excalidraw is a **monorepo** with a clear separation between the core library and the application:

- **`packages/excalidraw/`** - Main React component library published to npm as `@excalidraw/excalidraw`
- **`excalidraw-app/`** - Full-featured web application (excalidraw.com) that uses the library
- **`packages/`** - Core packages: `@excalidraw/common`, `@excalidraw/element`, `@excalidraw/math`, `@excalidraw/utils`
- **`examples/`** - Integration examples (NextJS, browser script)

## Development Workflow

1. **Package Development**: Work in `packages/*` for editor features
2. **App Development**: Work in `excalidraw-app/` for app-specific features
3. **Testing**: Always run `yarn test:update` before committing
4. **Type Safety**: Use `yarn test:typecheck` to verify TypeScript

## Development Commands

```bash
yarn test:typecheck  # TypeScript type checking
yarn test:update     # Run all tests (with snapshot updates)
yarn fix             # Auto-fix formatting and linting issues
```

## Architecture Notes

### Package System

- Uses Yarn workspaces for monorepo management
- Internal packages use path aliases (see `vitest.config.mts`)
- Build system uses esbuild for packages, Vite for the app
- TypeScript throughout with strict configuration


--- CONTRIBUTING.md ---
# Contributing

Head over to the [docs](https://docs.excalidraw.com/docs/introduction/contributing)



## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
