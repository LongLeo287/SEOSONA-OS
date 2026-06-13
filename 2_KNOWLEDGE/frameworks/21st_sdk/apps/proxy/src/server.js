import 'dotenv/config'
import express from 'express'
import { randomUUID } from 'node:crypto'
import { createProxyMiddleware } from 'http-proxy-middleware'
import jwt from 'jsonwebtoken'
import pg from 'pg'

const { Pool } = pg
const app = express()

// ============================================================================
// Configuration
// ============================================================================

const CONFIG = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  cacheTTL: parseInt(process.env.CACHE_TTL_MINUTES || '8', 10) * 60 * 1000, // 8 minutes default
  jwtPublicKey: process.env.JWT_PUBLIC_KEY?.replace(/\\n/g, '\n'),
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY,
  openrouterApiKey: process.env.OPENROUTER_API_KEY,
  databaseUrl: process.env.DATABASE_URL,
  databaseSslMode: (process.env.DATABASE_SSL_MODE || 'require').toLowerCase(),
}

// Validate required env vars
const missingEnvVars = []
if (!CONFIG.jwtPublicKey) missingEnvVars.push('JWT_PUBLIC_KEY')
if (!CONFIG.anthropicApiKey) missingEnvVars.push('ANTHROPIC_API_KEY')
if (!CONFIG.databaseUrl) missingEnvVars.push('DATABASE_URL')

if (missingEnvVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`)
  process.exit(1)
}

// ============================================================================
// Database Connection Pool
// ============================================================================

const poolConfig = {
  connectionString: CONFIG.databaseUrl,
  max: 10,                       // Max 10 concurrent connections
  idleTimeoutMillis: 30_000,     // Close idle connections after 30s
  connectionTimeoutMillis: 5000, // Timeout connection attempts after 5s
}

// Standalone K8s Postgres is plain TCP, while the old external contour used SSL.
// Make SSL explicit so we can switch between both without patching the code again.
if (CONFIG.databaseSslMode === 'require') {
  poolConfig.ssl = { rejectUnauthorized: false }
} else if (CONFIG.databaseSslMode !== 'disable') {
  console.error(`❌ Invalid DATABASE_SSL_MODE: ${CONFIG.databaseSslMode}. Use "require" or "disable".`)
  process.exit(1)
}

const pool = new Pool(poolConfig)

// Test database connection on startup
pool.query('SELECT NOW()')
  .then((res) => {
    console.log('✅ Database connected:', res.rows[0].now)
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message)
    process.exit(1)
  })

// ============================================================================
// In-Memory Cache
// ============================================================================

const cache = new Map()

// Cache cleanup job (runs every 5 minutes)
const cacheCleanupInterval = setInterval(() => {
  const now = Date.now()
  let cleaned = 0

  for (const [userId, data] of cache.entries()) {
    if (now - data.timestamp > CONFIG.cacheTTL) {
      cache.delete(userId)
      cleaned++
    }
  }

  if (cleaned > 0) {
    console.log(`🧹 Cleaned ${cleaned} stale cache entries. Size: ${cache.size}`)
  }
}, 5 * 60 * 1000)

// ============================================================================
// Metrics
// ============================================================================

const metrics = {
  requests: 0,
  cacheHits: 0,
  cacheMisses: 0,
  dbQueries: 0,
  authFailures: 0,
  quotaExceeded: 0,
  proxyErrors: 0,
  startTime: Date.now(),
}

function getCacheHitRate() {
  const total = metrics.cacheHits + metrics.cacheMisses
  return total === 0 ? 0 : ((metrics.cacheHits / total) * 100).toFixed(2)
}

// ============================================================================
// Express Middleware
// ============================================================================

// Extract real client IP from X-Forwarded-For (leftmost entry)
// Per Railway: their edge proxy controls this header and the leftmost IP is always the real client IP
function getClientIp(req) {
  const xff = req.headers['x-forwarded-for']
  if (xff) {
    const first = xff.split(',')[0].trim()
    if (first) return first.replace(/^::ffff:/, '')
  }
  return (req.socket?.remoteAddress || '').replace(/^::ffff:/, '')
}

function getIpDebugHeaders(req) {
  return {
    xForwardedFor: req.headers['x-forwarded-for'],
    fastlyClientIp: req.headers['fastly-client-ip'],
    xRealIp: req.headers['x-real-ip'],
    xEnvoyExternalAddress: req.headers['x-envoy-external-address'],
    cfConnectingIp: req.headers['cf-connecting-ip'],
    xForwardedHost: req.headers['x-forwarded-host'],
    xForwardedProto: req.headers['x-forwarded-proto'],
    remoteAddress: req.socket?.remoteAddress,
  }
}

app.use(express.json({ limit: '50mb' }))

// Request logging
app.use((req, res, next) => {
  metrics.requests++
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start
    // Only log non-health requests
    if (req.path !== '/health') {
      console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`)
    }
  })

  next()
})

