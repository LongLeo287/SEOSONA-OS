# KI: saturndec/waoowaoo

## Overview
Repository with 1176 files across 342 directories. Primary language: TypeScript (719 files).

## Tech Stack (from code)
- TypeScript (719 files)
- TypeScript (React) (241 files)
- Shell (4 files)
- **Total:** 1176 files, 342 directories
- **File types:** .ts: 719, .tsx: 241, .json: 81, .txt: 62, .mjs: 33, .png: 6, .css: 5, .svg: 4

## Public API / Exports
- `AuthSession` from `src\lib\api-auth.ts`
- `ProjectAuthIncludes` from `src\lib\api-auth.ts`
- `NovelDataBase` from `src\lib\api-auth.ts`
- `NovelDataWithIncludes` from `src\lib\api-auth.ts`
- `ProjectAuthContextWithIncludes` from `src\lib\api-auth.ts`
- `ProjectAuthContext` from `src\lib\api-auth.ts`
- `CustomModel` from `src\lib\api-config.ts`
- `ModelMediaType` from `src\lib\api-config.ts`
- `ModelSelection` from `src\lib\api-config.ts`
- `getPageLocale` from `src\lib\api-fetch.ts`
- `mergeLocaleHeader` from `src\lib\api-fetch.ts`
- `apiFetch` from `src\lib\api-fetch.ts`
- `APP_VERSION` from `src\lib\app-meta.ts`
- `GITHUB_REPOSITORY` from `src\lib\app-meta.ts`
- `ArkResponsesOptions` from `src\lib\ark-llm.ts`
- `ArkResponsesResult` from `src\lib\ark-llm.ts`
- `PollResult` from `src\lib\async-poll.ts`
- `parseExternalId` from `src\lib\async-poll.ts`
- `submitFalTask` from `src\lib\async-submit.ts`
- `queryFalStatus` from `src\lib\async-submit.ts`
- `TaskStatus` from `src\lib\async-task-utils.ts`
- `queryBananaTaskStatus` from `src\lib\async-task-utils.ts`
- `authOptions` from `src\lib\auth.ts`
- `ParsedModelKey` from `src\lib\config-service.ts`
- `parseModelKey` from `src\lib\config-service.ts`
- `composeModelKey` from `src\lib\config-service.ts`
- `extractModelId` from `src\lib\config-service.ts`
- `extractModelKey` from `src\lib\config-service.ts`
- `ProjectModelConfig` from `src\lib\config-service.ts`
- `PRIMARY_APPEARANCE_INDEX` from `src\lib\constants.ts`

## Imports Detected in Source
- `@/lib`
- `@next-auth/prisma-adapter`
- `bcryptjs`
- `crypto`
- `next`
- `next-auth`
- `next-intl`

## File Structure
```
  .dockerignore
  .env.example
  .eslintrc.json
  .gitignore
  .nvmrc
  .tmp_check_task.ts
  CHANGELOG.md
  Dockerfile
  LICENSE
  README.md
  README_en.md
  caddyfile
  debug-request.json
  docker-compose.test.yml
  docker-compose.yml
  eslint.config.mjs
  extract_chinese.py
  middleware.ts
  next.config.ts
  package-lock.json
  package.json
  postcss.config.mjs
  tsconfig.json
  vitest.config.ts
  vitest.core-coverage.config.ts
  images/
    cta-banner.png
    dab6b4105e3260f37ba2d5f536dce259.jpg
  lib/
    prompts/
      proxy.ts
      character-reference/
        character_image_to_description.en.txt
        character_image_to_description.zh.txt
        character_reference_to_sheet.en.txt
        character_reference_to_sheet.zh.txt
      novel-promotion/
        agent_acting_direction.en.txt
        agent_acting_direction.zh.txt
        agent_character_profile.en.txt
        agent_character_profile.zh.txt
        agent_character_visual.en.txt
        agent_character_visual.zh.txt
        agent_cinematographer.en.txt
        agent_cinematographer.zh.txt
        agent_clip.en.txt
        agent_clip.zh.txt
        agent_shot_variant_analysis.en.txt
        agent_shot_variant_analysis.zh.txt
        agent_shot_variant_generate.en.txt
        agent_shot_variant_generate.zh.txt
        agent_storyboard_detail.en.txt
        agent_storyboard_detail.zh.txt
        agent_storyboard_insert.en.txt
        agent_storyboard_insert.zh.txt
        agent_storyboard_plan.en.txt
        agent_storyboard_plan.zh.txt
        ai_story_expand.en.txt
        ai_story_expand.zh.txt
        character_create.en.txt
        character_create.zh.txt
        character_description_update.en.txt
        character_description_update.zh.txt
        character_modify.en.txt
        character_modify.zh.txt
        character_regenerate.en.txt
        character_regenerate.zh.txt
        episode_split.en.txt
        episode_split.zh.txt
        image_prompt_modify.en.txt
        image_prompt_modify.zh
```

