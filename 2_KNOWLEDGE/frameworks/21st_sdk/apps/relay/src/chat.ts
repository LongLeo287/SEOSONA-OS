import {
  buildSandboxMeta,
  getAccessibleAgentConfig,
} from '@repo/sandbox-provider/enterprise-access';
import { createStreamTransformer, createAcpStreamTransformer } from '@repo/sandbox-provider';
import {
  createUIMessageStream,
  JsonToSseTransformStream,
  UI_MESSAGE_STREAM_HEADERS,
  UIMessage,
} from 'ai';
import { and, desc, eq, isNotNull, isNull } from 'drizzle-orm';
import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { sendThreadUsageToBilling } from './billing';
import { ensureTeamBillingReady } from './billing-setup';
import { getCompletedRunSpendUsd, isBudgetExceeded } from './budget';
import { db } from './db';
import {
  getDeploymentTemplateId,
  getDeploymentSource,
  getDeploymentAgentConfig,
  getDeploymentMcpConfigUrl,
  getDeploymentMcpServers,
  getDeploymentVaultIds,
  getDeploymentMaxSandboxBudgetUsd,
  normalizeDeploymentSandboxConfig,
  type ResolvedSandboxConfig,
} from './deployment-metadata';
import { PubSubService } from './pubsub';
import {
  buildPrivateEnvVars,
  connectToSandbox,
  createProvisionedSandbox,
  destroySandbox,
  readPrivateEnvVars,
  refreshProxyTokenIfNeeded,
  renewSandbox,
  syncPrivateEnvVars,
} from './sandbox-factory';
import { SandboxHandle, RuntimeTransport } from './sandbox-backends/types';
import { isOpenSandboxNotFoundError } from './sandbox-backends/opensandbox';
import { SandboxKeepAliveHelper } from './sandbox-keepalive';
import { recreateStandaloneOpenSandbox } from './standalone-sandbox-recreate';
import { isStandaloneWorkspaceVolumesEnabled } from './standalone-workspace-pvc';
import { checkVaultCoverage, getVaultCoverageMode } from './vault-coverage';
import { resolveVaultIds, VaultResolutionError } from './vault-resolution';
import {
  ExternalUserIdentityError,
  resolveTrustedExternalUserId,
} from './chat-identity';
import {
  anDeployments,
  anRuns,
  anSandboxes,
  anSpans,
  anThreads,
  type AnRunError,
  type AnRunMeta,
  type AnRunStatus,
} from './schema';

const RESPONSE_STREAM_HEADERS: Record<string, string> = {
  ...UI_MESSAGE_STREAM_HEADERS,
  'transfer-encoding': 'chunked',
  'content-encoding': 'none',
};

type ChatErrorCode =
  | 'invalid_request'
  | 'agent_not_found'
  | 'sandbox_not_found'
  | 'sandbox_unavailable'
  | 'sandbox_error'
  | 'session_expired'
  | 'stream_not_found'
  | 'thread_not_found'
  | 'billing_not_ready'
  | 'vault_resolution_failed'
  | 'vault_unsupported_for_provider'
  | 'vault_coverage_missing'
  | 'budget_exceeded';

class ChatRuntimeError extends Error {
  code: ChatErrorCode;
  status: number;
  setupUrl?: string;
  details?: Record<string, unknown>;

  constructor(
    code: ChatErrorCode,
    message: string,
    status = 500,
    setupUrl?: string,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.setupUrl = setupUrl;
    this.details = details;
  }
}

type SandboxMessageMetadata = {
  sessionId?: string;
  totalCostUsd?: number;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  finalTextId?: string;
  durationMs?: number;
  resultSubtype?: string;
  models?: string[];
};

type AgentMessage = UIMessage<SandboxMessageMetadata>;

type ConvertedImage = {
  base64: string;
  mediaType: string;
  filename?: string;
};

type StreamCompletionParams = {
  threadId: string;
  sandboxRecordId: string;
  messages: AgentMessage[];
  streamMeta?: SandboxMessageMetadata;
  continuationSessionId?: string;
};

type StreamFailureParams = {
  threadId: string;
  sandboxRecordId: string;
  code: ChatErrorCode;
  message: string;
};

type UpdateRunParams = {
  runId: string;
  status?: AnRunStatus;
  agentId?: string | null;
  threadId?: string | null;
  totalCostUsd?: number | null;
  finishedAt?: Date | null;
  error?: AnRunError;
  meta?: AnRunMeta;
  onlyIfUnfinished?: boolean;
  expectedStatus?: AnRunStatus;
};

let pubsub: PubSubService;
const router = Router();

const streamAbortControllers = new Map<string, Set<AbortController>>();

function getDefaultRunMeta(): AnRunMeta {
  return {
    input_tokens: null,
    output_tokens: null,
    total_tokens: null,
    duration_ms: null,
    e2b_sandbox_id: null,
  };
}

function getTotalTokens(streamMeta?: Pick<SandboxMessageMetadata, 'totalTokens' | 'inputTokens' | 'outputTokens'>) {
  return streamMeta?.totalTokens
    ?? (streamMeta?.inputTokens !== undefined && streamMeta?.outputTokens !== undefined
      ? streamMeta.inputTokens + streamMeta.outputTokens
      : undefined);
}

function usesExternalBilling(model?: string): boolean {
  return !!model && !model.startsWith('claude-');
}

function registerAbortController(streamId: string, controller: AbortController) {
  const existing = streamAbortControllers.get(streamId);
  if (existing) {
    existing.add(controller);
    return;
  }
  streamAbortControllers.set(streamId, new Set([controller]));
}

function unregisterAbortController(streamId: string, controller: AbortController) {
  const existing = streamAbortControllers.get(streamId);
  if (!existing) return;
  existing.delete(controller);
  if (existing.size === 0) {
    streamAbortControllers.delete(streamId);
  }
}

function abortActiveStream(streamId: string, reason: string) {
  const controllers = streamAbortControllers.get(streamId);
  if (!controllers) return;
  for (const controller of controllers) {
    if (!controller.signal.aborted) {
      controller.abort(new Error(reason));
    }
  }
}

function toErrorResponse(err: unknown): {
  status: number;
  body: { error: { code: string; message: string; setup_url?: string } & Record<string, unknown> };
} {
  if (err instanceof ChatRuntimeError) {
    return {
      status: err.status,
      body: {
        error: {
          code: err.code,
          message: err.message,
          ...(err.setupUrl ? { setup_url: err.setupUrl } : {}),
          ...(err.details ?? {}),
        },
      },
    };
  }
  if (err instanceof ExternalUserIdentityError) {
    return {
      status: err.status,
      body: {
        error: {
          code: 'invalid_request',
          message: err.message,
        },
      },
    };
  }

  return {
    status: 500,
    body: {
      error: {
        code: 'internal_error',
        message: err instanceof Error ? err.message : 'Internal server error',
      },
    },
  };
}

function safeSlice(value: string, length: number): string {
  if (value.length <= length) return value;
  return `${value.slice(0, length - 1)}…`;
}

function getUserId(req: Request): string {
  const tokenClaims = (req as any).tokenClaims as Record<string, unknown> | undefined;
  return tokenClaims?.user_id as string ?? (req as any).apiKey?.user_id as string ?? 'anonymous';
}

function getEndUserId(req: Request): string | undefined {
  const tokenClaims = (req as any).tokenClaims as Record<string, unknown> | undefined;
  const endUserId = tokenClaims?.end_user_id;
  return typeof endUserId === 'string' && endUserId.length > 0 ? endUserId : undefined;
}

function enforceAgentScope(req: Request, slug: string) {
  const tokenClaims = (req as any).tokenClaims as Record<string, unknown> | undefined;
  if (!tokenClaims?.agents) return;

  const allowedAgents = tokenClaims.agents as string[];
  if (!allowedAgents.includes(slug)) {
    throw new ChatRuntimeError(
      'invalid_request',
      `Token is not authorized for agent "${slug}"`,
      403,
    );
  }
}

function isSessionExpiredStatus(status: number): boolean {
  return status === 400 || status === 404 || status === 409 || status === 410 || status === 422;
}

// ─── Agent request options (per-invocation overrides) ─────────────

