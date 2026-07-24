# Voice Cloning & TTS Repository Batch 1 — 2026-06-18

Analysis of the first batch of Voice Cloning / TTS repositories requested for SEOSONA OS ingestion.

## 1. CorentinJ/Real-Time-Voice-Cloning
- **Stars/Forks**: High popularity (legacy)
- **Summary**: SV2TTS implementation. Clones voice from 5s of audio to generate arbitrary speech in real-time.
- **SEOSONA Relevance**: **Low/Legacy**. It's largely outdated compared to modern models like F5-TTS, CosyVoice, or GPT-SoVITS. Mostly good for educational reference.

## 2. RVC-Boss/GPT-SoVITS
- **Summary**: Few-shot voice cloning model. Uses 1 minute of voice data to train a good TTS model, or 3-5 seconds for zero-shot cloning. Excellent cross-lingual inference (English, Japanese, Chinese).
- **SEOSONA Relevance**: **High (P1)**. One of the best open-source few-shot voice cloning tools available. A strong alternative to F5-TTS if we ever need to fine-tune a model for Chí Quyết's voice with just 1 minute of data, rather than relying solely on zero-shot inference.

## 3. coqui-ai/TTS
- **Summary**: Deep learning toolkit for Text-to-Speech. Includes XTTS (excellent zero-shot voice cloning) and supports many languages.
- **SEOSONA Relevance**: **Medium (P2)**. XTTSv2 is a great model, but Coqui AI has shut down and the repository is no longer actively maintained. F5-TTS and CosyVoice have generally surpassed it in zero-shot accuracy and efficiency.

## 4. OpenBMB/VoxCPM
- **Summary**: VoxCPM2 is a Tokenizer-Free TTS for Multilingual Speech Generation, Creative Voice Design, and True-to-Life Cloning.
- **SEOSONA Relevance**: **Medium (P2)**. Advanced research model. Good to keep an eye on for future integrations if tokenizer-free approaches prove more stable for Vietnamese text.

## 5. FunAudioLLM/CosyVoice
- **Summary**: Multi-lingual large voice generation model by Alibaba. Supports inference, zero-shot cloning, and fine-tuning. Outstanding for Chinese, English, and has good cross-lingual capabilities.
- **SEOSONA Relevance**: **High (P1)**. Already integrated into SEOSONA Video's `fish_audio_api.py` as a fallback engine. Excellent quality, but requires GPU and specific environment setup.

## 6. v-nhandt21/ViSV2TTS
- **Summary**: Vietnamese Voice Cloning System using Speaker Verification training on multi-speaker VITS.
- **SEOSONA Relevance**: **High (P1) for Vietnamese context**. Specifically trained on Vietnamese data. Good alternative to VieNeu-TTS for native Vietnamese voice cloning, though VITS-based zero-shot cloning is generally less accurate in timbre matching compared to Flow Matching (F5-TTS) or GPT-based models (GPT-SoVITS).

---
*Stored in SEOSONA OS Memory for future architectural references.*
