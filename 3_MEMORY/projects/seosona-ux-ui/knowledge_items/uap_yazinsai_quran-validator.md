# KI: yazinsai/quran-validator

## Overview
This repository contains a TypeScript library designed for validating and verifying Quranic verses within text, particularly in the context of LLM (Large Language Model) generated content. The core functionality involves normalizing Arabic text, comparing it against a database of known Quran verses, and providing tools to process and correct potential errors found in LLM outputs.  The project also includes a web application for benchmarking validation performance.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.json` shows `typescript`: `"^5.3.3"` in devDependencies).
- **Framework/Build System:** Vite (`vitest.config.ts`, `package.json` shows `devDependencies`: `"vitest": "^1.2.0"`) is used for testing and bundling, Tsup (`package.json` shows `"build": "tsup src/index.ts --format cjs,esm --dts --clean"`) is used for building the library.
- **Normalization Library:** `arabic-text-normalizer` (listed in `package.json` dependencies).

## Public API / Exports
Based on `src/index.ts`, the following are exported:

- `QuranValidator` class:  A core class for validating verses. (`export { QuranValidator, createValidator } from './validator';`)
- `LLMProcessor`: A class to process LLM output and validate Quran quotes. (`export { LLMProcessor, createLLMProcessor, quickValidate, SYSTEM_PROMPTS } from './llm-integration';`)
- Normalization utilities: Functions like `normalizeArabic`, `removeDiacritics`. (`export { normalizeArabic, removeDiacritics, containsArabic, extractArabicSegments, calculateSimilarity, findDifferences } from './normalizer';`)
- Types: Various type definitions related to Quran verses and validation results. (`export type { ... } from './types';`)

## Dependencies
Based on `package.json`:

- **Dependencies:**
    - `arabic-text-normalizer`: `"^1.4.0"`
- **Dev Dependencies:**
    - `@types/node`: `"^20.10.0"`
    - `eslint`: `"^8.56.0"`
    - `tsup`: `"^8.0.1"`
    - `tsx`: `"^4.7.0"`
    - `typescript`: `"^5.3.3"`
    - `vitest`: `"^1.2.0"`

## Architecture Patterns
- **Modular Design:** The code is organized into modules (`validator`, `llm-integration`, `normalizer`) with clear responsibilities, promoting reusability and maintainability.  The `src/index.ts` file acts as a public API aggregator.
- **Configuration-Driven:**  The validator uses options to control behavior (e.g., auto-correction). (`export type { ValidatorOptions } from './types';`)
- **Data-Driven Validation:** The validation process relies on pre-loaded data of Quran verses and surahs, suggesting a data-driven approach.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Content Verification:**  The core validation logic can be integrated into SEOSONA OS’s content verification pipelines, ensuring the accuracy of Islamic texts and preventing the spread of misinformation.
- **LLM Integration Enhancement:** The `LLMProcessor` component provides a valuable tool for improving the reliability of LLMs used within SEOSONA OS that generate or process religious content.  The system prompts could be adapted to improve LLM output quality.
- **Arabic Text Processing Expertise:** The normalization utilities (`normalizeArabic`, etc.) are useful for any SEOSONA OS feature involving Arabic text processing, beyond just Quran validation.


## UAP Routing (auto-classified)
- **System:** `seosona-ux-ui` · **Function:** `design-system` · **Fit:** 28/100 · **Auto-apply:** True
- **Evidence:** `tailwind`
- **All scores:** {'seosona-os': 20, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 28, 'seosona-flow': 0}
