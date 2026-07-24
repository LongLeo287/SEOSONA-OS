# KI: lbjlaq/Antigravity-Manager

## Overview
Repository with 428 files across 80 directories. Primary language: Rust (140 files).

## Tech Stack (from code)
- Rust (140 files)
- TypeScript (React) (68 files)
- TypeScript (22 files)
- Shell (5 files)
- **Total:** 428 files, 80 directories
- **File types:** .rs: 140, .png: 94, .tsx: 68, .md: 28, .ts: 22, .json: 19, .ttf: 10, .yml: 6

## Public API / Exports
- `listAccounts` from `src\services\accountService.ts`
- `getCurrentAccount` from `src\services\accountService.ts`
- `addAccount` from `src\services\accountService.ts`
- `deleteAccount` from `src\services\accountService.ts`
- `deleteAccounts` from `src\services\accountService.ts`
- `switchAccount` from `src\services\accountService.ts`
- `fetchAccountQuota` from `src\services\accountService.ts`
- `RefreshStats` from `src\services\accountService.ts`
- `refreshAllQuotas` from `src\services\accountService.ts`
- `startOAuthLogin` from `src\services\accountService.ts`
- `completeOAuthLogin` from `src\services\accountService.ts`
- `cancelOAuthLogin` from `src\services\accountService.ts`
- `loadConfig` from `src\services\configService.ts`
- `saveConfig` from `src\services\configService.ts`

## Dependencies
### Dependencies (from package.json)
- `@ant-design/icons`: ^5.6.1
- `@dnd-kit/core`: ^6.3.1
- `@dnd-kit/sortable`: ^10.0.0
- `@dnd-kit/utilities`: ^3.2.2
- `@emotion/react`: ^11.14.0
- `@emotion/styled`: ^11.14.0
- `@lobehub/fluent-emoji`: ^4.1.0
- `@lobehub/icons`: ^4.2.0
- `@lobehub/ui`: ^4.33.4
- `@tanstack/react-virtual`: ^3.13.18
- `@tauri-apps/api`: ^2
- `@tauri-apps/plugin-autostart`: ^2.5.1
- `@tauri-apps/plugin-dialog`: ^2.6.0
- `@tauri-apps/plugin-fs`: ^2.4.5
- `@tauri-apps/plugin-opener`: ^2
- `@tauri-apps/plugin-process`: ^2.3.1
- `@tauri-apps/plugin-updater`: ^2.9.0
- `antd`: ^5.24.6
- `antd-style`: ^3.7.1
- `clsx`: ^2.1.1

### Dev Dependencies
- `@tailwindcss/container-queries`: ^0.1.1
- `@tauri-apps/cli`: ^2
- `@types/react`: ^19.1.8
- `@types/react-dom`: ^19.1.6
- `@vitejs/plugin-react`: ^4.6.0
- `autoprefixer`: ^10.4.22
- `postcss`: ^8.5.6
- `tailwindcss`: ^3.4.19
- `typescript`: ~5.8.3
- `vite`: ^7.0.4
- `vitepress`: ^1.6.4
- `vue`: ^3.5.27

## Imports Detected in Source
- `@tailwindcss/container-queries`
- `@tauri-apps/api`
- `@vitejs/plugin-react`
- `daisyui`
- `i18next`
- `i18next-browser-languagedetector`
- `react`
- `react-dom`
- `react-i18next`
- `react-router-dom`
- `vite`

## Available Commands
- `npm run dev` -- `vite`
- `npm run build` -- `tsc && vite build`
- `npm run preview` -- `vite preview`
- `npm run tauri` -- `tauri`
- `npm run tauri:debug` -- `RUST_LOG=debug npm run tauri dev`

