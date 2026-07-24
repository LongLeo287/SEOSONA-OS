#!/usr/bin/env node
/**
 * Re-index this repo into the codebase-memory code graph.
 *
 * Why a wrapper instead of calling the .exe inline from package.json:
 *  - A bare relative path ("1_CORE/bin/.../codebase-memory-mcp.exe ...") is not recognized as a
 *    command by Windows cmd.exe under `npm run`, so the old script failed immediately.
 *  - Passing repo_path "." makes the indexer register the project as "root"; the MCP server
 *    (mounted via .mcp.json) serves it as "D-SEOSONA-AI-SEOSONA-OS", so a "." index never
 *    updates the served project.
 *
 * This resolves the repo root from __dirname (portable — no hardcoded drive paths), forward-
 * slashes it so the project name derives canonically, and invokes the binary via execFileSync
 * so the path resolves on every platform.
 */
const { execFileSync } = require("child_process");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..").replace(/\\/g, "/");
const exe = path.join(repoRoot, "1_CORE/bin/codebase-memory-mcp/codebase-memory-mcp.exe");

execFileSync(exe, ["cli", "index_repository", JSON.stringify({ repo_path: repoRoot })], {
  stdio: "inherit",
});
