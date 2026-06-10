/**
 * Security Tests - File Serving Path Traversal Protection
 * Tests 6-layer defense against directory traversal attacks
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { Hono } from 'hono';
import assetsRouter from '../routes/assets.js';
import { mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';

const app = new Hono();
app.route('/api/assets', assetsRouter);

// Create test assets directory
const testAssetsDir = join(process.cwd(), 'server/__tests__/test-assets');
const sensitiveFile = join(process.cwd(), 'server/__tests__/sensitive.txt');

beforeAll(() => {
  // Create test assets directory with a safe file
  mkdirSync(testAssetsDir, { recursive: true });
  writeFileSync(join(testAssetsDir, 'safe.png'), 'safe content');

  // Create a sensitive file OUTSIDE assets directory
  writeFileSync(sensitiveFile, 'SENSITIVE DATA - SHOULD NOT BE ACCESSIBLE');
});

describe('File Serving Security - Path Traversal Protection', () => {

  describe('Layer 1: URL Encoding Attacks', () => {
    it('should block URL-encoded parent directory traversal', async () => {
      const res = await app.request('/api/assets/file/%2e%2e%2f%2e%2e%2fsensitive.txt');
      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body.error).toBe('Access denied');
    });

    it('should block double URL-encoded traversal', async () => {
      const res = await app.request('/api/assets/file/%252e%252e%252f%252e%252e%252fsensitive.txt');
      expect(res.status).toBe(403);
    });

    it('should block mixed encoding traversal', async () => {
      const res = await app.request('/api/assets/file/%2e./../../sensitive.txt');
      expect(res.status).toBe(403);
    });
  });

  describe('Layer 2: Windows Backslash Attacks', () => {
    it('should block backslash directory traversal', async () => {
      const res = await app.request('/api/assets/file/..\\..\\sensitive.txt');
      expect(res.status).toBe(403);
    });

    it('should block mixed slash/backslash traversal', async () => {
      const res = await app.request('/api/assets/file/../..\\sensitive.txt');
      expect(res.status).toBe(403);
    });

    it('should block Windows absolute paths', async () => {
      const res = await app.request('/api/assets/file/C:\\Windows\\System32\\config\\sam');
      expect(res.status).toBe(403);
    });
  });

  describe('Layer 3: Absolute Path Attacks', () => {
    it('should block Unix absolute paths', async () => {
      const res = await app.request('/api/assets/file//etc/passwd');
      expect(res.status).toBe(403);
    });

    it('should block paths starting with /', async () => {
      const res = await app.request('/api/assets/file//../../../etc/passwd');
      expect(res.status).toBe(403);
    });
  });

  describe('Layer 4: Parent Directory (..) Attacks', () => {
    it('should block simple .. traversal', async () => {
      const res = await app.request('/api/assets/file/../sensitive.txt');
      expect(res.status).toBe(403);
    });

    it('should block multiple .. traversal', async () => {
      const res = await app.request('/api/assets/file/../../sensitive.txt');
      expect(res.status).toBe(403);
    });

    it('should block hidden .. in path segments', async () => {
      const res = await app.request('/api/assets/file/safe/../../../sensitive.txt');
      expect(res.status).toBe(403);
    });

    it('should block .. with extra dots', async () => {
      const res = await app.request('/api/assets/file/.../.../sensitive.txt');
      expect(res.status).toBe(403);
    });
  });

  describe('Layer 5+6: Normalization & Boundary Checks', () => {
    it('should block normalized paths outside boundary', async () => {
      const res = await app.request('/api/assets/file/subdir/../../outside.txt');
      expect(res.status).toBe(403);
    });

    it('should block complex multi-segment traversal', async () => {
      const res = await app.request('/api/assets/file/a/b/c/../../../../../../../etc/passwd');
      expect(res.status).toBe(403);
    });
  });

  describe('Edge Cases', () => {
    it('should block null byte injection', async () => {
      const res = await app.request('/api/assets/file/safe.png%00.txt');
      expect(res.status).toBe(403);
    });

    it('should block unicode normalization attacks', async () => {
      const res = await app.request('/api/assets/file/%c0%ae%c0%ae/sensitive.txt');
      expect(res.status).toBe(403);
    });

    it('should block overly long paths (DoS)', async () => {
      const longPath = '../'.repeat(1000) + 'etc/passwd';
      const res = await app.request(`/api/assets/file/${longPath}`);
      expect(res.status).toBe(403);
    });
  });

  describe('Valid File Access', () => {
    it('should allow access to files within assets directory', async () => {
      const res = await app.request('/api/assets/file/safe.png');
      expect([200, 404]).toContain(res.status); // 404 if file doesn't exist in real assets dir
    });

    it('should allow subdirectory access within assets', async () => {
      const res = await app.request('/api/assets/file/images/logo.png');
      expect([200, 404]).toContain(res.status);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent files (not 403)', async () => {
      const res = await app.request('/api/assets/file/nonexistent.png');
      expect(res.status).toBe(404);
    });

    it('should handle malformed requests gracefully', async () => {
      const res = await app.request('/api/assets/file/');
      expect([403, 404]).toContain(res.status);
    });
  });
});

// Cleanup
afterAll(() => {
  rmSync(testAssetsDir, { recursive: true, force: true });
  rmSync(sensitiveFile, { force: true });
});
