# KI: VanitasTran/AI-Agent-TFT

## Overview
This project appears to be an AI agent designed for playing the game "TFT" (Teamfight Tactics). The agent utilizes computer vision techniques, LLMs, and ADB control to automate gameplay actions based on screen analysis.  The code demonstrates a modular design with components for vision processing, decision-making, and action execution.

## Tech Stack (from code)
- **Python:** The primary language used throughout the project, evidenced by numerous `.py` files (e.g., `main.py`, `llm_brain.py`).
- **PyYAML:** Used for configuration file parsing, as demonstrated in `main.py`: `self.config = yaml.safe_load(f)`.  The presence of `requirements.txt` confirms this dependency: `pyyaml`.
- **OpenCV (cv2):** Employed for image processing and computer vision tasks within the calibration tool (`calibrate.py`) and likely elsewhere, as evidenced by lines like `img = cv2.imread(TEMP_FILE)`.  This is also listed in `requirements.txt`: `opencv-python`.
- **ADB (Android Debug Bridge):** The project interacts with an Android device via ADB for screen capture and input simulation, as shown in the `ADBController` class (`src/vision/adb_control.py`) and its usage within `main.py` and `calibrate.py`.

## Public API / Exports
Due to the limited scope of analysis (only source code), it's difficult to determine a formal public API. However, based on import statements in `main.py`, the following classes/modules appear to be core components:
- `ADBController` (from `src.vision.adb_control`) - Handles ADB interactions.
- `OCRReader` (from `src.vision.ocr_reader`) - Performs OCR on screen captures.
- `UnitDetector` (from `src.vision.unit_detector`) - Detects units on the TFT board.
- `LLMBrain` (from `src.brain.llm_brain`) -  Provides decision-making logic using an LLM.
- `ActionExecutor` (from `src.executor.action_executor`) - Executes actions based on decisions.
- `TFTAgent` (in `main.py`) - The main agent class, orchestrating the other components.

## Dependencies
The following dependencies are listed in `requirements.txt`:
- `opencv-python`
- `numpy`
- `mss`
- `pyautogui`
- `pynput`
- `easyocr`
- `torch`
- `stable-baselines3`
- `ultralytics`
- `loguru`
- `pyyaml`

## Architecture Patterns
- **Modular Design:** The project is structured into distinct modules (`vision`, `brain`, `executor`) with clear responsibilities, promoting code reusability and maintainability.  This is evident in the directory structure and import statements.
- **Configuration-Driven:** The agent's behavior appears to be configurable through a YAML file (`configs/regions.yaml`), allowing for adjustments without modifying core code. This is demonstrated by `main.py` loading configurations using `yaml.safe_load`.
- **Observer Pattern (Potential):**  The calibration tool in `calibrate.py` uses mouse events as triggers to update the screen display, which could be considered a form of observer pattern.

## Relevance to SEOSONA OS
This project's code can benefit SEOSONA OS in several ways:
- **Computer Vision Techniques:** The vision processing components (OCR, unit detection) could be adapted for other tasks requiring image analysis within the OS.
- **ADB Integration:**  The ADB control module provides a foundation for automating interactions with Android devices, which could be useful for testing or remote device management features in SEOSONA OS.
- **Modular Architecture:** The modular design principles employed can serve as a model for structuring other components of SEOSONA OS to enhance maintainability and extensibility.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 20/100 · **Auto-apply:** False
- **Evidence:** `llm`
- **All scores:** {'seosona-os': 20, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
