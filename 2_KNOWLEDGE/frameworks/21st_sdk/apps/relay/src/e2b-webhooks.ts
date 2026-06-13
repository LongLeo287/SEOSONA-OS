import { createHash, timingSafeEqual } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { raw, Request, Response, Router } from 'express';
import { sendSandboxLifecycleUsageToBilling } from './billing';
import { db } from './db';
import { anAgentConfigs, anSandboxes } from './schema';

type E2BExecutionData = {
  started_at?: string;
  execution_time?: number;
  vcpu_count?: number;
  memory_mb?: number;
};

type E2BWebhookPayload = {
  id?: string;
  type?: string;
  timestamp?: string;
  sandboxExecutionId?: string;
  sandboxId?: string;
  sandboxTeamId?: string;
  sandbox_execution_id?: string;
  sandbox_id?: string;
  sandbox_team_id?: string;
  eventData?: {
    sandbox_metadata?: Record<string, string | undefined>;
    execution?: E2BExecutionData;
  };
  event_data?: {
    sandbox_metadata?: Record<string, string | undefined>;
    execution?: E2BExecutionData;
  };
};

function toRawBody(req: Request): string {
  if (Buffer.isBuffer(req.body)) {
    return req.body.toString('utf8');
  }

  if (typeof req.body === 'string') {
    return req.body;
  }

  return '';
}

function getHeaderValue(header: string | string[] | undefined): string | null {
  if (typeof header === 'string' && header.length > 0) {
    return header;
  }

  if (Array.isArray(header) && header[0]) {
    return header[0];
  }

  return null;
}

function verifyWebhookSignature(secret: string, payload: string, signature: string): boolean {
  const expected = createHash('sha256')
    .update(secret + payload)
    .digest('base64')
    .replace(/=+$/, '');

  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, providedBuffer);
}

export function initE2BWebhooksRouter(): Router {
  const router = Router();
  const rawJsonParser = raw({ type: 'application/json', limit: '1mb' });

  router.post('/lifecycle', rawJsonParser, async (req: Request, res: Response) => {
    const secret = process.env.E2B_WEBHOOK_SECRET?.trim();
    if (!secret) {
      console.error('[E2B_WEBHOOK] Missing E2B_WEBHOOK_SECRET');
      res.status(500).json({ error: 'internal_error', message: 'Webhook secret is not configured' });
      return;
    }

    const rawBody = toRawBody(req);
    if (!rawBody) {
      res.status(400).json({ error: 'invalid_request', message: 'Webhook body is required' });
      return;
    }

    const signature = getHeaderValue(req.headers['e2b-signature']);
    if (!signature || !verifyWebhookSignature(secret, rawBody, signature)) {
      console.warn('[E2B_WEBHOOK] Invalid webhook signature', {
        hasSignature: !!signature,
        bodyLength: rawBody.length,
      });
      res.status(401).json({ error: 'unauthorized', message: 'Invalid webhook signature' });
      return;
    }

    console.log('[E2B_WEBHOOK] Raw event received', rawBody);

    let payload: E2BWebhookPayload;
    try {
      payload = JSON.parse(rawBody) as E2BWebhookPayload;
    } catch (error) {
      console.error('[E2B_WEBHOOK] Failed to parse payload', error);
      res.status(400).json({ error: 'invalid_request', message: 'Invalid JSON payload' });
      return;
    }

    const eventType = payload.type;
    if (eventType !== 'sandbox.lifecycle.paused' && eventType !== 'sandbox.lifecycle.killed') {
      console.log('[E2B_WEBHOOK] Ignoring unsupported lifecycle event', {
        eventType,
        sandboxId: payload.sandboxId,
        sandboxExecutionId: payload.sandboxExecutionId,
      });
      res.status(204).end();
      return;
    }

    const sandboxId = payload.sandboxId ?? payload.sandbox_id;
    const sandboxExecutionId = payload.sandboxExecutionId ?? payload.sandbox_execution_id;
    const eventData = payload.eventData ?? payload.event_data;
    const execution = eventData?.execution;
    const metadata = eventData?.sandbox_metadata ?? {};

    if (!sandboxId || !sandboxExecutionId) {
      console.warn('[E2B_WEBHOOK] Missing required lifecycle identifiers', {
        eventType,
        sandboxId,
        sandboxExecutionId,
        rawBodyPreview: rawBody.slice(0, 1000),
      });
      res.status(400).json({ error: 'invalid_request', message: 'sandboxId and sandboxExecutionId are required' });
      return;
    }

    if (!execution || typeof execution.execution_time !== 'number' || execution.execution_time <= 0) {
      console.warn('[E2B_WEBHOOK] Ignoring lifecycle event without positive execution time', {
        eventType,
        sandboxId,
        sandboxExecutionId,
        executionTime: execution?.execution_time,
      });
      res.status(204).end();
      return;
    }

    try {
      console.log('[E2B_WEBHOOK] Processing lifecycle event', {
        eventType,
        sandboxId,
        sandboxExecutionId,
        executionTime: execution.execution_time,
        metadataTeamId: metadata.teamId,
        clientSandboxId: metadata.clientSandboxId,
      });

      const [sandboxRecord] = await db
        .select({
          teamId: anAgentConfigs.team_id,
          clientSandboxId: anSandboxes.client_sandbox_id,
          meta: anSandboxes.meta,
        })
        .from(anSandboxes)
        .innerJoin(anAgentConfigs, eq(anSandboxes.agent_id, anAgentConfigs.id))
        .where(eq(anSandboxes.sandbox_id, sandboxId))
        .limit(1);

      const teamId = sandboxRecord?.teamId ?? metadata.teamId;
      if (!teamId) {
        console.warn('[E2B_WEBHOOK] Missing team ID for sandbox lifecycle billing', {
          sandboxId,
          sandboxExecutionId,
          sandboxTeamId: payload.sandboxTeamId ?? payload.sandbox_team_id,
          metadataTeamId: metadata.teamId,
        });
        res.status(204).end();
        return;
      }

      await sendSandboxLifecycleUsageToBilling({
        teamId,
        transactionId: `${sandboxExecutionId}:sandbox_runtime`,
        sandboxExecutionId,
        sandboxId,
        clientSandboxId: sandboxRecord?.clientSandboxId ?? metadata.clientSandboxId,
        sandboxMeta: sandboxRecord?.meta,
        durationMs: execution.execution_time,
        startedAt: execution.started_at,
        endedAt: payload.timestamp,
      });

      console.log('[E2B_WEBHOOK] Lifecycle billing completed', {
        sandboxId,
        sandboxExecutionId,
        teamId,
        transactionId: `${sandboxExecutionId}:sandbox_runtime`,
      });
      res.status(204).end();
    } catch (error) {
      console.error('[E2B_WEBHOOK] Failed to process lifecycle webhook', error);
      res.status(500).json({ error: 'internal_error', message: 'Failed to process webhook' });
    }
  });

  return router;
}
