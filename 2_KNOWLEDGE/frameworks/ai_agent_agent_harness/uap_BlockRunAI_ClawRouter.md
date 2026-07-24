# KI: BlockRunAI/ClawRouter

BlockRun AI's ClawRouter is a smart LLM router designed for autonomous agents, aiming to optimize inference costs by routing requests to the most cost-effective available models. It integrates with OpenClaw and supports x402 micropayments for secure and efficient transactions. The project prioritizes security and observability through features like wallet-based authentication and detailed logging.

## Tech Stack (from code)

*   **Language:** TypeScript (`tsconfig.json`: `"language": "typescript"`)
*   **Framework/Runtime:** Node.js (evident from `package.json`'s `type: "module"` and numerous Node.js built-in module imports, e.g., `node:fs`, `node:path`).  The use of `viem` also indicates a focus on Ethereum interaction within the Node.js environment.
*   **Build System:** Tsup (`tsup.config.ts`) is used for building and bundling the TypeScript code.
*   **Testing Framework:** Vitest (`vitest.integration.config.ts`) is employed for testing.

## Public API / Exports

Based on `src/index.ts` and `package.json`, the following are key exported elements:

*   `OpenClawPluginDefinition`: Type definition for an OpenClaw plugin (from `./types.js`).
*   `blockrunProvider`: A provider function, likely responsible for interacting with BlockRun's LLM services (`src/provider.ts`).
*   `startProxy`, `getProxyPort`: Functions related to starting and managing a proxy server (`src/proxy.ts`).
*   `resolveOrGenerateWalletKey`: Function for wallet management (`src/auth.ts`).
*   `BalanceMonitor`: Class for monitoring USDC balances (`src/balance.ts`).

## Dependencies

Based on `package.json`, key dependencies include:

*   `@noble/hashes`: For cryptographic hashing.
*   `@scure/bip32`, `@scure/bip39`:  For wallet key derivation and management.
*   `viem`: Ethereum interaction library.
*   `@x402/fetch`, `@x402/evm`, `@x402/svm`: For x402 payment protocol integration.

## Architecture Patterns

*   **Plugin-Based Architecture:** The project is designed as an OpenClaw plugin, adhering to a modular and extensible architecture.  This is evident from the `OpenClawPluginDefinition` type and the `openclaw.plugin.json` file.
*   **Configuration-Driven:**  The application relies heavily on configuration files (e.g., `tsconfig.json`, `tsup.config.ts`) to manage build settings, compiler options, and other parameters.
*   **Wallet-Centric Authentication:** Security is a core consideration, with wallet-based authentication as a central component (`src/auth.ts`).
*   **Microservice Proxy Pattern**: The project utilizes a proxy server (managed by `startProxy` and `getProxyPort`) to route requests through the BlockRun infrastructure.

## Relevance to SEOSONA OS

The ClawRouter's code could benefit SEOSONA OS in several ways:

*   **Cost Optimization for LLM Usage:**  SEOSONA OS, potentially utilizing LLMs for various tasks, can leverage ClawRouter’s routing capabilities to minimize inference costs by intelligently selecting the most cost-effective models.
*   **Secure Payment Integration:** The x402 payment protocol integration provides a secure and efficient mechanism for handling micropayments related to LLM usage within SEOSONA OS.  This could be adapted for other microtransaction scenarios.
*   **Modular Plugin Architecture:** The plugin architecture allows for easy integration of ClawRouter's functionality into SEOSONA OS, promoting extensibility and customization.
*   **Wallet Management Best Practices**: The robust wallet management system implemented in `src/auth.ts` can inform the design of secure wallet handling within SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`, `anthropic`, `gemini`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 28}
