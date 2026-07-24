# KI: tqdat410/agentune

## Overview
Agentune is a music player and server designed for "Agent" use, leveraging the Model Context Protocol (MCP). It integrates with services like YouTube and Apple Music, manages audio playback via MPV, and provides a web dashboard. The system appears to be built around managing queues, providing discovery features, and controlling an external media player.

## Tech Stack (from code)
- **Language:** TypeScript (`tsconfig.json`: `"language": "typescript"`)
- **Framework:**  The codebase utilizes several frameworks/libraries: `@modelcontextprotocol/sdk`, `@distube/ytsr`, `better-sqlite3`, and `ws`. This suggests a combination of MCP protocol implementation, YouTube search/download functionality, SQLite database interaction, and WebSocket communication.
- **Build System:** TypeScript compiler (`tsconfig.json`) with Node.js runtime environment (package.json: `"type": "module"`).

## Public API / Exports
Due to the lack of explicit module exports in the provided code snippets, it's difficult to definitively list a public API. However, based on import statements and file names, some likely exported components include:
- `createMpvController` (from `./audio/mpv-controller.js`) - Creates an MPV controller instance.
- `createYoutubeProvider` (from `./providers/youtube-provider.js`) - Creates a YouTube provider.
- `createWebServer` (from `./web/web-server.js`) - Creates a web server instance.
- `createQueueManager` (from `./queue/queue-manager.js`) - Creates a queue manager.
- `createHistoryStore` (from `./history/history-store.js`) - Creates a history store.
- `AppleSearchProvider` class (from `./providers/apple-search-provider.ts`) - Provides Apple Music search functionality.
- `SearchResult` interface (from `./providers/youtube-provider.ts`) - Defines the structure of YouTube search results.

## Dependencies
Based on `package.json`:
- `@distube/ytsr`: "^2.0.4" - For YouTube data retrieval.
- `@modelcontextprotocol/sdk`: "^1.27.1" -  For MCP protocol implementation.
- `better-sqlite3`: "^12.8.0" - SQLite database driver.
- `ws`: "^8.20.0" - WebSocket library for real-time communication.
- `youtube-dl-exec`: "^3.1.4" - For downloading audio from YouTube and other sources.
- `zod`: "^4.3.6" -  For schema validation (likely used in data processing).

## Architecture Patterns
- **Provider Pattern:** The use of `AppleSearchProvider` and `YoutubeProvider` demonstrates the Provider pattern, allowing for modularity and extensibility when integrating with different music sources. (`src/providers/*`)
- **Factory Functions:**  Functions like `createMpvController`, `createWebServer`, etc., suggest a factory function pattern to encapsulate object creation logic. (`src/*.ts`)
- **Event-Driven Architecture:** The use of WebSockets (`ws` dependency) and the mention of "web dashboard" implies an event-driven architecture for real-time updates and communication between client and server.

## Relevance to SEOSONA OS
Agentune's code could benefit SEOSONA OS in several ways:
- **Music Playback Integration:** The MPV integration provides a robust audio playback engine that can be leveraged within the OS.
- **Discovery Services:**  The Apple Music search functionality and YouTube provider offer valuable music discovery capabilities, which could enhance SEOSONA's media consumption experience.
- **MCP Support:** Agentune’s use of MCP suggests potential for integrating with other agent-based systems or services within a broader ecosystem.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `agent`, `mcp`
- **All scores:** {'seosona-os': 44, 'seosona-video': 22, 'seosona-content': 33, 'seosona-ux-ui': 0, 'seosona-flow': 28}
