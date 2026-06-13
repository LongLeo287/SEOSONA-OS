import { createPublicKey, type KeyObject } from 'node:crypto';
import { Request, Response, NextFunction } from 'express';
import { hashApiKey, isAgentApiKey } from '@repo/api-key-security';
import { eq, or } from 'drizzle-orm';
import { jwtVerify } from 'jose';
import { db } from './db.js';
import { apiKeys, anApiKeys } from './schema.js';
import { getJwtSecret } from './tokens.js';

let cachedProxyPublicKey: KeyObject | null = null;
const RELAY_PROXY_AUDIENCE = 'relay-proxy';

function getProxyPublicKey(): KeyObject {
  if (cachedProxyPublicKey) return cachedProxyPublicKey;
  const pem = process.env.CLAUDE_PROXY_PRIVATE_JWT?.replace(/\\n/g, '\n') || '';
  cachedProxyPublicKey = createPublicKey(pem);
  return cachedProxyPublicKey;
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  const key = authHeader.slice(7);
  const keyHash = hashApiKey(key);

  let teamId: string | undefined;

  if (key.startsWith('an_t_')) {
    // JWT token — local verification, no DB lookup
    const jwt = key.slice(5);
    try {
      const { payload } = await jwtVerify(jwt, getJwtSecret());
      teamId = payload.team_id as string;
      (req as any).tokenClaims = payload;
    } catch {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }
  } else if (isAgentApiKey(key)) {
    // Current 21st keys and legacy an_sk_ keys share the an_api_keys table.
    const [anKey] = await db
      .select()
      .from(anApiKeys)
      .where(or(eq(anApiKeys.key_hash, keyHash), eq(anApiKeys.key, key)))
      .limit(1);

    if (!anKey) {
      res.status(401).json({ error: 'Invalid API key' });
      return;
    }
    if (!anKey.is_active) {
      res.status(403).json({ error: 'API key is inactive' });
      return;
    }
    if (anKey.expires_at && anKey.expires_at < new Date()) {
      res.status(403).json({ error: 'API key has expired' });
      return;
    }

    teamId = anKey.team_id;
    (req as any).apiKeySource = 'an';

    db.update(anApiKeys)
      .set({ last_used_at: new Date() })
      .where(eq(anApiKeys.id, anKey.id))
      .then(() => {})
      .catch((err) => console.error('[AUTH] Failed to update last_used_at:', err));

    (req as any).apiKey = anKey;
  } else {
    // Try proxy JWT (RS256) first, fall through to legacy API key
    let resolved = false;
    try {
      const { payload } = await jwtVerify(key, getProxyPublicKey(), {
        algorithms: ['RS256'],
        audience: RELAY_PROXY_AUDIENCE,
      });
      if (payload.teamId && payload.clientSandboxId) {
        teamId = payload.teamId as string;
        (req as any).proxyJwtClaims = payload;
        resolved = true;
      }
    } catch {
      // Not a valid proxy JWT — fall through to legacy key
    }

    if (!resolved) {
      // Legacy API key
      const [apiKey] = await db
        .select()
        .from(apiKeys)
        .where(or(eq(apiKeys.key_hash, keyHash), eq(apiKeys.key, key)))
        .limit(1);

      if (!apiKey) {
        res.status(401).json({ error: 'Invalid API key' });
        return;
      }
      if (!apiKey.is_active) {
        res.status(403).json({ error: 'API key is inactive' });
        return;
      }
      if (apiKey.expires_at && apiKey.expires_at < new Date()) {
        res.status(403).json({ error: 'API key has expired' });
        return;
      }
      if (!apiKey.team_id) {
        res.status(403).json({ error: 'API key has no team' });
        return;
      }

      teamId = apiKey.team_id;
      (req as any).apiKeySource = 'legacy';

      db.update(apiKeys)
        .set({ last_used_at: new Date() })
        .where(eq(apiKeys.id, apiKey.id))
        .then(() => {})
        .catch((err) => console.error('[AUTH] Failed to update last_used_at:', err));

      (req as any).apiKey = apiKey;
    }
  }

  if (!teamId) {
    res.status(401).json({ error: 'Unable to resolve team' });
    return;
  }

  (req as any).teamId = teamId;
  next();
}
