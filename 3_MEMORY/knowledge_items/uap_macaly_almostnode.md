# KI: macaly/almostnode

## Overview
**Node.js in your browser. Just like that.**

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 127 files across 21 directories
- **File types:** .ts: 70, .html: 23, .json: 8, .md: 7, .js: 5, .tsx: 5, .yml: 3

## Core Capabilities
- **Virtual File System** - Full in-memory filesystem with Node.js-compatible API
- **Node.js API Shims** - 40+ shimmed modules (`fs`, `path`, `http`, `events`, and more)
- **npm Package Installation** - Install and run real npm packages in the browser with automatic bin stub creation
- **Run Any CLI Tool** - npm packages with `bin` entries (vitest, eslint, tsc, etc.) work automatically
- **Dev Servers** - Built-in Vite and Next.js development servers
- **Hot Module Replacement** - React Refresh support for instant updates
- **TypeScript Support** - First-class TypeScript/TSX transformation via esbuild-wasm
- **Service Worker Architecture** - Intercepts requests for seamless dev experience
- **Optional Web Worker Support** - Offload code execution to a Web Worker for improved UI responsiveness
- **Secure by Default** - Cross-origin sandbox support for running untrusted code safely

---

## Documentation Sections
- almostnode
- Features
- Requirements
- Quick Start
- Installation
- Basic Usage
- Running Untrusted Code Securely
- Working with Virtual File System
- With npm Packages
- Running Shell Commands
- Running CLI Tools
- Streaming Output & Long-Running Commands
- With Next.js Dev Server
- Service Worker Setup
- Which Setup Do I Need?
- Option 1: Cross-Origin Sandbox (Recommended)
- Option 2: Same-Origin with Vite
- Option 3: Same-Origin with Next.js
- Option 4: Manual Setup (Other Frameworks)
- Comparison with WebContainers
- When to use almostnode
- Example: Code Playground

## Core Structure
```
  .gitignore
  .npmignore
  CHANGELOG.md
  CLAUDE.md
  LICENSE
  README.md
  index.html
  package-lock.json
  package.json
  playwright.config.ts
  tsconfig.build.json
  tsconfig.json
  vite.config.js
  vite.lib.config.js
  vite.sandbox.config.js
  .github/
    workflows/
      ci.yml
      deploy-site.yml
      node-compat.yml
  docs/
    AI_CHATBOT_TUTORIAL.md
    CONVEX_CLI_INTEGRATION.md
    CONVEX_TUTORIAL.md
    api-reference.html
    core-concepts.html
    index.html
    nextjs-guide.html
    security.html
    styles.css
    tutorial-editor.html
    vite-guide.html
  e2e/
    agent-workbench.spec.ts
    convex-app-demo.spec.ts
    convex-deploy.spec.ts
    cors-proxy-server.mjs
    debug-iframe-errors.spec.ts
    debug-iframe.spec.ts
    express-demo.spec.ts
    next-demo.spec.ts
    next-features.spec.ts
    npm-command.spec.ts
    npm-scripts-demo.spec.ts
    sandbox-demo.spec.ts
    vercel-ai-sdk-demo.spec.ts
    vite-demo.spec.ts
    vitest-demo.spec.ts
  examples/
    agent-workbench.html
    bash-demo.html
    demo-convex-app.html
    demo-vercel-ai-sdk.html
    editor-tutorial.html
    express-demo.html
    index.html
    next-demo.html
    next-features-test.html
    npm-scripts-demo.html
    sandbox-next-demo.html
    shared-styles.css
    vite-demo.html
    vitest-demo.html
    convex-todo/
      README.md
      index.html
      package-lock.json
      package.json
      playwright.config.ts
      tsconfig.json
      tsconfig.node.json
      vite.config.ts
      e2e/
        deploy.spec.ts
      src/
        App.tsx
        main.tsx
        components/
          DeployButton.tsx
          Editor.tsx
          TodoList.tsx
        convex/
          _generated/
            api.ts
        hooks/
          useConvexRuntime.ts
        stubs/
          just-bash.ts
          vfs-adapter.ts
  public/
    CNAME
    __sw__.js
    og-image.png
    vite-sw.js
  sandbox/
    index.html
  scripts/
    extract-macaly-files.ts
  src/
    agent-workbench-entry.ts
    agent-workbench-project.ts
    convex-app-demo-entry.ts
    convex-app-demo.ts
    cors-proxy.ts
    create-runtime.ts
    demo.ts
    dev-server.ts
    index.ts
    macaly-demo.ts
    next-demo.ts
    next-plugin.ts
    npm-scripts-demo-entry.ts
    runtime-interface.ts
    runtime.ts
    sandbox-helpers.ts
    sandbox-runtime.ts
    server-bridge.ts
    transform.ts
    vercel-ai-sdk-demo-entry.ts
    vercel-ai-sdk-demo.ts
    virtual-fs.ts
    vite-demo.ts
    vite-plugin.ts
    vitest-dem
```

## Quick Start
```bash
npm install almostnode
> **⚠️ Security Warning:** The example above runs code on the main thread with full access to your page. **Do not use `createContainer()` or `container.execute()` with untrusted code.** For untrusted code, use `createRuntime()` with a cross-origin sandbox - see [Sandbox Setup](#sandbox-setup).
See [Sandbox Setup](#sandbox-setup) for deployment instructions.
```

## Agent Configuration

--- CLAUDE.md ---
# almostnode

## What This Is

almostnode is a **real competitor to WebContainers (StackBlitz)**. It runs Node.js natively in the browser — virtual filesystem, npm package installation, dev servers, the works.

## Core Principle

**Never write library-specific shim code. Fix the platform instead.**

When a package doesn't work, the fix goes into the generic shims (fs, path, crypto, etc.), not into a package-specific adapter. Every demo should use real npm packages installed via `PackageManager`, served via `/_npm/` bundling, and running through the standard runtime. No CDN shortcuts, no manual protocol reimplementations, no fake adapters.

## Architecture

- **Runtime** (`src/runtime.ts`) — JS execution engine with `require()`, ESM-to-CJS transforms, 43 built-in module shims
- **VirtualFS** (`src/virtual-fs.ts`) — In-memory filesystem, exposed as `require('fs')`
- **PackageManager** (`src/npm/`) — Real npm packages downloaded, extracted, ESM-to-CJS transformed via esbuild-wasm
- **Service Worker** — Network interception for HTTP servers (`/__virtual__/{port}/`)
- **Dev Servers** — `NextDevServer` (Pages + App Router), `ViteDevServer` (React + HMR)
- **just-bash** — Bash emulator with custom commands (`node`, `npm`, `convex`)
- **Code Transforms** (`src/frameworks/code-transforms.ts`) — CSS Modules (css-tree AST), ESM-to-CJS (acorn AST), React Refresh, npm import redirect

### Next.js Dev Server (split across files)

- `src/frameworks/next-dev-server.ts` — Orchestrator (~1360 lines)
- `src/frameworks/next-route-resolver.ts` — Route resolution (~600 lines)
- `src/frameworks/next-api-handler.ts` — API route handlers (~350 lines)
- `src/frameworks/next-shims.ts` — Shim string constants (~1040 lines)
- `src/frameworks/next-html-generator.ts` — HTML page generation (~560 lines)
- `src/frameworks/next-config-parser.ts` — next.config.js parsing (AST + regex fallback)

## Commands

```bash
npm run dev          # Vite dev server (port 5173)
npm run test:run     # Unit tests (


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
