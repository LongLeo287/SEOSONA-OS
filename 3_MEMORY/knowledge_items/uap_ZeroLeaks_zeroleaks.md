# KI: ZeroLeaks/zeroleaks

## Overview
ZeroLeaks is an AI security scanner designed to test LLM systems for prompt injection and extraction vulnerabilities. It utilizes a multi-agent architecture to systematically probe target systems, identifying weaknesses and potential data leaks. The project aims to provide autonomous testing capabilities for AI applications.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.json`: `"language": "typescript"`)
- **Runtime:** Bun (`package.json`: `"type": "module"`, `build` script uses `bun build`)
- **LLM Provider SDK:** OpenRouter AI SDK (`@openrouter/ai-sdk-provider` dependency in `package.json`)
- **Linting/Formatting:** Biome (`@biomejs/biome` dependency and `lint`/`format` scripts in `package.json`)
- **Schema Validation:** Zod (`zod` dependency in `package.json`)

## Public API / Exports
Based on the exports from `src/index.ts`:

*   `runSecurityScan()`:  Initiates a security scan.
*   `createScanEngine()`: Creates a ScanEngine instance.
*   `ScanEngine`: Class representing the core scanning engine.
*   `createAttacker()`: Creates an Attacker agent.
*   `Attacker`: Class representing the attacker agent.
*   `createEvaluator()`: Creates an Evaluator agent.
*   `Evaluator`: Class representing the evaluator agent.
*   `createMutator()`: Creates a Mutator agent.
*   `Mutator`: Class representing the mutator agent.
*   `createStrategist()`: Creates a Strategist agent.
*   `Strategist`: Class representing the strategist agent.
*   `createTarget()`: Creates a Target object for interacting with the system under test.
*   `Target`: Interface defining the target system's behavior.
*   `createInspector()`: Creates an Inspector object.
*   `Inspector`: Class responsible for defense fingerprinting.
*   `createOrchestrator()`: Creates a MultiTurnOrchestrator instance.
*   `MultiTurnOrchestrator`: Class managing multi-turn conversation sequences.
*   `createInjectionEvaluator()`: Creates an InjectionEvaluator object.
*   `InjectionEvaluator`: Class for evaluating prompt injection attempts.
*   `DEFENSE_DATABASE`:  A database of known defense systems (defined in `src/agents/inspector.ts`).
*   `SIREN_SEQUENCE`, `ECHO_CHAMBER_SEQUENCE`, `TOMBRAIDER_SEQUENCE`: Pre-defined multi-turn attack sequences.
*   `DEFAULT_TEMPERATURE_CONFIG`: Default configuration for temperature settings.

## Dependencies
Based on `package.json`:

*   `@openrouter/ai-sdk-provider`:  Version 0.4.3 - For interacting with the OpenRouter API.
*   `ai`: Version 4.3.15 - Likely a general AI utility library.
*   `commander`: Version 13.1.0 - Command-line argument parsing.
*   `js-tiktoken`: Version 1.0.18 - Tokenization library for LLMs.
*   `ora`: Version 8.2.0 -  Spinner/loading indicator utility.
*   `zod`: Version 3.24.2 - Schema validation library.
*   `@biomejs/biome`: Version 1.9.4 - For linting and formatting.
*   `@types/bun`: Version 1.2.4 - TypeScript definitions for Bun.
*   `@types/node`: Version 22.14.1 - TypeScript definitions for Node.js.
*   `typescript`: Version 5.7.3 -  TypeScript compiler.

## Architecture Patterns
- **Multi-Agent System:** The core architecture revolves around multiple AI agents (Attacker, Evaluator, Strategist, etc.) working together to perform the security scan (`src/agents/*`).
- **Modular Design:** Agents and probes are organized into separate modules within `src/agents` and `src/probes`, promoting code reusability.
- **Configuration-Driven:**  The scanning process is heavily configurable through various configuration objects (e.g., `ScanConfig`, `AttackerConfig`) (`src/index.ts`).
- **State Management:** The `ScanEngine` class appears to manage the overall state of the scan, including conversation history and findings (`src/agents/engine.ts`).

## Relevance to SEOSONA OS
The ZeroLeaks project's code could benefit SEOSONA OS in several ways:

*   **Prompt Injection Testing Framework:** The multi-agent architecture and probe library provide a robust framework for testing LLM-powered features within SEOSONA OS against prompt injection attacks.  This is particularly relevant if SEOSONA OS incorporates AI assistants or utilizes LLMs for any task involving user input.
*   **Defense Fingerprinting Techniques:** The `Inspector` class's defense fingerprinting capabilities could be adapted to identify and characterize the defenses implemented in SEOSONA OS, allowing for more targeted attack strategies. (`src/agents/inspector.ts`)
*   **Modular Probe Library:**  The extensive collection of probes categorized by type (direct, encoding, persona, etc.) offers a valuable resource for expanding SEOSONA OS's testing coverage and identifying novel vulnerabilities. (`src/probes/*`)


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 66/100 · **Auto-apply:** False
- **Evidence:** `agent`, `orchestrat`, `router`
- **All scores:** {'seosona-os': 66, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
