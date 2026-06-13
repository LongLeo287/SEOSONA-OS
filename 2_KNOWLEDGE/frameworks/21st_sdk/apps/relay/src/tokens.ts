import { Router, Request, Response } from 'express';
import { SignJWT } from 'jose';

const MAX_EXPIRES_IN_SECONDS = 24 * 60 * 60; // 24h
const DEFAULT_EXPIRES_IN_SECONDS = 60 * 60; // 1h

function parseExpiresIn(value: string): number {
  const match = value.match(/^(\d+)(s|m|h|d)$/);
  if (!match) return DEFAULT_EXPIRES_IN_SECONDS;
  const num = parseInt(match[1]!, 10);
  const unit = match[2];
  const seconds = unit === 's' ? num : unit === 'm' ? num * 60 : unit === 'h' ? num * 3600 : num * 86400;
  return Math.min(seconds, MAX_EXPIRES_IN_SECONDS);
}

let jwtSecret: Uint8Array | null = null;

export function getJwtSecret(): Uint8Array {
  if (!jwtSecret) {
    const secret = process.env.AN_JWT_SECRET;
    if (!secret) throw new Error('AN_JWT_SECRET environment variable is required');
    jwtSecret = new TextEncoder().encode(secret);
  }
  return jwtSecret;
}

export function initTokensRouter(): Router {
  const router = Router();

  router.post('/', async (req: Request, res: Response) => {
    // Only API keys can create tokens — reject JWT token auth.
    if ((req as any).tokenClaims) {
      res.status(403).json({ error: 'Tokens cannot create other tokens. Use an API key (21st_sk_).' });
      return;
    }

    const {
      agents,
      userId: bodyUserId,
      endUserId,
      maxMessages,
      expiresIn,
      metadata,
    } = req.body;
    const userId = bodyUserId || (req as any).apiKey?.user_id;
    const teamId = (req as any).teamId as string;

    const seconds = expiresIn ? parseExpiresIn(expiresIn) : DEFAULT_EXPIRES_IN_SECONDS;
    const expiresAt = new Date(Date.now() + seconds * 1000);

    const payload: Record<string, unknown> = { team_id: teamId };
    if (agents) payload.agents = agents;
    if (userId) payload.user_id = userId;
    if (typeof endUserId === 'string' && endUserId.length > 0) {
      payload.end_user_id = endUserId;
    }
    if (maxMessages) payload.max_messages = maxMessages;
    if (metadata) payload.metadata = metadata;

    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresAt)
      .sign(getJwtSecret());

    const token = `an_t_${jwt}`;

    res.status(201).json({ token, expiresAt: expiresAt.toISOString() });
  });

  return router;
}