// ============================================================================
// Health Check Endpoint (No Auth Required)
// ============================================================================

app.get('/health', (req, res) => {
  const uptime = Math.floor((Date.now() - metrics.startTime) / 1000)

  res.json({
    status: 'ok',
    uptime: `${Math.floor(uptime / 60)}m ${uptime % 60}s`,
    cache: {
      size: cache.size,
      ttl: `${CONFIG.cacheTTL / 60_000}min`,
      hitRate: `${getCacheHitRate()}%`,
    },
    database: {
      connected: pool.totalCount > 0,
      totalConnections: pool.totalCount,
      idleConnections: pool.idleCount,
      waitingRequests: pool.waitingCount,
    },
    metrics: {
      totalRequests: metrics.requests,
      cacheHits: metrics.cacheHits,
      cacheMisses: metrics.cacheMisses,
      dbQueries: metrics.dbQueries,
      authFailures: metrics.authFailures,
      quotaExceeded: metrics.quotaExceeded,
      proxyErrors: metrics.proxyErrors,
    },
    timestamp: new Date().toISOString(),
  })
})

// ============================================================================
// IP Registration (code is a signed JWT — proxy verifies signature + expiry)
// ============================================================================

app.post('/ip/register/:code', (req, res) => {
  const { code } = req.params

  let decoded
  try {
    decoded = jwt.verify(code, CONFIG.jwtPublicKey, { algorithms: ['RS256'] })
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired registration code' })
  }

  const clientIp = getClientIp(req)
  console.log('📍 IP registered', JSON.stringify({
    sandboxId: decoded?.sandboxId,
    purpose: decoded?.purpose,
    clientIp,
    headers: getIpDebugHeaders(req),
  }))
  res.json({ ok: true, ip: clientIp })
})

// ============================================================================
// Authentication Middleware
// ============================================================================

