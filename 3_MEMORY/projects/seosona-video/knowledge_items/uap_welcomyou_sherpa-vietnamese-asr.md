# KI: welcomyou/sherpa-vietnamese-asr

## Overview
This repository contains a Vietnamese automatic speech recognition (ASR) system designed for offline use, primarily targeting CPU environments. It provides both a desktop application with a graphical user interface and a web service accessible via Progressive Web App (PWA). The project focuses on speaker diarization and punctuation restoration using ONNX models.

## Tech Stack (from code)
- **Python:**  The primary language is Python, evident from the numerous `.py` files throughout the repository (e.g., `app.py`, `core/asr_engine.py`).
- **PyQt6:** The desktop application utilizes PyQt6 for its graphical user interface, as seen in `app.py`: `from PyQt6.QtWidgets import QApplication`.
- **FastAPI:**  The web service is built using FastAPI, indicated by the presence of files like `web_service/server.py` and references to FastAPI within those files (though specific code examples are not provided).
- **ONNX Runtime:** The core ASR engine relies heavily on ONNX Runtime for model inference (`core/asr_engine.py`: `import onnxruntime as ort`).
- **Build System:**  The project uses Python scripts for building, including `build-portable/build_portable.py` and `build-portable/build_portable_online.py`. The `requirements.txt` file defines the dependencies managed by a Python package manager (likely pip).

## Public API / Exports
Due to the lack of documentation or explicit API definitions in the code, identifying a formal public API is difficult. However, based on the structure and filenames, some potential exported elements include:

- **Functions within `core/asr_engine.py`:**  Functions like `TranscriberPipeline`, `merge_chunks_with_overlap`.
- **Classes within `core/speaker_diarization.py`:** The `run_diarization` function suggests a diarization API.
- **Functions in `core/audio_analyzer.py`**: Functions such as `QualityMetrics` and `AnalysisResult` suggest an audio quality analysis module.

## Dependencies
The `requirements.txt` file lists the following dependencies:

```
sherpa-onnx>=1.12.0
soundfile>=0.12.0
librosa>=0.10.0
soxr>=0.3.0
pydub>=0.25.0
sounddevice>=0.4.6
torch>=2.0.0
transformers>=4.30.0
onnxruntime>=1.15.0
huggingface_hub>=0.16.0
numpy>=1.24.0
scipy>=1.10.0
scikit-learn>=1.3.0
sentence-transformers>=2.2.0
sentencepiece>=0.1.99
pyannote.audio>=3.1.0
pyannote.core>=6.0.0
PyQt6>=6.5.0
PyQt6-Qt6>=6.5.0
psutil>=5.9.0
matplotlib>=3.7.0
filelock>=3.12.0
```

## Architecture Patterns
- **Modular Design:** The code is structured into `core`, `offline_pwa`, `web_service`, and `build-portable` directories, suggesting a modular architecture with distinct responsibilities.
- **ONNX Model Inference:**  The core ASR functionality relies heavily on ONNX models for efficiency and portability.
- **Configuration-Driven:** The application uses configuration files (`config.ini`) to manage settings, promoting flexibility and customization.
- **Separation of Concerns:** The code attempts to separate concerns between the desktop GUI, web service backend, and core ASR processing logic.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Offline Vietnamese ASR:**  The offline ASR capabilities can be integrated into SEOSONA OS for voice control and transcription without requiring an internet connection.
- **Speaker Diarization:** The speaker diarization functionality can enhance audio analysis features within SEOSONA OS, such as identifying different speakers in recordings.
- **ONNX Model Optimization:**  The project's use of ONNX Runtime demonstrates a focus on efficient model inference, which is valuable for resource-constrained devices that might run SEOSONA OS. The `build_portable` scripts could be adapted to create optimized builds for specific hardware targets within the SEOSONA ecosystem.


## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `asr` · **Fit:** 49/100 · **Auto-apply:** True
- **Evidence:** `asr`, `transcri`
- **All scores:** {'seosona-os': 20, 'seosona-video': 49, 'seosona-content': 28, 'seosona-ux-ui': 0, 'seosona-flow': 28}
