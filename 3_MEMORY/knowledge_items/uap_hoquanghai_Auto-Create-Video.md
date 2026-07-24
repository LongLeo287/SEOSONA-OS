# KI: hoquanghai/Auto-Create-Video

## Overview
This project is a command-line tool designed to automatically generate Vietnamese short news videos from a script file (script.json). It leverages Hyperframes for video composition, LucyLab or ElevenLabs for text-to-speech (TTS), and various other utilities for asset management and audio processing. The pipeline takes a JSON script as input and outputs a completed video file.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.json`: `"target": "ES2022"`, `src/**/*.ts` files)
- **Framework/Libraries:** Hyperframes (`package.json`: `"dependencies": {"hyperframes": "^0.4.34"`),  dotenv (`package.json`: `"dependencies": {"dotenv": "^17.4.2"`), Axios (`package.json`: `"dependencies": {"axios": "^1.15.2"`), Zod (`package.json`: `"dependencies": {"zod": "^4.3.6"`)
- **Build System:**  Vite (`vitest.config.ts`, `package.json` scripts using `vitest`)
- **Module System**: ES Modules (`package.json`: `"type": "module"`)

## Public API / Exports
The primary public entry point is the `cli.ts` file, which exposes a command-line interface:
```typescript
// src\cli.ts
#!/usr/bin/env node
...
async function main() {
  const scriptPath = process.argv[2];
  if (!scriptPath) {
    console.error("Usage: npm run pipeline -- <path/to/script.json>");
    process.exit(2);
  }
  try {
    await runPipeline(scriptPath);
  } catch (e) {
    log.error("Pipeline failed", e);
    process.exit(1);
  }
}

main();
```
The `runPipeline` function within `pipeline.ts` appears to be the core logic exposed for video generation:
```typescript
// src\pipeline.ts
export async function runPipeline(scriptPath: string): Promise<void> {
    ...
}
```

## Dependencies
Based on `package.json`:
- axios: "^1.15.2"
- dotenv: "^17.4.2"
- hyperframes: "^0.4.34"
- p-limit: "^7.3.0"
- zod: "^4.3.6"
- @types/node: "^25.6.0" (development dependency)
- nock: "^14.0.13" (development dependency)
- tsx: "^4.21.0" (development dependency)
- typescript: "^6.0.3" (development dependency)
- vitest: "^4.1.5" (development dependency)

## Architecture Patterns
- **Modular Design:** The project is structured into modules like `src/cli.ts`, `src/config.ts`, `src/pipeline.ts`, `src/tts/*`, and `src/render/*`, suggesting a modular architecture.
- **Configuration Management:**  The use of `.env` files (specifically `.env.local`) for configuration, along with the `dotenv` library, indicates a focus on environment variable management.
- **Pipeline Pattern:** The core logic follows a pipeline pattern, where data flows through a series of processing steps (fetching assets, generating TTS, composing video).  The `runPipeline` function orchestrates these steps.
- **Scripted Automation**: The project relies heavily on scripts (`src/scripts/*`) for tasks like downloading and filtering sound effects.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:
- **Automated Content Creation:**  The core functionality of automatically generating videos from text or URL data can be integrated into SEOSONA OS to streamline content creation workflows, particularly for localized news or informational content.
- **TTS Integration:** The integration with LucyLab and ElevenLabs demonstrates a focus on TTS capabilities. This could enhance SEOSONA OS's ability to generate audio content in multiple languages (especially Vietnamese).
- **Hyperframes Expertise:**  The use of Hyperframes provides valuable expertise in video composition, which can be leveraged for other visual content generation tasks within SEOSONA OS.
- **Modular Design Principles**: The project’s modular design and pipeline pattern offer a good example of how to structure complex automation workflows, which aligns with the principles of maintainable and extensible software development that should guide SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `video-render` · **Fit:** 44/100 · **Auto-apply:** True
- **Evidence:** `render`, `hyperframe`
- **All scores:** {'seosona-os': 41, 'seosona-video': 44, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 28}
