/**
 * Router - HTTP request routing for Content Hub
 * Handles API endpoints and static file serving
 */

const fs = require('fs');
const path = require('path');
const url = require('url');

// MIME types for static files
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
  '.md': 'text/markdown',
  '.txt': 'text/plain'
};

/**
 * Check if path is safe (no directory traversal)
 */
function isPathSafe(reqPath, baseDir) {
  const resolved = path.resolve(baseDir, reqPath);
  return resolved.startsWith(path.resolve(baseDir));
}

const { enhanceContent, generateContent, isClaudeAvailable } = require('./ai-bridge.cjs');

/**
 * Parse JSON body from request
 */
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Create router with config
 */
function createRouter(config) {
  const {
    assetsDir,
    skillAssetsDir,
    templatePath,
    getManifest,
    getBrandContext,
    rescan,
    projectRoot
  } = config;

  /**
   * Route handler
   */
  return async function route(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // CORS headers for local development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    try {
      // API Routes
      if (pathname === '/api/assets') {
        const manifest = await getManifest();
        sendJson(res, manifest);
        return;
      }

      if (pathname === '/api/brand') {
        const brand = await getBrandContext();
        sendJson(res, brand);
        return;
      }

      if (pathname === '/api/scan' && method === 'POST') {
        const result = await rescan();
        sendJson(res, { success: true, assets: result.totalAssets });
        return;
      }

      // AI Bridge Routes
      if (pathname === '/api/ai/status') {
        const available = await isClaudeAvailable();
        sendJson(res, { available, message: available ? 'Claude Code ready' : 'Claude Code not found' });
        return;
      }

      if (pathname === '/api/ai/enhance' && method === 'POST') {
        const body = await parseBody(req);
        const { content, instruction, filePath } = body;

        if (!content || !instruction) {
          res.writeHead(400);
          sendJson(res, { error: 'content and instruction required' });
          return;
        }

        try {
          const enhanced = await enhanceContent(content, instruction, filePath || 'unknown');
          sendJson(res, { success: true, content: enhanced });
        } catch (err) {
          res.writeHead(500);
          sendJson(res, { error: err.message });
        }
        return;
      }

      if (pathname === '/api/ai/generate' && method === 'POST') {
        const body = await parseBody(req);
        const { type, description } = body;

        if (!type || !description) {
          res.writeHead(400);
          sendJson(res, { error: 'type and description required' });
          return;
        }

        try {
          const brand = await getBrandContext();
          const generated = await generateContent(type, description, { brand });
          sendJson(res, { success: true, content: generated });
        } catch (err) {
          res.writeHead(500);
          sendJson(res, { error: err.message });
        }
        return;
      }

      // File Routes
      if (pathname === '/api/file/read' && method === 'GET') {
        const filePath = parsedUrl.query.path;
        if (!filePath || !isPathSafe(filePath, assetsDir)) {
          res.writeHead(400);
          sendJson(res, { error: 'Invalid path' });
          return;
        }

        const fullPath = path.join(assetsDir, filePath);
        if (!fs.existsSync(fullPath)) {
          res.writeHead(404);
          sendJson(res, { error: 'File not found' });
          return;
        }

        const content = fs.readFileSync(fullPath, 'utf8');
        sendJson(res, { success: true, content, path: filePath });
        return;
      }

      if (pathname === '/api/file/save' && method === 'POST') {
        const body = await parseBody(req);
        const { path: filePath, content } = body;

        if (!filePath || content === undefined || !isPathSafe(filePath, assetsDir)) {
          res.writeHead(400);
          sendJson(res, { error: 'Invalid path or content' });
          return;
        }

        const fullPath = path.join(assetsDir, filePath);
        fs.writeFileSync(fullPath, content, 'utf8');
        sendJson(res, { success: true, path: filePath });
        return;
      }

      // Hub page
      if (pathname === '/hub' || pathname === '/') {
        const html = fs.readFileSync(templatePath, 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
      }

      // Skill static assets (/assets/*)
      if (pathname.startsWith('/assets/')) {
        const filePath = pathname.replace('/assets/', '');
        serveStatic(res, skillAssetsDir, filePath);
        return;
      }

      // User asset files (/file/*)
      if (pathname.startsWith('/file/')) {
        const filePath = pathname.replace('/file/', '');
        serveStatic(res, assetsDir, filePath);
        return;
      }

      // 404
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));

    } catch (err) {
      console.error('Router error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  };
}

/**
 * Send JSON response
 */
function sendJson(res, data) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

/**
 * Serve static file
 */
function serveStatic(res, baseDir, filePath) {
  // Security check
  if (!isPathSafe(filePath, baseDir)) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Forbidden' }));
    return;
  }

  const fullPath = path.join(baseDir, filePath);

  if (!fs.existsSync(fullPath)) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'File not found' }));
    return;
  }

  const stat = fs.statSync(fullPath);
  if (stat.isDirectory()) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Cannot serve directory' }));
    return;
  }

  const ext = path.extname(fullPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': stat.size,
    'Cache-Control': 'max-age=3600'
  });

  const stream = fs.createReadStream(fullPath);
  stream.pipe(res);
}

module.exports = { createRouter, isPathSafe, MIME_TYPES };
