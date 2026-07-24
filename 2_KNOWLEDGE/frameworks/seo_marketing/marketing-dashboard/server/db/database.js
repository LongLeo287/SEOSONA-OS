/**
 * SQLite Database Module
 * Handles database initialization and connection
 */

import Database from 'better-sqlite3';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database file path
const DB_DIR = join(__dirname, '../../data');
const DB_PATH = join(DB_DIR, 'marketing.db');

// Initialize database
let db = null;

export function initDatabase() {
  try {
    // Create data directory if it doesn't exist
    if (!existsSync(DB_DIR)) {
      mkdirSync(DB_DIR, { recursive: true });
    }

    // Create database connection
    db = new Database(DB_PATH);

    // Enable foreign keys
    db.pragma('foreign_keys = ON');

    // Read and execute schema
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
    db.exec(schema);

    console.log('✓ Database initialized:', DB_PATH);
    return db;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

export function getDatabase() {
  if (!db) {
    return initDatabase();
  }
  return db;
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

// Export default instance
export default { initDatabase, getDatabase, closeDatabase };