const agentRequestOptionsSchema = z.object({
  model: z.string().min(1).optional(),
  systemPrompt: z.union([
    z.string(),
    z.object({
      type: z.literal('preset'),
      preset: z.literal('claude_code'),
      append: z.string().optional(),
    }),
  ]).optional(),
  maxTurns: z.number().int().positive().optional(),
  maxBudgetUsd: z.number().positive().optional(),
  maxSandboxBudgetUsd: z.number().min(0).optional(),
  permissionMode: z.enum(['default', 'acceptEdits', 'bypassPermissions', 'plan', 'dontAsk']).optional(),
  disallowedTools: z.array(z.string().min(1)).min(1).optional(),
}).strict();

type AgentRequestOptions = z.infer<typeof agentRequestOptionsSchema>;

function parseAgentOptions(raw: unknown): AgentRequestOptions | undefined {
  if (!raw || typeof raw !== 'object') return undefined;

  const parsed = agentRequestOptionsSchema.safeParse(raw);
  if (!parsed.success) return undefined;

  const result = parsed.data;

  return Object.keys(result).length > 0 ? result : undefined;
}

async function getAgentConfig(teamId: string, slug: string) {
  const agentConfig = await getAccessibleAgentConfig(teamId, slug);
  if (!agentConfig) {
    throw new ChatRuntimeError('agent_not_found', `Agent "${slug}" not found`, 404);
  }

  const [deployment] = agentConfig.active_deployment_id
    ? await db
      .select({ metadata: anDeployments.metadata })
      .from(anDeployments)
      .where(eq(anDeployments.id, agentConfig.active_deployment_id))
      .limit(1)
    : [];

  const deploymentMetadata = deployment?.metadata ?? null;

  return {
    ...agentConfig,
    template_id: getDeploymentTemplateId(deploymentMetadata),
    deployment_source: getDeploymentSource(deploymentMetadata),
    nocode_agent_config: getDeploymentAgentConfig(deploymentMetadata),
    max_sandbox_budget_usd: getDeploymentMaxSandboxBudgetUsd(deploymentMetadata),
    sandbox_config: normalizeDeploymentSandboxConfig(
      agentConfig.sandbox_config,
      deploymentMetadata,
    ),
    mcp_config_url: getDeploymentMcpConfigUrl(deploymentMetadata),
    declared_mcp_servers: getDeploymentMcpServers(deploymentMetadata),
    pinned_vault_ids: getDeploymentVaultIds(deploymentMetadata),
  };
}
// ─── Sandbox resolution ───────────────────────────────────────────

async function findSandbox(agentId: string, clientSandboxId: string) {
  const [sandbox] = await db
    .select()
    .from(anSandboxes)
    .where(
      and(
        eq(anSandboxes.agent_id, agentId),
        eq(anSandboxes.client_sandbox_id, clientSandboxId),
      ),
    )
    .limit(1);

  return sandbox;
}

async function findAccessibleSandbox(params: {
  agentId: string;
  clientSandboxId: string;
  teamId: string;
  ownerTeamId: string;
}) {
  const { agentId, clientSandboxId, teamId, ownerTeamId } = params;

  if (teamId === ownerTeamId) {
    return findSandbox(agentId, clientSandboxId);
  }

  const [sandbox] = await db
    .select()
    .from(anSandboxes)
    .where(
      and(
        eq(anSandboxes.agent_id, agentId),
        eq(anSandboxes.client_sandbox_id, clientSandboxId),
        eq(anSandboxes.invocation_team_id, teamId),
      ),
    )
    .limit(1);

  return sandbox;
}

