import { timingSafeEqual } from 'node:crypto';
import { raw, Request, Response, Router } from 'express';
import { z } from 'zod';
import { sendOpenRouterUsageToBilling } from './billing';

const otlpValueSchema = z.object({
  stringValue: z.string().optional(),
  intValue: z.union([z.string(), z.number()]).optional(),
  doubleValue: z.number().optional(),
  boolValue: z.boolean().optional(),
});

const otlpAttributeSchema = z.object({
  key: z.string(),
  value: otlpValueSchema.optional(),
});

const primitiveOtlpValueSchema = otlpValueSchema.transform((value) => {
  if (typeof value.stringValue === 'string') return value.stringValue;
  if (typeof value.doubleValue === 'number' && Number.isFinite(value.doubleValue)) {
    return value.doubleValue;
  }
  if (typeof value.intValue === 'string' || typeof value.intValue === 'number') {
    const parsed = Number(value.intValue);
    if (Number.isFinite(parsed)) return parsed;
  }
  if (typeof value.boolValue === 'boolean') return value.boolValue;
  return undefined;
});

const otlpSpanSchema = z.object({
  attributes: z.array(otlpAttributeSchema).optional().default([]),
});

const otlpPayloadSchema = z.object({
  resourceSpans: z.array(z.object({
    resource: z.object({
      attributes: z.array(otlpAttributeSchema).optional().default([]),
    }).optional(),
    scopeSpans: z.array(z.object({
      spans: z.array(otlpSpanSchema).optional().default([]),
    })).optional().default([]),
  })).optional().default([]),
});

const billableAttributesSchema = z.object({
  'openrouter.trace.id': z.string(),
  'gen_ai.usage.total_cost': z.number().positive(),
  'gen_ai.usage.input_tokens': z.number().optional(),
  'gen_ai.usage.output_tokens': z.number().optional(),
  'user.id': z.string().optional(),
  'trace.metadata.openrouter.user_id': z.string().optional(),
  'session.id': z.string().optional(),
  'gen_ai.provider.name': z.string().optional(),
  'gen_ai.request.model': z.string().optional(),
  'trace.metadata.openrouter.provider_name': z.string().optional(),
}).passthrough();

function getHeaderValue(header: string | string[] | undefined): string | null {
  if (typeof header === 'string' && header.length > 0) return header;
  if (Array.isArray(header) && header[0]) return header[0];
  return null;
}

function toRawBody(req: Request): string {
  if (Buffer.isBuffer(req.body)) return req.body.toString('utf8');
  if (typeof req.body === 'string') return req.body;
  return '';
}

function secretsMatch(expected: string, provided: string): boolean {
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, providedBuffer);
}

function getWebhookSecret(req: Request): string | null {
  const authorization = getHeaderValue(req.headers.authorization);
  if (authorization?.startsWith('Bearer ')) {
    return authorization.slice('Bearer '.length);
  }

  return null;
}

export function initOpenRouterWebhooksRouter(): Router {
  const router = Router();
  const rawJsonParser = raw({ type: 'application/json', limit: '2mb' });

  router.post('/broadcast', rawJsonParser, async (req: Request, res: Response) => {
    const expectedSecret = process.env.OPENROUTER_API_KEY?.trim();
    if (!expectedSecret) {
      console.error('[OPENROUTER_WEBHOOK] Missing OPENROUTER_API_KEY');
      res.status(500).json({ error: 'internal_error', message: 'Webhook secret is not configured' });
      return;
    }

    const providedSecret = getWebhookSecret(req);
    if (!providedSecret || !secretsMatch(expectedSecret, providedSecret)) {
      console.warn('[OPENROUTER_WEBHOOK] Invalid webhook secret');
      res.status(401).json({ error: 'unauthorized', message: 'Invalid webhook secret' });
      return;
    }

    if (getHeaderValue(req.headers['x-test-connection']) === 'true') {
      res.status(204).end();
      return;
    }

    const rawBody = toRawBody(req);
    if (!rawBody) {
      res.status(400).json({ error: 'invalid_request', message: 'Webhook body is required' });
      return;
    }

    console.log('[OPENROUTER_WEBHOOK] Raw payload', rawBody);

    let payload: z.infer<typeof otlpPayloadSchema>;
    try {
      payload = otlpPayloadSchema.parse(JSON.parse(rawBody));
    } catch (error) {
      console.error('[OPENROUTER_WEBHOOK] Failed to parse payload', error);
      res.status(400).json({ error: 'invalid_request', message: 'Invalid JSON payload' });
      return;
    }

    try {
      let billed = 0;

      for (const resourceSpan of payload.resourceSpans ?? []) {
        const resourceAttributes = Object.fromEntries(
          (resourceSpan.resource?.attributes ?? []).flatMap((attribute) => {
            const value = primitiveOtlpValueSchema.parse(attribute.value ?? {});
            return value === undefined ? [] : [[attribute.key, value] as const];
          }),
        );

        for (const scopeSpan of resourceSpan.scopeSpans ?? []) {
          for (const span of scopeSpan.spans ?? []) {
            const rawAttributes = Object.fromEntries(
              [...Object.entries(resourceAttributes), ...span.attributes.flatMap((attribute) => {
                const value = primitiveOtlpValueSchema.parse(attribute.value ?? {});
                return value === undefined ? [] : [[attribute.key, value] as const];
              })],
            );

            const parsedAttributes = billableAttributesSchema.safeParse(rawAttributes);
            if (!parsedAttributes.success) {
              continue;
            }

            const attributes = parsedAttributes.data;
            const teamId = attributes['user.id'];
            if (!teamId) {
              continue;
            }

            await sendOpenRouterUsageToBilling({
              teamId,
              transactionId: `${attributes['openrouter.trace.id']}:llm_request`,
              totalCostUsd: attributes['gen_ai.usage.total_cost'],
              inputTokens: attributes['gen_ai.usage.input_tokens'],
              outputTokens: attributes['gen_ai.usage.output_tokens'],
              userId: attributes['trace.metadata.openrouter.user_id'],
              sessionId: attributes['session.id'],
              providerName: attributes['trace.metadata.openrouter.provider_name'] ?? attributes['gen_ai.provider.name'],
              model: attributes['gen_ai.request.model'],
            });
            billed++;
          }
        }
      }

      console.log('[OPENROUTER_WEBHOOK] Processed payload', { billed });
      res.status(204).end();
    } catch (error) {
      console.error('[OPENROUTER_WEBHOOK] Failed to process webhook', error);
      res.status(500).json({ error: 'internal_error', message: 'Failed to process webhook' });
    }
  });

  return router;
}
