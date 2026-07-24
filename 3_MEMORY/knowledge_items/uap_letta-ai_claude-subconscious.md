# KI: letta-ai/claude-subconscious

## Overview
This project, "claude-subconscious," appears to be an agent that interacts with Claude Code and utilizes the Letta AI platform for memory management and guidance. It monitors Claude sessions, accumulates context, and sends messages to Letta, likely to provide assistance or feedback during those sessions. The project's description in `package.json` explicitly states this functionality: "A subconscious for Claude Code. A Letta agent watches your sessions, accumulates context, and whispers guidance back."

## Tech Stack (from code)
- **TypeScript:**  The presence of `.ts` files throughout the repository and the `typescript` dependency in `package.json` indicates that TypeScript is used as the primary language. Example: `scripts/agent_config.test.ts`.
- **Node.js:** The `engines` section in `package.json` specifies a Node version requirement (`"node": ">=18.0.0"`), indicating it's a Node.js project.  The `"type": "module"` property also confirms the use of ES modules.
- **Vitest:** The presence of `"test"` and `"test:watch"` scripts in `package.json` along with the `@vitest/core` dependency suggests Vitest is used for testing. Example: `"test": "vitest run"`.
- **tsx**:  The project uses `tsx` as a build system, as evidenced by its inclusion as a dependency and usage in the scripts section of `package.json`: `"sync": "tsx scripts/sync_letta_memory.ts"`

## Public API / Exports
Due to the limited scope (only source code), it's impossible to definitively determine the public API. However, based on file names like `agent_config.ts` and `conversation_utils.ts`, these files likely contain functions or classes intended for use within the project.  Further analysis of their contents would be needed to confirm exported elements.

## Dependencies
Based on `package.json`:
- `@letta-ai/letta-code-sdk`: Version ^0.1.0 - This suggests a core dependency related to interacting with the Letta AI platform and Claude Code.
- `tsx`: Version ^4.7.0 - Used for executing TypeScript files directly.
- `@types/node`: Version ^20.10.0 - Provides type definitions for Node.js.
- `typescript`: Version ^5.3.0 - The TypeScript compiler itself.
- `vitest`: Version ^3.0.0 - Testing framework.

## Architecture Patterns
- **Modular Design:**  The project is structured into several directories (`scripts`, `hooks`) and files, suggesting a modular design approach where different functionalities are separated into distinct modules. For example, the `scripts` directory contains multiple `.ts` files each handling specific tasks like session synchronization or message sending.
- **Agent-Based Architecture**: The name "Subconscious" and description in `package.json` strongly suggest an agent-based architecture where the system acts as a background process observing and interacting with Claude Code sessions.

## Relevance to SEOSONA OS
The project's use of asynchronous messaging (`send_messages_to_letta.ts`) and context management could be beneficial for SEOSONA OS.  Specifically, the `letta-code-sdk` dependency suggests integration with a remote memory/knowledge base system which aligns well with potential needs in a distributed operating system environment. The modular design also promotes reusability of components within the broader SEOSONA ecosystem.

## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `asr` · **Fit:** 49/100 · **Auto-apply:** True
- **Evidence:** `whisper`, `transcri`
- **All scores:** {'seosona-os': 41, 'seosona-video': 49, 'seosona-content': 33, 'seosona-ux-ui': 0, 'seosona-flow': 0}
