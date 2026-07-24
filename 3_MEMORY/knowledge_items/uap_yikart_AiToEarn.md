# KI: yikart/AiToEarn

## Overview
简体中文 | [English](README_EN.md) | [日本語](README_JA.md)

## Architecture & Tech Stack
- Could not detect automatically
- **Total files:** 108 files across 40 directories
- **File types:** .md: 45, .yml: 12, .jpeg: 10, .json: 9, .png: 9, .yaml: 4, .mp4: 3

## Documentation Sections
- [Aitoearn：#1 AI内容营销智能体](https://aitoearn.ai)
- 🚀 快速使用 AiToEarn（5 种方式）
- 最新动态
- 核心功能
- 💰 Monetize —— 内容赚钱
- 📢 Publish —— 内容发布 Agent
- 💬 Engage —— 内容互动 Agent
- 🎨 Create —— 内容创作 Agent
- 复制配置文件用于本地开发
- 在另一个终端
- 克隆仓库
- 进入目录
- 安装依赖
- 编译 sqlite（better-sqlite3 需要 node-gyp 和本地 Python）
- 启动开发
- 贡献指南
- 联系
- 推荐

## Core Structure
```
  .gitignore
  AGENTS.md
  CONTRIBUTING.md
  CONTRIBUTING_CN.md
  DOCKER_DEPLOYMENT_CN.md
  DOCKER_DEPLOYMENT_EN.md
  LICENSE
  README.md
  README_EN.md
  README_JA.md
  docker-compose.yml
  .claude/
    launch.json
  .github/
    languages.yml
    pull_request_template.md
    ISSUE_TEMPLATE/
      bug_report.yml
      draft.yml
      feature_request.yml
      refactor.yml
    workflows/
      backen-check.yml
      backend-build.yml
      pr-issue-check.yml
      pr-to-feishu.yml
      web-build.yml
      web-check.yml
  demo/
    kwai/
      index.html
    xhs/
      index.html
      signature.js
  nginx/
    nginx.conf
  presentation/
    agent_0.png
    channel-cn.png
    data_center.png
    display-1.5.2png.png
    engage-thumbnail-cn.png
    monetize-cn.png
    openclaw-earn-demo.png
    publish-cn.png
    wechat.jpg
    app-screenshot/
      0. api-key/
        api-key-settings.png
      1. content publish/
        calendar.jpeg
        support_channels.jpeg
      2. content hotspot/
        hotspot.jpg
        hotspot2.jpeg
        hotspot3.jpeg
        hotspot4.jpeg
      3. content search/
        contentsearch.gif
        contentsearch0.mp4
        contentsearch1.jpeg
        contentsearch2.jpeg
        contentsearch4.jpeg
      4. comments search/
        commentfilter.jpeg
        commentsearch.gif
        untitled folder/
          commentfilter.mp4
          commentfilter1.mp4
      5. content engagement/
        commentfilter2.jpeg
  project/
    aitoearn-backend/
      .editorconfig
      .gitignore
      .mcp.json
      .npmrc
      .nvmrc
      AGENTS.md
      CLAUDE.md
      Dockerfile
      README.md
      eslint.config.mjs
      nx.json
      package.json
      pnpm-lock.yaml
      pnpm-workspace.yaml
      project.json
      skills-lock.json
      tsconfig.base.json
      vitest.workspace.ts
      .agents/
        skills/
          caveman/
            SKILL.md
          diagnose/
            SKILL.md
            scripts/
              hitl-loop.template.sh
          grill-me/
            SKILL.md
          grill-with-docs/
            ADR-FORMAT.md
            CONTEXT-FORMAT.md
            SKILL.md
          handoff/
            SKILL.md
          improve-codebase-architecture/
            DEEPENING.md
            INTERFACE-DESIGN.md
            LANGUAGE.md
            SKILL.md
          prototype/
            LOGIC.md
            SKILL.md
            UI.md
          setup-matt-pocock-skills/
            SKILL.md
            domain.
```

## Quick Start
```bash
npx -y @aitoearn/openclaw-plugin-cli
</details>
<details>
<summary><b>Cursor</b></summary>
在 Cursor 的 MCP 设置中添加：
</details>
<details>
<summary><b>其他 AI 助手（通用配置）</b></summary>
任何支持 MCP 协议的工具，只需要两个信息：
| 配置项 | 值 |
```

## Agent Configuration

--- AGENTS.md ---
# AGENTS.md

本文件定义 Codex 在 `AiToEarn` 仓库内的默认工作规则。

## Communication

- 默认使用简体中文回复。

## Project Layout

- `project/aitoearn-backend` 是 Nx + pnpm 后端工作区。
- `project/aitoearn-web` 是 Next.js + pnpm 前端项目。
- 根目录主要维护 README、Docker 部署文档、`docker-compose.yml` 和展示资源。

## Package & Command Rules

- backend/web 使用 `pnpm`。
- 根目录没有统一 package，不要在根目录随手执行 install/build。
- backend 改动优先在 `project/aitoearn-backend` 用 `pnpm nx ...` 验证，并遵循 `project/aitoearn-backend/CLAUDE.md`。
- web 改动在 `project/aitoearn-web` 验证，优先使用 `pnpm run type-check` 和 `pnpm build`。
- 纯文档改动至少运行 `git diff --check`。

## Documentation Rules

- 根 README 对外文档包含 `README.md`、`README_EN.md`、`README_JA.md`；涉及用户可见能力、安装、OpenClaw、MCP、Relay、API Key 或环境地址时默认三语同步。
- Docker 部署说明涉及生产部署、环境变量或 `docker compose` 时，同步检查 `DOCKER_DEPLOYMENT_CN.md` 和 `DOCKER_DEPLOYMENT_EN.md`。
- README 类改动保持最小可用改写，不要把参考文档整段复制进来。
- 用户可见 README、skill、capability reference 只写当前能力与环境规则，不写 `dev`、测试环境、验证日期等来源说明。

## Environment Rules

- OpenClaw、MCP、Relay 都必须明确区分中国版和国际版环境：`*.aitoearn.cn` 属于中国版，`*.aitoearn.ai` 属于国际版。
- 中国版 API Key 只能搭配 `aitoearn.cn` 相关 URL；国际版 API Key 只能搭配 `aitoearn.ai` 相关 URL。环境和 Key 不匹配会导致 401。
- MCP 示例需要按环境区分 `https://aitoearn.cn/api/unified/mcp` / `https://aitoearn.ai/api/unified/mcp`，SSE 示例同理区分 `/api/unified/sse`。
- Relay 示例需要按 `RELAY_API_KEY` 来源选择 `RELAY_SERVER_URL`：中国版使用 `https://aitoearn.cn/api`，国际版使用 `https://aitoearn.ai/api`。


--- CONTRIBUTING.md ---
# CONTRIBUTING

So you're looking to contribute to AiToEarn - that's awesome! We can't wait to see what you do. We have grand ambitions to build the best platform for AI-driven earning. Any help from the community counts, truly.

We need to be nimble and ship fast, but we also want to make sure that contributors like you get as smooth an experience as possible. We've assembled this contribution guide for that purpose, aiming at getting you familiarized with the codebase & how we work with contributors, so you could quickly jump to the fun part.

This guide is a constant work in progress. We highly appreciate your understanding if at times it lags behind the actual project, and welcome any feedback for us to improve.

## Before you jump in

Looking for something to tackle? Browse our [issues](https://github.com/AiToEarn/AiToEarn/issues) and pick one to get started!

### Good first issue

Issues with titles containing **【good frist】** are issues we provide for new contributors. If you want to join our team, please submit a PR linked to such an issue.

Join us, contri

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
