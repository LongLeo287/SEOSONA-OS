# KI: abus-aikorea/voice-pro

## Overview
This project appears to be a voice AI platform, providing functionalities like text-to-speech (TTS), speech recognition (ASR), and voice cloning. The codebase includes modules for various tasks such as audio processing, translation, subtitle generation, and integration with services like Azure TTS and Cosyvoice.  The `start-voice.py` script indicates it's designed to be run after initial setup via the `one_click.py` installer.

## Tech Stack (from code)
- **Python:** The primary language used throughout the project, evidenced by the numerous `.py` files (225).  For example, `src/config.py` is a Python file.
- **PyTorch:** Used for machine learning models, as seen in `cosyvoice/hifigan/generator.py`.
- **Gradio:** Utilized for creating user interfaces, demonstrated by files like `gradio_tts_f5.py` and the CSS/JS imports within `ui.py`.
- **YAML:** Configuration files are used, as seen in `.yaml` extensions (e.g., `config-user.json5`).
- **Miniconda:** The update script (`update.sh`) explicitly mentions Miniconda for environment management.

## Public API / Exports
Due to the nature of this project and its apparent focus on internal functionality, there are no readily identifiable public APIs or endpoints exposed directly through code files.  However, `gradio_*.py` files suggest a user-facing interface is built using Gradio components. For example:
- `gradio_tts_f5.py`: Likely exposes a TTS endpoint using F5 models.
- `gradio_voice_celeb.py`: Probably provides an interface for voice celebrity generation.

## Dependencies
Dependencies are primarily listed in `requirements-voice-cpu.txt` and `requirements-voice-gpu.txt`.  Examples include:
- `torch`: PyTorch library (used in many files, e.g., `cosyvoice/hifigan/generator.py`)
- `gradio`: For creating user interfaces (`ui.py`).
- `azure-ai-speech`: Azure Speech Services SDK for TTS and ASR.
- `whisper`: Whisper ASR model (used in `abus_asr_whisper.py`).

## Architecture Patterns
- **Modular Design:** The project is organized into modules within the `app/` directory, each handling specific functionalities like ASR (`abus_asr_whisper.py`), TTS (`abus_tts_azure.py`), and voice cloning (`abus_voice_celeb.py`).
- **Configuration-Driven:**  The `src/config.py` file defines default configurations that can be overridden, suggesting a design where behavior is controlled by configuration files.
- **Service Integration:** The code integrates with external services like Azure TTS and Cosyvoice, demonstrating an architecture that relies on third-party APIs.

## Relevance to SEOSONA OS
This project's voice AI capabilities could benefit SEOSONA OS in several ways:
- **TTS Engine:**  The TTS functionalities (Azure TTS, Cosyvoice integration) can be integrated into SEOSONA for text-to-speech applications.
- **ASR Integration:** The ASR components (`abus_asr_whisper.py`) could enhance voice control and input capabilities within the OS.
- **Voice Cloning/Customization:**  The voice cloning features (e.g., `abus_voice_celeb.py`, `rvc_model` in `start-voice.py`) could allow users to personalize their SEOSONA experience with custom voices.


## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `asr` · **Fit:** 49/100 · **Auto-apply:** True
- **Evidence:** `asr`, `whisper`
- **All scores:** {'seosona-os': 41, 'seosona-video': 49, 'seosona-content': 33, 'seosona-ux-ui': 33, 'seosona-flow': 0}
