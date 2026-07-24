/**
 * Test Database Setup
 * Creates isolated test database for each test run
 */

import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function createTestDatabase() {
  const db = new Database(':memory:');

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Read and execute schema
  const schema = readFileSync(join(__dirname, '../db/schema.sql'), 'utf-8');
  db.exec(schema);

  return db;
}

export function cleanupTestDatabase(db) {
  if (db) {
    db.close();
  }
}
