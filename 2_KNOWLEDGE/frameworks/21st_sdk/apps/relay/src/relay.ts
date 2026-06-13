import "./instrument"
import "dotenv/config"
import express from "express"
import cors from "cors"
import * as Sentry from "@sentry/node"
import { PubSubService } from "./pubsub"
import { initChatRouter } from "./chat"
import { initE2BWebhooksRouter } from "./e2b-webhooks"
import { initOpenRouterWebhooksRouter } from "./openrouter-webhooks"
import { authMiddleware } from "./auth"
import { initTokensRouter } from "./tokens"
import { initSandboxesRouter } from "./sandboxes"
import { initVaultsRouter } from "./vaults"

console.log("[STARTUP] Loading relay server...")
console.log("[STARTUP] Environment:", process.env.NODE_ENV || "development")
console.log(
  "[STARTUP] Redis URL:",
  process.env.REDIS_URL ? "SET" : "NOT SET (using localhost)",
)

const app = express()
console.log("[STARTUP] Express app created")

const pubsub = new PubSubService()
console.log("[STARTUP] PubSubService created")
const defaultJsonParser = express.json({ limit: "10mb" })

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
)
console.log("[STARTUP] CORS middleware added")

app.use((req, res, next) => {
  if (
    req.path === "/internal/e2b/lifecycle" ||
    req.path === "/internal/openrouter/broadcast"
  ) {
    next()
    return
  }
  defaultJsonParser(req, res, (error) => {
    if (error) {
      res.status(400).json({
        error: "invalid_json",
        message: "Request body must be valid JSON",
        status: 400,
      })
      return
    }
    next()
  })
})
console.log("[STARTUP] JSON parser middleware added")

// Log all incoming requests
app.use((req, res, next) => {
  const start = Date.now()
  console.log(`[REQ] ${req.method} ${req.path} - Started`)

  res.on("finish", () => {
    const duration = Date.now() - start
    console.log(
      `[RES] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`,
    )
  })

  next()
})

// SSE endpoint - clients connect here
app.get("/stream/:sessionId", (req, res) => {
  const { sessionId } = req.params
  console.log(`[SSE] Client connecting: ${sessionId}`)
  console.log(`[SSE] Headers:`, JSON.stringify(req.headers, null, 2))

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  })
  console.log(`[SSE] Response headers sent for: ${sessionId}`)

  // Keep-alive ping every 15s
  const keepAlive = setInterval(() => {
    console.log(`[SSE] Sending ping to: ${sessionId}`)
    res.write(":ping\n\n")
  }, 15000)

  console.log(`[SSE] Subscribing to channel: session:${sessionId}`)
  let closeScheduled = false
  const cleanup = pubsub.subscribe(`session:${sessionId}`, (message: any) => {
    console.log(
      `[SSE] Received message for ${sessionId}:`,
      JSON.stringify(message),
    )
    console.log(`[SSE] Message type: ${message.type}`)

    res.write(`data: ${JSON.stringify(message)}\n\n`)
    console.log(`[SSE] Message sent to client: ${sessionId}`)

    // 'result' is the final message from Claude Code SDK
    if (
      !closeScheduled &&
      (message.type === "result" || message.type === "error")
    ) {
      closeScheduled = true
      console.log(
        `[SSE] Scheduling connection close for ${sessionId} (type: ${message.type})`,
      )
      // Wait 200ms to allow any in-flight messages to arrive before closing
      setTimeout(() => {
        console.log(`[SSE] Closing connection for ${sessionId} after timeout`)
        clearInterval(keepAlive)
        cleanup()
        res.end()
        console.log(`[SSE] Connection closed: ${sessionId}`)
      }, 200)
    }
  })

  req.on("close", () => {
    console.log(`[SSE] Client disconnected (close event): ${sessionId}`)
    clearInterval(keepAlive)
    cleanup()
  })

  req.on("error", (err) => {
    console.error(`[SSE] Request error for ${sessionId}:`, err)
  })
})

// Publish endpoint - for testing or internal use
app.post("/publish/:sessionId", (req, res) => {
  const { sessionId } = req.params
  console.log(`[PUBLISH] Received for session: ${sessionId}`)
  console.log(`[PUBLISH] Body:`, JSON.stringify(req.body))
  console.log(`[PUBLISH] Message type: ${req.body.type || "unknown"}`)

  pubsub.publish(`session:${sessionId}`, req.body)
  console.log(`[PUBLISH] Published to Redis channel: session:${sessionId}`)

  res.json({ ok: true })
  console.log(`[PUBLISH] Response sent for: ${sessionId}`)
})

// Health check
app.get("/health", (_req, res) => {
  console.log("[HEALTH] Health check requested")
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

app.use("/internal/e2b", initE2BWebhooksRouter())
console.log("[STARTUP] E2B webhooks router mounted at /internal/e2b")
app.use("/internal/openrouter", initOpenRouterWebhooksRouter())
console.log(
  "[STARTUP] OpenRouter webhooks router mounted at /internal/openrouter",
)
// Token creation (protected by API key auth)
app.use("/v1/tokens", authMiddleware, initTokensRouter())
console.log("[STARTUP] Tokens router mounted at /v1/tokens")

// Sandbox & thread CRUD (protected by API key auth)
app.use("/v1/sandboxes", authMiddleware, initSandboxesRouter())
console.log("[STARTUP] Sandboxes router mounted at /v1/sandboxes")

// Vault CRUD (protected by server API key auth)
app.use("/v1/mcp/vaults", authMiddleware, initVaultsRouter())
console.log("[STARTUP] Vaults router mounted at /v1/mcp/vaults")

// Chat routes (protected by API key or JWT token auth)
app.use("/v1/chat", authMiddleware, initChatRouter(pubsub))
console.log("[STARTUP] Chat router mounted at /v1/chat")

// Sentry error handler - must be after all controllers
Sentry.setupExpressErrorHandler(app)
console.log("[STARTUP] Sentry error handler added")

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
  console.log(`[STARTUP] ========================================`)
  console.log(`[STARTUP] Relay server running on port ${PORT}`)
  console.log(`[STARTUP] Ready to accept connections`)
  console.log(`[STARTUP] ========================================`)
})

// Disable Node.js 18+ default 5-min request timeout (kills SSE connections)
// Railway platform limit is 15 min — our keep-alive pings handle the rest
server.requestTimeout = 0
server.headersTimeout = 0
