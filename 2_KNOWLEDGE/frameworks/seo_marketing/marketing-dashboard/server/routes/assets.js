/**
 * Assets API Routes
 * Integrates Content Hub scanner for asset management
 */

import { Hono } from 'hono';
import { getDatabase } from '../db/database.js';
import scannerModule from '../lib/scanner.cjs';
import { readFileSync } from 'fs';
import { join, dirname, resolve, normalize } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = new Hono();
const db = getDatabase();
const { scan: scanAssets } = scannerModule;

// GET /api/assets - List assets from DB + live scan
app.get('/', async (c) => {
  try {
    // Get assets from database
    const dbAssets = db.prepare('SELECT * FROM assets ORDER BY created_at DESC').all();

    // Perform live scan of assets folder
    const assetsDir = join(__dirname, '../../../../../assets');
    const manifest = scanAssets(assetsDir, null, { update: false });
    const scannedAssets = manifest.assets || [];

    // Merge: Use DB data where available, fallback to scanned data
    const assets = scannedAssets.map(scanned => {
      const dbMatch = dbAssets.find(db => db.path === scanned.path);
      return dbMatch ? { ...scanned, ...dbMatch } : scanned;
    });

    return c.json({
      assets,
      total: assets.length,
      fromDatabase: dbAssets.length,
      fromScan: scannedAssets.length
    });
  } catch (error) {
    console.error('Failed to fetch assets:', error);
    return c.json({ error: 'Failed to fetch assets' }, 500);
  }
});

// GET /api/assets/:id - Get single asset
app.get('/:id', (c) => {
  try {
    const { id } = c.req.param();
    const asset = db.prepare('SELECT * FROM assets WHERE id = ?').get(id);

    if (!asset) {
      return c.json({ error: 'Asset not found' }, 404);
    }

    return c.json({ asset });
  } catch (error) {
    console.error('Failed to fetch asset:', error);
    return c.json({ error: 'Failed to fetch asset' }, 500);
  }
});

