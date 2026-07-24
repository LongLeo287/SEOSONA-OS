# KI: RVC-Boss/GPT-SoVITS

## Overview
This project, GPT-SoVITS, appears to be a system for text-to-speech (TTS) and voice conversion using generative models. The codebase includes components for training SoVITS (Speech Voice Conversion with Transformer) and GPT (Generative Pre-trained Transformer) models, as well as inference pipelines for both real-time and batch processing.  It also incorporates elements of a BigVGAN architecture for audio generation.

## Tech Stack (from code)
- **Python:** The primary language used throughout the project (`api.py`, `config.py`, `GPT_SoVITS/utils.py`).
- **PyTorch:** Heavily utilized for deep learning model implementation and training (`AR/models/*.py`, `BigVGAN/activations.py`).  The Dockerfile specifies a PyTorch base image (`FROM xxxxrt666/torch-base:cu${CUDA_VERSION}-${TORCH_BASE}`).
- **YAML:** Used for configuration files, particularly for defining model parameters and training settings (`config.py`, `docker-compose.yaml`).
- **Bash:**  Used in shell scripts for installation and build processes (`install.sh`, `docker_build.sh`).
- **JavaScript/HTML/CSS**: Utilized for the web UI components (webui.py imports css, js, top_html).

## Public API / Exports
Based on the code, particularly `api.py` and `api_v2.py`, the project exposes a RESTful API:

- **`/` endpoint in `api.py`:**  Handles TTS inference requests with options for specifying reference audio, text language, and other parameters. It supports both GET and POST methods.
- **`/tts` endpoint in `api_v2.py`:** Provides an alternative API for TTS inference, also accepting various parameters via GET or POST requests.
- **`/change_refer` endpoint in `api_v2.py`**: Allows changing the default reference audio.

## Dependencies
The `requirements.txt` file lists the following dependencies:

- numpy<2.0
- scipy
- tensorboard
- librosa==0.10.2
- numba
- pytorch-lightning>=2.4
- gradio<5
- ffmpeg-python
- onnxruntime (GPU and CPU versions)
- tqdm
- funasr>=1.3.7
- cn2an
- pypinyin
- pyopenjtalk>=0.4.1
- g2p_en
- torchaudio
- modelscope
- sentencepiece
- transformers>=4.43,<=4.50
- peft<0.18.0
- chardet
- PyYAML
- psutil
- jieba_fast
- jieba
- split-lang
- fast_langdetect>=0.3.1
- wordsegment
- rotary_embedding_torch
- ToJyutping
- g2pk2
- ko_pron
- opencc
- python_mecab_ko
- fastapi[standard]>=0.115.2
- x_transformers
- torchmetrics<=1.5
- pydantic<=2.10.6
- ctranslate2>=4.0,<5
- av>=11



## Architecture Patterns
- **Modular Design:** The project is structured into several directories (`GPT_SoVITS`, `BigVGAN`, `AR`, `modules`) suggesting a modular design with distinct components for different functionalities (training, inference, model architecture).
- **Configuration-Driven:**  The use of YAML configuration files (`config.py`, `docker-compose.yaml`, BigVGAN/configs/*.json) indicates that the system's behavior is largely driven by configuration rather than hardcoded logic.
- **Layered Architecture**: The code exhibits a layered architecture with clear separation between data processing, model definition, and inference execution.

## Relevance to SEOSONA OS
This project’s code could benefit SEOSONA OS in several ways:

- **TTS Capabilities:**  The core TTS functionality (SoVITS and GPT models) can be integrated into SEOSONA OS for voice synthesis tasks.
- **Voice Conversion:** The voice conversion capabilities of SoVITS could be used to create custom voices or modify existing ones within the operating system.
- **API Integration:** The exposed REST API (`api.py`, `api_v2.py`) can be leveraged by SEOSONA OS applications for TTS and voice conversion services.
- **Model Optimization**:  The project's focus on optimization (e.g., using CUDA, ONNX export) could inform efforts to improve the performance of other AI components within SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `asr` · **Fit:** 49/100 · **Auto-apply:** True
- **Evidence:** `asr`, `whisper`
- **All scores:** {'seosona-os': 20, 'seosona-video': 49, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 28}