async function resolveSandbox(params: {
  agentId: string;
  clientSandboxId: string;
  userId: string;
  teamId: string;
  ownerTeamId: string;
  meta?: Record<string, unknown> | null;
  runtime: string;
  deploymentId?: string | null;
  bundleUrl?: string | null;
  mcpConfigUrl?: string | null;
  envVars?: Record<string, string> | null;
  sandboxConfig: ResolvedSandboxConfig;
  nocodeAgentConfig?: Record<string, unknown> | null;
  vaultIds?: string[];
}) {
  const { agentId, clientSandboxId, userId, teamId, ownerTeamId, meta, runtime, deploymentId, bundleUrl, mcpConfigUrl, envVars, sandboxConfig, nocodeAgentConfig, vaultIds } = params;
  const existing = await findAccessibleSandbox({
    agentId,
    clientSandboxId,
    teamId,
    ownerTeamId,
  });
  if (existing) {
    // Update deployment_id if the active deployment changed since sandbox was created.
    // Also backfill sandbox meta once for new shared-agent attribution.
    if ((deploymentId && existing.deployment_id !== deploymentId) || (!existing.meta && meta)) {
      await db
        .update(anSandboxes)
        .set({
          ...(deploymentId && existing.deployment_id !== deploymentId ? { deployment_id: deploymentId } : {}),
          ...(!existing.meta && meta ? { meta } : {}),
          updated_at: new Date(),
        })
        .where(eq(anSandboxes.id, existing.id));
      if (deploymentId && existing.deployment_id !== deploymentId) {
        existing.deployment_id = deploymentId;
      }
      if (!existing.meta && meta) {
        existing.meta = meta;
      }
    }
    return { sandbox: existing, isNew: false };
  }

  let createdSandboxId: string | undefined;
  let createdProvider: ResolvedSandboxConfig['provider'] | undefined;
  try {
    const createdHandle = await createProvisionedSandbox({
      runtime,
      userId,
      sandboxConfig,
      bundleUrl,
      mcpConfigUrl,
      envVars,
      clientSandboxId,
      teamId,
      nocodeAgentConfig,
      vaultIds,
    });
    createdSandboxId = createdHandle.sandboxId;
    createdProvider = createdHandle.provider;
    const now = new Date();

    const [sandbox] = await db
      .insert(anSandboxes)
      .values({
        agent_id: agentId,
        deployment_id: deploymentId ?? null,
        client_sandbox_id: clientSandboxId,
        sandbox_id: createdSandboxId,
        provider: createdProvider,
        status: 'active',
        error: null,
        meta: meta ?? null,
        invocation_team_id: teamId,
        created_at: now,
        updated_at: now,
      })
      .returning();

    await createdHandle.close().catch(() => {});

    return { sandbox, isNew: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const duplicate = message.includes('duplicate key value') || message.includes('an_sandboxes_agent_client_sandbox_key');
    if (duplicate) {
      if (createdSandboxId && createdProvider) {
        destroySandbox(createdProvider, createdSandboxId).catch(() => {});
      }
      const concurrent = await findAccessibleSandbox({
        agentId,
        clientSandboxId,
        teamId,
        ownerTeamId,
      });
      if (concurrent) {
        return { sandbox: concurrent, isNew: false };
      }
      const existingSandbox = await findSandbox(agentId, clientSandboxId);
      if (existingSandbox) {
        throw new ChatRuntimeError('sandbox_not_found', `Sandbox "${clientSandboxId}" not found`, 404);
      }
      // Concurrent row was deleted between conflict and retry — surface a clear error
      throw new Error('Sandbox creation conflict: concurrent sandbox was created and deleted. Please retry.');
    }
    throw err;
  }
}

async function connectSandbox(sandboxRecord: {
  id: string;
  sandbox_id: string | null;
  provider?: string | null;
}): Promise<SandboxHandle> {
  if (!sandboxRecord.sandbox_id) {
    throw new ChatRuntimeError('sandbox_unavailable', 'Sandbox has no sandbox_id', 409);
  }

  try {
    return await connectToSandbox(
      (sandboxRecord.provider as ResolvedSandboxConfig['provider'] | null) ?? 'e2b',
      sandboxRecord.sandbox_id,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new ChatRuntimeError(
      'sandbox_unavailable',
      `Failed to connect sandbox ${sandboxRecord.sandbox_id}: ${message}`,
      isOpenSandboxNotFoundError(err) ? 404 : 503,
    );
  }
}

// ─── Thread resolution ────────────────────────────────────────────

function dedupePreservingOrder(values: string[]) {
  const seen = new Set<string>();
  const deduped: string[] = [];
  for (const value of values) {
    if (seen.has(value)) continue;
    seen.add(value);
    deduped.push(value);
  }
  return deduped;
}

function getEffectiveVaultIds(thread: {
  vaultId?: string | null;
  vaultIds?: string[] | null;
}) {
  if (Array.isArray(thread.vaultIds) && thread.vaultIds.length > 0) {
    return dedupePreservingOrder(thread.vaultIds);
  }
  return thread.vaultId ? [thread.vaultId] : [];
}

function vaultIdsEqual(left: string[], right: string[]) {
  if (left.length !== right.length) return false;
  return left.every((value, index) => value === right[index]);
}

async function setThreadVaultIds(threadId: string, vaultIds: string[]) {
  await db
    .update(anThreads)
    .set({
      vault_id: vaultIds[0] ?? null,
      vault_ids: vaultIds,
      updated_at: new Date(),
    })
    .where(eq(anThreads.id, threadId));
}

async function createThread(
  sandboxRecordId: string,
  name: string | null,
  mode: string | null,
  deploymentId?: string | null,
  vaultIds: string[] = [],
) {
  const now = new Date();
  const [thread] = await db
    .insert(anThreads)
    .values({
      sandbox_id: sandboxRecordId,
      deployment_id: deploymentId ?? null,
      vault_id: vaultIds[0] ?? null,
      vault_ids: vaultIds,
      name,
      mode: mode || 'chat',
      status: 'streaming',
      created_at: now,
      updated_at: now,
    })
    .returning({ id: anThreads.id });

  return thread;
}

async function getThread(threadId: string, sandboxRecordId: string) {
  const [thread] = await db
    .select({
      id: anThreads.id,
      claudeSessionId: anThreads.claude_session_id,
      messages: anThreads.messages,
      vaultId: anThreads.vault_id,
      vaultIds: anThreads.vault_ids,
    })
    .from(anThreads)
    .where(
      and(
        eq(anThreads.id, threadId),
        eq(anThreads.sandbox_id, sandboxRecordId),
      ),
    )
    .limit(1);

  return thread;
}

async function getLatestThread(sandboxRecordId: string) {
  const [thread] = await db
    .select({
      id: anThreads.id,
      claudeSessionId: anThreads.claude_session_id,
      messages: anThreads.messages,
      vaultId: anThreads.vault_id,
      vaultIds: anThreads.vault_ids,
    })
    .from(anThreads)
    .where(eq(anThreads.sandbox_id, sandboxRecordId))
    .orderBy(desc(anThreads.created_at))
    .limit(1);

  return thread;
}

function getStoredMessages(messages: unknown): AgentMessage[] {
  return Array.isArray(messages) ? messages as AgentMessage[] : [];
}

async function activateThread(threadId: string) {
  await db
    .update(anThreads)
    .set({
      status: 'streaming',
      stream_id: null,
      error: null,
      updated_at: new Date(),
    })
    .where(eq(anThreads.id, threadId));
}

async function resolveThread(params: {
  sandboxRecordId: string;
  threadId?: string;
  name: string | null;
  mode: string | null;
  deploymentId?: string | null;
  requestedVaultIds?: string[];
}): Promise<{
  id: string;
  claudeSessionId: string | null;
  messages: AgentMessage[];
  vaultIds: string[];
}> {
  const { sandboxRecordId, threadId, name, mode, deploymentId, requestedVaultIds } = params;

  if (threadId) {
    const existing = await getThread(threadId, sandboxRecordId);
    if (!existing) {
      throw new ChatRuntimeError('thread_not_found', `Thread "${threadId}" not found in this sandbox`, 404);
    }

    const storedVaultIds = getEffectiveVaultIds(existing);
    const resolvedVaultIds = requestedVaultIds ?? storedVaultIds;
    if (!vaultIdsEqual(resolvedVaultIds, storedVaultIds)) {
      await setThreadVaultIds(existing.id, resolvedVaultIds);
    }

    await activateThread(existing.id);
    return {
      ...existing,
      vaultIds: resolvedVaultIds,
      messages: getStoredMessages(existing.messages),
    };
  }

  const latest = await getLatestThread(sandboxRecordId);
  if (latest) {
    const storedVaultIds = getEffectiveVaultIds(latest);
    const resolvedVaultIds = requestedVaultIds ?? storedVaultIds;
    if (!vaultIdsEqual(resolvedVaultIds, storedVaultIds)) {
      await setThreadVaultIds(latest.id, resolvedVaultIds);
    }

    await activateThread(latest.id);
    return {
      ...latest,
      vaultIds: resolvedVaultIds,
      messages: getStoredMessages(latest.messages),
    };
  }

  // No threadId and no existing threads — create a new thread
  const initialVaultIds = requestedVaultIds ?? [];
  const thread = await createThread(sandboxRecordId, name, mode, deploymentId, initialVaultIds);
  return { id: thread.id, claudeSessionId: null, messages: [], vaultIds: initialVaultIds };
}

// ─── Thread/Sandbox status updates ───────────────────────────────

async function setThreadStreamId(threadId: string, streamId: string) {
  await db
    .update(anThreads)
    .set({ stream_id: streamId, updated_at: new Date() })
    .where(eq(anThreads.id, threadId));
}

async function markSandboxActive(sandboxRecordId: string) {
  await db
    .update(anSandboxes)
    .set({ status: 'active', error: null, updated_at: new Date() })
    .where(eq(anSandboxes.id, sandboxRecordId));
}

async function markSandboxError(sandboxRecordId: string, error: string) {
  await db
    .update(anSandboxes)
    .set({ status: 'error', error, updated_at: new Date() })
    .where(eq(anSandboxes.id, sandboxRecordId));
}

async function markThreadCompleted(params: StreamCompletionParams) {
  const { threadId, sandboxRecordId, messages, streamMeta, continuationSessionId } = params;
  const now = new Date();
  const totalTokens = getTotalTokens(streamMeta);

  const [updated] = await db
    .update(anThreads)
    .set({
      messages,
      stream_id: null,
      claude_session_id: streamMeta?.sessionId ?? continuationSessionId ?? null,
      status: 'completed',
      input_tokens: streamMeta?.inputTokens,
      output_tokens: streamMeta?.outputTokens,
      total_tokens: totalTokens,
      total_cost_usd: streamMeta?.totalCostUsd,
      duration_ms: streamMeta?.durationMs,
      error: null,
      updated_at: now,
      completed_at: now,
    })
    .where(and(eq(anThreads.id, threadId), eq(anThreads.status, 'streaming')))
    .returning({ id: anThreads.id });

  if (updated) {
    await markSandboxActive(sandboxRecordId);
    return true;
  }

  return false;
}

async function markThreadFailed(params: StreamFailureParams) {
  const { threadId, sandboxRecordId, code, message } = params;
  const now = new Date();
  const [updated] = await db
    .update(anThreads)
    .set({
      status: 'error',
      stream_id: null,
      error: `${code}: ${message}`,
      updated_at: now,
      completed_at: now,
    })
    .where(and(eq(anThreads.id, threadId), eq(anThreads.status, 'streaming')))
    .returning({ id: anThreads.id });

  if (updated) {
    await markSandboxError(sandboxRecordId, `${code}: ${message}`);
  }
}

async function markThreadCancelled(threadId: string, sandboxRecordId: string) {
  const now = new Date();
  await db
    .update(anThreads)
    .set({
      status: 'cancelled',
      stream_id: null,
      error: 'cancelled: cancelled by user',
      updated_at: now,
      completed_at: now,
    })
    .where(and(eq(anThreads.id, threadId), eq(anThreads.status, 'streaming')));

  await markSandboxActive(sandboxRecordId);
}

async function createRun(params: {
  teamId: string;
  userId: string;
  endUserId?: string;
  meta: AnRunMeta;
}) {
  const [run] = await db
    .insert(anRuns)
    .values({
      status: 'received',
      team_id: params.teamId,
      user_id: params.userId,
      end_user_id: params.endUserId ?? null,
      agent_id: null,
      thread_id: null,
      total_cost_usd: null,
      error: null,
      meta: params.meta,
    })
    .returning({ id: anRuns.id });

  if (!run) {
    throw new Error('Failed to create an_runs row');
  }

  return run.id;
}

async function updateRun(params: UpdateRunParams) {
  const values: Partial<typeof anRuns.$inferInsert> = {};

  if ('status' in params) values.status = params.status;
  if ('agentId' in params) values.agent_id = params.agentId ?? null;
  if ('threadId' in params) values.thread_id = params.threadId ?? null;
  if ('totalCostUsd' in params) values.total_cost_usd = params.totalCostUsd ?? null;
  if ('finishedAt' in params) values.finished_at = params.finishedAt ?? null;
  if ('error' in params) values.error = params.error ?? null;
  if ('meta' in params) values.meta = params.meta ?? null;

  if (Object.keys(values).length === 0) {
    return false;
  }

  const conditions = [eq(anRuns.id, params.runId)];
  if (params.onlyIfUnfinished) {
    conditions.push(isNull(anRuns.finished_at));
  }
  if (params.expectedStatus) {
    conditions.push(eq(anRuns.status, params.expectedStatus));
  }

  const [updated] = await db
    .update(anRuns)
    .set(values)
    .where(and(...conditions))
    .returning({ id: anRuns.id });

  return !!updated;
}

async function findLatestOpenRunByThreadId(threadId: string) {
  const [run] = await db
    .select({ id: anRuns.id, meta: anRuns.meta })
    .from(anRuns)
    .where(and(eq(anRuns.thread_id, threadId), isNull(anRuns.finished_at)))
    .orderBy(desc(anRuns.created_at))
    .limit(1);

  return run;
}

// ─── Message extraction ──────────────────────────────────────────

async function getBase64Image(url: string): Promise<string> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer).toString('base64');
}

