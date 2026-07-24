---
name: "rewrite_ai_desktop"
description: "Historic directory skill"
keywords: ["rewrite_ai_desktop", "ingested"]
mcp_compatible: true
---

# ReWrite AI Desktop App

> **Source**: http~/.seosona/path/
> **Ingested**: 2026-06-10
> **Type**: Reference (Desktop Application / AI Productivity Tool)
> **License**: Free & Permissive (Open Source)
> **Platform**: Windows (Native)

---

## Overview

ReWrite AI is a native Windows desktop application that deeply integrates AI into the daily OS workflow. It enables users to optimize text, translate, and compose content **instantly across any active application** (MS Word, Browsers, Notepad, Excel, Discord, Slack, etc.) without switching tabs or opening browser windows.

**Core Problem Solved**: Eliminates the tedious loop of *Highlight → Copy → Open Web AI → Paste → Wait → Copy Output → Switch Back → Paste*. With ReWrite AI, everything happens directly at the cursor position via a hotkey.

---

## Core Features

### 1. Rewrite Mode
- **1-Click Replace**: Fix typos, enhance grammar, improve phrasing — then instantly overwrite original text.
- **Granular Customization**:
  - **Tones**: Professional, Friendly, Academic, Creative, Humorous, etc.
  - **Formats**: Paragraph, Bullet Points, Email, Chat Message, Long-form Article, etc.
  - **Lengths**: Short, Medium, Longer.
- **Diff View**: Visually compare original vs. AI modifications before applying.

### 2. Translate Mode
- Break language barriers instantly.
- Translate highlighted text between any supported languages.
- Output replaces selection directly in the active window.

### 3. Compose Mode
- Generate new content from scratch based on prompts.
- Supports multiple formats and tones.

---

## Architecture & Technical Details

| Component | Technology |
|---|---|
| **Runtime** | Native Windows App (likely Electron/Tauri) |
| **AI Backend** | Google Gemini & OpenAI |
| **Input Method** | Global Hotkey → Clipboard interception → AI processing → Automated paste-back |
| **Speed Improvement** | 200-300% faster than manual web AI workflow |

---

## Key Design Patterns (Learnable)

1. **Global Hotkey Interception**: Registers system-wide keyboard shortcuts to trigger AI actions from any application context.
2. **Clipboard-Based I/O**: Uses clipboard as the universal data bridge between any application and the AI backend.
3. **Diff View Before Apply**: Shows visual diff of changes before destructive overwrite — good UX pattern for AI-assisted editing.
4. **Tone/Format/Length Matrix**: Parameterized AI prompts with user-selectable dimensions — reusable pattern for any content generation tool.

---

## SEOSONA Relevance Assessment

- **Skillize?** ❌ No — This is a standalone desktop app, not a reusable script/CLI tool.
- **Agentize?** ❌ No — Not requested by user.
- **Reference Value**: ✅ High — The UX patterns (hotkey AI, clipboard I/O, diff preview) are valuable for designing similar productivity tools within the SEOSONA ecosystem.
- **Classification**: `ingested_data/` reference only.