async function authenticate(req, res, next) {
  try {
    // 1. Extract JWT token from header
    const authHeader = req.headers['x-api-key'] || req.headers['authorization']
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      metrics.authFailures++
      return res.status(401).json({
        error: 'Missing authentication token',
        hint: 'Include JWT token in x-api-key or Authorization header',
      })
    }

    // 2. Verify JWT signature
    let decoded
    try {
      decoded = jwt.verify(token, CONFIG.jwtPublicKey, {
        algorithms: ['RS256'],
      })
    } catch (jwtError) {
      metrics.authFailures++

      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' })
      }
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' })
      }

      throw jwtError
    }

    const userId = decoded.userId

    if (!userId) {
      metrics.authFailures++
      return res.status(401).json({ error: 'Invalid token: missing userId' })
    }

    req.proxyAuth = decoded

    // 2b. Verify IP binding
    // if (decoded.allowedIp) {
    //   const clientIp = getClientIp(req)
    //   if (clientIp !== decoded.allowedIp) {
    //     metrics.authFailures++
    //     console.log(`🚫 IP mismatch for user ${userId}: expected ${decoded.allowedIp}, got ${clientIp}`)
    //     return res.status(403).json({ error: 'Token not valid from this IP' })
    //   }
    // }

    // 3. Check cache first
    const cached = cache.get(userId)
    const now = Date.now()

    if (cached && (now - cached.timestamp < CONFIG.cacheTTL)) {
      // Cache hit!
      metrics.cacheHits++

      if (!cached.isAllowed) {
        metrics.quotaExceeded++
        return res.status(429).json({ error: 'Usage quota exceeded' })
      }

      req.userId = userId
      return next()
    }

    // 4. Cache miss - query database
    metrics.cacheMisses++
    metrics.dbQueries++

    console.log(`🔍 Cache miss for user ${userId ?? 'unknown'} - querying DB`)

    const result = await pool.query(`
      SELECT
        CASE
          WHEN COALESCE(us.usage, 0) < COALESCE(us.limit, 100) THEN true
          ELSE false
        END as is_allowed
      FROM users u
      LEFT JOIN usages us ON u.id = us.user_id
      WHERE u.id = $1
      LIMIT 1
    `, [userId])

    if (result.rows.length === 0) {
      // User not found in DB - REJECT!
      metrics.authFailures++
      console.log(`🚫 User ${userId ?? 'unknown'} NOT FOUND in DB - REJECTED`)
      return res.status(403).json({
        error: 'User not found',
        hint: 'User must exist in database to use this proxy'
      })
    }

    const userData = result.rows[0]
    const isAllowed = userData.is_allowed

    // 5. Store in cache (just boolean + timestamp)
    cache.set(userId, { isAllowed, timestamp: now })

    console.log(`✅ Cached user ${userId ?? 'unknown'}: ${isAllowed ? 'ALLOWED' : 'DENIED'}`)

    // 6. Check quota
    if (!isAllowed) {
      metrics.quotaExceeded++
      return res.status(429).json({ error: 'Usage quota exceeded' })
    }

    req.userId = userId
    next()

  } catch (error) {
    console.error('❌ Authentication error:', error)
    metrics.authFailures++

    return res.status(500).json({
      error: 'Internal authentication error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    })
  }
}

// Apply auth middleware to all routes except /health
app.use((req, res, next) => {
  if (req.path === '/health') {
    return next()
  }
  return authenticate(req, res, next)
})

// ============================================================================
// Proxy to OpenAI API (must be before Anthropic catch-all)
//
// Mirrors the Anthropic catch-all pattern below: selfHandleResponse=false,
// simple passthrough, no request body modification, no response teeing.
//
// Cost attribution for OpenAI traffic is captured DOWNSTREAM by the relay's
// createAcpStreamTransformer, which reads codex-acp's `usage_update` ACP
// events from the streaming session (same pattern the Anthropic path uses
// via the SDK transformer). We do NOT need proxy-side extraction here.
//
// HISTORICAL NOTE (don't reintroduce): an earlier version of this handler
// injected `stream_options.include_usage: true` into the request body and
// used selfHandleResponse=true to tee the response stream for usage parsing.
// That pattern is valid for OpenAI's legacy /v1/chat/completions API but
// BREAKS the new /v1/responses API (which codex-acp uses): the Responses
// API rejects `stream_options` as an unknown parameter (HTTP 400), and
// codex's reqwest client then interprets the failed SSE stream as
// `ResponseStreamDisconnected { http_status_code: None }`. Hours of pain.
// Keep this route a simple passthrough.
// ============================================================================

app.use('/openai', createProxyMiddleware({
  target: 'https://api.openai.com',
  changeOrigin: true,
  selfHandleResponse: false,
  pathRewrite: { '^/openai': '' },

  onProxyReq: (proxyReq, req, res) => {
    try {
      if (!CONFIG.openaiApiKey) {
        console.error('❌ OpenAI API key not configured — set OPENAI_API_KEY env var')
        return
      }

      proxyReq.setHeader('Authorization', `Bearer ${CONFIG.openaiApiKey}`)
      proxyReq.removeHeader('x-api-key')

      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body)
        proxyReq.setHeader('Content-Type', 'application/json')
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
        proxyReq.write(bodyData)
      }

      console.log(`→ Proxying ${req.method} /openai${req.path} for user ${req.userId ?? '?'}`)
    } catch (err) {
      console.error('❌ onProxyReq error (OpenAI):', err.message)
    }
  },

  onProxyRes: (proxyRes, req, res) => {
    console.log(`← ${proxyRes.statusCode} from OpenAI for user ${req.userId ?? '?'}`)
  },

  onError: (err, req, res) => {
    console.error('❌ Proxy error (OpenAI):', err.message)
    metrics.proxyErrors++
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Proxy error',
        message: 'Failed to reach OpenAI API',
      })
    }
  },
}))

// ============================================================================
// Proxy to Anthropic API (or OpenRouter for non-Claude models)
// ============================================================================

function isClaudeModel(model) {
  return !model || model.startsWith('claude-')
}

function isObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function buildOpenRouterRequestBody(body, req) {
  const sessionId = req.proxyAuth?.clientSandboxId || req.proxyAuth?.sandboxId
  const trace = isObject(body?.trace) ? body.trace : {}

  return {
    ...body,
    ...(body?.user ? {} : req.proxyAuth?.teamId ? { user: req.proxyAuth.teamId } : {}),
    ...(body?.session_id ? {} : sessionId ? { session_id: sessionId } : {}),
    trace: {
      ...trace,
      billing_request_id: randomUUID(),
      ...(req.proxyAuth?.teamId ? { team_id: req.proxyAuth.teamId } : {}),
      ...(req.userId ? { user_id: req.userId } : {}),
      ...(req.proxyAuth?.sandboxId ? { sandbox_id: req.proxyAuth.sandboxId } : {}),
      ...(req.proxyAuth?.clientSandboxId ? { client_sandbox_id: req.proxyAuth.clientSandboxId } : {}),
    },
  }
}

