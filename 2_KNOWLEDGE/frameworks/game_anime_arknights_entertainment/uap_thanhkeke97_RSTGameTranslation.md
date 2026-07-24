# KI: thanhkeke97/RSTGameTranslation

## Overview
This repository contains a WPF application named RSTGameTranslation, designed for real-time translation of game text. The application utilizes various translation APIs (ChatGPT, Gemini, Groq, Microsoft Translator, ElevenLabs) and OCR services (OneOCR, PaddleOCR, RapidOCR) to provide localized content. It also includes features like API key management, audio playback via ElevenLabs, and a customizable chatbox interface.

## Tech Stack (from code)
- **Language:** C# - evidenced by the `.cs` file extensions (`src/ApiKeysWindow.xaml.cs`, `src/App.xaml.cs`, etc.).
- **Framework:** .NET Framework - evident from the `.csproj` file (`RST.csproj`) and the use of Windows Forms interop (e.g., `System.Windows.Forms`).
- **Build System:** MSBuild - indicated by the presence of a `.csproj` file (`RST.csproj`) which defines project settings and dependencies for building the application.
- **UI Framework:** WPF (Windows Presentation Foundation) - evidenced by the `.xaml` files (`src/ApiKeysWindow.xaml`, `src/MainWindow.xaml`, etc.) used for defining the user interface.

## Public API / Exports
The code doesn't appear to expose a public API in the traditional sense. It primarily focuses on providing a desktop application with internal functionality. However, several classes and interfaces are defined that could potentially be leveraged or adapted:

- `ITranslationService`: Interface defining methods for translation (`TranslateAsync`).  (`src/ITranslationService.cs`)
- `ChatGptTranslationService`, `GeminiTranslationService`, `GoogleTranslateService`, `MicrosoftLegacyTranslationService`, `MistralTranslationService`, `OllamaTranslationService`, `CustomApiTranslationService`: Implementations of the `ITranslationService` interface, providing specific translation logic for different APIs. (`src/ChatGptTranslationService.cs`, `src/GeminiTranslationService.cs`, etc.)
- `ClipboardMonitor`: Class responsible for monitoring the clipboard and raising events when text changes.  (`src/ClipboardMonitor.cs`)

## Dependencies
The dependencies are not explicitly listed in a single file like `package.json` or `requirements.txt`. However, based on namespace imports and code usage, we can infer some dependencies:

- **System.Windows.Forms:** Used for clipboard monitoring and other UI interactions (`src/ClipboardMonitor.cs`).
- **NAudio:**  Used for audio playback via ElevenLabs (`src/ElevenLabsService.cs`).
- **System.Text.Json:** Used for JSON serialization and deserialization (`src/ChatGptTranslationService.cs`, `src/GeminiTranslationService.cs`).
- **Google.Protobuf:** Likely a dependency of the Google Translate service, although not directly referenced in the code snippets provided.

## Architecture Patterns
- **Singleton Pattern:**  Several classes like `ConfigManager`, `ClipboardMonitor` and `CharacterBlockDetectionManager` implement the Singleton pattern to ensure only one instance exists (`src/ConfigManager.cs`, `src/ClipboardMonitor.cs`, `src/BlockDetectionManager.cs`).
- **Factory Pattern (Implicit):** The application uses a factory-like approach for creating translation services, allowing it to dynamically switch between different APIs based on configuration.
- **Strategy Pattern:**  The use of the `ITranslationService` interface and its implementations demonstrates the Strategy pattern, enabling flexibility in choosing translation methods.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Translation Services Integration:** The various translation service integrations (Gemini, ChatGPT, Microsoft Translator) can be adapted to provide real-time translation capabilities within SEOSONA OS applications.  The `ITranslationService` interface provides a clean abstraction for integrating new services.
- **OCR Functionality:** The OCR components (OneOCR, PaddleOCR, RapidOCR) could be incorporated into SEOSONA OS to enable text recognition from images and documents.
- **Audio Playback:** The ElevenLabs integration can be used to provide high-quality text-to-speech functionality within SEOSONA OS applications.
- **Clipboard Monitoring:**  The `ClipboardMonitor` class provides a robust mechanism for monitoring clipboard content, which could be useful for various SEOSONA OS features like automated data entry or context-aware actions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `seo` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `sitemap`, `robots`
- **All scores:** {'seosona-os': 41, 'seosona-video': 24, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
