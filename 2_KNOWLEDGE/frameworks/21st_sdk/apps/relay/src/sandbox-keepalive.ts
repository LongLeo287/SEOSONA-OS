import { Sandbox } from '@e2b/code-interpreter';
import { SANDBOX_KEEPALIVE_INTERVAL_MS, SANDBOX_TIMEOUT_MS } from './sandbox-constants';

const SANDBOX_TIMEOUT_METADATA_KEY = 'timeoutMs';
const sandboxTimeoutCache = new Map<string, number>();

type SandboxKeepAliveHelperParams = {
  renew: (ttlMs: number) => Promise<void>;
  ttlMs?: number | null;
  resolveTtlMs?: () => Promise<number>;
  refreshIntervalMs?: number;
  logTag?: string;
};

export class SandboxKeepAliveHelper {
  private readonly renewSandbox: (ttlMs: number) => Promise<void>;
  private ttlMs: number | null;
  private readonly resolveTtlMs?: () => Promise<number>;
  private readonly refreshIntervalMs: number;
  private readonly logTag: string;
  private timer: ReturnType<typeof setInterval> | null = null;
  private refreshInFlight = false;
  private stopped = false;

  constructor(params: SandboxKeepAliveHelperParams) {
    this.renewSandbox = params.renew;
    this.ttlMs = params.ttlMs ?? null;
    this.resolveTtlMs = params.resolveTtlMs;
    this.refreshIntervalMs = params.refreshIntervalMs ?? SANDBOX_KEEPALIVE_INTERVAL_MS;
    this.logTag = params.logTag ?? '[SANDBOX_KEEPALIVE]';
  }

  async start(): Promise<void> {
    if (this.stopped) {
      this.stopped = false;
    }

    if (this.timer) {
      return;
    }

    await this.refresh('start', true);

    this.timer = setInterval(() => {
      void this.refresh('interval', false);
    }, this.refreshIntervalMs);
  }

  stop(): void {
    this.stopped = true;

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private async getTtlMs(): Promise<number> {
    if (this.ttlMs !== null) {
      return this.ttlMs;
    }

    if (this.resolveTtlMs) {
      this.ttlMs = await this.resolveTtlMs();
      return this.ttlMs;
    }

    return SANDBOX_TIMEOUT_MS;
  }

  private async refresh(reason: string, throwOnError: boolean): Promise<void> {
    if (this.stopped || this.refreshInFlight) {
      return;
    }

    this.refreshInFlight = true;

    try {
      await this.renewSandbox(await this.getTtlMs());
    } catch (error) {
      if (this.stopped) {
        return;
      }

      if (throwOnError) {
        throw error;
      }

      console.warn(`${this.logTag} Failed to refresh sandbox TTL during ${reason}`, error);
    } finally {
      this.refreshInFlight = false;
    }
  }
}

export async function getSandboxTimeoutMs(sandboxId: string): Promise<number> {
  const cachedTimeoutMs = sandboxTimeoutCache.get(sandboxId);
  if (cachedTimeoutMs !== undefined) {
    return cachedTimeoutMs;
  }

  try {
    const sandboxInfo = await Sandbox.getInfo(sandboxId);
    const timeoutMs = Number(sandboxInfo.metadata?.[SANDBOX_TIMEOUT_METADATA_KEY]);
    if (Number.isFinite(timeoutMs) && timeoutMs > 0) {
      sandboxTimeoutCache.set(sandboxId, timeoutMs);
      return timeoutMs;
    }
  } catch (error) {
    console.warn(`[SANDBOX_KEEPALIVE][${sandboxId}] Failed to load sandbox timeout metadata`, error);
  }

  return SANDBOX_TIMEOUT_MS;
}
