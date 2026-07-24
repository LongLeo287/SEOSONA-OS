# KI: anime-vsub/app

## Overview
This Android application, named AnimeVsub, appears to be a platform for streaming and managing anime content. It leverages various libraries and APIs for data fetching, playback, user authentication (likely via Supabase), and push notifications (using Firebase Cloud Messaging). The project utilizes Kotlin and Jetpack Compose for development.

## Tech Stack (from code)
- **Language:** Kotlin 2.1.0 (as stated in `AGENTS.md`)
- **UI Framework:** Jetpack Compose with Material 3 (mentioned in `AGENTS.md`)
- **Dependency Injection:** Hilt (Dagger) (mentioned in `AGENTS.md`)
- **Build System:** Gradle Kotlin DSL with KSP (mentioned in `AGENTS.md`)
- **Media Playback:** Media3 ExoPlayer (mentioned in `AGENTS.md`)
- **Database:** Supabase (mentioned in `AGENTS.md` and required in `local.properties`)
- **Image Loading:** Coil (mentioned in `AGENTS.md`)
- **Data Storage:** DataStore (mentioned in `AGENTS.md`)
- **Background Tasks:** WorkManager (mentioned in `AGENTS.md`)

## Public API / Exports
The project's primary package is `git.shin.animevsub`.  A key interface within this package is `AnimeDataSource` defined in `app\src\main\java\git\shin\animevsub\data\remote\api\AnimeDataSource.kt`:

```kotlin
// app\src\main\java\git\shin\animevsub\data\remote\api\AnimeDataSource.kt
interface AnimeDataSource {
    suspend fun getEpisodes(seriesId: String): Result<EpisodeResponse>
    // ... other functions
}
```

An example implementation of this interface is `GogoAnimeDataSource` in `app\src\main\java\git\shin\animevsub\data\remote\api_example\GogoAnimeDataSource.kt`. This suggests a plugin-based architecture for supporting different anime sources.

## Dependencies
Based on the `package.json` file:

```json
// package.json
{
  "private": true,
  "devDependencies": {
    "husky": "^9.1.7",
    "firebase-admin": "^12.0.0"
  }
}
```

This indicates dependencies on `husky` for Git hooks and `firebase-admin` for Firebase administration tasks (likely related to FCM). The `Makefile` also implies dependencies on ktlint, detekt, and Media3 ExoPlayer.

## Architecture Patterns
- **Repository Pattern:** The code utilizes a repository pattern with classes like `AnimeRepository`, `HistoryRepository`, etc., in `app\src\main\java\git\shin\animevsub\data\repository`. These repositories abstract data access logic from the UI layer.
- **Data Source Abstraction:**  The use of the `AnimeDataSource` interface promotes a plugin architecture, allowing for easy integration of different anime streaming sources.
- **Modularization:** The project is structured into modules (e.g., `data`, `ui`, `di`), promoting code organization and reusability.

## Relevance to SEOSONA OS
This project's codebase could benefit SEOSONA OS in several ways:
- **Media Playback Integration:**  The use of Media3 ExoPlayer provides a robust media playback solution that could be integrated into SEOSONA OS for handling various video formats and streaming protocols.
- **Data Source Abstraction:** The `AnimeDataSource` interface and its implementations demonstrate a flexible architecture for integrating external data sources, which could be adapted to integrate with other services within SEOSONA OS.
- **Notification System:**  The Firebase Cloud Messaging (FCM) integration demonstrates experience in implementing push notifications, potentially useful for SEOSONA OS's notification system.
- **Kotlin and Jetpack Compose Expertise:** The project showcases expertise in modern Android development practices using Kotlin and Jetpack Compose, which aligns with current industry standards.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `gemini`, `rag`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
