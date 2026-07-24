# Voice Cloning, TTS & Video Production Repository Batch 2 — 2026-06-18

Analysis of the second batch of repositories requested for SEOSONA OS ingestion.

## 1. DrewThomasson/ebook2audiobook
- **Summary**: Generates audiobooks from e-books with voice cloning and 1158+ languages support. Uses Coqui TTS / XTTS under the hood, wrapped with Calibre for ebook parsing.
- **SEOSONA Relevance**: **Medium (P3)**. Good reference for chunking large texts into TTS-friendly pieces, but not directly related to short-form video production.

## 2. Huanshere/VideoLingo
- **Summary**: Netflix-level subtitle cutting, translation, alignment, and dubbing. Fully automated AI video subtitle team. Uses Whisper for transcription, NLP for translation, and TTS for dubbing.
- **SEOSONA Relevance**: **High (P1)**. Excellent reference for the exact workflow SEOSONA Video Factory is building! It provides great algorithms for optimal subtitle segmentation (line breaking rules for readability) and alignment.

## 3. PaddlePaddle/PaddleSpeech
- **Summary**: Comprehensive speech toolkit by Baidu. Includes ASR, TTS, Speaker Verification, and Translation.
- **SEOSONA Relevance**: **Low (P3)**. Massive, enterprise-grade framework. Overkill for SEOSONA's nimble agent-based video factory, especially when models like F5-TTS or Whisper handle specific tasks better and with less setup overhead.

## 4. abus-aikorea/voice-pro
- **Summary**: Gradio WebUI for creators. Combines Edge-TTS, Kokoro, F5-TTS, CosyVoice, Whisper, Demucs, and multilingual translation into one unified dashboard.
- **SEOSONA Relevance**: **High (P1)**. This is basically the exact architecture we are using for SEOSONA Video's voice pipeline (`fish_audio_api.py` orchestrating Edge-TTS, F5, CosyVoice). Very good reference for how to integrate Demucs (vocal isolation) if we ever need to extract cleaner reference audio from noisy YouTube videos.

## 5. debpalash/OmniVoice-Studio
- **Summary**: Open-source ElevenLabs alternative desktop app for local voice cloning and dubbing.
- **SEOSONA Relevance**: **Medium (P2)**. Good UI reference if SEOSONA OS ever builds a local GUI dashboard for users to manage voice profiles visually instead of via CLI/YAML.

## 6. Gentleman-Programming/engram
- **Summary**: Persistent memory system for AI coding agents. Uses SQLite + FTS5, MCP server.
- **SEOSONA Relevance**: **High (P1)**. (Previously logged). Critical reference for structuring `3_MEMORY` to be queryable by Antigravity or other agents via MCP.

---
*Stored in SEOSONA OS Memory for future architectural references.*
