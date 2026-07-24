# KI: NoeFabris/opencode-antigravity-auth

## Overview
This repository contains a plugin for Google Antigravity IDE that enables access to Gemini and Claude models using Google credentials. It handles authentication, quota management, recovery mechanisms, and multi-account rotation within the Opencode environment. The project aims to bridge the gap between Google's generative AI services and the OpenCode platform.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.json`: `"lib": ["ESNext", "DOM"]`, `package.json`: `"type": "module"`)
- **Framework/Libraries:**  `@opencode-ai/plugin` (dependency in `package.json`), `@openauthjs/openauth` (dependency in `package.json`), Zod (`package.json`: `"dependencies": {"zod": "^4.0.0"`), Vitest (`vitest.config.ts`, `package.json` dev dependencies)
- **Build System:**  TypeScript compiler (`tsconfig.json`, `package.json`: `"scripts": { "build": "tsc -p tsconfig.build.json" }`)
- **Bundler:** Bundler mode is enabled in the TypeScript configuration (`tsconfig.json`: `"moduleResolution": "bundler"`).

## Public API / Exports
The `index.ts` file defines the public API:

```typescript
// src/index.ts
export {
  AntigravityCLIOAuthPlugin,
  GoogleOAuthPlugin,
} from "./src/plugin";

export {
  authorizeAntigravity,
  exchangeAntigravity,
} from "./src/antigravity/oauth";

export type {
  AntigravityAuthorization,
  AntigravityTokenExchangeResult,
} from "./src/antigravity/oauth";
```

These exports suggest the plugin provides classes for OAuth functionality (`AntigravityCLIOAuthPlugin`, `GoogleOAuthPlugin`) and functions to authorize and exchange tokens (`authorizeAntigravity`, `exchangeAntigravity`).  Type definitions are also exported.

## Dependencies
Based on `package.json`:

- `@opencode-ai/plugin`: "^0.15.30"
- `@openauthjs/openauth`: "^0.4.3"
- `proper-lockfile`: "^4.1.2"
- `xdg-basedir`: "^5.1.0"
- `zod`: "^4.0.0"
- TypeScript: "^5.0.0" (as a peer dependency)
- Vitest: "^3.0.0" (and related dev dependencies like `@vitest/coverage-v8`, `@vitest/ui`)

## Architecture Patterns
- **Plugin Architecture:** The project is designed as a plugin for Opencode, utilizing the `@opencode-ai/plugin` library.  The `src/plugin.ts` file appears to be the core of this plugin functionality.
- **Configuration Management:** A configuration system (`./plugin/config`) loads and manages Antigravity settings. The `loadConfig` function is used for this purpose.
- **Modular Design:** The codebase is structured into modules (e.g., `antigravity`, `hooks`, `plugin`, `recovery`), indicating a modular design approach.  The use of barrel files (`index.ts`) within these modules further promotes organization.
- **Error Handling & Recovery:** The project includes mechanisms for error handling and recovery, particularly related to token refresh and quota management (e.g., `AntigravityTokenRefreshError`, `createSessionRecoveryHook`).



## Relevance to SEOSONA OS
This plugin's code could be beneficial to SEOSONA OS in the following ways:

- **Integration with Generative AI Services:** The authentication and request transformation logic can serve as a template for integrating other generative AI services into SEOSONA OS.  The `prepareAntigravityRequest` and `transformAntigravityResponse` functions are particularly relevant.
- **Quota Management & Rate Limiting:** The quota management system (`./plugin/quota`) provides valuable insights into handling API rate limits and implementing backoff strategies, which can be adapted for SEOSONA OS's own API interactions.  The `calculateBackoffMs` function is an example of this.
- **Plugin Architecture:** The plugin architecture itself could inspire a similar approach for extending SEOSONA OS functionality with modular plugins.
- **Token Refresh & Security:** The token refresh mechanism and security considerations (e.g., PKCE generation) are relevant to any system requiring secure authentication with external services.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `gemini`, `rag`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
