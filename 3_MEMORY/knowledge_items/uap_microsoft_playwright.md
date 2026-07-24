# KI: microsoft/playwright

## Overview
Playwright is a framework for web automation and testing. It drives Chromium, Firefox, and WebKit with a single API — in your tests, in your scripts, and as a tool for AI agents.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 119 files across 28 directories
- **File types:** .yml: 28, .md: 20, .js: 16, .png: 10, .json: 5, .sh: 5, .build: 4

## Documentation Sections
- 🎭 Playwright
- [Documentation](https://playwright.dev) | [API reference](https://playwright.dev/docs/api/class-playwright)
- Get Started
- Playwright Test
- Install
- Write a test
- Run tests
- Key capabilities
- Playwright CLI
- Install
- Usage
- Session monitoring
- Playwright MCP
- Setup
- How it works
- Playwright Library
- Install
- Examples
- VS Code Extension
- Cross-Browser Support
- Other Languages
- Resources

## Core Structure
```
  .editorconfig
  .gitattributes
  .gitignore
  CLAUDE.md
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  FILING_ISSUES.md
  LICENSE
  NOTICE
  README.md
  SECURITY.md
  SUPPORT.md
  eslint.config.mjs
  package-lock.json
  package.json
  tsconfig.json
  .claude/
    skills/
      playwright-dev/
        SKILL.md
        api.md
        bisect-published-versions.md
        dashboard.md
        library.md
        tools.md
        trace_system_guide.md
        vendor.md
        webkit-safari-version.md
        webview.md
      playwright-devops/
        SKILL.md
        commit-failures.md
        fetch-commit-logs.sh
  .github/
    copilot-instructions.md
    ISSUE_TEMPLATE/
      bug.yml
      config.yml
      documentation.yml
      feature.yml
      question.yml
      regression.yml
    actions/
      download-artifact/
        action.yml
      run-test/
        action.yml
      upload-blob-report/
        action.yml
    workflows/
      copilot-setup-steps.yml
      create_test_report.yml
      infra.yml
      merge.config.ts
      publish_extension.yml
      publish_release.yml
      publish_release_docker.yml
      roll_browser_into_playwright.yml
      roll_nodejs.yml
      roll_stable_test_runner.yml
      tests_bidi.yml
      tests_components.yml
      tests_docker.yml
      tests_docker_changes.yml
      tests_docker_release.yml
      tests_extension.yml
      tests_mcp.yml
      tests_primary.yml
      tests_secondary.yml
      tests_webview_simulator.yml
  browser_patches/
    roll_from_upstream.sh
    firefox/
      .gitignore
      UPSTREAM_CONFIG.sh
      juggler/
        ChannelEventSink.sys.mjs
        Helper.js
        JugglerFrameParent.jsm
        NetworkObserver.js
        SimpleChannel.js
        TargetRegistry.js
        jar.mn
        moz.build
        components/
          Juggler.js
          components.conf
          moz.build
        content/
          FrameTree.js
          JugglerFrameChild.jsm
          PageAgent.js
          Runtime.js
          WorkerMain.js
          hidden-scrollbars.css
          main.js
        pipe/
          components.conf
          moz.build
          nsIRemoteDebuggingPipe.idl
          nsRemoteDebuggingPipe.cpp
          nsRemoteDebuggingPipe.h
        protocol/
          BrowserHandler.js
          Dispatcher.js
          PageHandler.js
          PrimitiveTypes.js
          Protocol.js
        screencast/
          HeadlessWindowCapturer.cpp
          HeadlessWindowCapturer.h
          components.conf
     
```

## Quick Start
```bash
npm init playwright@latest
npm i -D @playwright/test
npx playwright install
Tests run in parallel across all configured browsers, in headless mode by default. Each test gets a fresh browser context — full isolation with near-zero overhead.
**Auto-wait and web-first assertions.** No artificial timeouts. Playwright waits for elements to be actionable, and assertions automatically retry until conditions are met.
**Locators.** Find elements with resilient locators that mirror how users see the page:
**Test isolation.** Each test runs in its own browser context — equivalent to a fresh browser profile. Save authentication state once and reuse it across tests:
```

## Agent Configuration

--- CLAUDE.md ---
### Monorepo Packages

| Package | npm name | Purpose |
|---------|----------|---------|
| `playwright-core` | `playwright-core` | Browser automation engine: client, server, dispatchers, protocol |
| `playwright` | `playwright` | Test runner + browser automation (public package) |
| `playwright-test` | `@playwright/test` | Test runner entry point |
| `playwright-client` | `@playwright/client` | Standalone client package |
| `protocol` | *(internal)* | RPC protocol definitions (`protocol.yml` → generated `channels.d.ts`) |

### Browser Packages

`playwright-chromium`, `playwright-firefox`, `playwright-webkit` — per-browser distributions.
`playwright-browser-chromium`, `playwright-browser-firefox`, `playwright-browser-webkit` — binary packages.

### Tooling Packages

| Package | Purpose |
|---------|---------|
| `html-reporter` | HTML test report viewer |
| `trace-viewer` | Trace viewer UI |
| `recorder` | Test recorder |
| `web` | Shared web UI components |
| `injected` | Scripts injected into browser pages |

### Component Testing

`playwright-ct-core`, `playwright-ct-react`, `playwright-ct-vue`

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `tests/` | All test suites (page, library, playwright-test, mcp, components, etc.) |
| `docs/src/` | API documentation — **source of truth** for public TypeScript types |
| `docs/src/api/` | Per-class API reference (`class-page.md`, `class-locator.md`, etc.) |
| `utils/` | Build scripts, code generation, linting, doc tools |
| `browser_patches/` | Browser engine patches |

## Build

```bash
npm run build       # Full build
npm run watch       # Watch mode (recommended during development)
```

Assume watch is running and code is up to date. Generated files (types, channels, validators) are produced by watch automatically.

## Lint and type check

```bash
npm run flint
```

Runs all lint checks in parallel: eslint, tsc, doclint, check-deps, generate_channels, generate_types, lint-tests, test-types, lint-pa

--- CONTRIBUTING.md ---
# Contributing

## Choosing an Issue

To maintain project quality and focus, Playwright **requires a corresponding issue** for every contribution, with the exception of minor documentation fixes.

If you would like to address a bug or feature that isn't currently listed, **please file a new issue first**. This allows the community and maintainers to provide early feedback and facilitates a discussion before you invest time in developing a pull request

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