## File Structure
```
  .dockerignore
  .gitattributes
  .gitignore
  LICENSE
  README.md
  README_EN.md
  diff_output.txt
  exe_build.txt
  index.html
  install.ps1
  install.sh
  package-lock.json
  package.json
  postcss.config.cjs
  request_transform.md
  tailwind.config.js
  tsconfig.json
  tsconfig.node.json
  vite.config.ts
  Casks/
    antigravity-tools.rb
  deploy/
    arch/
      PKGBUILD.template
      install.sh
  docker/
    Dockerfile
    Dockerfile.backend
    Dockerfile.backend.localdist
    README.md
    docker-compose.backend.yml
    docker-compose.localdist.yml
    docker-compose.yml
  docs/
    API_REFERENCE.md
    CLAUDE_OPUS_46_INTEGRATION.md
    README.md
    adaptive_mode_test_examples.md
    advanced_configuration.md
    client_test_examples.md
    fix-opus-ultra-priority.md
    fix_claude_code_tool_use.md
    gemini-3-image-guide.md
    model-remapping-logic.md
    proxy-invalid-grant.md
    proxy-monitor-technical.md
    test_503_issue.md
    images/
      AICodeMirror.jpg
      APIKEYFUN.png
      CleanShot 2026-03-12 at 09.34.34@2x.png
      about-dark.png
      accounts-dark.png
      accounts-light.png
      claudeapilogo.png
      dashboard-light.png
      donate_alipay.png
      donate_coffee.png
      donate_wechat.png
      hvoy.png
      packycode_logo.png
      settings-dark.png
      monitor/
        dashboard.png
        details.png
        entrance.png
      usage/
        cherry-studio-citations.png
        claude-code-search.png
        grpc-test.png
        image-gen-nebula.png
        kilo-code-integration.png
      v3/
        claude-code-gen.png
        gemini-image-edit.jpg
        proxy-chat-demo.png
        proxy-settings.png
    proxy/
      accounts.md
      auth.md
    testing/
      context_compression_test_plan.md
      ip_security_test_report.md
      opencode_sync_verification_checklist.md
    zai/
      implementation.md
      mcp.md
      notes.md
      provider.md
      vision-mcp.md
  public/
    icon.png
    tauri.svg
    vite.
```

## Key Source Excerpts
### vite.config.ts
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],
  base: "./",

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
        protocol: "ws",
        host,
        port: 1421,
      }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
    proxy: {
      "/api/": {
        target: "http://127.0.0.1:8045",
        changeOrigin: true,
      },
    },
  },
}));

```

### src\services\accountService.ts
```typescript
import i18n from '../i18n';
import { Account, DeviceProfile, DeviceProfileVersion, QuotaData } from '../types/account';
import { request as invoke } from '../utils/request';

// 检查环境 (可选)
function ensureTauriEnvironment() {
    // Web 模式下 request 也是一个 function，所以这里不应抛错
    if (typeof invoke !== 'function') {
        throw new Error(i18n.t('common.tauri_api_not_loaded'));
    }
}

export async function listAccounts(): Promise<Account[]> {
    const response = await invoke<any>('list_accounts');
    // 如果返回的是对象格式 { accounts: [...] }, 则取其 accounts 属性
    if (response && typeof response === 'object' && Array.isArray(response.accounts)) {
        return response.accounts;
    }
    // 否则直接返回响应内容（假设为数组）
    return response || [];
}

export async function getCurrentAccount(): Promise<Account | null> {
    return await invoke('get_current_account');
}

export async function addAccount(email: string, refreshToken: string): Promise<Account> {
    return await invoke('add_account', { email, refreshToken });
}

export async function deleteAccount(accountId: string): Promise<void> {
    return await invoke('delete_account', { accountId });
}

export async function deleteAccounts(accountIds: string[]): Promise<void> {
    return await invoke('delete_accounts', { accountIds });
}

export async function switchAccount(accountId: string, targetIde?: string): Promise<void> {
    return await invoke('switch_account', { accountId, targetIde });
}

export async function fetchAccountQuota(accountId
```

### src\services\configService.ts
```typescript
import { request as invoke } from '../utils/request';
import { AppConfig } from '../types/config';

export async function loadConfig(): Promise<AppConfig> {
    return await invoke('load_config');
}

export async function saveConfig(config: AppConfig): Promise<void> {
    return await invoke('save_config', { config });
}

```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `mcp`, `router`
- **All scores:** {'seosona-os': 44, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 44, 'seosona-flow': 0}