app.use('/', createProxyMiddleware({
  router: (req) => {
    const model = req.body?.model || ''
    if (!isClaudeModel(model)) {
      return 'https://openrouter.ai/api'
    }
    return 'https://api.anthropic.com'
  },
  changeOrigin: true,
  selfHandleResponse: false,

  onProxyReq: (proxyReq, req, res) => {
    try {
      const model = req.body?.model || ''
      const useOpenRouter = !isClaudeModel(model)
      const body = useOpenRouter ? buildOpenRouterRequestBody(req.body, req) : req.body

      if (useOpenRouter) {
        if (!CONFIG.openrouterApiKey) {
          console.error('OpenRouter API key not configured')
          return
        }
        proxyReq.setHeader('Authorization', `Bearer ${CONFIG.openrouterApiKey}`)
        proxyReq.removeHeader('x-api-key')
        console.log(`→ Proxying ${req.method} ${req.path} to OpenRouter (model: ${model}) for user ${req.userId ?? '?'}`)
        console.log('[OPENROUTER_PROXY] Outbound metadata', JSON.stringify({
          user: body?.user,
          session_id: body?.session_id,
          trace: body?.trace,
        }))
      } else {
        console.log('📍 Proxy IP debug', JSON.stringify({
          path: req.path,
          method: req.method,
          userId: req.userId,
          sandboxId: req.proxyAuth?.sandboxId,
          clientSandboxId: req.proxyAuth?.clientSandboxId,
          teamId: req.proxyAuth?.teamId,
          allowedIp: req.proxyAuth?.allowedIp,
          clientIp: getClientIp(req),
          headers: getIpDebugHeaders(req),
        }))
        proxyReq.setHeader('x-api-key', CONFIG.anthropicApiKey)
        console.log(`→ Proxying ${req.method} ${req.path} to Anthropic (model: ${model || 'default'}) for user ${req.userId ?? '?'}`)
      }

      if (body && Object.keys(body).length > 0) {
        const bodyData = JSON.stringify(body)
        proxyReq.setHeader('Content-Type', 'application/json')
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
        proxyReq.write(bodyData)
      }
    } catch (err) {
      console.error('❌ onProxyReq error:', err.message)
    }
  },

  onProxyRes: (proxyRes, req, res) => {
    const model = req.body?.model || ''
    const provider = isClaudeModel(model) ? 'Anthropic' : 'OpenRouter'
    console.log(`← ${proxyRes.statusCode} from ${provider} for user ${req.userId ?? '?'}`)
  },

  onError: (err, req, res) => {
    console.error('❌ Proxy error:', err.message)
    metrics.proxyErrors++
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Proxy error',
        message: 'Failed to reach upstream API',
      })
    }
  },
}))

// ============================================================================
// Server Startup
// ============================================================================

app.listen(CONFIG.port, CONFIG.host, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🚀 Claude Proxy Server Started')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`📡 Proxy URL:    http://${CONFIG.host}:${CONFIG.port}`)
  console.log(`🎯 Target:       https://api.anthropic.com (claude-* models)`)
  console.log(`🎯 Target:       https://openrouter.ai/api (non-claude models)`)
  console.log(`🎯 Target:       https://api.openai.com (via /openai/*)`)
  console.log(`📊 Health:       http://${CONFIG.host}:${CONFIG.port}/health`)
  console.log(`🗄️  DB Pool:      max ${pool.options.max} connections`)
  console.log(`⏱️  Cache TTL:    ${CONFIG.cacheTTL / 60_000} minutes`)
  console.log(`🔐 Auth:         JWT RS256`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
})

// ============================================================================
// Graceful Shutdown
// ============================================================================

async function shutdown(signal) {
  console.log(`\n🛑 ${signal} received, shutting down gracefully...`)

  // Stop accepting new requests
  clearInterval(cacheCleanupInterval)

  // Close database connections
  try {
    await pool.end()
    console.log('✅ Database pool closed')
  } catch (err) {
    console.error('❌ Error closing database pool:', err.message)
  }

  // Clear cache
  cache.clear()
  console.log('✅ Cache cleared')

  process.exit(0)
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

// Global error handlers - prevent crashes
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught exception:', err.message)
  console.error(err.stack)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection:', reason)
})
