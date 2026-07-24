#!/usr/bin/env node
/**
 * SEOSONA OS — Portable-path junction
 *
 * The whole OS refers to itself through the stable portable root `~/.seosona/...` (used in
 * .mcp.json, the capability bridge, every KI path, the CLI's project connector, etc.). That root is
 * a filesystem link to wherever the repo actually lives on disk — a Windows *junction* (needs no
 * admin), or a POSIX directory symlink. Without it a fresh clone can't resolve any portable path and
 * `seosona doctor` fails with "Run `seosona setup` first."
 *
 * ensureJunction(repoRoot) makes `~/.seosona` point at repoRoot, idempotently:
 *   - already correct        -> 'exists'
 *   - missing / broken / stale (points elsewhere) -> recreate  -> 'created'
 *   - a REAL directory/file  -> never clobbered   -> 'occupied'
 */
const fs = require('fs');
const os = require('os');
const path = require('path');

function linkPath() {
  return path.join(os.homedir(), '.seosona');
}

function _lstat(p) {
  try { return fs.lstatSync(p); } catch { return null; }
}

function ensureJunction(repoRoot) {
  const link = linkPath();
  const target = path.resolve(repoRoot);
  const st = _lstat(link);

  if (st) {
    if (st.isSymbolicLink() || st.isDirectory()) {
      // A junction reports as a directory on Windows; readlink still yields its target.
      let current = null;
      try { current = fs.realpathSync(link); } catch { current = null; } // broken link -> null
      if (current && path.resolve(current) === target) {
        return { status: 'exists', link, target };
      }
      // A plain directory that is NOT a link is real user data — refuse to delete it.
      if (st.isDirectory() && !st.isSymbolicLink()) {
        return { status: 'occupied', link, target };
      }
      // Stale/broken/wrong link -> replace it.
      try { fs.unlinkSync(link); } catch (e) {
        try { fs.rmdirSync(link); } catch { return { status: 'error', link, target, error: e.message }; }
      }
    } else {
      return { status: 'occupied', link, target };
    }
  }

  try {
    const type = process.platform === 'win32' ? 'junction' : 'dir';
    fs.symlinkSync(target, link, type);
    return { status: 'created', link, target };
  } catch (e) {
    return { status: 'error', link, target, error: e.message };
  }
}

module.exports = { ensureJunction, linkPath };
