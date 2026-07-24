# KI: chatfire-AI/huobao-drama

## Overview
> 🔥 **AI创作省钱攻略｜快乐马 & Seedance 合作专属折扣，优惠到底** 👉 [立即查看](https://aiad.dfycloud.com/)

## Architecture & Tech Stack
- Could not detect automatically
- **Total files:** 93 files across 31 directories
- **File types:** .ts: 56, .md: 10, .vue: 8, .json: 6, .png: 4, .gitignore: 3, .dockerignore: 1

## Documentation Sections
- 🎬 Huobao Drama - AI 短剧生成平台
- 📖 项目简介
- 🎯 核心价值
- 🛠️ 技术架构
- 🎥 作品展示 / Demo Videos
- ✨ 功能特性
- 🎭 角色管理
- 🎬 分镜制作
- 🎥 视频生成
- 📦 资源管理
- 🤖 AI Agents
- 🔌 多厂商适配
- 🚀 快速开始
- 📋 环境要求
- ⚙️ 配置文件
- 📥 安装依赖
- 克隆项目
- 安装后端依赖
- 安装前端依赖
- 🎯 启动项目
- 终端1：启动后端
- 终端2：启动前端
- 1. 构建前端
- 2. 启动后端
- 🗄️ 数据库

## Core Structure
```
  .dockerignore
  .gitignore
  CLAUDE.md
  Dockerfile
  README.md
  docker-compose.yml
  drama.png
  backend/
    .gitignore
    .npmrc
    package-lock.json
    package.json
    tsconfig.json
    scripts/
      seed-voices.ts
    src/
      index.ts
      agents/
        index.ts
        skills.ts
        tools/
          extract-tools.ts
          grid-prompt-tools.ts
          script-tools.ts
          storyboard-tools.ts
          voice-tools.ts
      db/
        index.ts
        schema.ts
      middleware/
        logger.ts
      routes/
        agent.ts
        agentConfigs.ts
        aiConfigs.ts
        aiVoices.ts
        characters.ts
        compose.ts
        dramas.ts
        episodes.ts
        grid.ts
        images.ts
        merge.ts
        scenes.ts
        skills.ts
        storyboards.ts
        upload.ts
        videos.ts
        webhooks.ts
      services/
        ai.ts
        ffmpeg-compose.ts
        ffmpeg-merge.ts
        grid-split.ts
        image-generation.ts
        tts-generation.ts
        video-generation.ts
        adapters/
          ali-image.ts
          ali-video.ts
          gemini-image.ts
          minimax-image.ts
          minimax-tts.ts
          minimax-video.ts
          openai-image.ts
          registry.ts
          types.ts
          url.ts
          vidu-video.ts
          volcengine-image.ts
          volcengine-video.ts
      utils/
        response.ts
        storage.ts
        task-logger.ts
        transform.ts
  configs/
    config.example.yaml
  data/
    .gitkeep
  frontend/
    .gitignore
    nuxt.config.ts
    package-lock.json
    package.json
    tsconfig.json
    app/
      app.vue
      assets/
        huobao-logo.png
        studio.css
      components/
        BaseSelect.vue
      composables/
        useAgent.ts
        useApi.ts
      layouts/
        default.vue
        studio.vue
      pages/
        index.vue
        settings.vue
        drama/
          [id]/
            index.vue
            episode/
              [episodeNumber].vue
    public/
      favicon.png
      huobao-logo.png
  skills/
    extractor/
      SKILL.md
    grid_prompt_generator/
      SKILL.md
      reference/
        character-prompt.md
        scene-prompt.md
        shot-prompt.md
    script_rewriter/
      SKILL.md
    storyboard_breaker/
      SKILL.md
    voice_assigner/
      SKILL.md
```

## Quick Start
```bash
frontend/   — Nuxt 3 + Vue 3 + TypeScript (纯 CSS，无 UI 框架)
backend/    — Hono + Drizzle ORM + Mastra AI Agents + better-sqlite3
configs/    — config.yaml 配置文件
data/       — SQLite 数据库 + 生成资源文件
skills/     — Agent 技能定义 (SKILL.md)
brew install ffmpeg
sudo apt update && sudo apt install ffmpeg
ffmpeg -version
cp configs/config.example.yaml configs/config.yaml
```

## Agent Configuration

--- CLAUDE.md ---
# CLAUDE.md

## Project Overview

Huobao Drama — AI-powered drama/video production tool. Full TypeScript stack.

## Structure

```
backend/   — Hono + Drizzle ORM + Mastra (AI agents) + better-sqlite3
frontend/  — Vue 3 + TypeScript + Vite (pure CSS, no UI framework)
configs/   — config.yaml
data/      — SQLite database + static files
skills/    — Agent SKILL.md definitions
```

## Commands

### Backend (`backend/`)
- `npm run dev` — Start dev server with tsx watch (port 5679)
- `npm start` — Start production server
- `npm run typecheck` — TypeScript type checking

### Frontend (`frontend/`)
- `npm run dev` — Vite dev server (port 3013, proxies /api to 5679)
- `npm run build` — Production build

## Architecture

### Backend
- **HTTP**: Hono framework with CORS, logger middleware
- **Database**: Drizzle ORM + better-sqlite3, WAL mode, schema in `src/db/schema.ts`
- **AI Agents**: Mastra framework with AI SDK (OpenAI compatible providers)
- **Agent Types**: script_rewriter, extractor, storyboard_breaker
- **SSE Streaming**: Hono streamSSE for agent chat responses
- **File Storage**: Local filesystem under `data/static/`

### Frontend
- **Vue 3** + TypeScript + Vite
- **Routing**: Vue Router (4 routes: list, detail, workbench, settings)
- **State**: Single composable `useWorkbench.ts` for workbench page
- **API**: Unified fetch client in `src/api/index.ts` with SSE async generator
- **Styling**: Pure CSS with CSS variables (dark theme)

## Database
SQLite at `data/drama_generator.db`. Schema matches existing GORM-created tables.
Auto-WAL mode. No migrations needed — reads existing DB directly.

## Key Config
- `configs/config.yaml` — AI provider defaults
- AI service configs stored in DB (`ai_service_configs` table)
- Agent configs stored in DB (`agent_configs` table)



## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
