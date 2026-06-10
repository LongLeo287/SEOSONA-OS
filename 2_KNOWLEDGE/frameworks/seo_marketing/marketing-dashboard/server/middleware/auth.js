/**
 * API Key Authentication Middleware
 * Protects API endpoints with API key validation
 */

/**
 * API Key middleware
 * Validates X-API-Key header against environment variable
 * Bypasses in development mode if SKIP_AUTH=true
 */
export function apiKeyAuth(c, next) {
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const SKIP_AUTH = process.env.SKIP_AUTH === 'true';
  const API_KEY = process.env.API_KEY;

  // Skip in development mode if configured
  if (NODE_ENV === 'development' && SKIP_AUTH) {
    console.warn('⚠️  AUTH BYPASSED (development mode)');
    return next();
  }

  // Require API key in production or if SKIP_AUTH not set
  if (!API_KEY) {
    return c.json({
      error: 'Server misconfigured',
      message: 'API_KEY not set in environment'
    }, 500);
  }

  const providedKey = c.req.header('X-API-Key');

  if (!providedKey) {
    return c.json({
      error: 'Unauthorized',
      message: 'Missing X-API-Key header'
    }, 401);
  }

  if (providedKey !== API_KEY) {
    return c.json({
      error: 'Unauthorized',
      message: 'Invalid API key'
    }, 401);
  }

  // Valid key, proceed
  return next();
}