## Key Source Excerpts
### next.config.ts
```typescript
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  // 已删除 ignoreBuildErrors / ignoreDuringBuilds，构建保持严格门禁
  // Next 15 的 allowedDevOrigins 是顶层配置，不属于 experimental
  allowedDevOrigins: [
    'http://192.168.31.218:3000',
    'http://192.168.31.*:3000',
  ],
};

export default withNextIntl(nextConfig);

```

### src\lib\api-auth.ts
```typescript
/**
 * 🔐 API 权限验证工具
 * 集中管理 Session 验证、项目权限检查等通用逻辑
 */

import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { headers as readHeaders } from 'next/headers'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { withPrismaRetry } from '@/lib/prisma-retry'
import { extractModelKey } from '@/lib/config-service'
import { getErrorSpec, type UnifiedErrorCode } from '@/lib/errors/codes'
import { getLogContext, setLogContext } from '@/lib/logging/context'

// ============================================================
// 类型定义
// ============================================================

export interface AuthSession {
    user: {
        id: string
        name?: string | null
        email?: string | null
    }
}

function bindAuthLogContext(session: AuthSession, projectId?: string) {
    const context = getLogContext()
    if (!context.requestId) return
    setLogContext({
        userId: session.user.id,
        ...(projectId ? { projectId } : {}),
    })
}

async function getInternalTaskSession(): Promise<AuthSession | null> {
    const expectedToken = process.env.INTERNAL_TASK_TOKEN || ''

    const incomingHeaders = await readHeaders()
    const token = incomingHeaders.get('x-internal-task-token') || ''
    const userId = incomingHeaders.get('x-internal-user-id') || ''
    if (!userId) return null
    if (expectedToken) {
        if (token !== expectedToken) return null
    } else if (process.env
```

### src\lib\api-config.ts
```typescript
/**
 * API 配置读取器（配置中心严格模式）
 *
 * 规则：
 * 1) 模型唯一键必须是 provider::modelId
 * 2) 禁止 provider 猜测、静态映射、默认降级
 * 3) 运行时只从配置中心读取 provider 与密钥
 */

import { prisma } from './prisma'
import { decryptApiKey } from './crypto-utils'
import {
  composeModelKey,
  parseModelKeyStrict,
  type UnifiedModelType,
} from './model-config-contract'
import type {
  OpenAICompatMediaTemplate,
  OpenAICompatMediaTemplateSource,
} from './openai-compat-media-template'
import { validateOpenAICompatMediaTemplate } from './user-api/model-template/validator'

export interface CustomModel {
  modelId: string
  modelKey: string
  name: string
  type: UnifiedModelType
  provider: string
  llmProtocol?: 'responses' | 'chat-completions'
  llmProtocolCheckedAt?: string
  compatMediaTemplate?: OpenAICompatMediaTemplate
  compatMediaTemplateCheckedAt?: string
  compatMediaTemplateSource?: OpenAICompatMediaTemplateSource
  // Non-authoritative display field; billing uses unified server pricing catalog.
  price: number
}

export type ModelMediaType = 'llm' | 'image' | 'video' | 'audio' | 'lipsync'

export interface ModelSelection {
  provider: string
  modelId: string
  modelKey: string
  mediaType: ModelMediaType
  llmProtocol?: 'responses' | 'chat-completions'
  compatMediaTemplate?: OpenAICompatMediaTemplate
}

type GatewayRouteType = 'official' | 'openai-compat'

interface CustomProvider {
  id: string
  name: string
  baseUrl?: string
  apiKey?: string
  apiMode?: 'gemini-sdk' | 'openai-official'
  gatewayRoute?
```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `llm`, `rag`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
