import Metronome from '@metronome/sdk';
import { getSandboxAttribution } from '@repo/sandbox-provider/enterprise-access';

const BILLING_EVENT_TYPE = process.env.METRONOME_TOKENS_EVENT_TYPE || 'llm_request';
/** Pass-through Anthropic prices (no margin). We earn via E2B discount. */
const CLAUDE_COST_MARKUP_MULTIPLIER = 1;
const BILLING_LOG_PREFIX = '[BILLING]';

type SendThreadUsageToBillingParams = {
  teamId: string;
  endUserId?: string;
  threadId: string;
  streamId: string;
  sandboxId?: string;
  clientSandboxId?: string;
  sandboxMeta?: unknown;
  totalCostUsd?: number;
  inputTokens?: number;
  outputTokens?: number;
  durationMs?: number;
  runtime?: string;
};

type SendOpenRouterUsageToBillingParams = {
  teamId: string;
  transactionId: string;
  totalCostUsd?: number;
  inputTokens?: number;
  outputTokens?: number;
  userId?: string;
  sessionId?: string;
  sandboxId?: string;
  clientSandboxId?: string;
  providerName?: string;
  model?: string;
};

type SendSandboxLifecycleUsageToBillingParams = {
  teamId: string;
  transactionId: string;
  sandboxExecutionId: string;
  sandboxId: string;
  clientSandboxId?: string;
  sandboxMeta?: unknown;
  durationMs: number;
  startedAt?: string;
  endedAt?: string;
};

type BillingUsageEvent = {
  customer_id: string;
  event_type: string;
  timestamp: string;
  transaction_id: string;
  properties: Record<string, unknown>;
};

let billingClient: Metronome | null | undefined;

function getBillingClient(): Metronome | null {
  if (billingClient !== undefined) {
    return billingClient;
  }

  const bearerToken = process.env.METRONOME_BEARER_TOKEN;
  if (!bearerToken) {
    console.warn(`${BILLING_LOG_PREFIX} METRONOME_BEARER_TOKEN is not configured, billing ingest disabled`);
    billingClient = null;
    return null;
  }

  billingClient = new Metronome({ bearerToken });
  console.log(`${BILLING_LOG_PREFIX} Metronome client initialized`);
  return billingClient;
}

function isFiniteNumber(value: number | undefined): value is number {
  return value !== undefined && Number.isFinite(value);
}

function toSeconds(durationMs: number | undefined): number | undefined {
  if (!isFiniteNumber(durationMs)) return undefined;
  if (durationMs < 0) return undefined;
  return durationMs / 1000;
}

