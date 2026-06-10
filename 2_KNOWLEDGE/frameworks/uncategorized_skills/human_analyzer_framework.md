# Human Analyzer Framework Architecture

The `human-analyzer` project is a clinical-grade character profile intelligence system. It demonstrates a robust 6-framework architecture for processing deep psychological profiles into platform-native content. 

## 6-Framework Structure
The system is divided into four domain frameworks, one orchestrator, and one common toolkit, communicating via an event bus.
1. **MAT (Materials) - Input**
   - **Role**: Ingests and classifies source material (transcripts, logs) into `docs/materials/`.
   - **Features**: Evidence tiers (T1-T5), CRAAP quality scoring, contradiction detection. Material must be "integrated" before analysis.
2. **PSY (Psychology) - Analysis**
   - **Role**: Builds and refreshes the clinical 5P formulation (defenses, trauma, strengths).
   - **Features**: Cross-character consistency, crisis assessment (never cached), hypothesis and timeline tracking.
3. **CRE (Content) - Output**
   - **Role**: Generates platform-native content under `assets/`.
   - **Features**: Per-claim evidence tier gating, privacy guard (confidentiality scan), voice audit, angle discovery.
4. **GRO (Growth) - Intelligence**
   - **Role**: Career trajectory, competency (Dreyfus), learning profile (Kolb).
   - **Features**: Outputs forecasts explicitly labeled `[FORECAST — NOT FACTUAL]`.
5. **ORC (Orchestration) - Coordinator**
   - **Role**: Event routing across domains, resolves cascades, audits cross-domain consistency, manages session state, memory, and knowledge graph.
6. **COM (Common) - Toolkit**
   - **Role**: Shared utilities like git operations, health checks, rules management, and skill analytics.

## Core Principles
- **Event-Driven**: Never cross-domain direct writes. E.g., `MAT.integrated` triggers `PSY.refresh`, which triggers `CRE.recalibrate`.
- **Privacy First**: Clinical-grade confidentiality is enforced. Caches only store verdict labels, never raw text.
- **Evidence Gating**: Content generation is gated per-claim by evidence tier before publishing.
- **Bilingual Support**: System commands and event names are in English, while prose and content are localized (e.g., Vietnamese with full diacritics).