async function extractLastUserTurn(messages: AgentMessage[]): Promise<{
  text: string;
  images: ConvertedImage[];
  inferredName: string;
  message: AgentMessage;
}> {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  if (!lastUser) {
    throw new ChatRuntimeError('invalid_request', 'No user message found', 400);
  }

  const text = lastUser.parts
    .filter((part: any) => part.type === 'text')
    .map((part: any) => part.text)
    .join('\n')
    .trim();

  if (!text) {
    throw new ChatRuntimeError('invalid_request', 'User message must contain text', 400);
  }

  const images: ConvertedImage[] = [];
  for (const part of lastUser.parts) {
    if ((part as any)?.type !== 'data-image') continue;
    const data = (part as any).data as { url?: string; mediaType?: string; filename?: string };
    if (!data?.url || !data?.mediaType) continue;

    try {
      const base64 = await getBase64Image(data.url);
      images.push({ base64, mediaType: data.mediaType, filename: data.filename });
    } catch (err) {
      console.error('[CHAT] Failed to load image for sandbox payload:', err);
    }
  }

  return {
    text,
    images,
    inferredName: safeSlice(text.replace(/\s+/g, ' '), 80),
    message: lastUser,
  };
}

// ─── Sandbox communication ───────────────────────────────────────

async function postToSandbox(params: {
  transport: RuntimeTransport;
  message: string;
  images: ConvertedImage[];
  continuationSessionId?: string;
  options?: AgentRequestOptions;
  threadId?: string;
}) {
  const { transport, message, images, continuationSessionId, options, threadId } = params;
  const sandboxUrl = transport.baseUrl;

  // All runtimes (claude-code, codex, future ACP runtimes) use the unified
  // /sessions endpoint. The sandbox picks the right ACP binary at request
  // time based on config.runtime, and the relay picks the right transformer
  // based on the streamId prefix ("acp:") returned by the sandbox.
  const endpoint = continuationSessionId
    ? `${sandboxUrl}/sessions/${continuationSessionId}/messages`
    : `${sandboxUrl}/sessions`;
  // Legacy template fallback: pre-ACP templates exposed /api/cc/sessions.
  const fallbackEndpoint = continuationSessionId
    ? `${sandboxUrl}/api/cc/sessions/${continuationSessionId}/messages`
    : `${sandboxUrl}/api/cc/sessions`;

  let response;
  try {
    const postBody = {
      message,
      ...(images.length > 0 ? { images } : {}),
      ...(options ? { options } : {}),
      ...(threadId ? { threadId } : {}),
    };
    const headers = {
      'Content-Type': 'application/json',
      ...(transport.headers ?? {}),
    };

    response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(postBody),
    });

    // New AN runtime templates expose /sessions directly.
    // Fallback to legacy /api/cc/sessions for backward compatibility.
    if (!response.ok && response.status === 404) {
      response = await fetch(fallbackEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(postBody),
      });
    }
  } catch (err) {
    throw new ChatRuntimeError(
      'sandbox_unavailable',
      err instanceof Error ? err.message : 'Failed to reach sandbox endpoint',
      503,
    );
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'unknown sandbox error');
    if (continuationSessionId && isSessionExpiredStatus(response.status)) {
      throw new ChatRuntimeError(
        'session_expired',
        `Continuation session ${continuationSessionId} is not available in sandbox`,
        409,
      );
    }
    if (response.status >= 500) {
      throw new ChatRuntimeError('sandbox_unavailable', `Sandbox returned ${response.status}: ${errorText}`, 503);
    }
    throw new ChatRuntimeError('sandbox_error', `Sandbox returned ${response.status}: ${errorText}`, 502);
  }

  const payload = await response.json() as { streamId?: string };
  if (!payload.streamId) {
    throw new ChatRuntimeError('sandbox_error', 'Sandbox response is missing streamId', 502);
  }

  return payload.streamId;
}

// ─── SSE streaming ───────────────────────────────────────────────

async function pipeSseToResponse(
  req: Request,
  res: Response,
  sseStream: ReadableStream<string | Uint8Array>,
) {
  res.writeHead(200, RESPONSE_STREAM_HEADERS);
  let clientClosed = false;
  req.on('close', () => { clientClosed = true; });

  const reader = sseStream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!clientClosed && !res.destroyed && !res.writableEnded) {
        res.write(value);
      }
    }
  } finally {
    reader.releaseLock();
    if (!res.writableEnded && !res.destroyed) {
      res.end();
    }
  }
}

async function postToSandboxWithRetry(params: {
  sandboxHandle: SandboxHandle;
  message: string;
  images: ConvertedImage[];
  continuationSessionId?: string;
  options?: AgentRequestOptions;
  threadId?: string;
  enableRetry: boolean;
}): Promise<string> {
  const {
    sandboxHandle,
    message,
    images,
    continuationSessionId,
    options,
    threadId,
    enableRetry,
  } = params;

  const maxAttempts = enableRetry ? 6 : 1;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const transport = await sandboxHandle.getRuntimeTransport(3003);

    try {
      return await postToSandbox({
        transport,
        message,
        images,
        continuationSessionId,
        options,
        threadId,
      });
    } catch (err) {
      const shouldRetry =
        enableRetry
        && err instanceof ChatRuntimeError
        && err.code === 'sandbox_unavailable'
        && attempt < maxAttempts;

      if (!shouldRetry) {
        throw err;
      }

      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }

  throw new ChatRuntimeError('sandbox_unavailable', 'Failed to reach sandbox endpoint', 503);
}

