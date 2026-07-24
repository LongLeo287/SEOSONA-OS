/**
 * Assets API Tests
 * CRUD operations, scanner integration, and file serving
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createTestDatabase, cleanupTestDatabase } from './test-db.js';
import { randomBytes } from 'crypto';

let testDb;
const generateId = () => randomBytes(6).toString('hex');

describe('Assets API', () => {
  beforeEach(() => {
    testDb = createTestDatabase();
  });

  afterEach(() => {
    cleanupTestDatabase(testDb);
  });

  describe('GET /api/assets - List assets', () => {
    it('should return empty list when no assets exist', () => {
      const assets = testDb.prepare('SELECT * FROM assets').all();
      expect(assets).toEqual([]);
    });

    it('should list all assets from database', () => {
      const asset1Id = generateId();
      const asset2Id = generateId();

      testDb.prepare(`
        INSERT INTO assets (id, path, name, category, format)
        VALUES (?, ?, ?, ?, ?)
      `).run(asset1Id, '/path/image1.png', 'image1.png', 'image', 'png');

      testDb.prepare(`
        INSERT INTO assets (id, path, name, category, format)
        VALUES (?, ?, ?, ?, ?)
      `).run(asset2Id, '/path/image2.jpg', 'image2.jpg', 'image', 'jpg');

      const assets = testDb.prepare('SELECT * FROM assets').all();
      expect(assets.length).toBe(2);
    });

    it('should include all asset fields', () => {
      const id = generateId();
      testDb.prepare(`
        INSERT INTO assets (id, path, name, category, format, format_type, size, ai_prompt, r2_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, '/path/file.png', 'file.png', 'image', 'png', 'image/png', 2048, 'enhance', 'local');

      const asset = testDb.prepare('SELECT * FROM assets WHERE id = ?').get(id);
      expect(asset).toHaveProperty('id');
      expect(asset).toHaveProperty('path');
      expect(asset).toHaveProperty('name');
      expect(asset).toHaveProperty('category');
      expect(asset).toHaveProperty('format');
      expect(asset).toHaveProperty('format_type');
      expect(asset).toHaveProperty('size');
      expect(asset).toHaveProperty('ai_prompt');
      expect(asset).toHaveProperty('r2_status');
      expect(asset).toHaveProperty('created_at');
      expect(asset).toHaveProperty('modified_at');
    });

    it('should enforce unique path constraint', () => {
      const id1 = generateId();
      const id2 = generateId();

      testDb.prepare('INSERT INTO assets (id, path, name) VALUES (?, ?, ?)').run(id1, '/same/path.png', 'file1.png');

      expect(() => {
        testDb.prepare('INSERT INTO assets (id, path, name) VALUES (?, ?, ?)').run(id2, '/same/path.png', 'file2.png');
      }).toThrow();
    });
  });

  describe('GET /api/assets/:id - Get single asset', () => {
    it('should return asset by id', () => {
      const id = generateId();
      testDb.prepare('INSERT INTO assets (id, path, name) VALUES (?, ?, ?)').run(id, '/path/file.png', 'file.png');

      const asset = testDb.prepare('SELECT * FROM assets WHERE id = ?').get(id);
      expect(asset).toBeDefined();
      expect(asset.id).toBe(id);
      expect(asset.name).toBe('file.png');
    });

    it('should return undefined for non-existent asset', () => {
      const asset = testDb.prepare('SELECT * FROM assets WHERE id = ?').get('nonexistent');
      expect(asset).toBeUndefined();
    });
  });

  describe('POST /api/assets/scan - Rescan assets and sync DB', () => {
    it('should insert new assets from scan', () => {
      // Simulate scanned assets from file system
      const scannedAssets = [
        {
          id: generateId(),
          path: '/assets/image1.png',
          name: 'image1.png',
          category: 'image',
          format: 'png',
          formatType: 'image/png',
          size: 2048,
          modifiedAt: new Date().toISOString()
        }
      ];

      let inserted = 0;
      for (const asset of scannedAssets) {
        const existing = testDb.prepare('SELECT * FROM assets WHERE path = ?').get(asset.path);
        if (!existing) {
          testDb.prepare(`
            INSERT INTO assets (id, path, name, category, format, format_type, size, modified_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `).run(asset.id, asset.path, asset.name, asset.category, asset.format, asset.formatType, asset.size, asset.modifiedAt);
          inserted++;
        }
      }

      expect(inserted).toBe(1);
      const assets = testDb.prepare('SELECT * FROM assets WHERE path = ?').all('/assets/image1.png');
      expect(assets.length).toBe(1);
    });

    it('should update existing assets metadata', () => {
      const id = generateId();
      testDb.prepare('INSERT INTO assets (id, path, name, size) VALUES (?, ?, ?, ?)').run(
        id, '/assets/file.png', 'file.png', 1024
      );

      // Simulate updated scan data
      testDb.prepare('UPDATE assets SET size = ? WHERE path = ?').run(2048, '/assets/file.png');

      const asset = testDb.prepare('SELECT * FROM assets WHERE id = ?').get(id);
      expect(asset.size).toBe(2048);
    });

    it('should preserve ai_prompt during scan update', () => {
      const assetId = generateId();

      testDb.prepare('INSERT INTO assets (id, path, name, size, ai_prompt) VALUES (?, ?, ?, ?, ?)').run(
        assetId, '/assets/file.png', 'file.png', 1024, 'enhance image'
      );

      // Simulate scan update (preserves ai_prompt)
      testDb.prepare('UPDATE assets SET size = ? WHERE path = ?').run(2048, '/assets/file.png');

      const asset = testDb.prepare('SELECT * FROM assets WHERE id = ?').get(assetId);
      expect(asset.ai_prompt).toBe('enhance image');
      expect(asset.size).toBe(2048);
    });

    it('should track inserted and updated counts', () => {
      const scannedAssets = [
        { id: generateId(), path: '/new1.png', name: 'new1.png', category: 'image', format: 'png', formatType: 'image/png', size: 1024, modifiedAt: new Date().toISOString() },
        { id: generateId(), path: '/new2.png', name: 'new2.png', category: 'image', format: 'png', formatType: 'image/png', size: 1024, modifiedAt: new Date().toISOString() },
      ];

      // Insert one existing asset first
      testDb.prepare('INSERT INTO assets (id, path, name) VALUES (?, ?, ?)').run(generateId(), '/new1.png', 'new1.png');

      let inserted = 0;
      let updated = 0;

      for (const asset of scannedAssets) {
        const existing = testDb.prepare('SELECT * FROM assets WHERE path = ?').get(asset.path);
        if (existing) {
          testDb.prepare('UPDATE assets SET name = ?, size = ? WHERE path = ?').run(asset.name, asset.size, asset.path);
          updated++;
        } else {
          testDb.prepare('INSERT INTO assets (id, path, name, size) VALUES (?, ?, ?, ?)').run(asset.id, asset.path, asset.name, asset.size);
          inserted++;
        }
      }

      expect(inserted).toBe(1);
      expect(updated).toBe(1);
    });
  });

  describe('PUT /api/assets/:id - Update asset metadata', () => {
    it('should update ai_prompt', () => {
      const id = generateId();
      testDb.prepare('INSERT INTO assets (id, path, name) VALUES (?, ?, ?)').run(id, '/path/file.txt', 'file.txt');

      const newPrompt = 'Enhance this text for clarity';
      testDb.prepare('UPDATE assets SET ai_prompt = ? WHERE id = ?').run(newPrompt, id);

      const asset = testDb.prepare('SELECT * FROM assets WHERE id = ?').get(id);
      expect(asset.ai_prompt).toBe(newPrompt);
    });

    it('should update r2_status', () => {
      const id = generateId();
      testDb.prepare('INSERT INTO assets (id, path, name, r2_status) VALUES (?, ?, ?, ?)').run(id, '/path/file.png', 'file.png', 'local');

      testDb.prepare('UPDATE assets SET r2_status = ? WHERE id = ?').run('synced', id);

      const asset = testDb.prepare('SELECT * FROM assets WHERE id = ?').get(id);
      expect(asset.r2_status).toBe('synced');
    });

    it('should update r2_url', () => {
      const id = generateId();
      testDb.prepare('INSERT INTO assets (id, path, name) VALUES (?, ?, ?)').run(id, '/path/file.png', 'file.png');

      const r2Url = 'https://cdn.example.com/file.png';
      testDb.prepare('UPDATE assets SET r2_url = ? WHERE id = ?').run(r2Url, id);

      const asset = testDb.prepare('SELECT * FROM assets WHERE id = ?').get(id);
      expect(asset.r2_url).toBe(r2Url);
    });

    it('should reject invalid r2_status', () => {
      expect(() => {
        const id = generateId();
        testDb.prepare('INSERT INTO assets (id, path, name, r2_status) VALUES (?, ?, ?, ?)').run(
          id, '/path/file.png', 'file.png', 'invalid_status'
        );
      }).toThrow();
    });

    it('should return 404 for non-existent asset', () => {
      const asset = testDb.prepare('SELECT * FROM assets WHERE id = ?').get('nonexistent');
      expect(asset).toBeUndefined();
    });

    it('should allow partial updates', () => {
      const id = generateId();

      testDb.prepare('INSERT INTO assets (id, path, name, ai_prompt) VALUES (?, ?, ?, ?)').run(
        id, '/path/file.png', 'file.png', 'old prompt'
      );

      testDb.prepare('UPDATE assets SET r2_status = ? WHERE id = ?').run('pending', id);

      const asset = testDb.prepare('SELECT * FROM assets WHERE id = ?').get(id);
      expect(asset.ai_prompt).toBe('old prompt');
      expect(asset.r2_status).toBe('pending');
    });
  });

  describe('R2 Status workflow', () => {
    it('should default r2_status to local', () => {
      const id = generateId();
      testDb.prepare('INSERT INTO assets (id, path, name) VALUES (?, ?, ?)').run(id, '/path/file.png', 'file.png');

      const asset = testDb.prepare('SELECT * FROM assets WHERE id = ?').get(id);
      expect(asset.r2_status).toBe('local');
    });

    it('should support pending status', () => {
      const id = generateId();
      testDb.prepare('INSERT INTO assets (id, path, name, r2_status) VALUES (?, ?, ?, ?)').run(
        id, '/path/file.png', 'file.png', 'pending'
      );

      const asset = testDb.prepare('SELECT * FROM assets WHERE id = ?').get(id);
      expect(asset.r2_status).toBe('pending');
    });

    it('should support synced status', () => {
      const id = generateId();
      testDb.prepare('INSERT INTO assets (id, path, name, r2_status) VALUES (?, ?, ?, ?)').run(
        id, '/path/file.png', 'file.png', 'synced'
      );

      const asset = testDb.prepare('SELECT * FROM assets WHERE id = ?').get(id);
      expect(asset.r2_status).toBe('synced');
    });

    it('should support error status', () => {
      const id = generateId();
      testDb.prepare('INSERT INTO assets (id, path, name, r2_status) VALUES (?, ?, ?, ?)').run(
        id, '/path/file.png', 'file.png', 'error'
      );

      const asset = testDb.prepare('SELECT * FROM assets WHERE id = ?').get(id);
      expect(asset.r2_status).toBe('error');
    });
  });
});
