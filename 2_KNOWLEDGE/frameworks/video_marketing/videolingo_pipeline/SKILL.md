---
name: "videolingo_pipeline"
description: "Netflix-level video translation, localization, and dubbing architecture. Ensures single-line subtitles and high-fidelity localized nuance via a 3-step Translate-Reflect-Adapt cycle."
keywords: ["video", "translation", "subtitles", "dubbing", "netflix", "videolingo"]
---

# VideoLingo Subtitle & Dubbing Pipeline

This skill enforces a high-quality video translation and localization architecture based on the "VideoLingo" framework. When building or instructing agents to translate videos, adhere to the following principles to avoid stiff machine translations and multi-line subtitle clashing.

## 1. The 3-Step Translation Architecture

Do not translate video subtitles in a single pass. Implement a 3-step loop:

### Step 1: Direct Translation
- Instruct the LLM to translate the segmented transcript directly to the target language.
- Maintain source terminology where appropriate.

### Step 2: Reflection (Critique)
- The AI must evaluate its own translation from Step 1.
- *Checklist:* Is it culturally appropriate? Are there low-illusion hallucinations? Does it sound stiff? Is it too long for a single screen frame?

### Step 3: Adaptation (Refinement)
- Based on the critique, output the final subtitle.
- **Critical Constraint:** Force the output into a single line to meet Netflix readability standards. Multi-line subtitles are strictly prohibited.

## 2. Audio Processing & Alignment
- **WhisperX:** Use word-level alignment models (like WhisperX) rather than basic Whisper to ensure subtitle timestamps perfectly match the audio.
- **NLP Segmentation:** Before translating, segment the transcript using NLP algorithms to break sentences at natural pauses, rather than arbitrary time intervals.

## 3. Dubbing Integration
- When passing the translated text to TTS engines (like GPT-SoVITS or ElevenLabs), ensure the translated text duration fits within the original audio envelope.
- Use the semantic pauses from the NLP segmentation to control the TTS speaking rate.
