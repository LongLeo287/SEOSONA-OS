/**
 * Marketing Dashboard API Server
 * Built with Hono framework + Content Hub integration
 */

import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { serveStatic } from '@hono/node-server/serve-static';
import { initDatabase } from './db/database.js';

// Import route modules
import assetsRouter from './routes/assets.js';
import brandRouter from './routes/brand.js';

// Import middleware
import { apiKeyAuth } from './middleware/auth.js';

// Environment configuration
const PORT = process.env.PORT || 3457;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize database
const db = initDatabase();

// Verify foreign keys are enabled
const fkStatus = db.pragma('foreign_keys', { simple: true });
if (fkStatus !== 1) {
  throw new Error('Foreign keys enforcement failed - database integrity at risk');
}

// Create Hono app
const app = new Hono();

// CORS Middleware (restricted origins)
app.use('/*', cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
}));

// Authentication Middleware - REMOVED for local development
// This is a local tool using Claude Code subscription, no external API keys needed
// app.use('/api/*', apiKeyAuth);

// Error handling middleware
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({
    error: 'Internal server error',
    message: NODE_ENV === 'development' ? err.message : undefined
  }, 500);
});

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// API Routes - Mount modular routers
app.route('/api/assets', assetsRouter);
app.route('/api/brand', brandRouter);

// Serve static files - Logos (path matches brand.js: ../../../assets/logos)
app.use('/static/logos/*', serveStatic({
  root: '../../../assets/logos',
  rewriteRequestPath: (path) => path.replace('/static/logos', '')
}));

// Serve static Vue build in production
if (NODE_ENV === 'production') {
  app.use('/*', serveStatic({ root: '../app/dist' }));
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n⏹ Shutting down gracefully...');
  db.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n⏹ Shutting down gracefully...');
  db.close();
  process.exit(0);
});

// Start server
console.log(`\n🚀 Marketing Dashboard API`);
console.log(`   Server: http://localhost:${PORT}`);
console.log(`   Health: http://localhost:${PORT}/health`);
console.log(`   Environment: ${NODE_ENV}`);
console.log(`   CORS: ${ALLOWED_ORIGINS.join(', ')}`);
console.log(`\n   Endpoints:`);
console.log(`   • /api/assets    - Assets + Scanner`);
console.log(`   • /api/brand     - Brand Center\n`);

serve({
  fetch: app.fetch,
  port: PORT
});