// POST /api/assets/scan - Rescan assets folder and update DB
app.post('/scan', async (c) => {
  try {
    const assetsDir = join(__dirname, '../../../../../assets');
    const manifest = scanAssets(assetsDir, null, { update: false });
    const scannedAssets = manifest.assets || [];

    // Update database with scanned assets
    let inserted = 0;
    let updated = 0;

    for (const asset of scannedAssets) {
      const existing = db.prepare('SELECT * FROM assets WHERE path = ?').get(asset.path);

      if (existing) {
        // Update metadata (preserve ai_prompt, r2_status)
        db.prepare(`
          UPDATE assets
          SET name = ?, category = ?, format = ?, format_type = ?, size = ?, modified_at = ?
          WHERE path = ?
        `).run(
          asset.name,
          asset.category,
          asset.format,
          asset.formatType,
          asset.size,
          asset.modifiedAt,
          asset.path
        );
        updated++;
      } else {
        // Insert new asset
        db.prepare(`
          INSERT INTO assets (id, path, name, category, format, format_type, size, modified_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          asset.id,
          asset.path,
          asset.name,
          asset.category,
          asset.format,
          asset.formatType,
          asset.size,
          asset.modifiedAt
        );
        inserted++;
      }
    }

    return c.json({
      success: true,
      scanned: scannedAssets.length,
      inserted,
      updated,
      message: `Scanned ${scannedAssets.length} assets: ${inserted} new, ${updated} updated`
    });
  } catch (error) {
    console.error('Failed to scan assets:', error);
    return c.json({ error: 'Failed to scan assets', details: error.message }, 500);
  }
});

// PUT /api/assets/:id - Update asset metadata
app.put('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();

    const existing = db.prepare('SELECT * FROM assets WHERE id = ?').get(id);
    if (!existing) {
      return c.json({ error: 'Asset not found' }, 404);
    }

    const updates = [];
    const values = [];

    if (body.ai_prompt !== undefined) {
      updates.push('ai_prompt = ?');
      values.push(body.ai_prompt);
    }
    if (body.r2_status !== undefined) {
      updates.push('r2_status = ?');
      values.push(body.r2_status);
    }
    if (body.r2_url !== undefined) {
      updates.push('r2_url = ?');
      values.push(body.r2_url);
    }

    values.push(id);

    const stmt = db.prepare(`UPDATE assets SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);

    const asset = db.prepare('SELECT * FROM assets WHERE id = ?').get(id);
    return c.json({ asset });
  } catch (error) {
    console.error('Failed to update asset:', error);
    return c.json({ error: 'Failed to update asset' }, 500);
  }
});

// GET /api/assets/:id/content - Get raw content for text files
app.get('/:id/content', async (c) => {
  try {
    const { id } = c.req.param();
    const asset = db.prepare('SELECT * FROM assets WHERE id = ?').get(id);

    if (!asset) {
      return c.json({ error: 'Asset not found' }, 404);
    }

    // Security: Validate path
    if (!asset.path) {
      return c.json({ error: 'Invalid asset path' }, 400);
    }

    // Build file path
    const assetsRoot = resolve(join(__dirname, '../../../../../assets'));
    const filePath = resolve(join(assetsRoot, asset.path));

    // Security: Ensure path is within assets directory
    if (!filePath.startsWith(assetsRoot + '/') && filePath !== assetsRoot) {
      return c.json({ error: 'Access denied' }, 403);
    }

    // Check if file exists and enforce 10MB size limit
    const MAX_CONTENT_SIZE = 10 * 1024 * 1024; // 10MB

    try {
      const fs = await import('fs');
      const stats = fs.statSync(filePath);

      if (stats.size > MAX_CONTENT_SIZE) {
        return c.json({ error: 'File too large for preview (max 10MB)' }, 413);
      }

      const content = readFileSync(filePath, 'utf-8');
      return c.json({
        content,
        format: asset.format,
        size: content.length
      });
    } catch (error) {
      return c.json({ error: 'Failed to read file content' }, 500);
    }
  } catch (error) {
    console.error('Failed to fetch content:', error);
    return c.json({ error: 'Failed to fetch content' }, 500);
  }
});

// GET /api/assets/file/* - Serve asset files
app.get('/file/*', (c) => {
  // Extract filepath from URL path (remove '/file/' prefix)
  const fullPath = c.req.path;
  const prefix = fullPath.indexOf('/file/');
  if (prefix === -1) {
    return c.json({ error: 'Invalid path' }, 400);
  }

  let filepath = fullPath.substring(prefix + 6); // '/file/' is 6 chars

  // Security: Comprehensive path traversal prevention

  // 1. URL decode to prevent encoded traversal attempts (reject on decode error)
  try {
    filepath = decodeURIComponent(filepath);
  } catch (e) {
    return c.json({ error: 'Access denied' }, 403);
  }

  // 2. Replace backslashes with forward slashes (Windows compatibility)
  filepath = filepath.replace(/\\/g, '/');

  // 3. Block absolute paths
  if (filepath.startsWith('/')) {
    return c.json({ error: 'Access denied' }, 403);
  }

  // 4. Block any path containing '..' segments
  if (filepath.includes('..')) {
    return c.json({ error: 'Access denied' }, 403);
  }

  // 5. Normalize and resolve paths
  const assetsRoot = resolve(join(__dirname, '../../../../../assets'));
  const requestedPath = resolve(join(assetsRoot, normalize(filepath)));

  // 6. Final boundary check - must be within assets directory
  if (!requestedPath.startsWith(assetsRoot + '/') && requestedPath !== assetsRoot) {
    return c.json({ error: 'Access denied' }, 403);
  }

  // 7. Attempt to read file (404 if not found)
  try {
    const content = readFileSync(requestedPath);
    return new Response(content);
  } catch (error) {
    return c.json({ error: 'File not found' }, 404);
  }
});

export default app;
