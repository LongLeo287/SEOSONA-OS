# KI: NexaAI/nexa-sdk

## Overview
This project is a multi-platform AI inference runtime, with a particular focus on Snapdragon and Hexagon devices. It provides an SDK written primarily in C/C++ for low-level device interaction, along with bindings for Go, Python, and Java (Android). The system appears to facilitate running large language models (LLMs) on edge devices.

## Tech Stack (from code)
- **Languages:** C/C++, Go, Python, Kotlin (Java subset) - evidenced by the presence of `.cpp`, `.h`, `.go`, `.py`, and `.kt` files.
- **Build Systems:** Bazel (CLI), CMake (SDK) - evident from `BUILD.bazel` and `CMakeLists.txt` files respectively.  The project uses a combination for different components.
- **Android Development:** Gradle, Java/Kotlin - evidenced by the presence of `build.gradle.kts`, `settings.gradle.kts`, `AndroidManifest.xml`, and `.kt` files within the Android directory structure.

## Public API / Exports
Due to the sheer size of the repository, a comprehensive list is impractical. However, based on file names and structure, some key exported elements can be identified:
- **Android SDK:** The Java code under `bindings/android/app/src/main/java/com/geniex/sdk` contains classes like `GenieXSdk`, `LlmWrapper`, `ModelManagerWrapper`, and `VlmWrapper`. These suggest a public API for interacting with the AI inference runtime from Android applications.  Example: `GenieXSdk.kt`
```kotlin
// bindings/android/app/src/main/java/com/geniex/sdk/GenieXSdk.kt
class GenieXSdk {
    // ... methods and properties related to SDK functionality ...
}
```

- **Compute Unit Resolution:** The `geniex_resolve_device` function, mentioned in `CLAUDE.md`, is a critical component for mapping device aliases (cpu, gpu, npu, hybrid).  Its location at `sdk/src/device.cpp` indicates its importance as a central point of control.
```c++
// sdk/src/device.cpp
std::string geniex_resolve_device(const std::string& device_id) {
    // ... logic to resolve device alias ...
}
```

## Dependencies
Dependency information is not readily available from the provided file list. There are no `package.json`, `requirements.txt`, or `Cargo.toml` files present, which would typically indicate Python and Rust dependencies respectively. The Android project uses Gradle, so dependency information would be found in `build.gradle.kts`.

## Architecture Patterns
- **Layered Architecture:**  The SDK appears to have a layered architecture with distinct components for device management, model loading, inference execution, and Java/Kotlin wrappers. This is suggested by the directory structure within the Android project (e.g., `com.geniex.sdk`).
- **JNI Bridge:** The use of JNI (`jni_cb.cpp`, `jni_cb.h`) indicates a bridge between native C/C++ code and Java/Kotlin for Android integration. This is a common pattern for exposing native functionality to managed environments.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:
- **Edge AI Capabilities:** The focus on Snapdragon and Hexagon devices aligns with potential hardware targets for SEOSONA OS, enabling local LLM inference without relying on cloud connectivity.
- **Android Integration:**  The existing Android bindings provide a foundation for integrating the AI runtime into SEOSONA OS's Android components or applications.
- **Device Optimization:** The `geniex_resolve_device` function and related code could be adapted to optimize model execution based on specific SEOSONA OS hardware configurations.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
