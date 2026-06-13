import { Sandbox } from '@e2b/code-interpreter';
import {
  buildSandboxMeta,
  getAccessibleAgentConfig,
} from '@repo/sandbox-provider/enterprise-access';
import {
  and,
  desc,
  eq,
  or,
} from 'drizzle-orm';
import { raw, Request, Response, Router } from 'express';
import { Readable } from 'node:stream';
import { db } from './db';
import {
  getDeploymentAgentConfig,
  getDeploymentMcpConfigUrl,
  normalizeDeploymentSandboxConfig,
  type ResolvedSandboxConfig,
} from './deployment-metadata';
import { getGitHubInstallationAccessToken } from './github-auth';
import { SandboxHandle } from './sandbox-backends/types';
import { isOpenSandboxNotFoundError } from './sandbox-backends/opensandbox';
import {
  connectToSandbox,
  createProvisionedSandbox,
  destroySandbox,
} from './sandbox-factory';
import { getSandboxTimeoutMs, SandboxKeepAliveHelper } from './sandbox-keepalive';
import { anAgentConfigs, anDeployments, anSandboxes, anThreads } from './schema';
import { recreateStandaloneOpenSandbox } from './standalone-sandbox-recreate';
import {
  deleteStandaloneWorkspacePvc,
  isStandaloneWorkspaceVolumesEnabled,
} from './standalone-workspace-pvc';

const SANDBOX_ROOT_USER = 'root';
const MAX_EXEC_TIMEOUT_MS = 10 * 60_000;

type FilesystemEntryLike = {
  name: string;
  path: string;
  type?: string;
  size?: number;
  mode?: number;
  permissions?: string;
  owner?: string;
  group?: string;
  modifiedTime?: Date | string;
  symlinkTarget?: string;
};

type SandboxFilesystemCompat = {
  list: (path: string, opts?: { depth?: number; user?: string }) => Promise<FilesystemEntryLike[]>;
  makeDir: (path: string, opts?: { user?: string }) => Promise<boolean>;
  rename: (oldPath: string, newPath: string, opts?: { user?: string }) => Promise<FilesystemEntryLike>;
  remove: (path: string, opts?: { user?: string }) => Promise<void>;
  exists: (path: string, opts?: { user?: string }) => Promise<boolean>;
  getInfo: (path: string, opts?: { user?: string }) => Promise<FilesystemEntryLike>;
};

function getFilesystemCompat(sandbox: Sandbox): SandboxFilesystemCompat {
  return sandbox.files as unknown as SandboxFilesystemCompat;
}

function serializeFilesystemEntry(entry: FilesystemEntryLike) {
  return {
    name: entry.name,
    path: entry.path,
    ...(entry.type !== undefined ? { type: entry.type } : {}),
    ...(typeof entry.size === 'number' ? { size: entry.size } : {}),
    ...(typeof entry.mode === 'number' ? { mode: entry.mode } : {}),
    ...(typeof entry.permissions === 'string' ? { permissions: entry.permissions } : {}),
    ...(typeof entry.owner === 'string' ? { owner: entry.owner } : {}),
    ...(typeof entry.group === 'string' ? { group: entry.group } : {}),
    ...(entry.modifiedTime
      ? {
        modifiedTime:
            entry.modifiedTime instanceof Date
              ? entry.modifiedTime.toISOString()
              : entry.modifiedTime,
      }
      : {}),
    ...(typeof entry.symlinkTarget === 'string' ? { symlinkTarget: entry.symlinkTarget } : {}),
  };
}

function parseDepth(value: unknown): number | null | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || value.trim().length === 0) return null;

  const depth = Number.parseInt(value, 10);
  if (!Number.isFinite(depth) || depth < 0) return null;

  return depth;
}

function isMissingFilesystemPathError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return message.includes('no such file') || message.includes('not found');
}

function mergeSandboxConfig(
  baseSandboxConfig: ResolvedSandboxConfig | null | undefined,
  overrides: {
    files?: Record<string, string>;
    setup?: string[];
  },
): ResolvedSandboxConfig {
  const resolvedBase = baseSandboxConfig ?? { provider: 'e2b' as const };
  return {
    ...resolvedBase,
    ...(overrides.files && {
      files: { ...(resolvedBase.files ?? {}), ...overrides.files },
    }),
    ...(overrides.setup && {
      setup: [...(resolvedBase.setup ?? []), ...overrides.setup],
    }),
  };
}

type ConnectedSandboxRecord = {
  recordId: string;
  provider: ResolvedSandboxConfig['provider'];
  sandboxId: string;
  handle: SandboxHandle;
};

async function getResolvedAgentConfig(teamId: string, agentSlug: string) {
  const agentConfig = await getAccessibleAgentConfig(teamId, agentSlug);
  if (!agentConfig) {
    return null;
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
    nocode_agent_config: getDeploymentAgentConfig(deploymentMetadata),
    sandbox_config: normalizeDeploymentSandboxConfig(
      agentConfig.sandbox_config,
      deploymentMetadata,
    ),
    mcp_config_url: getDeploymentMcpConfigUrl(deploymentMetadata),
  };
}
function getRequesterUserId(req: Request): string | undefined {
  return (req as any).tokenClaims?.user_id
    ?? (req as any).apiKey?.user_id;
}

function buildAuthenticatedGitHubUrl(repository: string, token: string): string {
  return `https://x-access-token:${encodeURIComponent(token)}@github.com/${repository}.git`;
}

function sandboxAccessClause(teamId: string) {
  return or(
    eq(anAgentConfigs.team_id, teamId),
    eq(anSandboxes.invocation_team_id, teamId),
  );
}

