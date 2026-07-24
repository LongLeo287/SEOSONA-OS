# KI: QwenLM/Qwen3-ASR

## Overview
This project, `qwen-asr`, appears to be a Python package for Automatic Speech Recognition (ASR) based on the Qwen3 models.  The presence of files like `qwen3_asr.py` and `qwen3_forced_aligner.py` within the `inference/` directory strongly suggests ASR functionality, while the `finetuning/qwen3_asr_sft.py` file indicates support for fine-tuning these models. The project also includes a CLI with demo and serving capabilities.

## Tech Stack (from code)
- **Language:** Python (evident from numerous `.py` files throughout the repository).
- **Build System:** `setuptools` (defined in `pyproject.toml`: `build-backend = "setuptools.build_meta"`).
- **Frameworks/Libraries:**  The project utilizes `transformers` (version 4.57.6) and `vllm` (optional dependency, version 0.14.0), as evidenced by the `dependencies` section in `pyproject.toml`. Other libraries include `nagisa`, `soynlp`, `accelerate`, `librosa`, `soundfile`, `sox`, `gradio`, `flask`, and `pytz`.

## Public API / Exports
Based on the `pyproject.toml` file, the following scripts are exposed:
- `qwen-asr-demo`:  Maps to `qwen_asr.cli.demo:main` (located in `qwen_asr/cli/demo.py`).
- `qwen-asr-demo-streaming`: Maps to `qwen_asr.cli.demo_streaming:main` (located in `qwen_asr/cli/demo_streaming.py`).
- `qwen-asr-serve`:  Maps to `qwen_asr.cli.serve:main` (located in `qwen_asr/cli/serve.py`).

## Dependencies
The following dependencies are listed in `pyproject.toml`:
- `transformers==4.57.6`
- `nagisa==0.2.11`
- `soynlp==0.0.493`
- `accelerate==1.12.0`
- `qwen-omni-utils`
- `librosa`
- `soundfile`
- `sox`
- `gradio`
- `flask`
- `pytz`
- `vllm==0.14.0` (optional)

## Architecture Patterns
- **Modular Design:** The project is structured into several directories (`qwen_asr/core`, `qwen_asr/inference`, `qwen_asr/cli`) suggesting a modular design with distinct responsibilities for core ASR logic, inference pipelines, and command-line interface.
- **Backend Abstraction:**  The presence of both `transformers_backend` and `vllm_backend` directories within `qwen_asr/core` indicates an abstraction layer allowing the ASR system to potentially utilize different inference backends (Transformers and vLLM).

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:
- **ASR Integration:** The core ASR functionality, particularly leveraging Qwen3 models, can be integrated into SEOSONA for voice control, transcription services, or other speech-based interactions.
- **Fine-tuning Capabilities:**  The `finetuning/qwen3_asr_sft.py` script provides a mechanism to fine-tune the ASR models on custom datasets, potentially improving accuracy and performance within specific SEOSONA use cases.
- **CLI Tools:** The provided CLI tools (`qwen-asr-demo`, `qwen-asr-demo-streaming`, `qwen-asr-serve`) can be adapted or integrated into SEOSONA for testing, demonstration, or deployment of ASR services.

## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `reference` · **Fit:** 24/100 · **Auto-apply:** False
- **Evidence:** `asr`
- **All scores:** {'seosona-os': 20, 'seosona-video': 24, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
