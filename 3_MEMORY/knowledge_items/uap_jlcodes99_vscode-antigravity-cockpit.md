# KI: jlcodes99/vscode-antigravity-cockpit

## Overview
Repository with 116 files across 15 directories. Primary language: TypeScript (66 files).

## Tech Stack (from code)
- TypeScript (66 files)
- JavaScript (8 files)
- Shell (3 files)
- **Total:** 116 files, 15 directories
- **File types:** .ts: 66, .png: 12, .md: 8, .js: 8, .css: 7, .json: 6, .sh: 3, .gitignore: 1

## Public API / Exports
- `AccountQuotaCache` from `src\services\accountsRefreshService.ts`
- `AccountState` from `src\services\accountsRefreshService.ts`
- `AccountsRefreshService` from `src\services\accountsRefreshService.ts`
- `AccountSwitchMode` from `src\services\accountSwitchService.ts`
- `AccountSwitchModeInput` from `src\services\accountSwitchService.ts`
- `AccountSwitchErrorCode` from `src\services\accountSwitchService.ts`
- `AccountSwitchResult` from `src\services\accountSwitchService.ts`
- `AccountSwitchOptions` from `src\services\accountSwitchService.ts`
- `cockpitToolsLocal` from `src\services\cockpitToolsLocal.ts`
- `cockpitToolsSyncEvents` from `src\services\cockpitToolsSync.ts`
- `syncAccountsWithCockpitTools` from `src\services\cockpitToolsSync.ts`
- `ServerConfig` from `src\services\cockpitToolsWs.ts`
- `readServerConfig` from `src\services\cockpitToolsWs.ts`
- `QuotaApiCacheSource` from `src\services\quota_api_cache.ts`
- `QuotaApiCacheRecord` from `src\services\quota_api_cache.ts`
- `readQuotaApiCache` from `src\services\quota_api_cache.ts`
- `writeQuotaApiCache` from `src\services\quota_api_cache.ts`
- `CACHE_TTL_MS` from `src\services\quota_api_cache.ts`
- `isApiCacheValid` from `src\services\quota_api_cache.ts`
- `getApiCacheAge` from `src\services\quota_api_cache.ts`
- `QuotaCacheSource` from `src\services\quota_cache.ts`
- `QuotaCacheModel` from `src\services\quota_cache.ts`
- `QuotaCacheRecord` from `src\services\quota_cache.ts`
- `readQuotaCache` from `src\services\quota_cache.ts`
- `writeQuotaCache` from `src\services\quota_cache.ts`
- `CACHE_TTL_MS` from `src\services\quota_cache.ts`
- `isCacheValid` from `src\services\quota_cache.ts`
- `getCacheAge` from `src\services\quota_cache.ts`
- `QuotaHistoryPoint` from `src\services\quota_history.ts`
- `QuotaHistoryModelRecord` from `src\services\quota_history.ts`

## Imports Detected in Source
- `child_process`
- `crypto`
- `events`
- `fs`
- `os`
- `path`
- `vscode`

## File Structure
```
  .eslintrc.json
  .gitignore
  .prettierrc
  .vscodeignore
  CHANGELOG.md
  CHANGELOG.zh-CN.md
  LICENSE
  README.en.md
  README.md
  announcements.json
  announcements_dev.json
  jest.config.js
  package-lock.json
  package.json
  tsconfig.json
  assets/
    dashboard_card_grouped.png
    dashboard_list_view.png
    donation_eth.png
    donation_sol.png
    icon-mono.svg
    icon.png
    model_capabilities_tooltip.png
    quickpick_mode.png
    settings_modal.png
  docs/
    DONATE.en.md
    DONATE.md
    PUBLISH.md
    RELEASE_AUTOMATION.md
    alipay.png
    qq_group.png
    qq_group_20260404_183718.png
    wechat.png
    wechat_info.jpg
  scripts/
    build.js
    install-hooks.sh
    pre-version.sh
    release.sh
  src/
    extension.ts
    announcement/
      announcement_service.ts
      index.ts
      types.ts
    antigravityTools_sync/
      index.ts
      service.ts
    auto_trigger/
      controller.ts
      credential_storage.ts
      index.ts
      local_auth_importer.ts
      oauth_service.ts
      scheduler_service.ts
      trigger_service.ts
      types.ts
    controller/
      command_controller.ts
      message_controller.ts
      status_bar_controller.ts
      telemetry_controller.ts
    engine/
      hunter.ts
      reactor.ts
      strategies.test.ts
      strategies.ts
    services/
      accountSwitchService.ts
      accountsRefreshService.ts
      cockpitToolsLocal.ts
      cockpitToolsSync.ts
      cockpitToolsWs.ts
      quotaRefreshManager.ts
      quota_api_cache.ts
      quota_cache.ts
      quota_history.ts
      syncSettings.ts
    shared/
      antigravity_paths.test.ts
      antigravity_paths.ts
      cloudcode_base.ts
      cloudcode_client.ts
      cockpit_tools_launcher.ts
      config_service.ts
      constants.ts
      errors.ts
      i18n.ts
      log_service.ts
      model_preference_migration.ts
      official_host_version.ts
      recommended_models.ts
      types.ts
      translations/
        ar.ts
        cs.ts
        d
```

