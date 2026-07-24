# KI: OptikR/OptikR

## Overview
Real-time screen translation system with OCR, multiple translation engines, and GPU acceleration.

## Architecture & Tech Stack
- Python
-   Python deps: PyQt6, PyQt6-Qt6, PyQt6-sip, easyocr, paddleocr, manga-ocr, pytesseract, rapidocr-onnxruntime, python-doctr[torch], surya-ocr, transformers, sentencepiece, huggingface-hub
- **Total files:** 131 files across 18 directories
- **File types:** .py: 109, .txt: 6, .json: 6, .md: 4, .qss: 2, .gitattributes: 1, .gitignore: 1

## Documentation Sections
- OptikR
- Project Motivation
- What is OptikR?
- A Modular Framework
- Built for Everyone
- Everything is a Plugin
- DEMO Video
- Real-Time Translation
- Key Features
- Quick Start
- Prerequisites
- Install and Run
- First Launch Setup
- Troubleshooting Installation
- Smart Dictionary
- How It Works
- Key Capabilities
- Real Performance Impact
- Community Sharing
- Settings Overview
- General
- Capture
- OCR
- Translation
- Overlay

## Core Structure
```
  .gitattributes
  .gitignore
  CLAUDE.md
  DEVELOPER_GUIDE.md
  LICENSE
  ROADMAP.md
  bootstrap.py
  readme.md
  requirements-audio.txt
  requirements-cpu.txt
  requirements-gpu.txt
  requirements-linux.txt
  requirements-windows.txt
  requirements.txt
  run.py
  run_gnome_backend.py
  start.bat
  start.sh
  app/
    __init__.py
    interfaces.py
    models.py
    benchmark/
      benchmark_runner.py
    capture/
      __init__.py
      capture_plugin_manager.py
      multi_monitor_support.py
      multi_region_manager.py
      pil_screenshot.py
      plugin_capture_layer.py
      simple_capture_layer.py
    core/
      __init__.py
      component_manifest.py
      config_schema.py
      credential_encryptor.py
      generate_config_docs.py
      headless_runner.py
      interfaces.py
      main_window.py
      model_catalog.py
      model_catalog_download.py
      model_catalog_import.py
      model_catalog_metadata.py
      model_catalog_recommend.py
      model_catalog_registry.py
      model_catalog_types.py
      pipeline_loader.py
      settings_coordinator.py
      ui_manager.py
      config/
        __init__.py
        cache.py
        encryptor.py
        facade.py
        migrator.py
        persistence.py
        types.py
        utils.py
        validator.py
    image_processing/
      __init__.py
      batch_processor.py
      image_compositor.py
      image_pipeline.py
      presets.py
    llm/
      __init__.py
      llm_engine_interface.py
      llm_layer.py
      llm_plugin_manager.py
    localization/
      __init__.py
      extracted_strings.json
      json_translator.py
      language_manager.py
      string_extractor.py
      translatable_mixin.py
      translate_locales.py
      locales/
        de.json
        en.json
        fr.json
        it.json
        ja.json
    ocr/
      __init__.py
      intelligent_text_processor.py
      ocr_engine_interface.py
      ocr_layer.py
      ocr_plugin_manager.py
    overlay/
      __init__.py
      factory.py
      intelligent_positioning.py
    preprocessing/
      __init__.py
      ai_upscaler.py
      comic_text_detector.py
      craft_detector.py
      deskew.py
      doctr_detector.py
      frame_differencing.py
      preprocessing_layer.py
      roi_detection.py
      small_text_enhancer.py
    styles/
      base.qss
      dark.qss
    text_processors/
      __init__.py
      text_processor_plugin_manager.py
    text_translation/
      __init__.py
      smart_dictionary.py
      smart_
```

## Quick Start
```bash
python run.py --create-plugin
cd OptikR
python run.py
First Time:
OCR detects "Hello" → AI translates to "Hallo" → Dictionary saves it
Next Time:
OCR detects "Hello" → Dictionary: "Hallo" (instant, no AI needed)
Frame 1: CAPTURE → OCR → TRANSLATE → POSITION → OVERLAY
Then Frame 2 starts...
Time 0ms:   Frame 1: CAPTURE
```

## Agent Configuration

--- CLAUDE.md ---
# CLAUDE.md — OptikR working reference

Reference notes for Claude when working in this repo. **Keep this file current as the project evolves.**
Companions: **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** (function reference + bug register) and
**[ROADMAP.md](ROADMAP.md)** (the get-it-running plan). This file is the mental model + conventions + backlog.

> **Current effort (June 2026):** the app was written on an old box (i7-10700K + RTX 4070) and **has never run on the
> new one (Intel Ultra 285K + RTX 5080)**. The 5080 is **Blackwell (sm_120)** → needs **CUDA 12.8 + PyTorch ≥2.7
> (cu128)**, but the code is pinned to **cu124 / torch <2.7** (`bootstrap.py:363,463`, `surya-ocr<=0.13.1`) → cu124 has
> no Blackwell kernels, so GPU ops fail. Plan (see ROADMAP): **① dependency cleanup + Windows baseline → ② fix all
> audit issues (clean app) → ③ Linux via WSL, last.** Work in a `.venv` (Python 3.12). Phase 1 = "make it run," not "improve."

## What this is
OptikR — a real-time **screen-translation** desktop app (PyQt6). Captures a screen region → OCR → translate → renders
the translated text as an on-screen overlay. Built around a **stage-based pipeline** where every stage *and* every
enhancement is a **plugin** (engines are swappable without touching the engine).

- **Scale:** ~292 Python files, ~80K LOC in the live tree (~98K incl. `old/`).
- **Status:** vibecoded proof-of-concept (originally ~Mar 2026, older model). Good architecture, several real bugs, two
  security gaps. Honest grade: **C+/B-** — good bones, swappable engines.
- **Platform:** Windows-primary (Win 10/11). **Linux/macOS support is weak and known** (capture `bettercam` is
  Windows-only; DPAPI credential storage is Windows-only; some path assumptions; `winocr` is Windows-only).
- **Maintainer:** solo, beginner — *can read code, does not write from scratch.* Prefer self-contained, plugin-scoped
  changes that are easy to review. Avoid sweeping refactors unless asked. Explain *why*, not just *what*.
- **S


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