export function initSandboxesRouter(): Router {
  const router = Router();
  const rawFileParser = raw({ type: () => true, limit: '10mb' });

  // POST /v1/sandboxes — create a new sandbox
  router.post('/', async (req: Request, res: Response) => {
    const teamId = (req as any).teamId as string;

    try {
      const {
        agent: agentSlug,
        files: overrideFiles,
        envs: overrideEnvs,
        setup: overrideSetup,
        timeoutMs,
        networkAllowOut,
        networkDenyOut,
      } = req.body as {
        agent?: string;
        files?: Record<string, string>;
        envs?: Record<string, string>;
        setup?: string[];
        timeoutMs?: number;
        networkAllowOut?: string[];
        networkDenyOut?: string[];
      };
      if (!agentSlug) {
        res.status(400).json({ error: { code: 'invalid_request', message: 'agent slug is required' } });
        return;
      }

      const agentConfig = await getResolvedAgentConfig(teamId, agentSlug);
      if (!agentConfig) {
        res.status(404).json({ error: { code: 'agent_not_found', message: `Agent "${agentSlug}" not found` } });
        return;
      }

      // Merge agent-level sandbox config with per-sandbox overrides
      const baseSandboxConfig = agentConfig.sandbox_config;
      const mergedSandboxConfig = mergeSandboxConfig(baseSandboxConfig, {
        ...(overrideFiles ? { files: overrideFiles } : {}),
        ...(overrideSetup ? { setup: overrideSetup } : {}),
      });

      // Merge env vars: agent envs + per-sandbox envs override
      const mergedEnvVars = {
        ...(agentConfig.env_vars as Record<string, string> | null),
        ...overrideEnvs,
      };

      // Create a fully configured sandbox (proxy config + bundle + env vars + sandbox config)
      const userId = (req as any).tokenClaims?.user_id
        ?? (req as any).apiKey?.user_id
        ?? 'anonymous';

      const clientSandboxId = crypto.randomUUID();
      const sandboxMeta = buildSandboxMeta({
        invocationTeamId: teamId,
        invocationUserId: userId,
        ownerTeamId: agentConfig.team_id,
      });

      const sandbox = await createProvisionedSandbox({
        runtime: agentConfig.runtime || 'claude-code',
        userId,
        sandboxConfig: mergedSandboxConfig,
        timeoutMs,
        networkAllowOut,
        networkDenyOut,
        bundleUrl: agentConfig.bundle_url,
        nocodeAgentConfig: agentConfig.nocode_agent_config,
        mcpConfigUrl: agentConfig.mcp_config_url,
        envVars: Object.keys(mergedEnvVars).length > 0 ? mergedEnvVars : null,
        clientSandboxId,
        teamId,
      });
      const now = new Date();

      const [record] = await db
        .insert(anSandboxes)
        .values({
          agent_id: agentConfig.id,
          deployment_id: agentConfig.active_deployment_id ?? null,
          client_sandbox_id: clientSandboxId,
          sandbox_id: sandbox.sandboxId,
          provider: sandbox.provider,
          status: 'active',
          meta: sandboxMeta,
          invocation_team_id: teamId,
          created_at: now,
          updated_at: now,
        })
        .returning();

      await sandbox.close().catch(() => {});

      res.status(201).json({
        id: record.client_sandbox_id,
        sandboxId: record.sandbox_id,
        status: record.status,
        createdAt: record.created_at,
      });
    } catch (err) {
      console.error('[SANDBOXES] POST error:', err);
      res.status(500).json({ error: { code: 'internal_error', message: err instanceof Error ? err.message : 'Internal error' } });
    }
  });

  // GET /v1/sandboxes/:id — get sandbox status
  router.get('/:id', async (req: Request, res: Response) => {
    const teamId = (req as any).teamId as string;
    const { id: clientSandboxId } = req.params as { id: string };

    try {
      // Find sandbox by client_sandbox_id, scoped to team's agents
      const [record] = await db
        .select({
          id: anSandboxes.id,
          clientSandboxId: anSandboxes.client_sandbox_id,
          sandboxId: anSandboxes.sandbox_id,
          provider: anSandboxes.provider,
          status: anSandboxes.status,
          error: anSandboxes.error,
          agentId: anAgentConfigs.id,
          agentSlug: anAgentConfigs.slug,
          agentName: anAgentConfigs.name,
          createdAt: anSandboxes.created_at,
          updatedAt: anSandboxes.updated_at,
        })
        .from(anSandboxes)
        .innerJoin(anAgentConfigs, eq(anSandboxes.agent_id, anAgentConfigs.id))
        .where(and(eq(anSandboxes.client_sandbox_id, clientSandboxId), sandboxAccessClause(teamId)))
        .limit(1);

      if (!record) {
        res.status(404).json({ error: { code: 'sandbox_not_found', message: `Sandbox "${clientSandboxId}" not found` } });
        return;
      }

      // Get threads
      const threads = await db
        .select({
          id: anThreads.id,
          name: anThreads.name,
          status: anThreads.status,
          createdAt: anThreads.created_at,
        })
        .from(anThreads)
        .where(eq(anThreads.sandbox_id, record.id))
        .orderBy(desc(anThreads.created_at));

      res.json({
        id: record.clientSandboxId,
        sandboxId: record.sandboxId,
        provider: record.provider ?? 'e2b',
        status: record.status,
        error: record.error,
        agent: { slug: record.agentSlug, name: record.agentName },
        threads,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      });
    } catch (err) {
      console.error('[SANDBOXES] GET error:', err);
      res.status(500).json({ error: { code: 'internal_error', message: err instanceof Error ? err.message : 'Internal error' } });
    }
  });

  // DELETE /v1/sandboxes/:id — kill sandbox
  router.delete('/:id', async (req: Request, res: Response) => {
    const teamId = (req as any).teamId as string;
    const { id: clientSandboxId } = req.params as { id: string };

    try {
      const [record] = await db
        .select({
          id: anSandboxes.id,
          clientSandboxId: anSandboxes.client_sandbox_id,
          sandboxId: anSandboxes.sandbox_id,
          provider: anSandboxes.provider,
          agentTeamId: anAgentConfigs.team_id,
        })
        .from(anSandboxes)
        .innerJoin(anAgentConfigs, eq(anSandboxes.agent_id, anAgentConfigs.id))
        .where(and(eq(anSandboxes.client_sandbox_id, clientSandboxId), sandboxAccessClause(teamId)))
        .limit(1);

      if (!record) {
        res.status(404).json({ error: { code: 'sandbox_not_found', message: `Sandbox "${clientSandboxId}" not found` } });
        return;
      }

      // Kill provider sandbox
      if (record.sandboxId) {
        await destroySandbox(
          (record.provider as ResolvedSandboxConfig['provider'] | null) ?? 'e2b',
          record.sandboxId,
        ).catch((err) => {
          console.warn('[SANDBOXES] Failed to kill sandbox:', err);
        });
      }

      if (isStandaloneWorkspaceVolumesEnabled(record.provider)) {
        await deleteStandaloneWorkspacePvc(record.clientSandboxId);
      }

      // Cascade delete: threads are deleted by FK cascade
      await db.delete(anSandboxes).where(eq(anSandboxes.id, record.id));

      res.status(204).end();
    } catch (err) {
      console.error('[SANDBOXES] DELETE error:', err);
      res.status(500).json({ error: { code: 'internal_error', message: err instanceof Error ? err.message : 'Internal error' } });
    }
  });

  // ─── Thread sub-resources ──────────────────────────────────────

  // GET /v1/sandboxes/:id/threads — list threads
  router.get('/:id/threads', async (req: Request, res: Response) => {
    const teamId = (req as any).teamId as string;
    const { id: clientSandboxId } = req.params as { id: string };

    try {
      const [sandbox] = await db
        .select({ id: anSandboxes.id })
        .from(anSandboxes)
        .innerJoin(anAgentConfigs, eq(anSandboxes.agent_id, anAgentConfigs.id))
        .where(and(eq(anSandboxes.client_sandbox_id, clientSandboxId), sandboxAccessClause(teamId)))
        .limit(1);

      if (!sandbox) {
        res.status(404).json({ error: { code: 'sandbox_not_found', message: `Sandbox "${clientSandboxId}" not found` } });
        return;
      }

      const threads = await db
        .select({
          id: anThreads.id,
          name: anThreads.name,
          status: anThreads.status,
          createdAt: anThreads.created_at,
          updatedAt: anThreads.updated_at,
        })
        .from(anThreads)
        .where(eq(anThreads.sandbox_id, sandbox.id))
        .orderBy(desc(anThreads.created_at));

      res.json(threads);
    } catch (err) {
      console.error('[SANDBOXES] GET threads error:', err);
      res.status(500).json({ error: { code: 'internal_error', message: err instanceof Error ? err.message : 'Internal error' } });
    }
  });

  // POST /v1/sandboxes/:id/threads — create thread
  router.post('/:id/threads', async (req: Request, res: Response) => {
    const teamId = (req as any).teamId as string;
    const { id: clientSandboxId } = req.params as { id: string };

    try {
      const [sandbox] = await db
        .select({ id: anSandboxes.id })
        .from(anSandboxes)
        .innerJoin(anAgentConfigs, eq(anSandboxes.agent_id, anAgentConfigs.id))
        .where(and(eq(anSandboxes.client_sandbox_id, clientSandboxId), sandboxAccessClause(teamId)))
        .limit(1);

      if (!sandbox) {
        res.status(404).json({ error: { code: 'sandbox_not_found', message: `Sandbox "${clientSandboxId}" not found` } });
        return;
      }

      const { name } = req.body as { name?: string };
      const now = new Date();

      const [thread] = await db
        .insert(anThreads)
        .values({
          sandbox_id: sandbox.id,
          name: name || null,
          mode: 'chat',
          status: 'idle',
          created_at: now,
          updated_at: now,
        })
        .returning();

      res.status(201).json({
        id: thread.id,
        name: thread.name,
        status: thread.status,
        createdAt: thread.created_at,
      });
    } catch (err) {
      console.error('[SANDBOXES] POST thread error:', err);
      res.status(500).json({ error: { code: 'internal_error', message: err instanceof Error ? err.message : 'Internal error' } });
    }
  });

  // GET /v1/sandboxes/:id/threads/:threadId — get thread details
  router.get('/:id/threads/:threadId', async (req: Request, res: Response) => {
    const teamId = (req as any).teamId as string;
    const { id: clientSandboxId, threadId } = req.params as { id: string; threadId: string };

    try {
      const [sandbox] = await db
        .select({ id: anSandboxes.id })
        .from(anSandboxes)
        .innerJoin(anAgentConfigs, eq(anSandboxes.agent_id, anAgentConfigs.id))
        .where(and(eq(anSandboxes.client_sandbox_id, clientSandboxId), sandboxAccessClause(teamId)))
        .limit(1);

      if (!sandbox) {
        res.status(404).json({ error: { code: 'sandbox_not_found', message: `Sandbox "${clientSandboxId}" not found` } });
        return;
      }

      const [thread] = await db
        .select()
        .from(anThreads)
        .where(and(eq(anThreads.id, threadId), eq(anThreads.sandbox_id, sandbox.id)))
        .limit(1);

      if (!thread) {
        res.status(404).json({ error: { code: 'thread_not_found', message: `Thread "${threadId}" not found` } });
        return;
      }

      res.json({
        id: thread.id,
        name: thread.name,
        status: thread.status,
        messages: thread.messages,
        usage: {
          inputTokens: thread.input_tokens,
          outputTokens: thread.output_tokens,
          totalTokens: thread.total_tokens,
          totalCostUsd: thread.total_cost_usd ? Number(thread.total_cost_usd) : null,
          durationMs: thread.duration_ms,
        },
        error: thread.error,
        createdAt: thread.created_at,
        updatedAt: thread.updated_at,
        completedAt: thread.completed_at,
      });
    } catch (err) {
      console.error('[SANDBOXES] GET thread error:', err);
      res.status(500).json({ error: { code: 'internal_error', message: err instanceof Error ? err.message : 'Internal error' } });
    }
  });

  // DELETE /v1/sandboxes/:id/threads/:threadId — delete thread
  router.delete('/:id/threads/:threadId', async (req: Request, res: Response) => {
    const teamId = (req as any).teamId as string;
    const { id: clientSandboxId, threadId } = req.params as { id: string; threadId: string };

    try {
      const [sandbox] = await db
        .select({ id: anSandboxes.id })
        .from(anSandboxes)
        .innerJoin(anAgentConfigs, eq(anSandboxes.agent_id, anAgentConfigs.id))
        .where(and(eq(anSandboxes.client_sandbox_id, clientSandboxId), sandboxAccessClause(teamId)))
        .limit(1);

      if (!sandbox) {
        res.status(404).json({ error: { code: 'sandbox_not_found', message: `Sandbox "${clientSandboxId}" not found` } });
        return;
      }

      const [thread] = await db
        .select({ id: anThreads.id })
        .from(anThreads)
        .where(and(eq(anThreads.id, threadId), eq(anThreads.sandbox_id, sandbox.id)))
        .limit(1);

      if (!thread) {
        res.status(404).json({ error: { code: 'thread_not_found', message: `Thread "${threadId}" not found` } });
        return;
      }

      await db.delete(anThreads).where(eq(anThreads.id, thread.id));
      res.status(204).end();
    } catch (err) {
      console.error('[SANDBOXES] DELETE thread error:', err);
      res.status(500).json({ error: { code: 'internal_error', message: err instanceof Error ? err.message : 'Internal error' } });
    }
  });

  // ─── Sandbox operations (thin proxy over provider backends) ───────────────

  async function resolveSandboxHandle(
    clientSandboxId: string,
    teamId: string,
    requesterUserId: string,
  ): Promise<ConnectedSandboxRecord | null> {
    const [record] = await db
      .select({
        id: anSandboxes.id,
        clientSandboxId: anSandboxes.client_sandbox_id,
        provider: anSandboxes.provider,
        sandboxId: anSandboxes.sandbox_id,
        meta: anSandboxes.meta,
        agentSlug: anAgentConfigs.slug,
      })
      .from(anSandboxes)
      .innerJoin(anAgentConfigs, eq(anSandboxes.agent_id, anAgentConfigs.id))
      .where(and(eq(anSandboxes.client_sandbox_id, clientSandboxId), sandboxAccessClause(teamId)))
      .limit(1);

    if (!record) return null;

    if (record.sandboxId) {
      try {
        const handle = await connectToSandbox(
          (record.provider as ResolvedSandboxConfig['provider'] | null) ?? 'e2b',
          record.sandboxId,
        );
        return {
          recordId: record.id,
          provider: handle.provider,
          sandboxId: record.sandboxId,
          handle,
        };
      } catch (error) {
        if (
          !isStandaloneWorkspaceVolumesEnabled(record.provider)
          || !isOpenSandboxNotFoundError(error)
        ) {
          throw error;
        }
      }
    } else if (!isStandaloneWorkspaceVolumesEnabled(record.provider)) {
      return null;
    }

    const agentConfig = await getResolvedAgentConfig(teamId, record.agentSlug);
    if (!agentConfig) {
      throw new Error(`Agent "${record.agentSlug}" not found for standalone sandbox recreate`);
    }

    const recreated = await recreateStandaloneOpenSandbox({
      sandboxRecord: {
        id: record.id,
        client_sandbox_id: record.clientSandboxId,
        sandbox_id: record.sandboxId,
        provider: record.provider,
        meta: record.meta,
      },
      runtime: agentConfig.runtime || 'claude-code',
      userId: requesterUserId,
      teamId,
      bundleUrl: agentConfig.bundle_url,
      mcpConfigUrl: agentConfig.mcp_config_url,
      envVars: agentConfig.env_vars as Record<string, string> | null,
      sandboxConfig: agentConfig.sandbox_config as ResolvedSandboxConfig,
    });

    return {
      recordId: recreated.sandbox.id,
      provider: recreated.handle.provider,
      sandboxId: recreated.handle.sandboxId,
      handle: recreated.handle,
    };
  }

  async function resolveE2BSandbox(
    clientSandboxId: string,
    teamId: string,
    requesterUserId: string,
  ): Promise<Sandbox | null> {
    const resolvedSandbox = await resolveSandboxHandle(clientSandboxId, teamId, requesterUserId);
    if (!resolvedSandbox) {
      return null;
    }

    await resolvedSandbox.handle.close().catch(() => {});
    return Sandbox.connect(resolvedSandbox.sandboxId, {
      timeoutMs: await getSandboxTimeoutMs(resolvedSandbox.sandboxId),
    });
  }

  // POST /v1/sandboxes/:id/files — write files
  router.post('/:id/files', (req: Request, res: Response, next) => {
    if (req.query.format === 'blob') {
      rawFileParser(req, res, next);
      return;
    }

    next();
  }, async (req: Request, res: Response) => {
    const teamId = (req as any).teamId as string;
    const { id: clientSandboxId } = req.params as { id: string };
    const format = req.query.format === 'blob' || req.query.format === 'stream' ? req.query.format : 'text';
    const queryPath = typeof req.query.path === 'string' ? req.query.path : undefined;

    try {
      const resolvedSandbox = await resolveSandboxHandle(clientSandboxId, teamId, getRequesterUserId(req) ?? 'anonymous');
      if (!resolvedSandbox) {
        res.status(404).json({ error: { code: 'sandbox_not_found', message: `Sandbox "${clientSandboxId}" not found` } });
        return;
      }
      const sandbox = resolvedSandbox.handle;

      const keepAlive = new SandboxKeepAliveHelper({
        renew: (ttlMs) => sandbox.renew(ttlMs),
        logTag: `[SANDBOXES][files-write][${sandbox.sandboxId}]`,
      });
      await keepAlive.start();

      try {
        if (format === 'blob') {
          if (!queryPath) {
            res.status(400).json({ error: { code: 'invalid_request', message: 'path query parameter is required for blob writes' } });
            return;
          }

          if (!Buffer.isBuffer(req.body)) {
            res.status(400).json({ error: { code: 'invalid_request', message: 'blob writes require a binary request body' } });
            return;
          }

          const blob = new Blob([Uint8Array.from(req.body)], {
            type: req.get('content-type') || 'application/octet-stream',
          });
          await sandbox.writeFile(queryPath, blob);
          res.json({ path: queryPath, size: req.body.length });
          return;
        }

        if (format === 'stream') {
          if (!queryPath) {
            res.status(400).json({ error: { code: 'invalid_request', message: 'path query parameter is required for stream writes' } });
            return;
          }

          const stream = Readable.toWeb(req as any) as unknown as ReadableStream<Uint8Array>;
          await sandbox.writeFile(queryPath, stream);

          const contentLength = Number(req.get('content-length'));
          res.json(Number.isFinite(contentLength) ? { path: queryPath, size: contentLength } : { path: queryPath });
          return;
        }

        const { path, content, files } = req.body as {
          path?: string;
          content?: string;
          files?: Record<string, string> | Array<{ path: string; content: string }>;
        };

        // Normalize files to array format
        let fileEntries: Array<{ path: string; content: string }> | null = null;
        if (files) {
          if (Array.isArray(files)) {
            fileEntries = files;
          } else if (typeof files === 'object') {
            // Record<string, string> format from client SDK
            fileEntries = Object.entries(files).map(([p, c]) => ({ path: p, content: c }));
          }
        }

        if (fileEntries && fileEntries.length > 0) {
          // Multi-file write
          await sandbox.writeFiles(fileEntries.map((f) => ({ path: f.path, data: f.content })));
          res.json({ files: fileEntries.map((f) => ({ path: f.path, size: f.content.length })) });
        } else if (path && content !== undefined) {
          // Single file write
          await sandbox.writeFile(path, content);
          res.json({ path, size: content.length });
        } else {
          res.status(400).json({ error: { code: 'invalid_request', message: 'Provide either {path, content} or {files}' } });
        }
      } finally {
        keepAlive.stop();
        await sandbox.close().catch(() => {});
      }
    } catch (err) {
      console.error('[SANDBOXES] POST files error:', err);
      res.status(500).json({ error: { code: 'internal_error', message: err instanceof Error ? err.message : 'Internal error' } });
    }
  });

  // GET /v1/sandboxes/:id/files — read file
  router.get('/:id/files', async (req: Request, res: Response) => {
    const teamId = (req as any).teamId as string;
    const { id: clientSandboxId } = req.params as { id: string };
    const filePath = req.query.path as string;
    const format = req.query.format === 'blob' || req.query.format === 'stream' ? req.query.format : 'text';

    try {
      if (!filePath) {
        res.status(400).json({ error: { code: 'invalid_request', message: 'path query parameter is required' } });
        return;
      }

      const resolvedSandbox = await resolveSandboxHandle(clientSandboxId, teamId, getRequesterUserId(req) ?? 'anonymous');
      if (!resolvedSandbox) {
        res.status(404).json({ error: { code: 'sandbox_not_found', message: `Sandbox "${clientSandboxId}" not found` } });
        return;
      }
      const sandbox = resolvedSandbox.handle;

      const keepAlive = new SandboxKeepAliveHelper({
        renew: (ttlMs) => sandbox.renew(ttlMs),
        logTag: `[SANDBOXES][files-read][${sandbox.sandboxId}]`,
      });
      await keepAlive.start();

      try {
        if (format === 'blob') {
          const blob = await sandbox.readBlob(filePath);
          res.setHeader('Content-Type', blob.type || 'application/octet-stream');
          res.send(Buffer.from(await blob.arrayBuffer()));
          return;
        }

        if (format === 'stream') {
          const stream = await sandbox.readStream(filePath);
          res.setHeader('Content-Type', 'application/octet-stream');
          await new Promise<void>((resolve, reject) => {
            const readable = Readable.fromWeb(stream as any);
            const cleanup = () => {
              readable.off('error', onError);
              res.off('finish', onDone);
              res.off('close', onDone);
            };
            const onError = (error: Error) => {
              cleanup();
              reject(error);
            };
            const onDone = () => {
              cleanup();
              resolve();
            };

            readable.on('error', onError);
            res.on('finish', onDone);
            res.on('close', onDone);
            readable.pipe(res);
          });
          return;
        }

        const content = await sandbox.readText(filePath);
        res.json({ path: filePath, content });
      } finally {
        keepAlive.stop();
        await sandbox.close().catch(() => {});
      }
    } catch (err: any) {
      if (err?.message?.includes('no such file')) {
        res.status(404).json({ error: { code: 'file_not_found', message: `File "${filePath}" not found` } });
        return;
      }
      console.error('[SANDBOXES] GET files error:', err);
      res.status(500).json({ error: { code: 'internal_error', message: err instanceof Error ? err.message : 'Internal error' } });
    }
  });

  // GET /v1/sandboxes/:id/files/list — list directory entries
  router.get('/:id/files/list', async (req: Request, res: Response) => {
    const teamId = (req as any).teamId as string;
    const { id: clientSandboxId } = req.params as { id: string };
    const path = typeof req.query.path === 'string' ? req.query.path : undefined;
    const depth = parseDepth(req.query.depth);

    try {
      if (!path) {
        res.status(400).json({ error: { code: 'invalid_request', message: 'path query parameter is required' } });
        return;
      }
      if (depth === null) {
        res.status(400).json({ error: { code: 'invalid_request', message: 'depth must be a non-negative integer when provided' } });
        return;
      }

      const sandbox = await resolveE2BSandbox(
        clientSandboxId,
        teamId,
        getRequesterUserId(req) ?? 'anonymous',
      );
      if (!sandbox) {
        res.status(404).json({ error: { code: 'sandbox_not_found', message: `Sandbox "${clientSandboxId}" not found` } });
        return;
      }

      const keepAlive = new SandboxKeepAliveHelper({
        renew: (ttlMs) => Sandbox.setTimeout(sandbox.sandboxId, ttlMs),
        resolveTtlMs: () => getSandboxTimeoutMs(sandbox.sandboxId),
        logTag: `[SANDBOXES][files-list][${sandbox.sandboxId}]`,
      });
      await keepAlive.start();

      try {
        const entries = await getFilesystemCompat(sandbox).list(path, {
          ...(depth !== undefined ? { depth } : {}),
          user: SANDBOX_ROOT_USER,
        });
        res.json(entries.map(serializeFilesystemEntry));
      } finally {
        keepAlive.stop();
      }
    } catch (err) {
      if (isMissingFilesystemPathError(err)) {
        res.status(404).json({ error: { code: 'file_not_found', message: `Path "${path}" not found` } });
        return;
      }
      console.error('[SANDBOXES] GET files/list error:', err);
      res.status(500).json({ error: { code: 'internal_error', message: err instanceof Error ? err.message : 'Internal error' } });
    }
  });

  // GET /v1/sandboxes/:id/files/info — get file or directory metadata
  router.get('/:id/files/info', async (req: Request, res: Response) => {
    const teamId = (req as any).teamId as string;
    const { id: clientSandboxId } = req.params as { id: string };
    const path = typeof req.query.path === 'string' ? req.query.path : undefined;

    try {
      if (!path) {
        res.status(400).json({ error: { code: 'invalid_request', message: 'path query parameter is required' } });
        return;
      }

      const sandbox = await resolveE2BSandbox(
        clientSandboxId,
        teamId,
        getRequesterUserId(req) ?? 'anonymous',
      );
      if (!sandbox) {
        res.status(404).json({ error: { code: 'sandbox_not_found', message: `Sandbox "${clientSandboxId}" not found` } });
        return;
      }

      const keepAlive = new SandboxKeepAliveHelper({
        renew: (ttlMs) => Sandbox.setTimeout(sandbox.sandboxId, ttlMs),
        resolveTtlMs: () => getSandboxTimeoutMs(sandbox.sandboxId),
        logTag: `[SANDBOXES][files-info][${sandbox.sandboxId}]`,
      });
      await keepAlive.start();

      try {
        const entry = await getFilesystemCompat(sandbox).getInfo(path, {
          user: SANDBOX_ROOT_USER,
        });
        res.json(serializeFilesystemEntry(entry));
      } finally {
        keepAlive.stop();
      }
    } catch (err) {
      if (isMissingFilesystemPathError(err)) {
        res.status(404).json({ error: { code: 'file_not_found', message: `Path "${path}" not found` } });
        return;
      }
      console.error('[SANDBOXES] GET files/info error:', err);
      res.status(500).json({ error: { code: 'internal_error', message: err instanceof Error ? err.message : 'Internal error' } });
    }
  });

  // GET /v1/sandboxes/:id/files/exists — check path existence
  router.get('/:id/files/exists', async (req: Request, res: Response) => {
    const teamId = (req as any).teamId as string;
    const { id: clientSandboxId } = req.params as { id: string };
    const path = typeof req.query.path === 'string' ? req.query.path : undefined;

    try {
      if (!path) {
        res.status(400).json({ error: { code: 'invalid_request', message: 'path query parameter is required' } });
        return;
      }

      const sandbox = await resolveE2BSandbox(
        clientSandboxId,
        teamId,
        getRequesterUserId(req) ?? 'anonymous',
      );
      if (!sandbox) {
        res.status(404).json({ error: { code: 'sandbox_not_found', message: `Sandbox "${clientSandboxId}" not found` } });
        return;
      }

      const keepAlive = new SandboxKeepAliveHelper({
        renew: (ttlMs) => Sandbox.setTimeout(sandbox.sandboxId, ttlMs),
        resolveTtlMs: () => getSandboxTimeoutMs(sandbox.sandboxId),
        logTag: `[SANDBOXES][files-exists][${sandbox.sandboxId}]`,
      });
      await keepAlive.start();

      try {
        const exists = await getFilesystemCompat(sandbox).exists(path, {
          user: SANDBOX_ROOT_USER,
        });
        res.json(exists);
      } finally {
        keepAlive.stop();
      }
    } catch (err) {
      console.error('[SANDBOXES] GET files/exists error:', err);
      res.status(500).json({ error: { code: 'internal_error', message: err instanceof Error ? err.message : 'Internal error' } });
    }
  });

  // POST /v1/sandboxes/:id/files/mkdir — create a directory
  router.post('/:id/files/mkdir', async (req: Request, res: Response) => {
    const teamId = (req as any).teamId as string;
    const { id: clientSandboxId } = req.params as { id: string };
    const { path } = req.body as { path?: string };

    try {
      if (!path) {
        res.status(400).json({ error: { code: 'invalid_request', message: 'path is required' } });
        return;
      }

      const sandbox = await resolveE2BSandbox(
        clientSandboxId,
        teamId,
        getRequesterUserId(req) ?? 'anonymous',
      );
      if (!sandbox) {
        res.status(404).json({ error: { code: 'sandbox_not_found', message: `Sandbox "${clientSandboxId}" not found` } });
        return;
      }

      const keepAlive = new SandboxKeepAliveHelper({
        renew: (ttlMs) => Sandbox.setTimeout(sandbox.sandboxId, ttlMs),
        resolveTtlMs: () => getSandboxTimeoutMs(sandbox.sandboxId),
        logTag: `[SANDBOXES][files-mkdir][${sandbox.sandboxId}]`,
      });
      await keepAlive.start();

      try {
        const created = await getFilesystemCompat(sandbox).makeDir(path, {
          user: SANDBOX_ROOT_USER,
        });
        res.json(created);
      } finally {
        keepAlive.stop();
      }
    } catch (err) {
      console.error('[SANDBOXES] POST files/mkdir error:', err);
      res.status(500).json({ error: { code: 'internal_error', message: err instanceof Error ? err.message : 'Internal error' } });
    }
  });

  // POST /v1/sandboxes/:id/files/rename — rename a file or directory
  router.post('/:id/files/rename', async (req: Request, res: Response) => {
    const teamId = (req as any).teamId as string;
    const { id: clientSandboxId } = req.params as { id: string };
    const { oldPath, newPath } = req.body as { oldPath?: string; newPath?: string };

    try {
      if (!oldPath || !newPath) {
        res.status(400).json({ error: { code: 'invalid_request', message: 'oldPath and newPath are required' } });
        return;
      }

      const sandbox = await resolveE2BSandbox(
        clientSandboxId,
        teamId,
        getRequesterUserId(req) ?? 'anonymous',
      );
      if (!sandbox) {
        res.status(404).json({ error: { code: 'sandbox_not_found', message: `Sandbox "${clientSandboxId}" not found` } });
        return;
      }

      const keepAlive = new SandboxKeepAliveHelper({
        renew: (ttlMs) => Sandbox.setTimeout(sandbox.sandboxId, ttlMs),
        resolveTtlMs: () => getSandboxTimeoutMs(sandbox.sandboxId),
        logTag: `[SANDBOXES][files-rename][${sandbox.sandboxId}]`,
      });
      await keepAlive.start();

      try {
        const entry = await getFilesystemCompat(sandbox).rename(oldPath, newPath, {
          user: SANDBOX_ROOT_USER,
        });
        res.json(serializeFilesystemEntry(entry));
      } finally {
        keepAlive.stop();
      }
    } catch (err) {
      if (isMissingFilesystemPathError(err)) {
        res.status(404).json({ error: { code: 'file_not_found', message: `Path "${oldPath}" not found` } });
        return;
      }
      console.error('[SANDBOXES] POST files/rename error:', err);
      res.status(500).json({ error: { code: 'internal_error', message: err instanceof Error ? err.message : 'Internal error' } });
    }
  });

  // DELETE /v1/sandboxes/:id/files?path=<path> — remove a file or directory
  router.delete('/:id/files', async (req: Request, res: Response) => {
    const teamId = (req as any).teamId as string;
    const { id: clientSandboxId } = req.params as { id: string };
    const path = typeof req.query.path === 'string' ? req.query.path : undefined;

    try {
      if (!path) {
        res.status(400).json({ error: { code: 'invalid_request', message: 'path query parameter is required' } });
        return;
      }

      const sandbox = await resolveE2BSandbox(
        clientSandboxId,
        teamId,
        getRequesterUserId(req) ?? 'anonymous',
      );
      if (!sandbox) {
        res.status(404).json({ error: { code: 'sandbox_not_found', message: `Sandbox "${clientSandboxId}" not found` } });
        return;
      }

      const keepAlive = new SandboxKeepAliveHelper({
        renew: (ttlMs) => Sandbox.setTimeout(sandbox.sandboxId, ttlMs),
        resolveTtlMs: () => getSandboxTimeoutMs(sandbox.sandboxId),
        logTag: `[SANDBOXES][files-remove][${sandbox.sandboxId}]`,
      });
      await keepAlive.start();

      try {
        await getFilesystemCompat(sandbox).remove(path, {
          user: SANDBOX_ROOT_USER,
        });
        res.status(204).end();
      } finally {
        keepAlive.stop();
      }
    } catch (err) {
      if (isMissingFilesystemPathError(err)) {
        res.status(404).json({ error: { code: 'file_not_found', message: `Path "${path}" not found` } });
        return;
      }
      console.error('[SANDBOXES] DELETE files error:', err);
      res.status(500).json({ error: { code: 'internal_error', message: err instanceof Error ? err.message : 'Internal error' } });
    }
  });

  // POST /v1/sandboxes/:id/exec — run command
  router.post('/:id/exec', async (req: Request, res: Response) => {
    const teamId = (req as any).teamId as string;
    const { id: clientSandboxId } = req.params as { id: string };

    try {
      const resolvedSandbox = await resolveSandboxHandle(clientSandboxId, teamId, getRequesterUserId(req) ?? 'anonymous');
      if (!resolvedSandbox) {
        res.status(404).json({ error: { code: 'sandbox_not_found', message: `Sandbox "${clientSandboxId}" not found` } });
        return;
      }
      const sandbox = resolvedSandbox.handle;

      const { command, cwd, envs, timeoutMs } = req.body as {
        command: string;
        cwd?: string;
        envs?: Record<string, string>;
        timeoutMs?: number;
      };

      if (!command) {
        res.status(400).json({ error: { code: 'invalid_request', message: 'command is required' } });
        return;
      }

      const keepAlive = new SandboxKeepAliveHelper({
        renew: (ttlMs) => sandbox.renew(ttlMs),
        logTag: `[SANDBOXES][exec][${sandbox.sandboxId}]`,
      });
      await keepAlive.start();

      const timeout = Math.min(timeoutMs ?? 60_000, MAX_EXEC_TIMEOUT_MS);
      try {
        try {
          const result = await sandbox.exec(command, {
            runAs: SANDBOX_ROOT_USER === 'root' ? 'root' : 'default',
            ...(cwd ? { cwd } : {}),
            ...(envs ? { envs } : {}),
            timeoutMs: timeout,
          });
          res.json({ stdout: result.stdout, stderr: result.stderr, exitCode: result.exitCode });
        } catch (cmdErr: any) {
          if (cmdErr?.message?.includes('timed out')) {
            res.status(408).json({ error: { code: 'command_timeout', message: 'Command execution timed out' } });
          } else {
            throw cmdErr;
          }
        }
      } finally {
        keepAlive.stop();
        await sandbox.close().catch(() => {});
      }
    } catch (err: any) {
      console.error('[SANDBOXES] POST exec error:', err);
      res.status(500).json({ error: { code: 'internal_error', message: err instanceof Error ? err.message : 'Internal error' } });
    }
  });

  // POST /v1/sandboxes/:id/git/clone — clone repository
  // @deprecated Use POST /v1/sandboxes/:id/exec with a git clone command instead.
  // This endpoint is a thin wrapper around sandbox.exec() and will be removed in a future release.
  router.post('/:id/git/clone', async (req: Request, res: Response) => {
    console.warn('[DEPRECATED] POST /v1/sandboxes/:id/git/clone is deprecated. Use POST /v1/sandboxes/:id/exec instead. This endpoint will be removed in a future release.');
    res.setHeader('X-Deprecated', 'Use POST /v1/sandboxes/:id/exec with a git clone command instead');
    const teamId = (req as any).teamId as string;
    const { id: clientSandboxId } = req.params as { id: string };

    try {
      const resolvedSandbox = await resolveSandboxHandle(clientSandboxId, teamId, getRequesterUserId(req) ?? 'anonymous');
      if (!resolvedSandbox) {
        res.status(404).json({ error: { code: 'sandbox_not_found', message: `Sandbox "${clientSandboxId}" not found` } });
        return;
      }
      const sandbox = resolvedSandbox.handle;

      const { url, path, token, depth, branch } = req.body as {
        url: string;
        path?: string;
        token?: string;
        depth?: number;
        branch?: string;
      };

      if (!url) {
        res.status(400).json({ error: { code: 'invalid_request', message: 'url is required' } });
        return;
      }

      const keepAlive = new SandboxKeepAliveHelper({
        renew: (ttlMs) => sandbox.renew(ttlMs),
        logTag: `[SANDBOXES][git-clone][${sandbox.sandboxId}]`,
      });
      await keepAlive.start();

      try {
        const clonePath = path || '/home/user/repo';

        // Build git clone command since the sandbox handle only exposes exec/file primitives.
        let cloneUrl = url;
        if (token) {
          const parsed = new URL(url);
          parsed.username = 'x-access-token';
          parsed.password = token;
          cloneUrl = parsed.toString();
        }
        const args = ['git', 'clone'];
        if (depth) args.push('--depth', String(depth));
        if (branch) args.push('--branch', branch);
        args.push(cloneUrl, clonePath);

        const result = await sandbox.exec(args.join(' '), {
          runAs: SANDBOX_ROOT_USER === 'root' ? 'root' : 'default',
          timeoutMs: 120_000,
        });
        if (result.exitCode !== 0) {
          res.status(400).json({ error: { code: 'git_clone_failed', message: result.stderr || 'Clone failed' } });
          return;
        }

        res.json({ path: clonePath, branch: branch || 'default' });
      } finally {
        keepAlive.stop();
        await sandbox.close().catch(() => {});
      }
    } catch (err) {
      console.error('[SANDBOXES] POST git/clone error:', err);
      res.status(400).json({ error: { code: 'git_clone_failed', message: err instanceof Error ? err.message : 'Clone failed' } });
    }
  });

  // POST /v1/sandboxes/:id/git/create-pr — extract changes, push branch, open PR (platform-side)
  router.post('/:id/git/create-pr', async (req: Request, res: Response) => {
    const teamId = (req as any).teamId as string;
    const { id: clientSandboxId } = req.params as { id: string };

    try {
      const resolvedSandbox = await resolveSandboxHandle(clientSandboxId, teamId, getRequesterUserId(req) ?? 'anonymous');
      if (!resolvedSandbox) {
        res.status(404).json({ error: { code: 'sandbox_not_found', message: `Sandbox "${clientSandboxId}" not found` } });
        return;
      }
      const sandbox = resolvedSandbox.handle;

      const {
        baseCommitSha,
        repoPath,
        repository,
        baseBranch,
        title,
        body: prBody,
        commitMessage,
        authorName,
        authorEmail,
        workflowName,
        username,
      } = req.body as {
        baseCommitSha: string;
        repoPath?: string;
        repository: string;
        baseBranch: string;
        title: string;
        body: string;
        commitMessage: string;
        authorName: string;
        authorEmail: string;
        workflowName: string;
        username: string;
      };

      if (!baseCommitSha || !repository || !baseBranch || !title || !commitMessage || !workflowName || !username) {
        res.status(400).json({ error: { code: 'invalid_request', message: 'Missing required fields' } });
        return;
      }

      const clonePath = repoPath || '/home/user/repo';
      const requesterUserId = getRequesterUserId(req);
      if (!requesterUserId) {
        res.status(401).json({ error: { code: 'unauthorized', message: 'Unable to resolve requester user ID' } });
        return;
      }
      const { token } = await getGitHubInstallationAccessToken({
        teamId,
        userId: requesterUserId,
        repository,
      });
      const keepAlive = new SandboxKeepAliveHelper({
        renew: (ttlMs) => sandbox.renew(ttlMs),
        logTag: `[SANDBOXES][git-create-pr][${sandbox.sandboxId}]`,
      });
      await keepAlive.start();

      try {
        // 1. Auto-commit pending changes inside sandbox (local only, no credentials)
        await sandbox.exec(
          'git config user.email "ai@21st.dev" && git config user.name "21st AI" && git add -A && git commit --no-verify -m "agent changes" 2>/dev/null || true',
          {
            cwd: clonePath,
            runAs: SANDBOX_ROOT_USER === 'root' ? 'root' : 'default',
            timeoutMs: 60_000,
          },
        );

        // 2. Extract full patch from sandbox
        const patchResult = await sandbox.exec(
          `git --no-pager diff ${baseCommitSha}..HEAD`,
          {
            cwd: clonePath,
            runAs: SANDBOX_ROOT_USER === 'root' ? 'root' : 'default',
            timeoutMs: 30_000,
          },
        );

        if ((patchResult.exitCode ?? 0) !== 0) {
          throw new Error(patchResult.stderr || 'Failed to extract git patch');
        }

        const patch = (patchResult.stdout || '').trim();
        if (!patch) {
          res.json({ created: false, message: 'No changes to push' });
          return;
        }

        // 3. Generate branch name per PRD: agent/{workflow}/{username}/{short-description}
        const shortDesc = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
          .slice(0, 40);
        const branchName = `agent/${workflowName}/${username}/${shortDesc}`;

        // 4. Platform-side: shallow clone → apply patch → commit → push
        const { execFileSync } = await import('node:child_process');
        const { mkdtempSync, rmSync, writeFileSync } = await import('node:fs');
        const { tmpdir } = await import('node:os');
        const { join } = await import('node:path');

        const tmpDir = mkdtempSync(join(tmpdir(), 'agent-pr-'));
        const repoDir = join(tmpDir, 'repo');

        try {
          const cloneUrl = buildAuthenticatedGitHubUrl(repository, token);

          execFileSync('git', ['clone', '--depth', '1', '--branch', baseBranch, cloneUrl, repoDir], { timeout: 120_000 });
          execFileSync('git', ['checkout', '-b', branchName], { cwd: repoDir });

          const patchFile = join(tmpDir, 'changes.patch');
          writeFileSync(patchFile, patch);
          execFileSync('git', ['apply', '--allow-empty', patchFile], { cwd: repoDir });

          execFileSync('git', ['add', '-A'], { cwd: repoDir });

          const status = execFileSync('git', ['status', '--porcelain'], { cwd: repoDir, encoding: 'utf-8' });
          if (!status.trim()) {
            res.json({ created: false, message: 'No changes after apply' });
            return;
          }

          // Commit with Co-Authored-By per PRD §2.3
          const fullMessage = `${commitMessage}\n\nCo-Authored-By: ${authorName} <${authorEmail}>`;
          execFileSync('git', ['-c', 'user.name=21st AI', '-c', 'user.email=ai@21st.dev', 'commit', '-m', fullMessage], { cwd: repoDir });

          const sha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repoDir, encoding: 'utf-8' }).trim();
          execFileSync('git', ['push', '-u', 'origin', branchName], { cwd: repoDir, timeout: 120_000 });

          // 5. Open PR via GitHub API
          const prResponse = await fetch(`https://api.github.com/repos/${repository}/pulls`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/vnd.github+json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title,
              body: prBody || '',
              head: branchName,
              base: baseBranch,
            }),
          });

          if (!prResponse.ok) {
            const err = await prResponse.json().catch(() => ({}));
            console.error('[SANDBOXES] GitHub PR creation failed:', err);
            // Branch was pushed, PR creation failed — return partial success
            res.json({ created: false, branchName, sha, message: `Branch pushed but PR creation failed: ${(err as any)?.message || prResponse.status}` });
            return;
          }

          const pr = await prResponse.json() as { html_url: string; number: number };

          res.json({ created: true, prUrl: pr.html_url, prNumber: pr.number, branchName, sha });
        } finally {
          rmSync(tmpDir, { recursive: true, force: true });
        }
      } finally {
        keepAlive.stop();
        await sandbox.close().catch(() => {});
      }
    } catch (err) {
      console.error('[SANDBOXES] POST git/create-pr error:', err);
      res.status(500).json({ error: { code: 'create_pr_failed', message: err instanceof Error ? err.message : 'Failed to create PR' } });
    }
  });

  return router;
}