async function streamThreadToResponse(params: {
  req: Request;
  res: Response;
  tag: string;
  teamId: string;
  endUserId?: string;
  runtime: string;
  streamId: string;
  threadId: string;
  sandboxRecordId: string;
  clientSandboxId?: string;
  e2bSandboxId?: string | null;
  sandboxMeta?: unknown;
  continuationSessionId?: string;
  existingMessages?: AgentMessage[];
  lastUserMessage?: AgentMessage;
  background?: boolean;
  runId?: string;
  runMeta?: AnRunMeta;
}) {
  const {
    req, res, tag, teamId, endUserId, runtime, streamId,
    threadId, sandboxRecordId,
    clientSandboxId, e2bSandboxId, sandboxMeta,
    continuationSessionId, existingMessages, lastUserMessage, background, runId, runMeta,
  } = params;

  const abortController = new AbortController();
  registerAbortController(streamId, abortController);

  let terminalErrorText: string | undefined;
  let streamMeta: SandboxMessageMetadata | undefined;
  let redisCleanup: (() => void) | undefined;

  // Span buffer for tracing data
  const spanBuffer: Map<string, any> = new Map();

  const handleSpanMessage = (msg: any) => {
    if (msg.type !== 'span') return;
    const { event, span } = msg;
    if (event === 'start') {
      spanBuffer.set(span.spanId, { ...span, threadId });
    } else if (event === 'end') {
      const existing = spanBuffer.get(span.spanId);
      if (existing) {
        Object.assign(existing, span);
      } else {
        spanBuffer.set(span.spanId, { ...span, threadId });
      }
    }
  };

  const flushSpans = async (errorStatus?: boolean) => {
    if (spanBuffer.size === 0) return;
    const spans = Array.from(spanBuffer.values()).map((s: any) => {
      if (errorStatus && !s.endTime) {
        s.status = 'error';
        s.error = s.error || 'Thread ended before span completed';
        s.endTime = Date.now();
        s.durationMs = s.endTime - s.startTime;
      }
      return s;
    });
    try {
      await db.insert(anSpans).values(spans.map((s: any) => ({
        thread_id: threadId,
        span_id: s.spanId,
        parent_span_id: s.parentSpanId || null,
        trace_id: s.traceId,
        name: s.name,
        kind: s.kind,
        start_time: BigInt(s.startTime),
        end_time: s.endTime ? BigInt(s.endTime) : null,
        duration_ms: s.durationMs ?? null,
        status: s.status,
        error: s.error || null,
        input: s.attributes?.['tool.input'] ? { raw: s.attributes['tool.input'] } : null,
        output: s.attributes?.['tool.output'] ? { raw: s.attributes['tool.output'] } : null,
        attributes: s.attributes || null,
      })));
    } catch (err) {
      console.error(`${tag} Failed to flush spans:`, err);
    }
    spanBuffer.clear();
  };

  const onFinish = async (streamMessages: AgentMessage[]) => {
    if (abortController.signal.aborted) return;
    if (terminalErrorText) {
      await new Promise(resolve => setTimeout(resolve, 500));
      await flushSpans(true);
      await markThreadFailed({ threadId, sandboxRecordId, code: 'sandbox_error', message: terminalErrorText });
      if (runId && runMeta) {
        await updateRun({
          runId,
          status: 'failed',
          finishedAt: new Date(),
          error: { code: 'sandbox_error', message: terminalErrorText },
          meta: runMeta,
          onlyIfUnfinished: true,
          expectedStatus: 'streaming',
        });
      }
      return;
    }

    const responseMessage = streamMessages[streamMessages.length - 1];
    const mergedMessages = lastUserMessage
      ? [
        ...(existingMessages ?? []),
        lastUserMessage,
        ...(responseMessage ? [responseMessage] : streamMessages),
      ]
      : streamMessages;

    const completed = await markThreadCompleted({
      threadId,
      sandboxRecordId,
      messages: mergedMessages,
      streamMeta,
      continuationSessionId,
    });
    if (!completed) return;

    if (runId && runMeta) {
      runMeta.input_tokens = streamMeta?.inputTokens ?? null;
      runMeta.output_tokens = streamMeta?.outputTokens ?? null;
      runMeta.total_tokens = getTotalTokens(streamMeta) ?? null;
      runMeta.duration_ms = streamMeta?.durationMs ?? null;

      await updateRun({
        runId,
        status: 'completed',
        finishedAt: new Date(),
        totalCostUsd: streamMeta?.totalCostUsd ?? null,
        error: null,
        meta: runMeta,
        onlyIfUnfinished: true,
        expectedStatus: 'streaming',
      });
    }

    // Brief delay to allow in-flight span publishes (root span end, LLM spans)
    // to arrive before flushing to DB
    await new Promise(resolve => setTimeout(resolve, 1500));
    await flushSpans(false);

    const externallyBilled = streamMeta?.models?.some((model) => usesExternalBilling(model)) ?? false;
    if (externallyBilled) {
      console.log(`${tag} Skipping relay billing for externally billed stream ${streamId}`);
      return;
    }

    void sendThreadUsageToBilling({
      teamId,
      endUserId,
      threadId,
      streamId,
      sandboxId: e2bSandboxId ?? undefined,
      clientSandboxId,
      sandboxMeta,
      totalCostUsd: streamMeta?.totalCostUsd,
      inputTokens: streamMeta?.inputTokens,
      outputTokens: streamMeta?.outputTokens,
      durationMs: streamMeta?.durationMs,
      runtime,
    }).catch((err) => {
      console.error(`${tag} Failed to send usage to billing`, err);
    });
  };

  let uiStream: ReadableStream<string | Uint8Array>;

  {
    const generateId = () => crypto.randomUUID();
    // Select transformer based on the streamId prefix. Sandboxes on the new
    // ACP-capable template generate streamIds as `acp:${sandboxId}-${uuid}`;
    // legacy sandboxes use the bare `${sandboxId}-${uuid}` format. The prefix
    // is the single source of truth — it survives relay restarts, works on
    // resume (streamId is persisted on an_threads.stream_id), and needs no
    // extra columns, env vars, or lookups.
    //
    // RELAY_FORCE_TRANSFORMER env var is kept as an ops escape hatch:
    //   - "acp" forces the ACP transformer regardless of prefix
    //   - "sdk" forces the SDK transformer regardless of prefix
    const forceTransformer = process.env.RELAY_FORCE_TRANSFORMER;
    const streamIdWantsAcp = streamId.startsWith('acp:');
    const useAcpTransformer =
      forceTransformer === 'acp' ||
      (forceTransformer !== 'sdk' && streamIdWantsAcp);
    console.log(
      `${tag} transformer=${useAcpTransformer ? 'acp' : 'sdk'} streamId=${streamId}${forceTransformer ? ` force=${forceTransformer}` : ''}`,
    );
    const transformer = useAcpTransformer
      ? createAcpStreamTransformer(generateId, {
          // Route ACP-path spans through the same handler as SDK-path spans so
          // they end up in the anSpans DB table with the same shape.
          onSpan: (msg) => handleSpanMessage(msg),
          traceId: threadId,
        })
      : createStreamTransformer(generateId);
    const transformerWriter = transformer.writable.getWriter();
    const encoder = new TextEncoder();

    // Reorder buffer for batched messages
    let expectedSeq = 0;
    const pendingBatches = new Map<number, any[]>();
    let gapTimer: ReturnType<typeof setTimeout> | null = null;

    const writeMessage = (msg: any) => {
      // Intercept span messages — don't forward to stream transformer
      if (msg.type === 'span') {
        handleSpanMessage(msg);
        return;
      }
      if (msg.type === 'error') {
        terminalErrorText = msg.error || msg.message || 'Claude stream error';
      }
      const line = `data: ${JSON.stringify(msg)}\n\n`;
      transformerWriter.write(encoder.encode(line)).catch(() => {});
      // Terminal detection:
      //  - SDK path: {type:'done'|'result'|'error'}
      //  - ACP path: JSON-RPC response with id + result.stopReason (fallback if bridge
      //    forgets the {type:'done'} envelope)
      const isAcpTerminal =
        useAcpTransformer &&
        msg.jsonrpc === '2.0' &&
        msg.id !== undefined &&
        (msg.result?.stopReason !== undefined || msg.error !== undefined);
      if (msg.type === 'done' || msg.type === 'result' || msg.type === 'error' || isAcpTerminal) {
        if (gapTimer) { clearTimeout(gapTimer); gapTimer = null; }
        setTimeout(() => { transformerWriter.close().catch(() => {}); }, 200);
      }
    };

    const drainBatches = () => {
      while (pendingBatches.has(expectedSeq)) {
        const messages = pendingBatches.get(expectedSeq)!;
        pendingBatches.delete(expectedSeq);
        expectedSeq++;
        for (const msg of messages) writeMessage(msg);
      }
      // Reset gap timer if there are still pending out-of-order batches
      if (gapTimer) { clearTimeout(gapTimer); gapTimer = null; }
      if (pendingBatches.size > 0) {
        gapTimer = setTimeout(() => {
          // Skip missing seq and drain what we have
          const nextAvailable = Math.min(...pendingBatches.keys());
          console.log(`${tag} Batch gap timeout: skipping seq ${expectedSeq} to ${nextAvailable}`);
          expectedSeq = nextAvailable;
          drainBatches();
        }, 5_000);
      }
    };

    redisCleanup = pubsub.subscribe(`session:${streamId}`, (message: any) => {
      if (abortController.signal.aborted) return;
      if (message.type === 'batch') {
        pendingBatches.set(message.seq, message.messages);
        drainBatches();
      } else {
        // Backward compat: non-batch messages pass through directly
        writeMessage(message);
      }
    });

    abortController.signal.addEventListener('abort', () => { transformerWriter.close().catch(() => {}); });

    uiStream = createUIMessageStream<AgentMessage>({
      execute: async ({ writer }) => {
        writer.write({ type: 'start' });
        let lastTextId: string | undefined;
        const seenToolCalls = new Set<string>();
        const parseToolInput = (input: unknown) => {
          if (typeof input !== 'string') return input;
          const trimmed = input.trim();
          if (!trimmed) return input;
          try {
            return JSON.parse(trimmed);
          } catch {
            return input;
          }
        };
        const reader = transformer.readable.getReader();

        try {
          while (true) {
            const { done, value: part } = await reader.read();
            if (done) break;
            if (abortController.signal.aborted) break;

            if (part.type === 'tool-call') {
              seenToolCalls.add(part.toolCallId);
              writer.write({
                type: 'tool-input-available',
                toolCallId: part.toolCallId,
                toolName: part.toolName,
                input: parseToolInput(part.input),
              });
            } else if (part.type === 'tool-result') {
              if (seenToolCalls.has(part.toolCallId)) {
                writer.write({ type: 'tool-output-available', toolCallId: part.toolCallId, output: part.result });
              }
            } else if (part.type === 'text-delta') {
              writer.write({ type: 'text-delta', id: part.id!, delta: part.delta });
            } else if (part.type === 'text-start') {
              writer.write({ type: 'text-start', id: part.id! });
            } else if (part.type === 'text-end') {
              lastTextId = part.id!;
              writer.write({ type: 'text-end', id: part.id! });
            } else if (part.type === 'tool-input-start') {
              seenToolCalls.add(part.id);
              writer.write({ type: 'tool-input-start', toolCallId: part.id, toolName: part.toolName });
            } else if (part.type === 'tool-input-delta') {
              writer.write({ type: 'tool-input-delta', toolCallId: part.id, inputTextDelta: part.delta });
            } else if (part.type === 'finish') {
              const sandboxMeta = part.providerMetadata?.sandbox as SandboxMessageMetadata | undefined;
              streamMeta = sandboxMeta;
              writer.write({
                type: 'message-metadata',
                messageMetadata: {
                  sessionId: sandboxMeta?.sessionId,
                  totalCostUsd: sandboxMeta?.totalCostUsd,
                  inputTokens: sandboxMeta?.inputTokens,
                  outputTokens: sandboxMeta?.outputTokens,
                  totalTokens: sandboxMeta?.totalTokens,
                  durationMs: sandboxMeta?.durationMs,
                  resultSubtype: sandboxMeta?.resultSubtype,
                  finalTextId: lastTextId,
                },
              });
              writer.write({ type: 'finish' });
            } else if (part.type === 'error') {
              terminalErrorText = part.error instanceof Error ? part.error.message : String(part.error);
              writer.write({ type: 'error', errorText: terminalErrorText });
            }
          }
        } finally {
          reader.releaseLock();
        }
      },
      onFinish: async ({ messages }) => {
        console.log(`${tag} Claude onFinish, messages=${messages.length}`);
        await onFinish(messages as AgentMessage[]);
      },
    }).pipeThrough(new JsonToSseTransformStream());
  }

  try {
    if (background) {
      // Background mode: drain the stream silently (triggers onFinish)
      const reader = uiStream.getReader();
      while (true) {
        const { done } = await reader.read();
        if (done) break;
      }
      reader.releaseLock();
    } else {
      await pipeSseToResponse(req, res, uiStream);
    }
  } finally {
    redisCleanup?.();
    unregisterAbortController(streamId, abortController);
  }
}

