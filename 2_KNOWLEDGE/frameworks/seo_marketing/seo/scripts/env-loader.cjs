#!/usr/bin/env node
/**
 * Environment Variable Loader for Claude Code Skills
 *
 * Loads environment variables following the priority order:
 * 1. process.env (highest priority - already set)
 * 2. $HOME/.claude/skills/${SKILL}/.env (skill-specific)
 * 3. $HOME/.claude/skills/.env (shared across skills)
 * 4. $HOME/.claude/.env (global Claude config)
 *
 * Usage:
 *   const { loadEnv, getEnv } = require('./env-loader.cjs');
 *   loadEnv('seo'); // Load with skill name
 *   const apiKey = getEnv('REVIEWWEB_API_KEY');
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Cache loaded env vars to avoid re-reading files
let envCache = null;
let loadedSkill = null;

/**
 * Parse .env file content into key-value pairs
 * Handles quotes, comments, and multi-line values
 * @param {string} content - .env file content
 * @returns {Object} Parsed environment variables
 */
function parseEnvFile(content) {
  const env = {};
  const lines = content.split('\n');

  for (const line of lines) {
    // Skip empty lines and comments
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Find first = sign (key can't have =, but value can)
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    // Remove surrounding quotes if present
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Handle escape sequences in double-quoted values
    if (trimmed.slice(eqIndex + 1).trim().startsWith('"')) {
      value = value.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
    }

    env[key] = value;
  }

  return env;
}

/**
 * Safely read and parse .env file
 * @param {string} filePath - Path to .env file
 * @returns {Object} Parsed env vars or empty object if file doesn't exist
 */
function readEnvFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return parseEnvFile(content);
    }
  } catch (error) {
    // Silently ignore read errors (permission issues, etc.)
    if (process.env.DEBUG) {
      console.error(`[env-loader] Could not read ${filePath}: ${error.message}`);
    }
  }
  return {};
}

/**
 * Get the home directory path
 * @returns {string} Home directory path
 */
function getHomeDir() {
  return process.env.HOME || os.homedir();
}

/**
 * Load environment variables following priority order
 * @param {string} skillName - Name of the skill (for skill-specific .env)
 * @returns {Object} Merged environment variables
 */
function loadEnv(skillName) {
  // Return cached if already loaded for this skill
  if (envCache && loadedSkill === skillName) {
    return envCache;
  }

  const homeDir = getHomeDir();

  // Define .env file paths in reverse priority order (lowest first)
  // We'll merge them so higher priority overwrites lower
  const envPaths = [
    path.join(homeDir, '.claude', '.env'), // 4. Global Claude config (lowest)
    path.join(homeDir, '.claude', 'skills', '.env'), // 3. Shared skills
  ];

  // Add skill-specific .env if skill name provided
  if (skillName) {
    envPaths.push(
      path.join(homeDir, '.claude', 'skills', skillName, '.env') // 2. Skill-specific
    );
  }

  // Start with empty object, merge in order (lower priority first)
  let mergedEnv = {};
  for (const envPath of envPaths) {
    const fileEnv = readEnvFile(envPath);
    mergedEnv = { ...mergedEnv, ...fileEnv };
  }

  // process.env has highest priority - don't overwrite existing values
  // Instead, we make merged values available only if not already in process.env
  envCache = mergedEnv;
  loadedSkill = skillName;

  return mergedEnv;
}

/**
 * Get environment variable with priority handling
 * Priority: process.env > skill .env > skills .env > claude .env
 * @param {string} key - Environment variable name
 * @param {string} defaultValue - Default value if not found
 * @returns {string|undefined} Environment variable value
 */
function getEnv(key, defaultValue = undefined) {
  // process.env always has highest priority
  if (process.env[key] !== undefined) {
    return process.env[key];
  }

  // Check cached env from .env files
  if (envCache && envCache[key] !== undefined) {
    return envCache[key];
  }

  return defaultValue;
}

/**
 * Get multiple environment variables at once
 * @param {string[]} keys - Array of environment variable names
 * @returns {Object} Object with key-value pairs
 */
function getEnvMultiple(keys) {
  const result = {};
  for (const key of keys) {
    result[key] = getEnv(key);
  }
  return result;
}

/**
 * Check if required environment variables are set
 * @param {string[]} requiredKeys - Array of required env var names
 * @returns {{ valid: boolean, missing: string[] }} Validation result
 */
function validateEnv(requiredKeys) {
  const missing = [];
  for (const key of requiredKeys) {
    if (getEnv(key) === undefined) {
      missing.push(key);
    }
  }
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Clear the environment cache (useful for testing)
 */
function clearCache() {
  envCache = null;
  loadedSkill = null;
}

/**
 * Get all loaded environment variables (for debugging)
 * @returns {Object} All cached env vars
 */
function getLoadedEnv() {
  return envCache ? { ...envCache } : {};
}

module.exports = {
  loadEnv,
  getEnv,
  getEnvMultiple,
  validateEnv,
  clearCache,
  getLoadedEnv,
  parseEnvFile,
  readEnvFile,
};
