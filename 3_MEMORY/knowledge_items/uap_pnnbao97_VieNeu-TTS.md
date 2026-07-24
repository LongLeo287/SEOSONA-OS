# KI: pnnbao97/VieNeu-TTS

## Overview
This project, "VieNeu-TTS," appears to be a Vietnamese text-to-speech (TTS) system with voice cloning capabilities.  The codebase includes components for both CPU and GPU execution, utilizing ONNX Runtime for efficient inference on CPUs and PyTorch for GPU acceleration. It supports streaming and offers different model configurations, including an experimental "v3 Turbo" variant.

## Tech Stack (from code)
- **Python:** The primary language, evidenced by the `.py` file extensions (45 files).  The `pyproject.toml` file confirms this: `requires-python = ">=3.10"`
- **PyTorch:** Used for GPU acceleration, as indicated in `config.yaml`: `"v3 Turbo (Thử nghiệm)": { repo: pnnbao-ump/VieNeu-TTS-v3-Turbo; CPU dùng ONNX; GPU dùng PyTorch }` and the presence of `.pt` files (6).
- **ONNX Runtime:** Utilized for CPU inference, as stated in `config.yaml`: `"v3 Turbo (Thử nghiệm)": { repo: pnnbao-ump/VieNeu-TTS-v3-Turbo; CPU dùng ONNX }`.
- **uv:** A dependency management tool, specified in the `pyproject.toml` file under `[build-system]` and `[tool.uv]`.
- **Hugging Face Transformers:**  Implied by the use of Hugging Face models and repositories referenced in `config.yaml`, such as `"VieNeu-TTS-v3-Turbo (Thử nghiệm)": { repo: pnnbao-ump/VieNeu-TTS-v3-Turbo }`.
- **Sea-g2p:** A phonemizer library, listed as a dependency in `pyproject.toml`: `dependencies = [ "sea-g2p>=0.7.14" ]`

## Public API / Exports
Due to the large number of files and lack of clear entry points (e.g., a `__main__.py`), it's difficult to definitively list public APIs without further analysis. However, based on file names and structure:

- **`vieneu/serve.py`**: Likely contains functions or classes related to serving the TTS model.
- **`vieneu/_v3_turbo_engine/inference_v3_turbo.py`**:  Contains inference logic for the v3 Turbo engine.
- **`src/vieneu/factory.py`**: Suggests a factory pattern for creating different TTS models or components.

## Dependencies
Based on `pyproject.toml`:
- `sea-g2p>=0.7.14`
- `onnxruntime>=1.20.0`
- `numpy`
- `soundfile`
- `soxr`
- `tokenizers>=0.20`
- `huggingface_hub`

## Architecture Patterns
- **Modular Design:** The codebase is structured into modules (`vieneu`, `vieneu_utils`, `_v3_turbo_engine`) suggesting a modular architecture.
- **Configuration-Driven:**  The use of `config.yaml` indicates that the system's behavior is configurable, allowing for different model selections and settings.
- **Factory Pattern:** The presence of `factory.py` suggests the use of a factory pattern to create instances of various TTS components.

## Relevance to SEOSONA OS
This project’s code could benefit SEOSONA OS in several ways:

- **Vietnamese Language Support:**  The core functionality provides high-quality Vietnamese TTS, which is currently lacking in SEOSONA OS.
- **Voice Cloning Capabilities:** The voice cloning feature could be integrated into SEOSONA OS to allow users to create personalized voices for various applications.
- **ONNX Runtime Optimization:** Leveraging ONNX Runtime for CPU inference can improve performance and reduce resource consumption on devices with limited GPU capabilities, aligning with SEOSONA's focus on efficiency.
- **Modular Design:** The modular architecture allows for easy integration of specific components into the existing SEOSONA OS framework.

## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `tts` · **Fit:** 61/100 · **Auto-apply:** True
- **Evidence:** `tts`, `text-to-speech`, `vieneu`
- **All scores:** {'seosona-os': 24, 'seosona-video': 61, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 28}