async function getActiveStreamingThread(sandboxRecordId: string) {
  const [thread] = await db
    .select({
      id: anThreads.id,
      streamId: anThreads.stream_id,
      claudeSessionId: anThreads.claude_session_id,
    })
    .from(anThreads)
    .where(
      and(
        eq(anThreads.sandbox_id, sandboxRecordId),
        eq(anThreads.status, 'streaming'),
        isNotNull(anThreads.stream_id),
      ),
    )
    .orderBy(desc(anThreads.created_at))
    .limit(1);

  return thread;
}

export function initChatRouter(pubsubInstance: PubSubService): Router {
  pubsub = pubsubInstance;
  return router;
}

// ─── POST /:slug — send message ──────────────────────────────────

router.post('/:slug', async (req: Request, res: Response) => {
  const { slug } = req.params as { slug: string };
  const teamId = (req as any).teamId as string;
  const userId = getUserId(req);
  const tokenEndUserId = getEndUserId(req);
  const tag = `[CHAT][${teamId}/${slug}]`;

  let runId: string | undefined;
  let threadId: string | undefined;
  let sandboxRecordId: string | undefined;
  const runMeta = getDefaultRunMeta();

  try {
    const {
      messages,
      sandboxId: clientSandboxId,
      threadId: requestThreadId,
      name,
      mode,
      options: rawOptions,
      vaultIds: requestedVaultIds,
      externalUserId,
    } = req.body as {
      messages?: AgentMessage[];
      sandboxId?: string;
      threadId?: string;
      name?: string;
      mode?: string;
      options?: unknown;
      vaultIds?: string[];
      externalUserId?: string;
    };

    const effectiveExternalUserId = resolveTrustedExternalUserId({
      tokenEndUserId,
      bodyExternalUserId: externalUserId,
    }) ?? undefined;

    const currentRunId = await createRun({
      teamId,
      userId,
      endUserId: effectiveExternalUserId,
      meta: runMeta,
    });
    runId = currentRunId;

    enforceAgentScope(req, slug);

    const agentOptions = parseAgentOptions(rawOptions);
    const { maxSandboxBudgetUsd: requestMaxSandboxBudgetUsd, ...runtimeAgentOptions } = agentOptions ?? {};

    if (
      requestMaxSandboxBudgetUsd !== undefined
      && !(
        (req as any).apiKey
        && req.headers.authorization?.startsWith('Bearer an_sk_')
      )
    ) {
      throw new ChatRuntimeError(
        'invalid_request',
        'maxSandboxBudgetUsd can only be set from an an_sk_ secret key request',
        400,
      );
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      throw new ChatRuntimeError('invalid_request', 'messages is required and must not be empty', 400);
    }

    if (!clientSandboxId) {
      throw new ChatRuntimeError('invalid_request', 'sandboxId is required', 400);
    }

    const t0 = Date.now();

    const agentConfig = await getAgentConfig(teamId, slug);

    const billingReadiness = await ensureTeamBillingReady(agentConfig.team_id);
    if (!billingReadiness.ready) {
      const blockerSuffix = billingReadiness.blocker
        ? ` (${billingReadiness.blocker})`
        : '';
      throw new ChatRuntimeError(
        'billing_not_ready',
        `Billing setup is required${blockerSuffix}`,
        402,
        billingReadiness.setupUrl,
      );
    }

    const t1 = Date.now();

    await updateRun({ runId: currentRunId, agentId: agentConfig.id, onlyIfUnfinished: true });
    const maxSandboxBudgetUsd = requestMaxSandboxBudgetUsd ?? agentConfig.max_sandbox_budget_usd;
    if (maxSandboxBudgetUsd !== null && maxSandboxBudgetUsd !== undefined) {
      const spentUsd = await getCompletedRunSpendUsd({
        type: 'sandbox',
        agentId: agentConfig.id,
        clientSandboxId,
      });

      if (isBudgetExceeded({ spentUsd, limitUsd: maxSandboxBudgetUsd })) {
        throw new ChatRuntimeError(
          'budget_exceeded',
          `Sandbox budget exceeded for "${clientSandboxId}"`,
          402,
          undefined,
          {
            scope: 'sandbox',
            sandboxId: clientSandboxId,
            spentUsd,
            limitUsd: maxSandboxBudgetUsd,
          },
        );
      }
    }

    const runtime = agentConfig.runtime || 'claude-code';
    const sandboxMeta = buildSandboxMeta({
      invocationTeamId: teamId,
      invocationUserId: userId,
      ownerTeamId: agentConfig.team_id,
    });

    // Preflight: reject unsupported runtimes early with a clear error instead
    // of failing at sandbox spawn or transformer selection time.
    const SUPPORTED_RUNTIMES = ['claude-code', 'codex'] as const;
    if (!SUPPORTED_RUNTIMES.includes(runtime as typeof SUPPORTED_RUNTIMES[number])) {
      throw new ChatRuntimeError(
        'invalid_request',
        `Unsupported runtime "${runtime}" on agent "${slug}". Supported: ${SUPPORTED_RUNTIMES.join(', ')}`,
        400,
      );
    }

    // Vault resolution — five-layer precedence (session > externalUserId
    // metadata > agent-pinned > workspace default). Result is the ordered
    // array baked into the sandbox JWT.
    const agentConfigVaultIds =
      agentConfig.pinned_vault_ids.length > 0
        ? agentConfig.pinned_vault_ids
        : null;
    const declaredMcpServers = agentConfig.declared_mcp_servers;

    let resolved;
    try {
      resolved = await resolveVaultIds({
        teamId,
        sessionVaultIds: requestedVaultIds ?? null,
        externalUserId: effectiveExternalUserId ?? null,
        agentConfigVaultIds,
      });
    } catch (err) {
      if (err instanceof VaultResolutionError) {
        throw new ChatRuntimeError('vault_resolution_failed', err.message, err.status);
      }
      throw err;
    }
    const resolvedVaultIds = resolved.vaultIds;

    // Vault proxy is E2B-only — the vault-proxy CA cert is baked into the
    // E2B template. OpenSandbox sandboxes can't authenticate vault traffic
    // until they ship a matching trust store, so we fail fast here rather
    // than silently passing through unauthenticated requests.
    const sandboxConfigForVaults = agentConfig.sandbox_config as ResolvedSandboxConfig;
    if (resolvedVaultIds.length > 0 && sandboxConfigForVaults?.provider && sandboxConfigForVaults.provider !== 'e2b') {
      throw new ChatRuntimeError(
        'vault_unsupported_for_provider',
        `Vault credentials are not supported on the "${sandboxConfigForVaults.provider}" sandbox provider yet — they require the E2B template's CA cert.`,
        422,
      );
    }

    // Vault coverage — verify every declared MCP server has a matching
    // credential in the resolved vaults. Mode is set per relay env
    // (VAULT_COVERAGE_MODE = strict | warn | off).
    if (resolvedVaultIds.length > 0 && declaredMcpServers.length > 0) {
      const coverageMode = getVaultCoverageMode();
      if (coverageMode !== 'off') {
        const coverage = await checkVaultCoverage(
          resolvedVaultIds,
          declaredMcpServers,
        );
        if (!coverage.ok && coverageMode === 'strict') {
          throw new ChatRuntimeError(
            'vault_coverage_missing',
            coverage.missing.length > 0
              ? `Vault coverage missing for: ${coverage.missing.join(', ')}`
              : 'One or more declared MCP servers have no matching credential in the resolved vaults.',
            422,
          );
        }
      }
    }

    const resolvedSandboxId = clientSandboxId;
    const [{ sandbox: initialSandboxRecord }, userTurn] = await Promise.all([
      resolveSandbox({
        agentId: agentConfig.id,
        clientSandboxId: resolvedSandboxId,
        userId,
        teamId,
        ownerTeamId: agentConfig.team_id,
        meta: sandboxMeta,
        runtime,
        deploymentId: agentConfig.active_deployment_id,
        bundleUrl: agentConfig.bundle_url,
        mcpConfigUrl: agentConfig.mcp_config_url,
        envVars: agentConfig.env_vars as Record<string, string> | null,
        sandboxConfig: agentConfig.sandbox_config as ResolvedSandboxConfig,
        nocodeAgentConfig: agentConfig.nocode_agent_config,
        vaultIds: resolvedVaultIds,
      }),
      extractLastUserTurn(messages),
    ]);
    const t2 = Date.now();
    let sandboxRecord = initialSandboxRecord;
    sandboxRecordId = sandboxRecord.id;
    runMeta.e2b_sandbox_id = sandboxRecord.sandbox_id ?? null;
    await updateRun({ runId: currentRunId, meta: runMeta, onlyIfUnfinished: true });
    const { text: messageText, images, inferredName, message: lastUserMessage } = userTurn;

    let sandboxHandle: SandboxHandle;
    try {
      sandboxHandle = await connectSandbox(sandboxRecord);
    } catch (error) {
      if (
        !isStandaloneWorkspaceVolumesEnabled(sandboxRecord.provider)
        || !(error instanceof ChatRuntimeError && error.status === 404)
      ) {
        throw error;
      }

      const recreated = await recreateStandaloneOpenSandbox({
        sandboxRecord,
        runtime,
        userId,
        teamId,
        bundleUrl: agentConfig.bundle_url,
        mcpConfigUrl: agentConfig.mcp_config_url,
        envVars: agentConfig.env_vars as Record<string, string> | null,
        sandboxConfig: agentConfig.sandbox_config as ResolvedSandboxConfig,
      });
      sandboxRecord = recreated.sandbox as typeof sandboxRecord;
      sandboxHandle = recreated.handle;
      runMeta.e2b_sandbox_id = sandboxRecord.sandbox_id ?? null;
      await updateRun({ runId: currentRunId, meta: runMeta, onlyIfUnfinished: true });
    }

    const thread = await resolveThread({
      sandboxRecordId: sandboxRecord.id,
      threadId: requestThreadId,
      name: name || inferredName,
      mode: mode || 'chat',
      deploymentId: agentConfig.active_deployment_id,
      requestedVaultIds: resolvedVaultIds,
    });
    threadId = thread.id;
    await updateRun({ runId: currentRunId, threadId, onlyIfUnfinished: true });
    const continuationSessionId = thread.claudeSessionId ?? undefined;

    await Promise.all([
      (async () => {
        const existingPrivateEnvVars = await readPrivateEnvVars(sandboxHandle);
        const nextPrivateEnvVars = {
          // Preserve sandbox-specific overrides such as Studio's DEPLOYED_SLUG,
          // while still letting fresh agent-level env vars win on overlap.
          ...existingPrivateEnvVars,
          ...buildPrivateEnvVars(agentConfig.env_vars as Record<string, string> | null),
        };

        await syncPrivateEnvVars(sandboxHandle, nextPrivateEnvVars);
      })(),
      refreshProxyTokenIfNeeded(
        sandboxHandle,
        runtime,
        userId,
        sandboxRecord.sandbox_id!,
        sandboxRecord.client_sandbox_id ?? resolvedSandboxId,
        teamId,
        thread.vaultIds,
      ),
    ]);
    const t3 = Date.now();

    console.log(`${tag} sandbox=${resolvedSandboxId} provider=${sandboxRecord.provider ?? 'e2b'} sandbox_id=${sandboxRecord.sandbox_id} thread=${threadId} session=${continuationSessionId ?? 'new'}`);
    console.log(`${tag} [PERF] getAgentConfig=${t1-t0}ms resolveSandbox+extractUser=${t2-t1}ms connectSandbox+thread+env=${t3-t2}ms total_pre_post=${t3-t0}ms`);

    const keepAlive = new SandboxKeepAliveHelper({
      renew: (ttlMs) => sandboxHandle.renew(ttlMs),
      logTag: `${tag}[keepalive]`,
    });

    await keepAlive.start();
    let backgroundOwnershipTransferred = false;

    try {
      const streamId = await postToSandboxWithRetry({
        sandboxHandle,
        message: messageText,
        images,
        continuationSessionId,
        options: Object.keys(runtimeAgentOptions).length > 0 ? runtimeAgentOptions : undefined,
        threadId: thread.id,
        enableRetry: isStandaloneWorkspaceVolumesEnabled(sandboxRecord.provider),
      });
      const t4 = Date.now();
      console.log(`${tag} [PERF] postToSandbox=${t4-t3}ms total_to_stream=${t4-t0}ms`);

      await setThreadStreamId(thread.id, streamId);
      await updateRun({
        runId: currentRunId,
        status: 'streaming',
        onlyIfUnfinished: true,
        expectedStatus: 'received',
      });

      if (mode === 'background') {
        // Background mode: consume stream internally, return immediately
        backgroundOwnershipTransferred = true;
        const backgroundTask = streamThreadToResponse({
          req,
          res,
          tag,
          teamId: agentConfig.team_id,
          endUserId: effectiveExternalUserId,
          runtime,
          streamId,
          threadId: thread.id,
          sandboxRecordId: sandboxRecord.id,
          clientSandboxId: sandboxRecord.client_sandbox_id ?? resolvedSandboxId,
          e2bSandboxId: sandboxRecord.sandbox_id,
          sandboxMeta: sandboxRecord.meta ?? sandboxMeta,
          continuationSessionId,
          existingMessages: thread.messages,
          lastUserMessage,
          background: true,
          runId: currentRunId,
          runMeta,
        }).catch((err) => {
          console.error(`${tag} Background stream error:`, err);
          const backgroundError = err instanceof Error ? err.message : 'Background stream failed';
          markThreadFailed({
            threadId: thread.id,
            sandboxRecordId: sandboxRecord.id,
            code: 'sandbox_error',
            message: backgroundError,
          }).catch(() => {});
          updateRun({
            runId: currentRunId,
            status: 'failed',
            finishedAt: new Date(),
            error: { code: 'sandbox_error', message: backgroundError },
            meta: runMeta,
            onlyIfUnfinished: true,
          }).catch(() => {});
        }).finally(() => {
          keepAlive.stop();
          sandboxHandle.close().catch(() => {});
        });

        // Don't await — let it run detached
        void backgroundTask;

        res.status(202).json({
          threadId: thread.id,
          sandboxId: resolvedSandboxId,
          status: 'running',
        });
        return;
      }
      await streamThreadToResponse({
        req,
        res,
        tag,
        teamId: agentConfig.team_id,
        endUserId: effectiveExternalUserId,
        runtime,
        streamId,
        threadId: thread.id,
        sandboxRecordId: sandboxRecord.id,
        clientSandboxId: sandboxRecord.client_sandbox_id ?? resolvedSandboxId,
        e2bSandboxId: sandboxRecord.sandbox_id,
        sandboxMeta: sandboxRecord.meta ?? sandboxMeta,
        continuationSessionId,
        existingMessages: thread.messages,
        lastUserMessage,
        runId: currentRunId,
        runMeta,
      });
    } finally {
      if (!backgroundOwnershipTransferred) {
        keepAlive.stop();
        await sandboxHandle.close().catch(() => {});
      }
    }
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    const code = err instanceof ChatRuntimeError ? err.code : 'sandbox_error';
    const runStatus: AnRunStatus =
      code === 'billing_not_ready' || code === 'budget_exceeded'
        ? 'blocked'
        : 'failed';

    if (runId) {
      await updateRun({
        runId,
        status: runStatus,
        finishedAt: new Date(),
        error: { code, message: body.error.message },
        meta: runMeta,
        onlyIfUnfinished: true,
      }).catch(() => {});
    }

    if (threadId && sandboxRecordId) {
      await markThreadFailed({ threadId, sandboxRecordId, code, message: body.error.message }).catch(() => {});
    } else if (sandboxRecordId && err instanceof ChatRuntimeError && err.code === 'sandbox_unavailable') {
      await markSandboxError(sandboxRecordId, `${err.code}: ${err.message}`).catch(() => {});
    }

    console.error(`${tag} Error:`, err);
    if (!res.headersSent) {
      res.status(status).json(body);
    } else if (!res.writableEnded && !res.destroyed) {
      res.end();
    }
  }
});