## Key Source Excerpts
### src\services\accountsRefreshService.ts
```typescript
import * as vscode from 'vscode';
import { logger } from '../shared/log_service';
import { credentialStorage } from '../auto_trigger/credential_storage';
import { ReactorCore } from '../engine/reactor';
import { cockpitToolsWs, AccountInfo } from './cockpitToolsWs';
import { syncAccountsWithCockpitTools } from './cockpitToolsSync';
import { configService } from '../shared/config_service';
import { QuotaSnapshot } from '../shared/types';
import { t } from '../shared/i18n';
import { recordQuotaHistory } from './quota_history';
import { QuotaRefreshManager } from './quotaRefreshManager';
import { accountSwitchService } from './accountSwitchService';

export interface AccountQuotaCache {
    snapshot: QuotaSnapshot;
    fetchedAt: number;
    loading?: boolean;
    error?: string;
}

export interface AccountState {
    email: string;
    toolsId: string | null;
    isCurrent: boolean;
    hasDeviceBound: boolean;
    hasPluginCredential: boolean;
    tier?: string;
    // 异常状态（从 credentialStorage 同步）
    isInvalid?: boolean;        // Token 失效（需重新授权）
    invalidReason?: string;     // 失效原因（用于UI显示）
    isForbidden?: boolean;      // 403 无权限（跳过自动刷新）
    forbiddenReason?: string;   // 无权限原因（用于UI显示）
    expiresAt?: string;         // Token 过期时间
}

export class AccountsRefreshService {
    private accounts: Map<string, AccountState> = new Map();
    private quotaCache: Map<string, AccountQuotaCache> = new Map();
    private currentEmail: string | null = null;
    private initialized =
```

### src\services\accountSwitchService.ts
```typescript
import * as vscode from 'vscode';
import { credentialStorage, oauthService } from '../auto_trigger';
import { configService } from '../shared/config_service';
import { logger } from '../shared/log_service';
import { getOfficialIdeVersion } from '../shared/official_host_version';
import { cockpitToolsLocal } from './cockpitToolsLocal';
import { cockpitToolsWs } from './cockpitToolsWs';

const ACCOUNT_SWITCH_MODE_STATE_KEY = 'accountSwitchMode';
const DEFAULT_WS_WAIT_MS = 5000;
const DEFAULT_SEAMLESS_TIMEOUT_MS = 8000;

export type AccountSwitchMode = 'default' | 'seamless';
export type AccountSwitchModeInput = AccountSwitchMode | 'auto';

export type AccountSwitchErrorCode =
    | 'tools_offline'
    | 'account_not_found'
    | 'switch_failed'
    | 'host_unavailable'
    | 'token_missing'
    | 'invalid_expiry'
    | 'unknown';

export interface AccountSwitchResult {
    success: boolean;
    mode: AccountSwitchMode;
    email?: string;
    message?: string;
    errorCode?: AccountSwitchErrorCode;
}

export interface AccountSwitchOptions {
    requestedMode?: AccountSwitchModeInput;
}

interface OAuthTokenInfoPayload {
    accessToken: string;
    refreshToken: string;
    expiryDateSeconds: number;
    tokenType: string;
    isGcpTos: boolean;
}

interface OAuthPreferencesApi {
    getOAuthTokenInfo?(): Promise<OAuthTokenInfoPayload | null> | Thenable<OAuthTokenInfoPayload | null>;
    setOAuthTokenInfo(tokenInfo: OAuthTokenInfoPayload | null): Promise<void> | Thenable<void>
```

### src\services\cockpitToolsLocal.ts
```typescript
/**
 * Cockpit Tools 本地文件读取服务
 * 直接读取 ~/.antigravity_cockpit/ 下的 JSON 文件获取数据
 * 不依赖 WebSocket 连接
 */

import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../shared/log_service';
import { getCockpitToolsSharedDir } from '../shared/antigravity_paths';

const ACCOUNTS_INDEX = 'accounts.json';

/** accounts.json 中的账号条目 */
interface AccountEntry {
    id: string;
    email: string;
    name: string | null;
    created_at: number;
    last_used: number;
}

/** accounts.json 的完整结构 */
interface AccountsIndex {
    version: string;
    accounts: AccountEntry[];
    current_account_id: string | null;
}

class CockpitToolsLocal {
    /**
     * 读取 accounts.json 索引文件
     */
    private readAccountsIndex(): AccountsIndex | null {
        const filePath = path.join(getCockpitToolsSharedDir(), ACCOUNTS_INDEX);
        try {
            if (!fs.existsSync(filePath)) {
                logger.warn('[CockpitToolsLocal] accounts.json 不存在');
                return null;
            }
            const content = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(content) as AccountsIndex;
        } catch (err) {
            logger.error(`[CockpitToolsLocal] 读取 accounts.json 失败: ${err}`);
            return null;
        }
    }

    /**
     * 通过 email 获取账号 ID（不依赖 WebSocket）
     */
    getAccountIdByEmail(email: string): string | null {
        const index = this.readAccountsIndex();
        if (!index) { return null; }

        const account = index.ac
```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 20/100 · **Auto-apply:** False
- **Evidence:** `keyword`
- **All scores:** {'seosona-os': 20, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