function truncate(value: string, max = 400): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max)}…`;
}

function serializeBillingError(error: unknown): Record<string, unknown> {
  if (!(error instanceof Error)) {
    return { raw: error };
  }

  const sdkError = error as Error & {
    status?: number;
    code?: string;
    cause?: unknown;
    headers?: Headers | { get?: (name: string) => string | null } | Record<string, string>;
    error?: unknown;
  };

  const getHeader = (name: string): string | undefined => {
    const source = sdkError.headers;
    if (!source) return undefined;
    if (typeof (source as any).get === 'function') {
      const value = (source as any).get(name) ?? (source as any).get(name.toLowerCase());
      return value ?? undefined;
    }
    if (typeof source === 'object' && source !== null) {
      return (source as Record<string, string>)[name] ?? (source as Record<string, string>)[name.toLowerCase()];
    }
    return undefined;
  };

  return {
    name: sdkError.name,
    message: sdkError.message,
    status: sdkError.status,
    code: sdkError.code,
    requestId: getHeader('x-amzn-requestid') ?? getHeader('x-request-id'),
    responseError: sdkError.error,
    cause: sdkError.cause instanceof Error
      ? { name: sdkError.cause.name, message: sdkError.cause.message }
      : sdkError.cause,
    stack: sdkError.stack ? truncate(sdkError.stack, 1000) : undefined,
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelay = 1000,
  maxDelay = 10000,
  operation = 'Operation',
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts) {
        console.error(`${operation} failed after ${maxAttempts} attempts`, serializeBillingError(lastError));
        throw error;
      }

      const delay = Math.min(
        baseDelay * (2 ** (attempt - 1)) + Math.random() * 1000,
        maxDelay,
      );

      console.warn(
        `${operation} failed (attempt ${attempt}/${maxAttempts}), retrying in ${Math.round(delay)}ms`,
        serializeBillingError(lastError),
      );
      await sleep(delay);
    }
  }

  throw lastError;
}

async function sendUsageEvents(logTag: string, usageEvents: BillingUsageEvent[]) {
  const client = getBillingClient();
  if (!client) {
    console.warn(`${logTag} Skipping billing ingest: Metronome client unavailable`);
    return;
  }

  if (usageEvents.length === 0) {
    console.warn(`${logTag} Skipping billing ingest: no usage events prepared`);
    return;
  }

  const firstEvent = usageEvents[0];
  console.log(`${logTag} Prepared usage event for Metronome`, {
    transactionId: firstEvent?.transaction_id,
    customerId: firstEvent?.customer_id,
    eventType: firstEvent?.event_type,
    timestamp: firstEvent?.timestamp,
    properties: firstEvent?.properties,
  });

  await retryWithBackoff(
    async () => {
      console.log(`${logTag} Sending usage ingest request`, {
        eventsCount: usageEvents.length,
        transactionIds: usageEvents.map((event) => event.transaction_id),
      });
      await client.v1.usage.ingest({ usage: usageEvents });
      console.log(`${logTag} Usage ingest request accepted by Metronome`, {
        eventsCount: usageEvents.length,
        transactionIds: usageEvents.map((event) => event.transaction_id),
      });
    },
    5,
    1000,
    10000,
    `${logTag} Billing usage ingest`,
  );
}

export async function sendThreadUsageToBilling(params: SendThreadUsageToBillingParams) {
  const logTag = `${BILLING_LOG_PREFIX}[team:${params.teamId}][thread:${params.threadId}][stream:${params.streamId}]`;
  console.log(`${logTag} Billing pipeline started`, {
    eventType: BILLING_EVENT_TYPE,
    totalCostUsd: params.totalCostUsd,
    inputTokens: params.inputTokens,
    outputTokens: params.outputTokens,
    durationMs: params.durationMs,
    hasEndUserId: !!params.endUserId,
  });

  const hasTotalCostUsd = isFiniteNumber(params.totalCostUsd) && params.totalCostUsd > 0;
  if (!hasTotalCostUsd) {
    console.warn(`${logTag} Skipping billing ingest: totalCostUsd is missing or <= 0`, {
      totalCostUsd: params.totalCostUsd,
    });
    return;
  }

  const claudeTotalCostOriginal = params.totalCostUsd as number;
  const claudeTotalCost = claudeTotalCostOriginal * CLAUDE_COST_MARKUP_MULTIPLIER;
  const attribution = getSandboxAttribution(params.sandboxMeta);

  await sendUsageEvents(logTag, [{
    customer_id: params.teamId,
    event_type: BILLING_EVENT_TYPE,
    timestamp: new Date().toISOString(),
    transaction_id: `${params.streamId}:llm_request`,
    properties: {
      claude_total_cost: claudeTotalCost,
      claude_total_cost_original: claudeTotalCostOriginal,
      input_tokens: params.inputTokens,
      output_tokens: params.outputTokens,
      ...(params.endUserId ? { end_user_id: params.endUserId } : {}),
      ...(attribution.invocationTeamId ? { invocation_team_id: attribution.invocationTeamId } : {}),
      ...(attribution.invocationUserId ? { invocation_user_id: attribution.invocationUserId } : {}),
      ...(attribution.ownerTeamId ? { team_id: attribution.ownerTeamId } : {}),
      ...(params.sandboxId ? { sandbox_id: params.sandboxId } : {}),
      ...(params.clientSandboxId ? { client_sandbox_id: params.clientSandboxId } : {}),
      ...(params.sandboxMeta !== undefined ? { sandbox_meta: params.sandboxMeta } : {}),
      thread_id: params.threadId,
      stream_id: params.streamId,
      ...(params.runtime ? { runtime: params.runtime } : {}),
    },
  }]);
}

export async function sendOpenRouterUsageToBilling(params: SendOpenRouterUsageToBillingParams) {
  const logTag = `${BILLING_LOG_PREFIX}[team:${params.teamId}][transaction:${params.transactionId}][provider:openrouter]`;

  const hasTotalCostUsd = isFiniteNumber(params.totalCostUsd) && params.totalCostUsd > 0;
  if (!hasTotalCostUsd) {
    console.warn(`${logTag} Skipping billing ingest: totalCostUsd is missing or <= 0`, {
      totalCostUsd: params.totalCostUsd,
    });
    return;
  }

  const claudeTotalCostOriginal = params.totalCostUsd as number;
  const claudeTotalCost = claudeTotalCostOriginal * CLAUDE_COST_MARKUP_MULTIPLIER;

  await sendUsageEvents(logTag, [{
    customer_id: params.teamId,
    event_type: BILLING_EVENT_TYPE,
    timestamp: new Date().toISOString(),
    transaction_id: params.transactionId,
    properties: {
      claude_total_cost: claudeTotalCost,
      claude_total_cost_original: claudeTotalCostOriginal,
      input_tokens: params.inputTokens,
      output_tokens: params.outputTokens,
      provider: 'openrouter',
      ...(params.userId ? { user_id: params.userId } : {}),
      ...(params.sessionId ? { session_id: params.sessionId } : {}),
      ...(params.sandboxId ? { sandbox_id: params.sandboxId } : {}),
      ...(params.clientSandboxId ? { client_sandbox_id: params.clientSandboxId } : {}),
      ...(params.providerName ? { openrouter_provider_name: params.providerName } : {}),
      ...(params.model ? { openrouter_model: params.model } : {}),
      runtime_source: 'openrouter_webhook',
    },
  }]);
}

export async function sendSandboxLifecycleUsageToBilling(params: SendSandboxLifecycleUsageToBillingParams) {
  const logTag = `${BILLING_LOG_PREFIX}[team:${params.teamId}][sandbox:${params.sandboxId}][execution:${params.sandboxExecutionId}]`;
  const computeUsageSeconds = toSeconds(params.durationMs);

  console.log(`${logTag} Sandbox lifecycle billing started`, {
    eventType: BILLING_EVENT_TYPE,
    transactionId: params.transactionId,
    durationMs: params.durationMs,
    computeUsageSeconds,
    clientSandboxId: params.clientSandboxId,
  });

  if (!computeUsageSeconds || computeUsageSeconds <= 0) {
    console.warn(`${logTag} Skipping billing ingest: durationMs is missing or <= 0`, {
      durationMs: params.durationMs,
    });
    return;
  }
  const attribution = getSandboxAttribution(params.sandboxMeta);

  await sendUsageEvents(logTag, [{
    customer_id: params.teamId,
    event_type: BILLING_EVENT_TYPE,
    timestamp: params.endedAt ?? new Date().toISOString(),
    transaction_id: params.transactionId,
    properties: {
      compute_usage: computeUsageSeconds,
      duration_ms: params.durationMs,
      sandbox_execution_id: params.sandboxExecutionId,
      sandbox_id: params.sandboxId,
      ...(params.clientSandboxId ? { client_sandbox_id: params.clientSandboxId } : {}),
      ...(attribution.invocationTeamId ? { invocation_team_id: attribution.invocationTeamId } : {}),
      ...(attribution.invocationUserId ? { invocation_user_id: attribution.invocationUserId } : {}),
      ...(attribution.ownerTeamId ? { team_id: attribution.ownerTeamId } : {}),
      ...(params.sandboxMeta !== undefined ? { sandbox_meta: params.sandboxMeta } : {}),
      runtime_source: 'e2b_webhook',
      ...(params.startedAt ? { started_at: params.startedAt } : {}),
      ...(params.endedAt ? { ended_at: params.endedAt } : {}),
    },
  }]);
}