// ─── GET /:slug/:sandboxId/stream — resume active stream ─────────

router.get('/:slug/:sandboxId/stream', async (req: Request, res: Response) => {
  const { slug, sandboxId: clientSandboxId } = req.params as { slug: string; sandboxId: string };
  const teamId = (req as any).teamId as string;
  const endUserId = getEndUserId(req);
  const tag = `[CHAT-RESUME][${teamId}/${slug}/${clientSandboxId}]`;

  try {
    enforceAgentScope(req, slug);

    const agentConfig = await getAgentConfig(teamId, slug);
    const sandboxRecord = await findAccessibleSandbox({
      agentId: agentConfig.id,
      clientSandboxId,
      teamId,
      ownerTeamId: agentConfig.team_id,
    });
    if (!sandboxRecord) {
      throw new ChatRuntimeError('sandbox_not_found', `Sandbox "${clientSandboxId}" not found`, 404);
    }

    const activeThread = await getActiveStreamingThread(sandboxRecord.id);
    if (!activeThread?.streamId) {
      res.status(204).end();
      return;
    }

    const keepAlive = sandboxRecord.sandbox_id
      ? new SandboxKeepAliveHelper({
        renew: (ttlMs) =>
          renewSandbox(
            (sandboxRecord.provider as ResolvedSandboxConfig['provider'] | null) ?? 'e2b',
            sandboxRecord.sandbox_id!,
            ttlMs,
          ),
        logTag: `${tag}[keepalive]`,
      })
      : null;

    if (keepAlive) {
      await keepAlive.start();
    }

    try {
      await streamThreadToResponse({
        req,
        res,
        tag,
        teamId: agentConfig.team_id,
        endUserId,
        runtime: agentConfig.runtime || 'claude-code',
        streamId: activeThread.streamId,
        threadId: activeThread.id,
        sandboxRecordId: sandboxRecord.id,
        clientSandboxId,
        e2bSandboxId: sandboxRecord.sandbox_id,
        sandboxMeta: sandboxRecord.meta,
        continuationSessionId: activeThread.claudeSessionId ?? undefined,
      });
    } finally {
      keepAlive?.stop();
    }
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    console.error(`${tag} Error:`, err);
    if (!res.headersSent) {
      res.status(status).json(body);
    } else if (!res.writableEnded && !res.destroyed) {
      res.end();
    }
  }
});

