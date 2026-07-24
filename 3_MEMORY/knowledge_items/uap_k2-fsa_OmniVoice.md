# KI: k2-fsa/OmniVoice

## Overview
This repository, `k2-fsa/OmniVoice`, implements a multilingual zero-shot text-to-speech (TTS) system utilizing diffusion language models. The project aims to create an "omnilingual" TTS capable of generating speech in various languages without explicit training data for each language.  The core functionality is exposed through command-line interfaces and includes tools for inference, batch processing, demonstration, and audio manipulation.

## Tech Stack (from code)
- **Python:** The primary language used throughout the codebase (e.g., `omnivoice/__init__.py`, `omnivoice/cli/infer.py`).
- **PyTorch:**  Used for deep learning model implementation and training, as indicated by dependencies like `torch>=2.4` and `torchaudio>=2.4` in `pyproject.toml`.
- **Transformers:** A core dependency from Hugging Face, used for leveraging pre-trained language models (e.g., `dependencies = ["transformers>=5.3.0"]` in `pyproject.toml`).
- **Hatchling:**  The build backend specified in `pyproject.toml` (`build-backend = "hatchling.build"`), indicating its use for packaging the project.
- **uv (Universal Venv):** Used for managing dependencies and ensuring specific PyTorch versions with CUDA support, as defined in `pyproject.toml`.

## Public API / Exports
Based on the `pyproject.toml` file, the following command-line scripts are exposed:
- `omnivoice-infer`:  Located at `omnivoice.cli.infer:main`.
- `omnivoice-infer-batch`: Located at `omnivoice.cli.infer_batch:main`.
- `omnivoice-demo`: Located at `omnivoice.cli.demo:main`.

## Dependencies
The following dependencies are listed in `pyproject.toml`:
- `torch>=2.4`
- `torchaudio>=2.4`
- `transformers>=5.3.0`
- `accelerate`
- `pydub`
- `gradio`
- `tensorboardX`
- `webdataset`
- `numpy`
- `soundfile`
- `librosa`
- `jiwer==3.1.0` (optional, for evaluation)
- `s3prl` (optional, for speech representation)
- `funasr` (optional, for ASR models)
- `zhconv` (optional, for Chinese character normalization)
- `zhon` (optional, for Chinese punctuation)
- `unidecode` (optional, for Unicode normalization)

## Architecture Patterns
- **Modular CLI Structure:** The project utilizes a clear command-line interface structure within the `omnivoice/cli/` directory, separating inference (`infer.py`), batch processing (`infer_batch.py`), and demonstration (`demo.py`) functionalities.
- **Data Processing Pipeline:**  The `omnivoice/data/` directory suggests a pipeline for data preparation involving batching (`batching.py`), collating (`collator.py`), dataset creation (`dataset.py`), and processing (`processor.py`).
- **Model Organization:** The `omnivoice/models/` directory contains the core model definition (`omnivoice.py`), indicating a modular approach to model design.
- **Configuration Management:**  The `omnivoice/training/config.py` file suggests a configuration system for managing training parameters and settings.



## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Multilingual TTS Capabilities:** The multilingual nature of OmniVoice aligns with the potential need for SEOSONA OS to support speech synthesis in multiple languages, expanding its accessibility and user base.  The zero-shot capabilities would reduce the development effort required for new language support.
- **Audio Processing Tools:** The `omnivoice/utils/audio.py` and related scripts (e.g., `omnivoice/scripts/denoise_audio.py`) provide audio processing functionalities that could be integrated into SEOSONA OS for tasks like noise reduction, voice cloning, or audio enhancement.
- **TTS Research & Development:** The codebase provides a valuable resource for research and development in TTS technologies, potentially inspiring new features or improvements within SEOSONA OS's speech synthesis pipeline.

## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `tts` · **Fit:** 61/100 · **Auto-apply:** True
- **Evidence:** `tts`, `text-to-speech`, `omnivoice`
- **All scores:** {'seosona-os': 20, 'seosona-video': 61, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