// ─── DELETE /:slug/:sandboxId/stream — cancel active stream ──────

router.delete('/:slug/:sandboxId/stream', async (req: Request, res: Response) => {
  const { slug, sandboxId: clientSandboxId } = req.params as { slug: string; sandboxId: string };
  const teamId = (req as any).teamId as string;
  const tag = `[CHAT-CANCEL][${teamId}/${slug}/${clientSandboxId}]`;

  try {
    enforceAgentScope(req, slug);

    const agentConfig = await getAgentConfig(teamId, slug);
    const sandboxRecord = await findAccessibleSandbox({
      agentId: agentConfig.id,
      clientSandboxId,
      teamId,
      ownerTeamId: agentConfig.team_id,
    });
    if (!sandboxRecord) {
      throw new ChatRuntimeError('sandbox_not_found', `Sandbox "${clientSandboxId}" not found`, 404);
    }

    const activeThread = await getActiveStreamingThread(sandboxRecord.id);
    if (!activeThread?.streamId) {
      res.json({ ok: true, status: 'idle' });
      return;
    }

    await markThreadCancelled(activeThread.id, sandboxRecord.id);
    const activeRun = await findLatestOpenRunByThreadId(activeThread.id);
    if (activeRun) {
      await updateRun({
        runId: activeRun.id,
        status: 'cancelled',
        finishedAt: new Date(),
        error: { code: 'cancelled', message: 'cancelled by user' },
        onlyIfUnfinished: true,
      });
    }
    abortActiveStream(activeThread.streamId, 'user-cancelled');

    await Promise.allSettled([
      pubsub.publish(`session:${activeThread.streamId}`, { type: 'error', error: 'cancelled' }),
      pubsub.publish(`cancel:${activeThread.streamId}`, { type: 'cancelled' }),
    ]);

    console.log(`${tag} cancelled streamId=${activeThread.streamId}`);
    res.json({ ok: true, status: 'cancelled', streamId: activeThread.streamId });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    console.error(`${tag} Error:`, err);
    res.status(status).json(body);
  }
});
